-- Entrada con nombre de usuario: se guarda en el perfil
alter table public.profiles add column if not exists username text unique;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, username)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), ''),
    new.email,
    nullif(lower(new.raw_user_meta_data ->> 'username'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
