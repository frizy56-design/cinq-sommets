-- Cinq Sommets : schéma de la base
--
-- Conçu pour cohabiter avec d'autres applications dans le même projet Supabase :
--   * toutes les tables vivent dans le schéma cs_private, invisible depuis l'API ;
--   * le site n'appelle que les fonctions public.cs_*, qui vérifient la session ;
--   * aucun objet existant n'est modifié.
--
-- Connexion : nom d'utilisateur + mot de passe, avec une phrase de récupération
-- de 12 mots. Pas d'e-mail, pas de Supabase Auth, aucun service payant.
-- Les inscriptions se font sur invitation (code à usage unique créé par un admin).

create extension if not exists pgcrypto with schema extensions;
create schema if not exists cs_private;
revoke all on schema cs_private from public;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists cs_private.accounts (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique check (username ~ '^[a-z0-9][a-z0-9._-]{2,23}$'),
  display_name  text not null check (char_length(display_name) between 1 and 40),
  role          text not null default 'member' check (role in ('admin', 'member')),
  password_hash text not null,
  phrase_hash   text not null,
  failed_count  integer not null default 0,
  locked_until  timestamptz,
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);

-- Sessions : seule l'empreinte SHA-256 du jeton est stockée.
create table if not exists cs_private.sessions (
  token_hash   text primary key,
  account_id   uuid not null references cs_private.accounts (id) on delete cascade,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create index if not exists cs_sessions_account_idx on cs_private.sessions (account_id);

-- Invitations à usage unique.
create table if not exists cs_private.invites (
  code       text primary key check (code ~ '^[A-Z2-9]{4}-[A-Z2-9]{4}$'),
  role       text not null default 'member' check (role in ('admin', 'member')),
  created_by uuid references cs_private.accounts (id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days',
  used_by    uuid references cs_private.accounts (id) on delete set null,
  used_at    timestamptz
);

-- Toute la progression d'un joueur, au format du jeu (un document JSON).
-- rev sert à détecter deux appareils qui écrivent en même temps.
create table if not exists cs_private.progress (
  account_id uuid primary key references cs_private.accounts (id) on delete cascade,
  state      jsonb not null check (pg_column_size(state) < 1048576),
  rev        bigint not null default 1,
  updated_at timestamptz not null default now()
);

-- Ligue d'équipe : le D+ de la semaine de chaque joueur.
create table if not exists cs_private.league (
  account_id uuid primary key references cs_private.accounts (id) on delete cascade,
  week       text not null check (week ~ '^\d{4}-\d{2}-\d{2}$'),
  xp         integer not null default 0 check (xp between 0 and 1000000),
  streak     integer not null default 0 check (streak between 0 and 100000),
  updated_at timestamptz not null default now()
);
create index if not exists cs_league_week_idx on cs_private.league (week);

-- Abonnements Web Push (un par appareil).
create table if not exists cs_private.push_subscriptions (
  endpoint         text primary key check (endpoint like 'https://%' and char_length(endpoint) < 1000),
  account_id       uuid not null references cs_private.accounts (id) on delete cascade,
  p256dh           text not null check (char_length(p256dh) < 200),
  auth             text not null check (char_length(auth) < 100),
  remind_hour      smallint not null default 20 check (remind_hour between 6 and 22),
  tz               text not null default 'Europe/Paris',
  last_reminded_on date,
  created_at       timestamptz not null default now()
);
create index if not exists cs_push_account_idx on cs_private.push_subscriptions (account_id);

-- Réglages privés (empreinte du secret de la tâche planifiée).
create table if not exists cs_private.settings (
  key   text primary key,
  value text not null
);

-- Battement de cœur : chaque passage de la tâche planifiée écrit ici,
-- ce qui suffit à garder le projet actif sur l'offre gratuite.
create table if not exists cs_private.heartbeat (
  id      integer primary key default 1 check (id = 1),
  beat_at timestamptz not null default now(),
  beats   bigint not null default 0
);

alter table cs_private.accounts enable row level security;
alter table cs_private.sessions enable row level security;
alter table cs_private.invites enable row level security;
alter table cs_private.progress enable row level security;
alter table cs_private.league enable row level security;
alter table cs_private.push_subscriptions enable row level security;
alter table cs_private.settings enable row level security;
alter table cs_private.heartbeat enable row level security;
-- Aucune politique : aucun accès direct. Tout passe par les fonctions ci-dessous.

-- ---------------------------------------------------------------------------
-- Outils internes (schéma privé, jamais exposés)
-- ---------------------------------------------------------------------------

create or replace function cs_private.sha256(p text)
returns text language sql immutable
set search_path = ''
as $$ select encode(extensions.digest(coalesce(p, ''), 'sha256'), 'hex') $$;

create or replace function cs_private.norm_username(p text)
returns text language sql immutable
set search_path = ''
as $$ select lower(btrim(coalesce(p, ''))) $$;

-- Phrase de récupération normalisée : minuscules, sans accents, un espace entre les mots.
create or replace function cs_private.norm_phrase(p text)
returns text language sql immutable
set search_path = ''
as $$
  select btrim(regexp_replace(
    translate(lower(coalesce(p, '')), 'àâäáãéèêëíìîïóòôöõúùûüçñ', 'aaaaaeeeeiiiiooooouuuucn'),
    '[^a-z]+', ' ', 'g'))
$$;

-- 256 mots courants, sans accent : 12 mots tirés au hasard = 96 bits d'entropie.
create or replace function cs_private.wordlist()
returns text[] language sql immutable
set search_path = ''
as $$ select array[
    'abeille', 'abri', 'acier', 'agneau', 'aigle', 'aiguille', 'alpage', 'amande', 'ancre',
    'anneau', 'arbre', 'arche', 'argile', 'atlas', 'aube', 'avion', 'avoine', 'badge', 'bagage',
    'baie', 'balcon', 'baleine', 'bambou', 'banane', 'banc', 'barque', 'bassin', 'bateau',
    'berger', 'beurre', 'biche', 'bille', 'bison', 'blason', 'bocal', 'bois', 'bonbon', 'bougie',
    'bouleau', 'boussole', 'branche', 'brebis', 'brioche', 'brume', 'bulle', 'bureau', 'cabane',
    'cactus', 'cadre', 'caillou', 'calme', 'camion', 'canard', 'canyon', 'carafe', 'carnet',
    'carotte', 'carte', 'cascade', 'castor', 'cerise', 'chalet', 'chameau', 'chapeau', 'charbon',
    'chat', 'chemin', 'cheval', 'chien', 'cigale', 'citron', 'clairon', 'clou', 'cocon', 'colline',
    'compas', 'corde', 'corbeau', 'coton', 'coucou', 'courge', 'crabe', 'crayon', 'cuivre',
    'dauphin', 'dentelle', 'domino', 'dragon', 'dune', 'eau', 'encre', 'escargot', 'falaise',
    'farine', 'faucon', 'fenouil', 'feuille', 'figue', 'flamme', 'fleur', 'flocon', 'fontaine',
    'fourmi', 'fraise', 'framboise', 'frelon', 'fromage', 'fusain', 'galet', 'gant', 'gaufre',
    'girafe', 'glace', 'gland', 'gomme', 'gourde', 'graine', 'grenier', 'griffe', 'grotte',
    'guitare', 'hamac', 'hamster', 'hareng', 'hibou', 'hiver', 'homard', 'horloge', 'houblon',
    'igloo', 'jardin', 'jasmin', 'jonquille', 'jungle', 'kayak', 'koala', 'lac', 'lagune', 'lama',
    'lampe', 'lanterne', 'lapin', 'laurier', 'lavande', 'levure', 'lierre', 'limace', 'lion',
    'loup', 'loutre', 'lune', 'lynx', 'magnolia', 'maison', 'manche', 'mangue', 'marmotte',
    'marron', 'menthe', 'merle', 'miel', 'mimosa', 'miroir', 'montagne', 'moulin', 'mouton',
    'muguet', 'mulet', 'myrtille', 'neige', 'noisette', 'nuage', 'oasis', 'oiseau', 'olive',
    'orage', 'orange', 'ortie', 'ours', 'paille', 'palmier', 'panda', 'panier', 'papillon',
    'parapluie', 'passage', 'pelote', 'pelouse', 'perle', 'phare', 'piano', 'pierre', 'pigeon',
    'pinceau', 'piste', 'plage', 'plume', 'poivre', 'pomme', 'poney', 'pont', 'potager', 'poulpe',
    'prairie', 'prune', 'puits', 'radis', 'raisin', 'rame', 'ravin', 'refuge', 'renard', 'requin',
    'rivage', 'robot', 'rocher', 'roseau', 'ruban', 'ruche', 'ruisseau', 'sable', 'sac', 'safran',
    'sapin', 'sardine', 'saule', 'sentier', 'serpent', 'sirop', 'soleil', 'source', 'souris',
    'tambour', 'tapis', 'taupe', 'tigre', 'tilleul', 'tomate', 'tonneau', 'torrent', 'tortue',
    'toucan', 'tournesol', 'train', 'tracteur', 'trompette', 'tulipe', 'tunnel', 'vache', 'vallon',
    'vanille', 'verger', 'violon', 'volcan', 'wagon', 'yaourt'
  ]::text[] $$;

create or replace function cs_private.new_phrase()
returns text language plpgsql volatile
set search_path = ''
as $$
declare
  w text[] := cs_private.wordlist();
  b bytea := extensions.gen_random_bytes(12);
  out text[] := '{}';
begin
  for i in 0..11 loop
    out := out || w[get_byte(b, i) + 1];
  end loop;
  return array_to_string(out, ' ');
end $$;

create or replace function cs_private.new_invite_code()
returns text language plpgsql volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  b bytea := extensions.gen_random_bytes(8);
  c text := '';
begin
  for i in 0..7 loop
    c := c || substr(alphabet, (get_byte(b, i) % 31) + 1, 1);
    if i = 3 then c := c || '-'; end if;
  end loop;
  return c;
end $$;

create or replace function cs_private.norm_invite(p text)
returns text language sql immutable
set search_path = ''
as $$
  select case when char_length(x) = 8 then substr(x, 1, 4) || '-' || substr(x, 5, 4) else x end
  from (select upper(regexp_replace(coalesce(p, ''), '[^A-Za-z0-9]', '', 'g')) as x) s
$$;

-- Mot de passe : 8 caractères au moins, 72 octets au plus (limite de bcrypt).
create or replace function cs_private.password_problem(p text, u text)
returns text language sql immutable
set search_path = ''
as $$
  select case
    when p is null or char_length(p) < 8 then 'password_short'
    when octet_length(p) > 72 then 'password_long'
    when lower(p) = lower(coalesce(u, '')) then 'password_is_username'
  end
$$;

create or replace function cs_private.hash_password(p text)
returns text language sql volatile
set search_path = ''
as $$ select extensions.crypt(p, extensions.gen_salt('bf', 10)) $$;

create or replace function cs_private.hash_phrase(p text)
returns text language sql volatile
set search_path = ''
as $$ select extensions.crypt(cs_private.sha256(cs_private.norm_phrase(p)), extensions.gen_salt('bf', 8)) $$;

create or replace function cs_private.account_json(p_id uuid)
returns jsonb language sql stable
set search_path = ''
as $$
  select jsonb_build_object('id', a.id, 'username', a.username, 'display_name', a.display_name,
                            'role', a.role, 'created_at', a.created_at)
  from cs_private.accounts a where a.id = p_id
$$;

-- Crée une session et renvoie le jeton (seule son empreinte est gardée).
-- Au plus 10 sessions par compte : les plus anciennes sont fermées.
create or replace function cs_private.new_session(p_account uuid)
returns text language plpgsql volatile
set search_path = ''
as $$
declare
  tok text := encode(extensions.gen_random_bytes(32), 'hex');
begin
  insert into cs_private.sessions (token_hash, account_id) values (cs_private.sha256(tok), p_account);
  delete from cs_private.sessions s
   where s.account_id = p_account
     and s.token_hash in (select x.token_hash from cs_private.sessions x where x.account_id = p_account
                          order by x.last_seen_at desc offset 10);
  update cs_private.accounts set last_login_at = now() where id = p_account;
  return tok;
end $$;

-- Compte associé à un jeton valide (null sinon). Une session dure 180 jours après le dernier passage.
create or replace function cs_private.session_account(p_token text)
returns uuid language plpgsql volatile
set search_path = ''
as $$
declare
  s cs_private.sessions;
begin
  if p_token is null or p_token !~ '^[0-9a-f]{64}$' then return null; end if;
  select * into s from cs_private.sessions where token_hash = cs_private.sha256(p_token);
  if not found or s.last_seen_at < now() - interval '180 days' then return null; end if;
  if s.last_seen_at < now() - interval '1 hour' then
    update cs_private.sessions set last_seen_at = now() where token_hash = s.token_hash;
  end if;
  return s.account_id;
end $$;

create or replace function cs_private.is_admin(p_account uuid)
returns boolean language sql stable
set search_path = ''
as $$ select exists (select 1 from cs_private.accounts where id = p_account and role = 'admin') $$;

-- Échec de mot de passe ou de phrase : 8 échecs d'affilée bloquent le compte 15 minutes.
create or replace function cs_private.register_failure(p_account uuid)
returns jsonb language plpgsql volatile
set search_path = ''
as $$
declare
  n integer;
begin
  update cs_private.accounts
     set failed_count = failed_count + 1
   where id = p_account
  returning failed_count into n;
  if n >= 8 then
    update cs_private.accounts set failed_count = 0, locked_until = now() + interval '15 minutes' where id = p_account;
    return jsonb_build_object('ok', false, 'error', 'locked', 'retry_in', 900);
  end if;
  return jsonb_build_object('ok', false, 'error', 'invalid');
end $$;

create or replace function cs_private.locked_json(p_until timestamptz)
returns jsonb language sql stable
set search_path = ''
as $$ select jsonb_build_object('ok', false, 'error', 'locked', 'retry_in', greatest(1, ceil(extract(epoch from p_until - now()))::integer)) $$;

create or replace function cs_private.err(p_code text)
returns jsonb language sql immutable
set search_path = ''
as $$ select jsonb_build_object('ok', false, 'error', p_code) $$;

-- ---------------------------------------------------------------------------
-- Compte : inscription, connexion, récupération
-- ---------------------------------------------------------------------------

create or replace function public.cs_inscription(p_username text, p_password text, p_display_name text, p_invite text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  u text := cs_private.norm_username(p_username);
  n text := nullif(btrim(coalesce(p_display_name, '')), '');
  c text := cs_private.norm_invite(p_invite);
  inv cs_private.invites;
  acc uuid;
  phrase text;
  problem text;
begin
  if u !~ '^[a-z0-9][a-z0-9._-]{2,23}$' then return cs_private.err('username_invalid'); end if;
  problem := cs_private.password_problem(p_password, u);
  if problem is not null then return cs_private.err(problem); end if;
  n := coalesce(n, u);
  if char_length(n) > 40 then return cs_private.err('name_long'); end if;

  select * into inv from cs_private.invites where code = c for update;
  if not found or inv.used_at is not null or inv.expires_at < now() then return cs_private.err('invite_invalid'); end if;
  if exists (select 1 from cs_private.accounts where username = u) then return cs_private.err('username_taken'); end if;

  phrase := cs_private.new_phrase();
  begin
    insert into cs_private.accounts (username, display_name, role, password_hash, phrase_hash)
    values (u, n, inv.role, cs_private.hash_password(p_password), cs_private.hash_phrase(phrase))
    returning id into acc;
  exception when unique_violation then
    return cs_private.err('username_taken');
  end;
  update cs_private.invites set used_by = acc, used_at = now() where code = c;

  return jsonb_build_object('ok', true, 'token', cs_private.new_session(acc), 'phrase', phrase,
                            'account', cs_private.account_json(acc));
end $$;

create or replace function public.cs_connexion(p_username text, p_password text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  a cs_private.accounts;
begin
  select * into a from cs_private.accounts where username = cs_private.norm_username(p_username) for update;
  if not found then
    perform cs_private.hash_password(coalesce(p_password, ''));  -- même durée qu'un vrai essai
    return cs_private.err('invalid');
  end if;
  if a.locked_until is not null and a.locked_until > now() then return cs_private.locked_json(a.locked_until); end if;
  if a.password_hash <> extensions.crypt(coalesce(p_password, ''), a.password_hash) then
    return cs_private.register_failure(a.id);
  end if;
  update cs_private.accounts set failed_count = 0, locked_until = null where id = a.id;
  return jsonb_build_object('ok', true, 'token', cs_private.new_session(a.id), 'account', cs_private.account_json(a.id));
end $$;

-- Mot de passe oublié : la phrase de 12 mots permet d'en choisir un nouveau.
-- Une nouvelle phrase est générée (l'ancienne ne marche plus) et toutes les sessions sont fermées.
create or replace function public.cs_recuperation(p_username text, p_phrase text, p_new_password text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  a cs_private.accounts;
  phrase text;
  problem text;
begin
  select * into a from cs_private.accounts where username = cs_private.norm_username(p_username) for update;
  if not found then
    perform cs_private.hash_phrase(coalesce(p_phrase, ''));
    return cs_private.err('invalid');
  end if;
  problem := cs_private.password_problem(p_new_password, a.username);
  if problem is not null then return cs_private.err(problem); end if;
  if a.locked_until is not null and a.locked_until > now() then return cs_private.locked_json(a.locked_until); end if;
  if a.phrase_hash <> extensions.crypt(cs_private.sha256(cs_private.norm_phrase(p_phrase)), a.phrase_hash) then
    return cs_private.register_failure(a.id);
  end if;
  phrase := cs_private.new_phrase();
  update cs_private.accounts
     set password_hash = cs_private.hash_password(p_new_password), phrase_hash = cs_private.hash_phrase(phrase),
         failed_count = 0, locked_until = null
   where id = a.id;
  delete from cs_private.sessions where account_id = a.id;
  return jsonb_build_object('ok', true, 'token', cs_private.new_session(a.id), 'phrase', phrase,
                            'account', cs_private.account_json(a.id));
end $$;

create or replace function public.cs_deconnexion(p_token text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
begin
  delete from cs_private.sessions where token_hash = cs_private.sha256(coalesce(p_token, ''));
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.cs_moi(p_token text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
begin
  if acc is null then return cs_private.err('session'); end if;
  return jsonb_build_object('ok', true, 'account', cs_private.account_json(acc));
end $$;

create or replace function public.cs_changer_nom(p_token text, p_name text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
  n text := nullif(btrim(coalesce(p_name, '')), '');
begin
  if acc is null then return cs_private.err('session'); end if;
  if n is null then return cs_private.err('name_empty'); end if;
  if char_length(n) > 40 then return cs_private.err('name_long'); end if;
  update cs_private.accounts set display_name = n where id = acc;
  return jsonb_build_object('ok', true, 'account', cs_private.account_json(acc));
end $$;

-- Change le mot de passe et ferme les autres sessions (celle-ci reste ouverte).
create or replace function public.cs_changer_mot_de_passe(p_token text, p_old text, p_new text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
  a cs_private.accounts;
  problem text;
begin
  if acc is null then return cs_private.err('session'); end if;
  select * into a from cs_private.accounts where id = acc for update;
  if a.locked_until is not null and a.locked_until > now() then return cs_private.locked_json(a.locked_until); end if;
  if a.password_hash <> extensions.crypt(coalesce(p_old, ''), a.password_hash) then return cs_private.register_failure(acc); end if;
  problem := cs_private.password_problem(p_new, a.username);
  if problem is not null then return cs_private.err(problem); end if;
  update cs_private.accounts set password_hash = cs_private.hash_password(p_new), failed_count = 0 where id = acc;
  delete from cs_private.sessions where account_id = acc and token_hash <> cs_private.sha256(p_token);
  return jsonb_build_object('ok', true);
end $$;

-- Nouvelle phrase de récupération (l'ancienne cesse de fonctionner).
create or replace function public.cs_nouvelle_phrase(p_token text, p_password text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
  a cs_private.accounts;
  phrase text;
begin
  if acc is null then return cs_private.err('session'); end if;
  select * into a from cs_private.accounts where id = acc for update;
  if a.locked_until is not null and a.locked_until > now() then return cs_private.locked_json(a.locked_until); end if;
  if a.password_hash <> extensions.crypt(coalesce(p_password, ''), a.password_hash) then return cs_private.register_failure(acc); end if;
  phrase := cs_private.new_phrase();
  update cs_private.accounts set phrase_hash = cs_private.hash_phrase(phrase), failed_count = 0 where id = acc;
  return jsonb_build_object('ok', true, 'phrase', phrase);
end $$;

-- Supprime son propre compte et toute sa progression.
create or replace function public.cs_supprimer_compte(p_token text, p_password text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
  a cs_private.accounts;
begin
  if acc is null then return cs_private.err('session'); end if;
  select * into a from cs_private.accounts where id = acc for update;
  if a.locked_until is not null and a.locked_until > now() then return cs_private.locked_json(a.locked_until); end if;
  if a.password_hash <> extensions.crypt(coalesce(p_password, ''), a.password_hash) then return cs_private.register_failure(acc); end if;
  if a.role = 'admin'
     and not exists (select 1 from cs_private.accounts where role = 'admin' and id <> acc)
     and exists (select 1 from cs_private.accounts where id <> acc) then
    return cs_private.err('last_admin');
  end if;
  delete from cs_private.accounts where id = acc;
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------------------
-- Progression et ligue
-- ---------------------------------------------------------------------------

create or replace function public.cs_lire_progression(p_token text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
  p cs_private.progress;
begin
  if acc is null then return cs_private.err('session'); end if;
  select * into p from cs_private.progress where account_id = acc;
  if not found then return jsonb_build_object('ok', true, 'state', null, 'rev', 0); end if;
  return jsonb_build_object('ok', true, 'state', p.state, 'rev', p.rev, 'updated_at', p.updated_at);
end $$;

-- Écrit la progression si personne d'autre ne l'a modifiée depuis la version p_base_rev.
-- Sinon renvoie la version du serveur pour que l'appareil choisisse.
create or replace function public.cs_ecrire_progression(p_token text, p_state jsonb, p_base_rev bigint)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
  cur cs_private.progress;
  r bigint;
begin
  if acc is null then return cs_private.err('session'); end if;
  if p_state is null or jsonb_typeof(p_state) <> 'object' then return cs_private.err('invalid'); end if;
  if pg_column_size(p_state) >= 1048576 then return cs_private.err('too_large'); end if;
  select * into cur from cs_private.progress where account_id = acc for update;
  if not found then
    insert into cs_private.progress (account_id, state, rev) values (acc, p_state, 1)
    on conflict (account_id) do nothing
    returning rev into r;
    if r is not null then return jsonb_build_object('ok', true, 'rev', r); end if;
    select * into cur from cs_private.progress where account_id = acc for update;
  end if;
  if cur.rev <> coalesce(p_base_rev, -1) then
    return jsonb_build_object('ok', false, 'error', 'conflict', 'rev', cur.rev, 'state', cur.state);
  end if;
  update cs_private.progress set state = p_state, rev = cur.rev + 1, updated_at = now()
   where account_id = acc
  returning rev into r;
  return jsonb_build_object('ok', true, 'rev', r);
end $$;

create or replace function public.cs_ecrire_ligue(p_token text, p_week text, p_xp integer, p_streak integer)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
begin
  if acc is null then return cs_private.err('session'); end if;
  if p_week is null or p_week !~ '^\d{4}-\d{2}-\d{2}$' then return cs_private.err('invalid'); end if;
  insert into cs_private.league (account_id, week, xp, streak, updated_at)
  values (acc, p_week, least(greatest(coalesce(p_xp, 0), 0), 1000000), least(greatest(coalesce(p_streak, 0), 0), 100000), now())
  on conflict (account_id) do update
    set week = excluded.week, xp = excluded.xp, streak = excluded.streak, updated_at = now();
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.cs_lire_ligue(p_token text, p_week text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
begin
  if acc is null then return cs_private.err('session'); end if;
  return jsonb_build_object('ok', true, 'rows', coalesce((
    select jsonb_agg(jsonb_build_object('id', l.account_id, 'name', a.display_name, 'xp', l.xp, 'streak', l.streak, 'week', l.week)
                     order by l.xp desc)
      from cs_private.league l
      join cs_private.accounts a on a.id = l.account_id
     where l.week = p_week), '[]'::jsonb));
end $$;

-- ---------------------------------------------------------------------------
-- Notifications (rappel du soir)
-- ---------------------------------------------------------------------------

create or replace function public.cs_abonner(p_token text, p_endpoint text, p_p256dh text, p_auth text, p_hour integer, p_tz text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
  tz text := coalesce(nullif(btrim(coalesce(p_tz, '')), ''), 'Europe/Paris');
begin
  if acc is null then return cs_private.err('session'); end if;
  if p_endpoint is null or p_endpoint not like 'https://%' or char_length(p_endpoint) >= 1000
     or coalesce(p_p256dh, '') = '' or char_length(p_p256dh) >= 200
     or coalesce(p_auth, '') = '' or char_length(p_auth) >= 100
     or p_hour is null or p_hour not between 6 and 22 then
    return cs_private.err('invalid');
  end if;
  if not exists (select 1 from pg_catalog.pg_timezone_names where name = tz) then tz := 'Europe/Paris'; end if;
  insert into cs_private.push_subscriptions (endpoint, account_id, p256dh, auth, remind_hour, tz, last_reminded_on)
  values (p_endpoint, acc, p_p256dh, p_auth, p_hour, tz, null)
  on conflict (endpoint) do update
    set account_id = excluded.account_id, p256dh = excluded.p256dh, auth = excluded.auth,
        remind_hour = excluded.remind_hour, tz = excluded.tz, last_reminded_on = null;
  return jsonb_build_object('ok', true, 'hour', p_hour);
end $$;

create or replace function public.cs_desabonner(p_token text, p_endpoint text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
begin
  if acc is null then return cs_private.err('session'); end if;
  delete from cs_private.push_subscriptions where endpoint = p_endpoint and account_id = acc;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.cs_abonnement(p_token text, p_endpoint text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
  h smallint;
begin
  if acc is null then return cs_private.err('session'); end if;
  select remind_hour into h from cs_private.push_subscriptions where endpoint = p_endpoint and account_id = acc;
  return jsonb_build_object('ok', true, 'subscribed', h is not null, 'hour', h);
end $$;

-- ---------------------------------------------------------------------------
-- Équipe (administrateurs)
-- ---------------------------------------------------------------------------

create or replace function public.cs_equipe(p_token text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
begin
  if acc is null then return cs_private.err('session'); end if;
  if not cs_private.is_admin(acc) then return cs_private.err('not_admin'); end if;
  return jsonb_build_object('ok', true,
    'membres', coalesce((select jsonb_agg(jsonb_build_object('id', a.id, 'username', a.username, 'display_name', a.display_name,
                                                             'role', a.role, 'created_at', a.created_at, 'last_login_at', a.last_login_at,
                                                             'me', a.id = acc) order by a.created_at)
                           from cs_private.accounts a), '[]'::jsonb),
    'invitations', coalesce((select jsonb_agg(jsonb_build_object('code', i.code, 'role', i.role, 'expires_at', i.expires_at) order by i.created_at)
                               from cs_private.invites i where i.used_at is null and i.expires_at > now()), '[]'::jsonb));
end $$;

create or replace function public.cs_creer_invitation(p_token text, p_role text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
  r text := coalesce(p_role, 'member');
  c text;
  e timestamptz;
begin
  if acc is null then return cs_private.err('session'); end if;
  if not cs_private.is_admin(acc) then return cs_private.err('not_admin'); end if;
  if r not in ('admin', 'member') then return cs_private.err('invalid'); end if;
  if (select count(*) from cs_private.invites where used_at is null and expires_at > now()) >= 20 then
    return cs_private.err('too_many_invites');
  end if;
  loop
    c := cs_private.new_invite_code();
    begin
      insert into cs_private.invites (code, role, created_by) values (c, r, acc) returning expires_at into e;
      exit;
    exception when unique_violation then
      -- code déjà pris : on en tire un autre
    end;
  end loop;
  return jsonb_build_object('ok', true, 'code', c, 'role', r, 'expires_at', e);
end $$;

create or replace function public.cs_annuler_invitation(p_token text, p_code text)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
begin
  if acc is null then return cs_private.err('session'); end if;
  if not cs_private.is_admin(acc) then return cs_private.err('not_admin'); end if;
  delete from cs_private.invites where code = cs_private.norm_invite(p_code) and used_at is null;
  return jsonb_build_object('ok', true);
end $$;

-- Retire un membre : son compte et sa progression sont supprimés.
create or replace function public.cs_retirer_membre(p_token text, p_member uuid)
returns jsonb language plpgsql security definer
set search_path = ''
as $$
declare
  acc uuid := cs_private.session_account(p_token);
begin
  if acc is null then return cs_private.err('session'); end if;
  if not cs_private.is_admin(acc) then return cs_private.err('not_admin'); end if;
  if p_member = acc then return cs_private.err('self'); end if;
  delete from cs_private.accounts where id = p_member;
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------------------
-- Tâche planifiée (protégée par un secret)
-- ---------------------------------------------------------------------------

create or replace function cs_private.check_cron_secret(p_secret text)
returns void language plpgsql
set search_path = ''
as $$
begin
  if p_secret is null or char_length(p_secret) < 24 or not exists (
    select 1 from cs_private.settings
     where key = 'cron_secret_sha256' and value = cs_private.sha256(p_secret)
  ) then
    raise exception 'unauthorized' using errcode = '28000';
  end if;
end $$;

-- À lancer une fois depuis l'éditeur SQL : select cs_private.set_cron_secret('le-secret');
create or replace function cs_private.set_cron_secret(p_secret text)
returns void language plpgsql
set search_path = ''
as $$
begin
  if char_length(coalesce(p_secret, '')) < 24 then raise exception 'secret_too_short'; end if;
  insert into cs_private.settings (key, value) values ('cron_secret_sha256', cs_private.sha256(p_secret))
  on conflict (key) do update set value = excluded.value;
end $$;

-- Crée une invitation administrateur (pour le tout premier compte, ou en secours).
-- À lancer depuis l'éditeur SQL : select cs_private.invitation_admin();
create or replace function cs_private.invitation_admin(p_days integer default 30)
returns text language plpgsql
set search_path = ''
as $$
declare
  c text;
begin
  loop
    c := cs_private.new_invite_code();
    begin
      insert into cs_private.invites (code, role, expires_at) values (c, 'admin', now() + make_interval(days => greatest(1, p_days)));
      return c;
    exception when unique_violation then
    end;
  end loop;
end $$;

-- Relance la base (battement de cœur), fait le ménage, et renvoie les rappels à envoyer :
-- abonnés dont l'heure de rappel est passée, pas encore relancés aujourd'hui,
-- et qui n'ont pas fait leur séance du jour.
create or replace function public.cs_rappels_du_moment(p_secret text)
returns table (endpoint text, p256dh text, auth text, streak integer, mission text, name text)
language plpgsql security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  perform cs_private.check_cron_secret(p_secret);

  insert into cs_private.heartbeat (id, beat_at, beats) values (1, now(), 1)
  on conflict (id) do update set beat_at = now(), beats = cs_private.heartbeat.beats + 1;

  delete from cs_private.sessions where last_seen_at < now() - interval '180 days';
  delete from cs_private.invites where used_at is null and expires_at < now() - interval '30 days';

  return query
  with base as (
    select s.endpoint, s.p256dh, s.auth, s.account_id, s.remind_hour, s.last_reminded_on,
           (now() at time zone s.tz) as local_now,
           p.state
      from cs_private.push_subscriptions s
      left join cs_private.progress p on p.account_id = s.account_id
  ),
  due as (
    select b.*, b.local_now::date as today,
           case when (b.state -> 'streak' ->> 'last') ~ '^\d{4}-\d{2}-\d{2}$' then b.state -> 'streak' ->> 'last' end as last_day,
           case when (b.state -> 'streak' ->> 'count') ~ '^\d{1,6}$' then (b.state -> 'streak' ->> 'count')::integer else 0 end as streak_count,
           case when (b.state -> 'streak' ->> 'freezes') ~ '^\d{1,3}$' then (b.state -> 'streak' ->> 'freezes')::integer else 0 end as freezes
      from base b
     where extract(hour from b.local_now) >= b.remind_hour
       and extract(hour from b.local_now) < 23
       and (b.last_reminded_on is null or b.last_reminded_on < b.local_now::date)
       and coalesce(b.state -> 'streak' ->> 'last', '') <> to_char(b.local_now::date, 'YYYY-MM-DD')
  ),
  marked as (
    update cs_private.push_subscriptions ps
       set last_reminded_on = d.today
      from due d
     where ps.endpoint = d.endpoint
    returning ps.endpoint
  )
  select d.endpoint, d.p256dh, d.auth,
         case
           when d.last_day is not null
            and (d.today - to_date(d.last_day, 'YYYY-MM-DD') - 1) <= d.freezes
           then d.streak_count else 0
         end as streak,
         (select m.value ->> 'text'
            from jsonb_each(case when jsonb_typeof(d.state -> 'missions') = 'object' then d.state -> 'missions' else '{}'::jsonb end) m
           where jsonb_typeof(m.value) = 'object'
             and m.value ->> 'status' = 'active'
             and (m.value ->> 'due') <= to_char(d.today, 'YYYY-MM-DD')
           order by m.value ->> 'due'
           limit 1) as mission,
         (select a.display_name from cs_private.accounts a where a.id = d.account_id) as name
    from due d
   where d.endpoint in (select mk.endpoint from marked mk);
end $$;

-- Supprime les abonnements expirés signalés par les services de notification.
create or replace function public.cs_supprimer_abonnements(p_secret text, p_endpoints text[])
returns integer language plpgsql security definer
set search_path = ''
as $$
declare
  n integer;
begin
  perform cs_private.check_cron_secret(p_secret);
  delete from cs_private.push_subscriptions where endpoint = any (p_endpoints);
  get diagnostics n = row_count;
  return n;
end $$;

-- ---------------------------------------------------------------------------
-- Droits
-- ---------------------------------------------------------------------------

revoke all on all tables in schema cs_private from public;
revoke all on all functions in schema cs_private from public;

do $$
declare
  f record;
begin
  -- Les rôles anon et authenticated existent sur Supabase.
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on schema cs_private from anon, authenticated';
    execute 'revoke all on all tables in schema cs_private from anon, authenticated';
    execute 'revoke all on all functions in schema cs_private from anon, authenticated';
  end if;
  for f in
    select p.oid::regprocedure as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname like 'cs\_%'
  loop
    execute format('revoke all on function %s from public', f.sig);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on function %s from anon, authenticated', f.sig);
      execute format('grant execute on function %s to anon, authenticated', f.sig);
    end if;
  end loop;
end $$;
