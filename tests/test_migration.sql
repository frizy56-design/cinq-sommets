-- Vérifie la migration sur un Postgres local :
--   psql -d cs_test -f tests/supabase_stubs.sql
--   psql -d cs_test -f supabase/migrations/20261012120000_cinq_sommets.sql
--   psql -d cs_test -f tests/test_migration.sql
\set ON_ERROR_STOP 1
\set QUIET 1
\pset tuples_only on

create or replace function pg_temp.check(cond boolean, label text) returns void language plpgsql as $$
begin
  if cond is not true then raise exception 'ECHEC : %', label; end if;
  raise notice 'ok  %', label;
end $$;

select cs_private.set_cron_secret('un-secret-de-test-assez-long-123456');
create temp table t (k text primary key, v jsonb);
grant all on t to anon;
insert into t values ('invite_admin', to_jsonb(cs_private.invitation_admin()));

set role anon;

-- 1. Accès direct aux tables impossible
do $$ begin
  perform 1 from cs_private.accounts;
  raise exception 'ECHEC : anon lit cs_private.accounts';
exception when insufficient_privilege then raise notice 'ok  anon ne voit pas les tables privées';
end $$;
do $$ begin
  perform cs_private.invitation_admin();
  raise exception 'ECHEC : anon crée une invitation admin';
exception when insufficient_privilege then raise notice 'ok  anon ne peut pas appeler les fonctions privées';
end $$;

-- 2. Inscription
select pg_temp.check(public.cs_inscription('antoine', 'motdepasse1', 'Antoine', 'ZZZZ-ZZZZ') ->> 'error' = 'invite_invalid', 'invitation inconnue refusée');
select pg_temp.check(public.cs_inscription('a', 'motdepasse1', 'Antoine', (select v #>> '{}' from t where k = 'invite_admin')) ->> 'error' = 'username_invalid', 'nom trop court refusé');
select pg_temp.check(public.cs_inscription('antoine', 'court', 'Antoine', (select v #>> '{}' from t where k = 'invite_admin')) ->> 'error' = 'password_short', 'mot de passe trop court refusé');
select pg_temp.check(public.cs_inscription('antoine', 'antoine', 'Antoine', (select v #>> '{}' from t where k = 'invite_admin')) ->> 'error' in ('password_short', 'password_is_username'), 'mot de passe = nom refusé');
insert into t values ('antoine', public.cs_inscription('  Antoine ', 'motdepasse1', 'Antoine', lower(replace((select v #>> '{}' from t where k = 'invite_admin'), '-', ' '))));
select pg_temp.check((select v ->> 'ok' from t where k = 'antoine') = 'true', 'inscription admin avec code saisi en minuscules');
select pg_temp.check((select v #>> '{account,role}' from t where k = 'antoine') = 'admin', 'le premier compte est admin');
select pg_temp.check((select v #>> '{account,username}' from t where k = 'antoine') = 'antoine', 'nom normalisé');
select pg_temp.check((select array_length(string_to_array(v ->> 'phrase', ' '), 1) from t where k = 'antoine') = 12, 'phrase de 12 mots');
select pg_temp.check((select (v ->> 'token') ~ '^[0-9a-f]{64}$' from t where k = 'antoine'), 'jeton de session');
select pg_temp.check(public.cs_inscription('autre', 'motdepasse1', 'Autre', (select v #>> '{}' from t where k = 'invite_admin')) ->> 'error' = 'invite_invalid', 'invitation déjà utilisée');

-- 3. Session
select pg_temp.check(public.cs_moi((select v ->> 'token' from t where k = 'antoine')) #>> '{account,display_name}' = 'Antoine', 'cs_moi avec jeton');
select pg_temp.check(public.cs_moi('0000000000000000000000000000000000000000000000000000000000000000') ->> 'error' = 'session', 'jeton inconnu refusé');
select pg_temp.check(public.cs_moi('pas un jeton') ->> 'error' = 'session', 'jeton mal formé refusé');

-- 4. Connexion et blocage
select pg_temp.check(public.cs_connexion('inconnu', 'motdepasse1') ->> 'error' = 'invalid', 'nom inconnu');
select pg_temp.check(public.cs_connexion('antoine', 'mauvais') ->> 'error' = 'invalid', 'mauvais mot de passe');
do $$ declare r jsonb; begin
  for i in 2..7 loop r := public.cs_connexion('antoine', 'mauvais'); end loop;
  r := public.cs_connexion('antoine', 'mauvais');
  perform pg_temp.check(r ->> 'error' = 'locked', 'blocage au 8e échec');
  r := public.cs_connexion('antoine', 'motdepasse1');
  perform pg_temp.check(r ->> 'error' = 'locked' and (r ->> 'retry_in')::int > 800, 'bon mot de passe refusé pendant le blocage');
end $$;
reset role;
update cs_private.accounts set locked_until = now() - interval '1 second' where username = 'antoine';
set role anon;
insert into t values ('antoine2', public.cs_connexion('ANTOINE', 'motdepasse1'));
select pg_temp.check((select v ->> 'ok' from t where k = 'antoine2') = 'true', 'connexion après blocage, nom en majuscules');

-- 5. Progression avec détection de conflit
select pg_temp.check(public.cs_lire_progression((select v ->> 'token' from t where k = 'antoine')) ->> 'rev' = '0', 'progression vide');
select pg_temp.check(public.cs_ecrire_progression((select v ->> 'token' from t where k = 'antoine'), '{"xp":10,"streak":{"count":5,"last":"2000-01-01","freezes":0},"missions":{"m1":{"text":"Appelle une marque","status":"active","due":"2000-01-01"}}}', 0) ->> 'rev' = '1', 'première écriture');
select pg_temp.check(public.cs_ecrire_progression((select v ->> 'token' from t where k = 'antoine2'), '{"xp":20}', 1) ->> 'rev' = '2', 'écriture depuis un autre appareil');
select pg_temp.check(public.cs_ecrire_progression((select v ->> 'token' from t where k = 'antoine'), '{"xp":15}', 1) ->> 'error' = 'conflict', 'conflit détecté');
select pg_temp.check(public.cs_ecrire_progression((select v ->> 'token' from t where k = 'antoine'), '{"xp":15}', 1) #>> '{state,xp}' = '20', 'le conflit renvoie la version du serveur');
select pg_temp.check(public.cs_ecrire_progression((select v ->> 'token' from t where k = 'antoine'), '[1,2]', 2) ->> 'error' = 'invalid', 'état non objet refusé');
select pg_temp.check(public.cs_ecrire_progression((select v ->> 'token' from t where k = 'antoine'), '{"xp":20,"streak":{"count":5,"last":"2000-01-01","freezes":0},"missions":{"m1":{"text":"Appelle une marque","status":"active","due":"2000-01-01"}}}', 2) ->> 'rev' = '3', 'écriture après relecture');

-- 6. Invitation d'un membre
select pg_temp.check(public.cs_creer_invitation('0000000000000000000000000000000000000000000000000000000000000000', 'member') ->> 'error' = 'session', 'invitation sans session refusée');
insert into t values ('inv_jules', public.cs_creer_invitation((select v ->> 'token' from t where k = 'antoine'), 'member'));
select pg_temp.check((select v ->> 'code' from t where k = 'inv_jules') ~ '^[A-Z2-9]{4}-[A-Z2-9]{4}$', 'code d''invitation lisible');
insert into t values ('jules', public.cs_inscription('jules', 'jules-mdp-123', '', (select v ->> 'code' from t where k = 'inv_jules')));
select pg_temp.check((select v #>> '{account,role}' from t where k = 'jules') = 'member', 'jules est membre');
select pg_temp.check((select v #>> '{account,display_name}' from t where k = 'jules') = 'jules', 'nom affiché par défaut');
select pg_temp.check(public.cs_inscription('Jules', 'autre-mdp-123', '', (select v ->> 'code' from public.cs_creer_invitation((select v ->> 'token' from t where k = 'antoine'), 'member') v)) ->> 'error' = 'username_taken', 'nom déjà pris');
select pg_temp.check(public.cs_equipe((select v ->> 'token' from t where k = 'jules')) ->> 'error' = 'not_admin', 'jules ne gère pas l''équipe');
select pg_temp.check(public.cs_creer_invitation((select v ->> 'token' from t where k = 'jules'), 'admin') ->> 'error' = 'not_admin', 'jules ne crée pas d''invitation');
select pg_temp.check(jsonb_array_length(public.cs_equipe((select v ->> 'token' from t where k = 'antoine')) -> 'membres') = 2, 'l''admin voit 2 membres');
select pg_temp.check(jsonb_array_length(public.cs_equipe((select v ->> 'token' from t where k = 'antoine')) -> 'invitations') = 1, 'une invitation en attente');

-- 7. Chacun sa progression, ligue partagée
select pg_temp.check(public.cs_lire_progression((select v ->> 'token' from t where k = 'jules')) ->> 'rev' = '0', 'jules ne voit pas la progression d''antoine');
select pg_temp.check(public.cs_ecrire_ligue((select v ->> 'token' from t where k = 'antoine'), '2026-10-12', 120, 5) ->> 'ok' = 'true', 'ligue antoine');
select pg_temp.check(public.cs_ecrire_ligue((select v ->> 'token' from t where k = 'jules'), '2026-10-12', 40, 1) ->> 'ok' = 'true', 'ligue jules');
select pg_temp.check(public.cs_ecrire_ligue((select v ->> 'token' from t where k = 'jules'), 'x', 40, 1) ->> 'error' = 'invalid', 'semaine invalide');
select pg_temp.check(jsonb_array_length(public.cs_lire_ligue((select v ->> 'token' from t where k = 'jules'), '2026-10-12') -> 'rows') = 2, 'jules voit les 2 lignes');
select pg_temp.check(public.cs_lire_ligue((select v ->> 'token' from t where k = 'jules'), '2026-10-12') #>> '{rows,0,name}' = 'Antoine', 'classement trié, nom affiché');
select pg_temp.check(public.cs_changer_nom((select v ->> 'token' from t where k = 'jules'), 'Jules') #>> '{account,display_name}' = 'Jules', 'changement de nom');

-- 8. Récupération par la phrase
select pg_temp.check(public.cs_recuperation('antoine', 'abeille abeille abeille abeille abeille abeille abeille abeille abeille abeille abeille abeille', 'nouveau-mdp-1') ->> 'error' = 'invalid', 'mauvaise phrase refusée');
select pg_temp.check(public.cs_recuperation('antoine', (select v ->> 'phrase' from t where k = 'antoine'), 'court') ->> 'error' = 'password_short', 'nouveau mot de passe trop court');
insert into t values ('antoine3', public.cs_recuperation(' antoine', '  ' || upper(replace((select v ->> 'phrase' from t where k = 'antoine'), ' ', ' ,  ')) || '. ', 'nouveau-mdp-1'));
select pg_temp.check((select v ->> 'ok' from t where k = 'antoine3') = 'true', 'récupération avec phrase en majuscules et ponctuation');
select pg_temp.check((select v ->> 'phrase' from t where k = 'antoine3') <> (select v ->> 'phrase' from t where k = 'antoine'), 'nouvelle phrase générée');
select pg_temp.check(public.cs_moi((select v ->> 'token' from t where k = 'antoine')) ->> 'error' = 'session', 'anciennes sessions fermées');
select pg_temp.check(public.cs_connexion('antoine', 'motdepasse1') ->> 'error' = 'invalid', 'ancien mot de passe refusé');
select pg_temp.check(public.cs_connexion('antoine', 'nouveau-mdp-1') ->> 'ok' = 'true', 'nouveau mot de passe accepté');
select pg_temp.check(public.cs_recuperation('antoine', (select v ->> 'phrase' from t where k = 'antoine'), 'encore-un-mdp') ->> 'error' = 'invalid', 'ancienne phrase refusée');
select pg_temp.check(public.cs_lire_progression((select v ->> 'token' from t where k = 'antoine3')) ->> 'rev' = '3', 'progression conservée');

-- 9. Mot de passe et phrase depuis le compte
select pg_temp.check(public.cs_changer_mot_de_passe((select v ->> 'token' from t where k = 'antoine3'), 'faux', 'mdp-change-1') ->> 'error' = 'invalid', 'changement refusé sans l''ancien');
select pg_temp.check(public.cs_changer_mot_de_passe((select v ->> 'token' from t where k = 'antoine3'), 'nouveau-mdp-1', 'mdp-change-1') ->> 'ok' = 'true', 'mot de passe changé');
select pg_temp.check(public.cs_moi((select v ->> 'token' from t where k = 'antoine3')) ->> 'ok' = 'true', 'la session courante reste ouverte');
select pg_temp.check(array_length(string_to_array(public.cs_nouvelle_phrase((select v ->> 'token' from t where k = 'antoine3'), 'mdp-change-1') ->> 'phrase', ' '), 1) = 12, 'nouvelle phrase depuis le compte');

-- 10. Rappels et battement de cœur
select pg_temp.check(public.cs_abonner((select v ->> 'token' from t where k = 'antoine3'), 'http://pas-https', 'k', 'a', 20, 'Europe/Paris') ->> 'error' = 'invalid', 'abonnement non https refusé');
select pg_temp.check(public.cs_abonner((select v ->> 'token' from t where k = 'antoine3'), 'https://push.example/abc', 'cle', 'auth', 6, 'Pas/Une_Zone') ->> 'ok' = 'true', 'abonnement (zone inconnue remplacée)');
select pg_temp.check(public.cs_abonnement((select v ->> 'token' from t where k = 'antoine3'), 'https://push.example/abc') ->> 'hour' = '6', 'heure enregistrée');
select pg_temp.check(public.cs_abonnement((select v ->> 'token' from t where k = 'jules'), 'https://push.example/abc') ->> 'subscribed' = 'false', 'jules ne voit pas cet abonnement');
do $$ begin
  perform public.cs_rappels_du_moment('mauvais-secret-mais-assez-long-0000');
  raise exception 'ECHEC : mauvais secret accepté';
exception when sqlstate '28000' then raise notice 'ok  mauvais secret refusé';
end $$;
reset role;
-- Fuseau où il est midi en ce moment, pour que le test marche à toute heure.
update cs_private.push_subscriptions set remind_hour = 6,
  tz = (select name from pg_timezone_names where name like 'Etc/GMT%' and extract(hour from now() at time zone name) = 12 limit 1);
set role anon;
create temp table r1 as select * from public.cs_rappels_du_moment('un-secret-de-test-assez-long-123456');
select pg_temp.check((select count(*) from r1) = 1, 'un rappel à envoyer');
select pg_temp.check((select name from r1) = 'Antoine', 'prénom dans le rappel');
select pg_temp.check((select mission from r1) = 'Appelle une marque', 'mission du jour dans le rappel');
select pg_temp.check((select streak from r1) = 0, 'série cassée détectée (dernier jour en 2000)');
select pg_temp.check((select count(*) from public.cs_rappels_du_moment('un-secret-de-test-assez-long-123456')) = 0, 'pas deux rappels le même jour');
select pg_temp.check(public.cs_supprimer_abonnements('un-secret-de-test-assez-long-123456', array['https://push.example/abc']) = 1, 'abonnement expiré supprimé');
reset role;
select pg_temp.check((select beats from cs_private.heartbeat) = 2, 'battement de cœur enregistré');
set role anon;

-- 11. Retrait d'un membre, dernier admin
select pg_temp.check(public.cs_supprimer_compte((select v ->> 'token' from t where k = 'antoine3'), 'mdp-change-1') ->> 'error' = 'last_admin', 'le dernier admin ne peut pas partir avant les membres');
select pg_temp.check(public.cs_retirer_membre((select v ->> 'token' from t where k = 'jules'), (select (v #>> '{account,id}')::uuid from t where k = 'antoine')) ->> 'error' = 'not_admin', 'jules ne retire personne');
select pg_temp.check(public.cs_retirer_membre((select v ->> 'token' from t where k = 'antoine3'), (select (v #>> '{account,id}')::uuid from t where k = 'antoine')) ->> 'error' = 'self', 'l''admin ne se retire pas lui-même');
select pg_temp.check(public.cs_retirer_membre((select v ->> 'token' from t where k = 'antoine3'), (select (v #>> '{account,id}')::uuid from t where k = 'jules')) ->> 'ok' = 'true', 'jules retiré');
select pg_temp.check(public.cs_moi((select v ->> 'token' from t where k = 'jules')) ->> 'error' = 'session', 'la session de jules ne marche plus');
select pg_temp.check(jsonb_array_length(public.cs_lire_ligue((select v ->> 'token' from t where k = 'antoine3'), '2026-10-12') -> 'rows') = 1, 'la ligne de jules a disparu');
select pg_temp.check(public.cs_deconnexion((select v ->> 'token' from t where k = 'antoine3')) ->> 'ok' = 'true', 'déconnexion');
select pg_temp.check(public.cs_moi((select v ->> 'token' from t where k = 'antoine3')) ->> 'error' = 'session', 'session fermée après déconnexion');

reset role;
-- 12. L'application voisine n'a pas bougé
select pg_temp.check((select count(*) from voisin_private.players) = 1, 'application voisine intacte');
select pg_temp.check(public.voisin_ping() = 'pong', 'fonction voisine intacte');
\echo 'Tous les tests sont passés.'
