-- Stubs minimaux des objets Supabase pour tester la migration sur un Postgres nu.
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
end $$;
create schema if not exists extensions;
grant usage on schema extensions, public to anon, authenticated;
-- Une application voisine déjà installée (comme dans poste31) : elle ne doit pas être touchée.
create schema if not exists voisin_private;
create table if not exists voisin_private.players (id serial primary key, name text);
insert into voisin_private.players (name) values ('existant');
create or replace function public.voisin_ping() returns text language sql as $$ select 'pong' $$;
