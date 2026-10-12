\set ON_ERROR_STOP 1
\set QUIET 1
insert into auth.users values ('11111111-1111-1111-1111-111111111111', 'antoine@exemple.fr'), ('22222222-2222-2222-2222-222222222222', 'jules@exemple.fr'), ('33333333-3333-3333-3333-333333333333', 'intrus@exemple.fr');
select private.set_cron_secret('un-secret-de-test-assez-long-123456');

create or replace function pg_temp.as_user(uid text, mail text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', uid, false);
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'email', mail)::text, false);
end $$;

-- 1. Premier compte : devient admin
select pg_temp.as_user('11111111-1111-1111-1111-111111111111', 'Antoine@Exemple.fr');
set role authenticated;
select 'claim antoine' t, public.claim_first_admin() v;
select 'profil antoine' t, (select role from public.mon_profil()) v;
insert into public.progress (user_id, state) values ('11111111-1111-1111-1111-111111111111', '{"streak":{"count":5,"last":"2000-01-01","freezes":0}}');
insert into public.league (user_id, week, xp, streak, name) values ('11111111-1111-1111-1111-111111111111', '2026-10-12', 120, 5, 'Antoine');
reset role;

-- 2. Un intrus ne peut rien faire
select pg_temp.as_user('33333333-3333-3333-3333-333333333333', 'intrus@exemple.fr');
set role authenticated;
select 'claim intrus (attendu false)' t, public.claim_first_admin() v;
select 'league vue par intrus (attendu 0)' t, count(*) v from public.league;
do $$ begin
  insert into public.progress (user_id, state) values ('33333333-3333-3333-3333-333333333333', '{}');
  raise exception 'ECHEC: intrus a pu écrire';
exception when insufficient_privilege then raise notice 'OK intrus bloqué en écriture';
end $$;
do $$ begin perform public.add_member('moi@exemple.fr'); raise exception 'ECHEC'; exception when insufficient_privilege then raise notice 'OK intrus ne peut pas ajouter'; end $$;
reset role;

-- 3. L'admin ajoute Jules
select pg_temp.as_user('11111111-1111-1111-1111-111111111111', 'antoine@exemple.fr');
set role authenticated;
select public.add_member(' Jules@Exemple.fr ', 'Jules');
select 'membres' t, string_agg(email || ':' || role, ', ') v from public.list_members();
reset role;

-- 4. Jules voit la ligue mais ne modifie que sa ligne
select pg_temp.as_user('22222222-2222-2222-2222-222222222222', 'jules@exemple.fr');
set role authenticated;
select 'jules membre' t, public.is_member() v;
insert into public.league (user_id, week, xp, streak, name) values ('22222222-2222-2222-2222-222222222222', '2026-10-12', 40, 1, 'Jules');
select 'ligue vue par jules (attendu 2)' t, count(*) v from public.league;
update public.league set xp = 999999 where user_id = '11111111-1111-1111-1111-111111111111';
select 'xp antoine après tentative (attendu 120)' t, xp v from public.league where user_id = '11111111-1111-1111-1111-111111111111';
select 'progress vue par jules (attendu 0)' t, count(*) v from public.progress where user_id <> '22222222-2222-2222-2222-222222222222';
do $$ begin perform public.list_members(); raise exception 'ECHEC'; exception when insufficient_privilege then raise notice 'OK jules pas admin'; end $$;
select public.set_display_name('Jules R.');
select 'nom ligue jules' t, name v from public.league where user_id = '22222222-2222-2222-2222-222222222222';
reset role;

-- 5. anon ne lit rien
set role anon;
do $$ begin perform count(*) from public.progress; raise exception 'ECHEC anon'; exception when insufficient_privilege then raise notice 'OK anon bloqué'; end $$;
reset role;

-- 6. Rappels
select pg_temp.as_user('11111111-1111-1111-1111-111111111111', 'antoine@exemple.fr');
set role authenticated;
insert into public.push_subscriptions (endpoint, user_id, p256dh, auth, remind_hour, tz)
values ('https://push.exemple/abc', '11111111-1111-1111-1111-111111111111', 'p', 'a', greatest(6, least(22, extract(hour from now() at time zone 'Europe/Paris')::int)), 'Europe/Paris');
update public.progress set state = jsonb_build_object(
  'streak', jsonb_build_object('count', 5, 'freezes', 0, 'last', to_char((now() at time zone 'Europe/Paris')::date - 1, 'YYYY-MM-DD')),
  'missions', jsonb_build_object('vente-0-0', jsonb_build_object('text', 'Poser 2 questions d''implication', 'status', 'active', 'due', to_char((now() at time zone 'Europe/Paris')::date, 'YYYY-MM-DD'))))
where user_id = '11111111-1111-1111-1111-111111111111';
reset role;

set role anon;
do $$ begin perform public.rappels_du_moment('mauvais-secret-mauvais-secret-000'); raise exception 'ECHEC secret'; exception when invalid_authorization_specification then raise notice 'OK mauvais secret refusé'; end $$;
select 'rappel 1er passage' t, json_agg(r) v from public.rappels_du_moment('un-secret-de-test-assez-long-123456') r;
select 'rappel 2e passage (attendu vide)' t, count(*) v from public.rappels_du_moment('un-secret-de-test-assez-long-123456');
reset role;
select 'battements' t, beats v from private.heartbeat;

-- Séance faite aujourd'hui : pas de rappel même si non relancé
update public.push_subscriptions set last_reminded_on = null;
update public.progress set state = jsonb_set(state, '{streak,last}', to_jsonb(to_char((now() at time zone 'Europe/Paris')::date, 'YYYY-MM-DD')));
set role anon;
select 'séance faite (attendu 0)' t, count(*) v from public.rappels_du_moment('un-secret-de-test-assez-long-123456');
select 'suppression' t, public.supprimer_abonnements('un-secret-de-test-assez-long-123456', array['https://push.exemple/abc']) v;
reset role;

-- 7. Quota coach
select pg_temp.as_user('22222222-2222-2222-2222-222222222222', 'jules@exemple.fr');
set role authenticated;
select 'quota' t, sum(case when public.coach_take() then 1 else 0 end) v from generate_series(1, 155);
reset role;
