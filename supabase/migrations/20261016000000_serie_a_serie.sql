-- Serie a Serie · esquema inicial
--
-- Todos los datos de la app viven en una sola tabla de documentos JSON (`docs`),
-- direccionados por ruta, igual que en la versión original:
--   library/<id>                     plantillas de planificación (solo entrenador)
--   clients/<uid>                    ficha del cliente (plan asignado, fecha de inicio, avisos…)
--   clients/<uid>/plan/current       copia del plan asignada a ese cliente
--   clients/<uid>/logs/<pid>_w<w>_<D> registro de cada sesión
--   clients/<uid>/msgs/<id>          mensajes entre cliente, entrenador y app
--
-- Permisos (RLS):
--   · Entrenador (tabla `coaches`): lee y escribe todo.
--   · Cliente: solo lee y escribe lo que cuelga de clients/<su uid>. No puede borrar.

-- ---------------------------------------------------------------- entrenadores
create table public.coaches (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.coaches enable row level security;

create or replace function public.is_coach()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.coaches c where c.user_id = auth.uid());
$$;
revoke all on function public.is_coach() from public;
grant execute on function public.is_coach() to authenticated;

create policy "coaches: ver la propia fila" on public.coaches
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_coach()));

-- ---------------------------------------------------------------- perfiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  email text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles: ver el propio o entrenador" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_coach()));
create policy "profiles: editar el propio" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- documentos
create table public.docs (
  path text primary key
    check (path ~ '^[A-Za-z0-9_-]+(/[A-Za-z0-9_.-]+)*$' and length(path) <= 300),
  parent text generated always as (
    case when position('/' in path) > 0 then regexp_replace(path, '/[^/]+$', '') else '' end
  ) stored,
  owner uuid generated always as (
    case
      when path ~ '^clients/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(/|$)'
      then substring(path from 9 for 36)::uuid
    end
  ) stored,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid()
);
create index docs_parent_idx on public.docs (parent);
create index docs_owner_idx on public.docs (owner);
alter table public.docs enable row level security;

create policy "docs: leer" on public.docs
  for select to authenticated
  using ((select public.is_coach()) or owner = (select auth.uid()));
create policy "docs: crear" on public.docs
  for insert to authenticated
  with check ((select public.is_coach()) or owner = (select auth.uid()));
create policy "docs: modificar" on public.docs
  for update to authenticated
  using ((select public.is_coach()) or owner = (select auth.uid()))
  with check ((select public.is_coach()) or owner = (select auth.uid()));
create policy "docs: borrar (solo entrenador)" on public.docs
  for delete to authenticated
  using ((select public.is_coach()));

create or replace function public.docs_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;
create trigger docs_touch before insert or update on public.docs
  for each row execute function public.docs_touch();

-- Mezcla campos en un documento existente (equivale a doc.update()).
create or replace function public.doc_update(p_path text, p_patch jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.docs set data = data || p_patch where path = p_path;
  if not found then
    raise exception 'El documento % no existe o no tienes permiso', p_path using errcode = 'P0002';
  end if;
end;
$$;
revoke all on function public.doc_update(text, jsonb) from public;
grant execute on function public.doc_update(text, jsonb) to authenticated;

-- Tiempo real: la app escucha los cambios de `docs` (Supabase aplica RLS a cada cliente).
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.docs;
  end if;
end;
$$;

-- Nadie anónimo toca nada.
revoke all on public.docs, public.profiles, public.coaches from anon;
