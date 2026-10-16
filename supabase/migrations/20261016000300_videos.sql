-- Vídeos de técnica: cada cliente sube a su carpeta <uid>/…; Javi los ve todos y puede borrarlos.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('videos', 'videos', false, 52428800, array['video/*'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "videos: subir a su carpeta" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'videos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "videos: ver los propios o entrenador" on storage.objects
  for select to authenticated
  using (bucket_id = 'videos' and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_coach())));

create policy "videos: borrar los propios o entrenador" on storage.objects
  for delete to authenticated
  using (bucket_id = 'videos' and ((storage.foldername(name))[1] = (select auth.uid())::text or (select public.is_coach())));
