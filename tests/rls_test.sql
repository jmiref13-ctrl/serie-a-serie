-- Prueba de permisos en un Postgres local con un "auth" simulado (no se usa en Supabase).
\set ON_ERROR_STOP 1
create role anon nologin; create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema auth to authenticated, anon; grant execute on function auth.uid() to authenticated, anon;
\i supabase/migrations/20261016000000_serie_a_serie.sql
\i supabase/seed.sql
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.docs, public.profiles, public.coaches to authenticated;
insert into auth.users values ('11111111-1111-1111-1111-111111111111','javi@x.es','{"name":"Javi"}'),
  ('22222222-2222-2222-2222-222222222222','pepe@x.es','{}'),('33333333-3333-3333-3333-333333333333','raul@x.es','{"name":"Raúl"}');
insert into public.coaches values ('11111111-1111-1111-1111-111111111111');
select id, name, email from public.profiles order by email;

-- Raúl crea su ficha y un mensaje
set role authenticated; select set_config('request.jwt.claim.sub','33333333-3333-3333-3333-333333333333',false);
insert into public.docs(path,data) values ('clients/33333333-3333-3333-3333-333333333333','{"uid":"r"}');
insert into public.docs(path,data) values ('clients/33333333-3333-3333-3333-333333333333/msgs/a1','{"text":"hola"}');
select public.doc_update('clients/33333333-3333-3333-3333-333333333333','{"hip":true}');
select 'raul ve' t, count(*) from public.docs;
select public.is_coach() as raul_coach;
-- Pepe no ve a Raúl ni la biblioteca, y no puede escribir en su ruta
select set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',false);
select 'pepe ve' t, count(*) from public.docs;
do $$ begin
  begin insert into public.docs(path,data) values ('clients/33333333-3333-3333-3333-333333333333/msgs/x','{}'); raise exception 'FALLO: pepe escribió en raul';
  exception when insufficient_privilege then raise notice 'OK: pepe no puede escribir en raul'; end;
  begin insert into public.docs(path,data) values ('library/x','{}'); raise exception 'FALLO: pepe escribió library';
  exception when insufficient_privilege then raise notice 'OK: pepe no puede escribir library'; end;
  begin perform public.doc_update('clients/33333333-3333-3333-3333-333333333333','{"hip":false}'); raise exception 'FALLO';
  exception when sqlstate 'P0002' then raise notice 'OK: pepe no puede actualizar raul'; end;
end $$;
select count(*) as pepe_profiles from public.profiles;
-- Raúl no puede borrar
select set_config('request.jwt.claim.sub','33333333-3333-3333-3333-333333333333',false);
delete from public.docs where path like 'clients/3333%'; select 'raul tras borrar' t, count(*) from public.docs;
-- Javi ve todo, borra y escribe
select set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',false);
select 'javi ve' t, count(*) from public.docs; select public.is_coach() as javi_coach;
select count(*) as javi_profiles from public.profiles;
insert into public.docs(path,data) values ('clients/demo-prueba','{"demo":true}');
select path, parent, owner from public.docs where path like 'clients/%' order by path;
delete from public.docs where path='clients/demo-prueba';
-- Anónimo
reset role; set role anon;
do $$ begin perform count(*) from public.docs; raise exception 'FALLO anon';
exception when insufficient_privilege then raise notice 'OK: anon sin acceso'; end $$;
