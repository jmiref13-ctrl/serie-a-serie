// Serie a Serie · alta de clientes con usuario y contraseña (solo entrenadores)
//
// POST { action: "create", username, password, name }  → crea el usuario y su ficha
// POST { action: "password", uid, password }           → pone una contraseña nueva a un cliente
//
// Los usuarios se guardan en Supabase Auth con un correo interno <usuario>@serieaserie.invalid
// (dominio reservado: nunca se envía nada). Así se entra con usuario, sin correo real.
import { createClient } from "jsr:@supabase/supabase-js@2";

const DOMAIN = "serieaserie.invalid";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  // ¿quién llama? tiene que ser entrenador
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: who, error: whoErr } = await admin.auth.getUser(token);
  if (whoErr || !who?.user) return json({ error: "Sesión no válida" }, 401);
  const { data: coach } = await admin.from("coaches").select("user_id").eq("user_id", who.user.id).maybeSingle();
  if (!coach) return json({ error: "Solo el entrenador puede hacer esto" }, 403);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Petición no válida" }, 400); }
  const password = String(body.password || "");
  if (password.length < 6) return json({ error: "La contraseña debe tener al menos 6 caracteres" }, 400);

  if (body.action === "create") {
    const username = String(body.username || "").trim().toLowerCase();
    const name = String(body.name || "").trim().slice(0, 60);
    if (!/^[a-z0-9][a-z0-9._-]{2,23}$/.test(username))
      return json({ error: "El usuario debe tener entre 3 y 24 letras o números (sin espacios ni tildes)" }, 400);
    const { data, error } = await admin.auth.admin.createUser({
      email: `${username}@${DOMAIN}`,
      password,
      email_confirm: true,
      user_metadata: { name, username },
    });
    if (error) {
      const taken = /already|registered|exists/i.test(error.message);
      return json({ error: taken ? "Ese usuario ya existe" : "No se ha podido crear: " + error.message }, taken ? 409 : 400);
    }
    const uid = data.user.id;
    await admin.from("profiles").update({ name, username }).eq("id", uid);
    await admin.from("docs").upsert({
      path: `clients/${uid}`,
      data: { uid, label: name, username, joinedAt: new Date().toISOString() },
    }, { onConflict: "path" });
    return json({ ok: true, uid, username });
  }

  if (body.action === "password") {
    const uid = String(body.uid || "");
    const { data: target } = await admin.from("coaches").select("user_id").eq("user_id", uid).maybeSingle();
    if (target) return json({ error: "No se puede cambiar la contraseña de otro entrenador" }, 403);
    const { error } = await admin.auth.admin.updateUserById(uid, { password });
    if (error) return json({ error: "No se ha podido cambiar: " + error.message }, 400);
    return json({ ok: true });
  }

  return json({ error: "Acción desconocida" }, 400);
});
