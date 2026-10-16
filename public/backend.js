/* Serie a Serie · conexión con Supabase
 *
 * - Pantalla de entrada (email + contraseña, recuperar y cambiar contraseña).
 * - Adaptador de datos con la misma interfaz que usa app.js:
 *     db.doc(path).set(data) / .update(patch) / .delete() / .onSnapshot(fn, onErr)
 *     db.collection(path).onSnapshot(fn, onErr)
 *     user.isOwner() / .id() / .name() / .setName(n) / .profiles(ids)
 *   Todo se guarda en la tabla `docs` (path → JSON) y se sincroniza en tiempo real.
 */
(function(){
  'use strict';
  const cfg = window.SAS_CONFIG || {};
  const $app = document.getElementById('app');
  const $acct = document.getElementById('acct');
  const el = (tag, attrs, ...kids) => {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v === true ? '' : v);
    });
    kids.flat().forEach(k => { if (k != null && k !== false) n.append(k); });
    return n;
  };
  const LOGO = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="2" y="13" width="5" height="9" rx="1.5" fill="currentColor" opacity=".45"/><rect x="9.5" y="8" width="5" height="14" rx="1.5" fill="currentColor" opacity=".7"/><rect x="17" y="2" width="5" height="20" rx="1.5" fill="currentColor"/></svg>';
  const hero = (title, text) => {
    const b = el('div', {class:'brand', style:'color:var(--hero-soft)'}); b.innerHTML = LOGO; b.append('Serie a Serie');
    return el('div', {class:'hero'}, b, el('h1', {class:'title'}, title), text ? el('p', {class:'soft'}, text) : null);
  };
  const fatal = (t) => { $app.replaceChildren(el('div', {class:'stack', style:'padding-top:20px'}, hero('Serie a Serie'), el('div', {class:'card'}, el('p', null, t)))); };

  if (!cfg.url || !cfg.anonKey || /TU_PROYECTO|TU_CLAVE/.test(cfg.url + cfg.anonKey)){
    fatal('Falta conectar la app con Supabase: rellena public/config.js con la URL y la clave pública (anon) del proyecto.');
    return;
  }
  if (!window.supabase || !window.supabase.createClient){ fatal('No se ha podido cargar la app. Recarga la página.'); return; }

  const sb = window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  window.SAS_supabase = sb;

  /* ================= pantalla de entrada ================= */
  // Se entra con usuario (p. ej. «pepe») o con correo. Los usuarios se guardan con un correo interno.
  const DOMAIN = 'serieaserie.invalid';
  const toEmail = (u) => { u = u.trim().toLowerCase(); return u.includes('@') ? u : u + '@' + DOMAIN; };
  const shownName = (email) => (email || '').endsWith('@' + DOMAIN) ? email.split('@')[0] : (email || '');
  function field(label, attrs){ const i = el('input', Object.assign({class:'in', style:'min-height:48px;font-size:16px'}, attrs)); return [el('label', {class:'lbl'}, label, i), i]; }
  function msgBox(){ return el('div', {class:'err', hidden:true}); }
  function showMsg(box, t, ok){ box.textContent = t; box.hidden = !t; box.className = ok ? 'okbox' : 'err'; }

  function loginView(){
    const [lE, email] = field('Usuario', {type:'text', autocomplete:'username', autocapitalize:'none', autocorrect:'off', spellcheck:'false', required:true});
    const [lP, pass] = field('Contraseña', {type:'password', autocomplete:'current-password', required:true});
    const box = msgBox();
    const btn = el('button', {class:'btn full', type:'submit'}, 'Entrar');
    const form = el('form', {class:'card stack', onsubmit: async (e) => {
      e.preventDefault(); showMsg(box, ''); btn.disabled = true; btn.textContent = 'Entrando…';
      const { error } = await sb.auth.signInWithPassword({ email: toEmail(email.value), password: pass.value });
      btn.disabled = false; btn.textContent = 'Entrar';
      if (error) showMsg(box, /invalid/i.test(error.message) ? 'Usuario o contraseña incorrectos.' : 'No se ha podido entrar. Revisa la conexión e inténtalo otra vez.');
    }}, lE, lP, box, btn,
      el('button', {class:'btn ghost full', type:'button', onclick: () => {
        if (email.value.includes('@')) return forgotView(email.value);
        showMsg(box, 'Pídele a Javi que te ponga una contraseña nueva. Él lo hace en un momento desde su panel.', true);
      }}, 'He olvidado la contraseña'));
    $app.replaceChildren(el('div', {class:'stack', style:'padding-top:20px'},
      hero('Entra en tu cuenta', 'Tus entrenos, tus cargas y el chat con Javi.'), form,
      el('p', {class:'small muted', style:'text-align:center'}, 'Tu usuario y tu contraseña te los da Javi.')));
    $acct.replaceChildren();
    setTimeout(() => email.focus(), 50);
  }

  function forgotView(prefill){
    const [lE, email] = field('Correo', {type:'email', autocomplete:'email', value: prefill || ''});
    const box = msgBox();
    const btn = el('button', {class:'btn full', type:'submit'}, 'Enviarme un enlace');
    const form = el('form', {class:'card stack', onsubmit: async (e) => {
      e.preventDefault(); btn.disabled = true;
      const { error } = await sb.auth.resetPasswordForEmail(email.value.trim(), { redirectTo: location.origin + location.pathname });
      btn.disabled = false;
      showMsg(box, error ? 'No se ha podido enviar. Espera unos minutos e inténtalo otra vez.' : 'Si el correo está dado de alta, te llegará un enlace para poner una contraseña nueva.', !error);
    }}, el('p', null, 'Te mandamos un enlace a tu correo para poner una contraseña nueva.'), lE, box, btn,
      el('button', {class:'btn ghost full', type:'button', onclick: loginView}, 'Volver'));
    $app.replaceChildren(el('div', {class:'stack', style:'padding-top:20px'}, hero('Recuperar contraseña'), form));
  }

  function newPasswordView(after){
    const [l1, p1] = field('Contraseña nueva', {type:'password', autocomplete:'new-password', minlength:'8'});
    const [l2, p2] = field('Repítela', {type:'password', autocomplete:'new-password', minlength:'8'});
    const box = msgBox();
    const btn = el('button', {class:'btn full', type:'submit'}, 'Guardar contraseña');
    const form = el('form', {class:'card stack', onsubmit: async (e) => {
      e.preventDefault();
      if (p1.value.length < 8) return showMsg(box, 'Usa al menos 8 caracteres.');
      if (p1.value !== p2.value) return showMsg(box, 'Las dos contraseñas no coinciden.');
      btn.disabled = true;
      const { error } = await sb.auth.updateUser({ password: p1.value });
      btn.disabled = false;
      if (error) return showMsg(box, 'No se ha podido cambiar. Prueba con otra contraseña.');
      showMsg(box, 'Contraseña cambiada.', true);
      setTimeout(after, 900);
    }}, l1, l2, box, btn, after ? el('button', {class:'btn ghost full', type:'button', onclick: after}, 'Cancelar') : null);
    $app.replaceChildren(el('div', {class:'stack', style:'padding-top:20px'}, hero('Contraseña nueva'), form));
    $acct.replaceChildren();
  }

  function accountBar(session){
    const out = el('button', {class:'linkbtn', type:'button', onclick: async () => { await sb.auth.signOut(); location.reload(); }}, 'Cerrar sesión');
    const pw = el('button', {class:'linkbtn', type:'button', onclick: () => newPasswordView(() => location.reload())}, 'Cambiar contraseña');
    $acct.replaceChildren(el('span', null, shownName(session.user.email)), pw, out);
  }

  /* ================= adaptador de datos ================= */
  const parentOf = (p) => { const i = p.lastIndexOf('/'); return i < 0 ? '' : p.slice(0, i); };
  const idOf = (p) => p.slice(p.lastIndexOf('/') + 1);
  const clone = (o) => o == null ? o : JSON.parse(JSON.stringify(o));
  const cache = new Map();          // path → data
  const byParent = new Map();       // parent → Set(path)
  const knownDocs = new Set();      // documentos ya consultados (existan o no)
  const knownCols = new Set();      // colecciones ya cargadas
  const docSubs = new Map();        // path → Set(listener)
  const colSubs = new Map();        // parent → Set(listener)
  const inflight = new Map();       // path → escrituras locales en curso

  function put(path, data){
    cache.set(path, data);
    const par = parentOf(path);
    if (!byParent.has(par)) byParent.set(par, new Set());
    byParent.get(par).add(path);
  }
  function drop(path){ cache.delete(path); const s = byParent.get(parentOf(path)); if (s) s.delete(path); }
  function docSnap(path){ const d = cache.get(path); return { id: idOf(path), exists: d !== undefined, data: () => clone(d) }; }
  function colSnap(parent){
    const docs = [...(byParent.get(parent) || [])].sort().map(p => ({ id: idOf(p), data: () => clone(cache.get(p)) }));
    return { docs, size: docs.length, empty: !docs.length };
  }
  function emit(path){
    (docSubs.get(path) || []).forEach(l => l.fn(docSnap(path)));
    const par = parentOf(path);
    if (knownCols.has(par)) (colSubs.get(par) || []).forEach(l => l.fn(colSnap(par)));
  }
  function mapErr(error){
    const e = new Error(error && error.message || 'error');
    const c = error && (error.code || '');
    e.code = c === '42501' || c === 'P0002' ? 'denied' : (c === 'PGRST301' || /jwt/i.test(e.message) ? 'auth' : 'network');
    return e;
  }
  async function fetchDoc(path){
    const { data, error } = await sb.from('docs').select('path,data').eq('path', path).maybeSingle();
    if (error) throw mapErr(error);
    knownDocs.add(path);
    if (data) put(path, data.data); else drop(path);
  }
  async function fetchCol(parent){
    const rows = []; const PAGE = 1000;
    for (let from = 0; ; from += PAGE){
      const { data, error } = await sb.from('docs').select('path,data').eq('parent', parent).order('path').range(from, from + PAGE - 1);
      if (error) throw mapErr(error);
      rows.push(...data); if (data.length < PAGE) break;
    }
    const seen = new Set(rows.map(r => r.path));
    [...(byParent.get(parent) || [])].forEach(p => { if (!seen.has(p) && !inflight.get(p)) drop(p); });
    rows.forEach(r => { if (!inflight.get(r.path)) put(r.path, r.data); knownDocs.add(r.path); });
    knownCols.add(parent);
  }
  function addSub(map, key, fn, onErr){
    const l = { fn, onErr };
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(l);
    return () => { const s = map.get(key); if (s) s.delete(l); };
  }
  async function track(path, p){
    inflight.set(path, (inflight.get(path) || 0) + 1);
    try { return await p; } finally { const n = (inflight.get(path) || 1) - 1; if (n) inflight.set(path, n); else inflight.delete(path); }
  }

  const db = {
    doc(path){
      return {
        id: idOf(path),
        onSnapshot(fn, onErr){
          const un = addSub(docSubs, path, fn, onErr);
          if (knownDocs.has(path)) fn(docSnap(path));
          else fetchDoc(path).then(() => emit(path)).catch(e => onErr && onErr(e));
          return un;
        },
        async get(){ if (!knownDocs.has(path)) await fetchDoc(path); return docSnap(path); },
        async set(data){
          const prev = cache.get(path), had = cache.has(path);
          put(path, clone(data)); knownDocs.add(path); emit(path);
          const { error } = await track(path, sb.from('docs').upsert({ path, data }, { onConflict: 'path' }));
          if (error){ if (had) put(path, prev); else drop(path); emit(path); throw mapErr(error); }
        },
        async update(patch){
          const prev = cache.get(path);
          if (prev !== undefined){ put(path, Object.assign(clone(prev), clone(patch))); emit(path); }
          const { error } = await track(path, sb.rpc('doc_update', { p_path: path, p_patch: patch }));
          if (error){ if (prev !== undefined){ put(path, prev); emit(path); } throw mapErr(error); }
        },
        async delete(){
          const prev = cache.get(path);
          drop(path); emit(path);
          const { error } = await track(path, sb.from('docs').delete().eq('path', path));
          if (error){ if (prev !== undefined){ put(path, prev); emit(path); } throw mapErr(error); }
        },
      };
    },
    collection(parent){
      return {
        onSnapshot(fn, onErr){
          const un = addSub(colSubs, parent, fn, onErr);
          if (knownCols.has(parent)) fn(colSnap(parent));
          else fetchCol(parent).then(() => fn(colSnap(parent))).catch(e => onErr && onErr(e));
          return un;
        },
      };
    },
  };

  /* tiempo real: un solo canal para toda la tabla; Supabase solo envía lo que cada usuario puede leer */
  let wasDown = false;
  function startRealtime(){
    sb.channel('docs-' + Math.random().toString(36).slice(2))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'docs' }, (pl) => {
        if (pl.eventType === 'DELETE'){
          const p = pl.old && pl.old.path; if (!p || !cache.has(p) || inflight.get(p)) return;
          drop(p); emit(p); return;
        }
        const row = pl.new; if (!row || !row.path || inflight.get(row.path)) return;
        const watched = docSubs.has(row.path) || knownCols.has(parentOf(row.path)) || cache.has(row.path);
        if (!watched) return;
        put(row.path, row.data); knownDocs.add(row.path); emit(row.path);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED'){ if (wasDown){ wasDown = false; resync(); } }
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED'){ wasDown = true; }
      });
  }
  async function resync(){
    try {
      for (const par of [...knownCols]){ await fetchCol(par); (colSubs.get(par) || []).forEach(l => l.fn(colSnap(par))); }
      for (const p of [...docSubs.keys()]){ await fetchDoc(p); (docSubs.get(p) || []).forEach(l => l.fn(docSnap(p))); }
    } catch(e){}
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && started) resync(); });

  function makeUser(session){
    const uid = session.user.id;
    let coach = null;
    return {
      async id(){ return uid; },
      async isOwner(){
        if (coach === null){ const { data, error } = await sb.rpc('is_coach'); if (error) throw mapErr(error); coach = !!data; }
        return coach;
      },
      async name(){
        const { data } = await sb.from('profiles').select('name').eq('id', uid).maybeSingle();
        return (data && data.name) || '';
      },
      username(){ return shownName(session.user.email); },
      async admin(body){
        const { data, error } = await sb.functions.invoke('usuarios', { body });
        if (error){
          let msg = 'No se ha podido completar. Revisa la conexión.';
          try { const j = await error.context.json(); if (j && j.error) msg = j.error; } catch(e){}
          throw Object.assign(new Error(msg), { code: 'admin', userMsg: msg });
        }
        if (data && data.error) throw Object.assign(new Error(data.error), { code: 'admin', userMsg: data.error });
        return data;
      },
      async setName(n){ const { error } = await sb.from('profiles').update({ name: n }).eq('id', uid); if (error) throw mapErr(error); },
      async profiles(ids){
        const { data, error } = await sb.from('profiles').select('id,name,email').in('id', ids);
        if (error) throw mapErr(error);
        const out = {}; (data || []).forEach(r => { out[r.id] = { name: r.name || (r.email || '').split('@')[0] }; });
        return out;
      },
    };
  }

  /* ================= arranque ================= */
  let started = false, recovering = /type=recovery/.test(location.hash);
  function start(session){
    if (started) return; started = true;
    accountBar(session);
    startRealtime();
    window.SAS_boot(db, makeUser(session));
  }
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY'){ recovering = true; newPasswordView(() => { recovering = false; history.replaceState(null, '', location.pathname); location.reload(); }); return; }
    if (event === 'SIGNED_OUT'){ if (started) location.reload(); else loginView(); return; }
    if (session && !recovering && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) setTimeout(() => start(session), 0);
    else if (!session && event === 'INITIAL_SESSION') loginView();
  });
})();
