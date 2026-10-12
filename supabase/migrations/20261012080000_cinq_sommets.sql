-- Cinq Sommets : schéma de la base
-- Membres autorisés, progression privée, ligue d'équipe, abonnements aux notifications,
-- quota du coach et fonctions appelées par la tâche planifiée GitHub.

create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
revoke all on schema private from public;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Qui a le droit d'utiliser le site (et le coach, qui coûte de l'argent).
create table if not exists public.members (
  email        text primary key check (email = lower(email) and position('@' in email) > 1),
  display_name text check (char_length(display_name) <= 40),
  role         text not null default 'member' check (role in ('admin', 'member')),
  added_at     timestamptz not null default now()
);

-- Toute la progression d'un joueur, au format du jeu (un document JSON).
create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb not null check (pg_column_size(state) < 1048576),
  updated_at timestamptz not null default now()
);

-- Ligue d'équipe : le D+ de la semaine de chaque joueur.
create table if not exists public.league (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  week       text not null check (week ~ '^\d{4}-\d{2}-\d{2}$'),
  xp         integer not null default 0 check (xp between 0 and 1000000),
  streak     integer not null default 0 check (streak between 0 and 100000),
  name       text check (char_length(name) <= 40),
  updated_at timestamptz not null default now()
);
create index if not exists league_week_idx on public.league (week);

-- Abonnements Web Push (un par appareil).
create table if not exists public.push_subscriptions (
  endpoint         text primary key check (endpoint like 'https://%'),
  user_id          uuid not null references auth.users (id) on delete cascade,
  p256dh           text not null,
  auth             text not null,
  remind_hour      smallint not null default 20 check (remind_hour between 6 and 22),
  tz               text not null default 'Europe/Paris',
  last_reminded_on date,
  created_at       timestamptz not null default now()
);
create index if not exists push_subscriptions_user_idx on public.push_subscriptions (user_id);

-- Nombre d'appels au coach par jour et par joueur.
create table if not exists public.coach_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day     date not null,
  n       integer not null default 0,
  primary key (user_id, day)
);

-- Réglages privés (empreinte du secret de la tâche planifiée).
create table if not exists private.settings (
  key   text primary key,
  value text not null
);

-- Battement de cœur : chaque passage de la tâche planifiée écrit ici,
-- ce qui suffit à garder le projet actif sur l'offre gratuite.
create table if not exists private.heartbeat (
  id      integer primary key default 1 check (id = 1),
  beat_at timestamptz not null default now(),
  beats   bigint not null default 0
);

-- ---------------------------------------------------------------------------
-- Fonctions d'accès
-- ---------------------------------------------------------------------------

create or replace function public.current_email()
returns text language sql stable
set search_path = ''
as $$ select lower(coalesce(auth.jwt() ->> 'email', '')) $$;

create or replace function public.is_member()
returns boolean language sql stable security definer
set search_path = ''
as $$ select exists (select 1 from public.members m where m.email = public.current_email()) $$;

create or replace function public.is_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$ select exists (select 1 from public.members m where m.email = public.current_email() and m.role = 'admin') $$;

-- Le tout premier compte connecté devient administrateur.
-- Ensuite, seuls les e-mails ajoutés par un administrateur ont accès.
create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer
set search_path = ''
as $$
declare
  e text := public.current_email();
begin
  if auth.uid() is null or e = '' then
    return false;
  end if;
  lock table public.members in share row exclusive mode;
  if not exists (select 1 from public.members) then
    insert into public.members (email, display_name, role)
    values (e, initcap(split_part(split_part(e, '@', 1), '.', 1)), 'admin');
  end if;
  return exists (select 1 from public.members where email = e);
end $$;

-- Profil du joueur connecté (null s'il n'est pas autorisé).
create or replace function public.mon_profil()
returns table (email text, display_name text, role text)
language sql stable security definer
set search_path = ''
as $$
  select m.email, m.display_name, m.role from public.members m where m.email = public.current_email()
$$;

create or replace function public.set_display_name(p_name text)
returns void language plpgsql security definer
set search_path = ''
as $$
declare
  n text := nullif(btrim(coalesce(p_name, '')), '');
begin
  if not public.is_member() then raise exception 'not_member' using errcode = '42501'; end if;
  if n is not null and char_length(n) > 40 then raise exception 'name_too_long' using errcode = '22001'; end if;
  update public.members set display_name = n where email = public.current_email();
  update public.league set name = n where user_id = auth.uid();
end $$;

-- Gestion de l'équipe (administrateurs uniquement).
create or replace function public.list_members()
returns table (email text, display_name text, role text, added_at timestamptz)
language plpgsql stable security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not public.is_admin() then raise exception 'not_admin' using errcode = '42501'; end if;
  return query select m.email, m.display_name, m.role, m.added_at from public.members m order by m.added_at;
end $$;

create or replace function public.add_member(p_email text, p_name text default null, p_role text default 'member')
returns void language plpgsql security definer
set search_path = ''
as $$
declare
  e text := lower(btrim(coalesce(p_email, '')));
begin
  if not public.is_admin() then raise exception 'not_admin' using errcode = '42501'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'invalid_email' using errcode = '22023'; end if;
  if p_role not in ('admin', 'member') then raise exception 'invalid_role' using errcode = '22023'; end if;
  insert into public.members (email, display_name, role)
  values (e, nullif(btrim(coalesce(p_name, '')), ''), p_role)
  on conflict (email) do update set display_name = coalesce(excluded.display_name, public.members.display_name), role = excluded.role;
end $$;

create or replace function public.remove_member(p_email text)
returns void language plpgsql security definer
set search_path = ''
as $$
declare
  e text := lower(btrim(coalesce(p_email, '')));
begin
  if not public.is_admin() then raise exception 'not_admin' using errcode = '42501'; end if;
  if e = public.current_email() then raise exception 'cannot_remove_self' using errcode = '42501'; end if;
  delete from public.members where email = e;
end $$;

-- Quota du coach : 150 appels par jour et par joueur.
create or replace function public.coach_take()
returns boolean language plpgsql security definer
set search_path = ''
as $$
declare
  d date := (now() at time zone 'Europe/Paris')::date;
  used integer;
begin
  if auth.uid() is null or not public.is_member() then return false; end if;
  insert into public.coach_usage as c (user_id, day, n) values (auth.uid(), d, 1)
  on conflict (user_id, day) do update set n = c.n + 1
  returning c.n into used;
  return used <= 150;
end $$;

-- ---------------------------------------------------------------------------
-- Fonctions appelées par la tâche planifiée (protégées par un secret)
-- ---------------------------------------------------------------------------

create or replace function private.check_cron_secret(p_secret text)
returns void language plpgsql security definer
set search_path = ''
as $$
begin
  if p_secret is null or char_length(p_secret) < 24 or not exists (
    select 1 from private.settings
    where key = 'cron_secret_sha256'
      and value = encode(extensions.digest(p_secret, 'sha256'), 'hex')
  ) then
    raise exception 'unauthorized' using errcode = '28000';
  end if;
end $$;

-- Enregistre l'empreinte du secret. À lancer une fois depuis l'éditeur SQL :
--   select private.set_cron_secret('le-secret');
create or replace function private.set_cron_secret(p_secret text)
returns void language plpgsql security definer
set search_path = ''
as $$
begin
  if char_length(coalesce(p_secret, '')) < 24 then raise exception 'secret_too_short'; end if;
  insert into private.settings (key, value)
  values ('cron_secret_sha256', encode(extensions.digest(p_secret, 'sha256'), 'hex'))
  on conflict (key) do update set value = excluded.value;
end $$;

-- Relance la base (battement de cœur) et renvoie les rappels à envoyer maintenant :
-- abonnés dont l'heure de rappel est passée, pas encore relancés aujourd'hui,
-- et qui n'ont pas fait leur séance du jour.
create or replace function public.rappels_du_moment(p_secret text)
returns table (endpoint text, p256dh text, auth text, streak integer, mission text, name text)
language plpgsql security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  perform private.check_cron_secret(p_secret);

  insert into private.heartbeat (id, beat_at, beats) values (1, now(), 1)
  on conflict (id) do update set beat_at = now(), beats = private.heartbeat.beats + 1;

  return query
  with base as (
    select s.endpoint, s.p256dh, s.auth, s.user_id, s.remind_hour, s.last_reminded_on,
           (now() at time zone s.tz) as local_now,
           p.state
    from public.push_subscriptions s
    left join public.progress p on p.user_id = s.user_id
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
    update public.push_subscriptions ps
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
            from jsonb_each(coalesce(d.state -> 'missions', '{}'::jsonb)) m
           where m.value ->> 'status' = 'active'
             and (m.value ->> 'due') <= to_char(d.today, 'YYYY-MM-DD')
           order by m.value ->> 'due'
           limit 1) as mission,
         (select l.name from public.league l where l.user_id = d.user_id) as name
  from due d
  where d.endpoint in (select mk.endpoint from marked mk);
end $$;

-- Supprime les abonnements expirés signalés par les services de notification.
create or replace function public.supprimer_abonnements(p_secret text, p_endpoints text[])
returns integer language plpgsql security definer
set search_path = ''
as $$
declare
  n integer;
begin
  perform private.check_cron_secret(p_secret);
  delete from public.push_subscriptions where endpoint = any (p_endpoints);
  get diagnostics n = row_count;
  return n;
end $$;

-- ---------------------------------------------------------------------------
-- Sécurité au niveau des lignes
-- ---------------------------------------------------------------------------

alter table public.members enable row level security;
alter table public.progress enable row level security;
alter table public.league enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.coach_usage enable row level security;
alter table private.settings enable row level security;
alter table private.heartbeat enable row level security;

-- members : lecture de sa propre ligne ; toute modification passe par les fonctions.
drop policy if exists members_self_read on public.members;
create policy members_self_read on public.members
  for select to authenticated
  using (email = public.current_email());

-- progress : chacun ne voit et n'écrit que sa progression.
drop policy if exists progress_own on public.progress;
create policy progress_own on public.progress
  for all to authenticated
  using (user_id = auth.uid() and public.is_member())
  with check (user_id = auth.uid() and public.is_member());

-- league : les membres voient toute l'équipe, chacun n'écrit que sa ligne.
drop policy if exists league_read on public.league;
create policy league_read on public.league
  for select to authenticated
  using (public.is_member());
drop policy if exists league_write_own on public.league;
create policy league_write_own on public.league
  for insert to authenticated
  with check (user_id = auth.uid() and public.is_member());
drop policy if exists league_update_own on public.league;
create policy league_update_own on public.league
  for update to authenticated
  using (user_id = auth.uid() and public.is_member())
  with check (user_id = auth.uid() and public.is_member());

-- push_subscriptions : chacun gère ses appareils.
drop policy if exists push_own on public.push_subscriptions;
create policy push_own on public.push_subscriptions
  for all to authenticated
  using (user_id = auth.uid() and public.is_member())
  with check (user_id = auth.uid() and public.is_member());

-- coach_usage et private.* : aucune politique, donc aucun accès direct.

-- ---------------------------------------------------------------------------
-- Droits d'exécution
-- ---------------------------------------------------------------------------

revoke all on function public.current_email() from public, anon, authenticated;
revoke all on function public.is_member() from public, anon, authenticated;
revoke all on function public.is_admin() from public, anon, authenticated;
revoke all on function public.claim_first_admin() from public, anon, authenticated;
revoke all on function public.mon_profil() from public, anon, authenticated;
revoke all on function public.set_display_name(text) from public, anon, authenticated;
revoke all on function public.list_members() from public, anon, authenticated;
revoke all on function public.add_member(text, text, text) from public, anon, authenticated;
revoke all on function public.remove_member(text) from public, anon, authenticated;
revoke all on function public.coach_take() from public, anon, authenticated;
revoke all on function public.rappels_du_moment(text) from public, anon, authenticated;
revoke all on function public.supprimer_abonnements(text, text[]) from public, anon, authenticated;
revoke all on function private.check_cron_secret(text) from public, anon, authenticated;
revoke all on function private.set_cron_secret(text) from public, anon, authenticated;

grant execute on function public.current_email() to authenticated;
grant execute on function public.is_member() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.claim_first_admin() to authenticated;
grant execute on function public.mon_profil() to authenticated;
grant execute on function public.set_display_name(text) to authenticated;
grant execute on function public.list_members() to authenticated;
grant execute on function public.add_member(text, text, text) to authenticated;
grant execute on function public.remove_member(text) to authenticated;
grant execute on function public.coach_take() to authenticated;
grant execute on function public.rappels_du_moment(text) to anon, authenticated;
grant execute on function public.supprimer_abonnements(text, text[]) to anon, authenticated;

revoke all on public.members, public.progress, public.league, public.push_subscriptions, public.coach_usage from anon;
revoke all on public.coach_usage from authenticated;
grant select, insert, update, delete on public.progress, public.league, public.push_subscriptions to authenticated;
grant select on public.members to authenticated;
