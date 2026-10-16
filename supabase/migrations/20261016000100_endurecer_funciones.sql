-- Recomendaciones del asesor de seguridad de Supabase
alter function public.docs_touch() set search_path = '';
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_coach() from anon;
revoke execute on function public.doc_update(text, jsonb) from anon;
