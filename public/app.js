/* ============ utilidades ============ */
const COACH = 'Javi';
const ZONES = ['Hombro','Codo','Muñeca','Cuello','Espalda alta','Espalda baja','Cadera','Rodilla','Tobillo','Otra'];
const MES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const $app = document.getElementById('app');
const SVGNS = 'http://www.w3.org/2000/svg';
function h(tag, props, ...kids){
  const el = document.createElement(tag);
  if (props) for (const [k,v] of Object.entries(props)){
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k === 'value') el.value = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) el.setAttribute(k,'');
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat(Infinity)){
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
const ICONS = {
  train:'<path d="M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  prog:'<path d="M4 4v16h16"/><path d="M8 15l3.5-4 3 2.5L20 7"/>',
  chat:'<path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-5 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.6c2 .8 3.2 2.6 3.6 5.4"/>',
  plans:'<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4V3h6v1M8.5 10h7M8.5 14h7M8.5 18h4"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',
  next:'<path d="M9 5l7 7-7 7"/>',
  more:'<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  warn:'<path d="M12 4l9 16H3L12 4z"/><path d="M12 10v4"/><path d="M12 17.2v.1"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  send:'<path d="M4 12l16-8-6 16-2.5-6.5L4 12z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  up:'<path d="M6 15l6-6 6 6"/>', down:'<path d="M6 9l6 6 6-6"/>',
  trash:'<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
};
function icon(name, size = 22){
  const s = document.createElementNS(SVGNS,'svg');
  s.setAttribute('viewBox','0 0 24 24'); s.setAttribute('width',size); s.setAttribute('height',size);
  s.setAttribute('fill','none'); s.setAttribute('stroke','currentColor'); s.setAttribute('stroke-width','2');
  s.setAttribute('stroke-linecap','round'); s.setAttribute('stroke-linejoin','round'); s.setAttribute('aria-hidden','true');
  s.innerHTML = ICONS[name]; return s;
}
function ring(p, size, sw){
  const r = (size - sw) / 2, c = 2 * Math.PI * r, svg = document.createElementNS(SVGNS,'svg');
  svg.setAttribute('viewBox',`0 0 ${size} ${size}`); svg.setAttribute('width',size); svg.setAttribute('height',size); svg.setAttribute('class','ring'); svg.setAttribute('aria-hidden','true');
  svg.innerHTML = `<circle class="bg" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke-width="${sw}"/><circle class="fg" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.max(0, Math.min(1, p)))}" transform="rotate(-90 ${size/2} ${size/2})"/>`;
  return svg;
}
function logo(size = 22){
  const s = document.createElementNS(SVGNS,'svg'); s.setAttribute('viewBox','0 0 24 24'); s.setAttribute('width',size); s.setAttribute('height',size); s.setAttribute('aria-hidden','true');
  s.innerHTML = '<rect x="2" y="13" width="5" height="9" rx="1.5" fill="currentColor" opacity=".45"/><rect x="9.5" y="8" width="5" height="14" rx="1.5" fill="currentColor" opacity=".7"/><rect x="17" y="2" width="5" height="20" rx="1.5" fill="currentColor"/>';
  return s;
}
const brand = () => h('div',{class:'brand'}, logo(20), 'Serie a Serie');
const warnBox = (t) => h('div',{class:'warn'}, icon('warn',18), h('span',null,t));
const pad = (n) => String(n).padStart(2,'0');
const isoDay = (d) => d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
const parseDay = (s) => { const [y,m,d] = String(s).split('-').map(Number); return new Date(y, m-1, d); };
const today0 = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const fmtDay = (s) => { const d = parseDay(s); return DIAS[d.getDay()] + ' ' + d.getDate() + ' ' + MES[d.getMonth()]; };
function nextMonday(){ const d = today0(); const add = (8 - d.getDay()) % 7 || 7; d.setDate(d.getDate() + add); return isoDay(d); }
function weekRange(start, w){ const a = parseDay(start); a.setDate(a.getDate() + 7*(w-1)); const b = new Date(a); b.setDate(b.getDate()+6); return `${a.getDate()} ${MES[a.getMonth()]} - ${b.getDate()} ${MES[b.getMonth()]}`; }
function weekNow(doc, weeks){
  if (!doc || !doc.startDate) return 1;
  const diff = Math.floor((today0() - parseDay(doc.startDate)) / 864e5);
  if (diff < 0) return 1;
  return Math.min(weeks || 1, Math.floor(diff / 7) + 1);
}
const notStarted = (doc) => doc && doc.startDate && today0() < parseDay(doc.startDate);
const finished = (doc, weeks) => doc && doc.startDate && Math.floor((today0() - parseDay(doc.startDate)) / 864e5) >= 7*weeks;
function ago(iso){
  if (!iso) return '';
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'ahora'; if (m < 60) return `hace ${m} min`;
  const hh = Math.round(m/60); if (hh < 24) return `hace ${hh} h`;
  const d = Math.round(hh/24); if (d < 7) return `hace ${d} d`;
  const dt = new Date(iso); return dt.getDate() + ' ' + MES[dt.getMonth()];
}
const hhmm = (iso) => { const d = new Date(iso); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const num = (v) => { const n = parseFloat(String(v ?? '').replace(',','.')); return Number.isFinite(n) ? n : null; };
const fmtN = (n) => n == null ? '' : String(Math.round(n*10)/10).replace('.',',');
const fmt = (v) => (v === '' || v == null) ? '' : String(v);
function e1rm(k, r, rir){ k = num(k); r = num(r); if (!k || !r) return null; return k * (1 + (r + (num(rir) || 0)) / 30); }
const logKey = (w, d) => `w${w}_${d}`;
const docKey = (plan, w, d) => (plan && plan.pid ? plan.pid + '_' : '') + logKey(w, d);
function deriveLogs(raw, plan){
  const out = {}, pre = plan && plan.pid ? plan.pid + '_' : '';
  Object.keys(raw || {}).forEach(id => {
    if (pre){ if (id.startsWith(pre)) out[id.slice(pre.length)] = raw[id]; }
    else if (/^w\d+_[A-Z]+$/.test(id)) out[id] = raw[id];
  });
  return out;
}
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const clone = (o) => JSON.parse(JSON.stringify(o));
const byAt = (a,b) => String(a.at).localeCompare(String(b.at));
const initials = (n) => (n || '?').trim().split(/\s+/).slice(0,2).map(x => x[0]).join('').toUpperCase();

/* ============ estado ============ */
const S = {
  db:null, user:null, uid:null, owner:false, mode:'loading', err:'', fatal:'',
  route:{v:'home'}, viewWeek:null, names:{}, myName:'',
  me:null,                                   // cliente: {uid, doc, plan, logs, msgs}
  c:{clients:{}, plans:{}, plansLoaded:false, clientsLoaded:false, msgs:{}, logs:{}, raw:{}, plan:{}, un:{}, planUn:{}},
  drafts:{}, ed:null, dirty:false, armed:null, openEx:{},
};

/* ============ escritura con cola por documento ============ */
const writers = {};
function setStatus(t){ const el = document.getElementById('savestate'); if (el) el.textContent = t; }
function queueSet(path, data, delay = 600){
  const w = writers[path] || (writers[path] = {timer:null, pending:null, busy:false});
  w.pending = data; clearTimeout(w.timer); setStatus('Guardando…');
  w.timer = setTimeout(() => flush(path), delay);
}
async function flush(path){
  const w = writers[path]; if (!w || !w.pending) return;
  if (w.busy){ w.timer = setTimeout(() => flush(path), 300); return; }
  const data = w.pending; w.pending = null; w.busy = true;
  try { await S.db.doc(path).set(clone(data)); setStatus('Guardado'); }
  catch(e){ setStatus('No se ha guardado'); showErr(e); }
  finally { w.busy = false; if (w.pending) flush(path); }
}
async function flushAll(){ for (const p of Object.keys(writers)){ clearTimeout(writers[p].timer); await flush(p); } }
function showErr(e){
  const code = e && e.code;
  S.err = code === 'denied' ? 'No tienes permiso para guardar aquí. Habla con Javi.'
        : code === 'auth' ? 'Tu sesión ha caducado. Recarga la página y vuelve a entrar.'
        : 'No se ha podido guardar. Revisa la conexión e inténtalo otra vez.';
  const el = document.getElementById('errbox'); if (el){ el.textContent = S.err; el.hidden = false; }
}
async function safe(fn){ try { await fn(); return true; } catch(e){ showErr(e); return false; } }

/* ============ render diferido mientras se escribe ============ */
let rafId = 0;
function typing(){ const a = document.activeElement; return a && $app.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName); }
const QUIET = new Set(['session','editor']);
function schedule(){
  if (QUIET.has(S.route.v)){ refreshLive(); return; }
  if (typing()){ S.dirty = true; refreshLive(); return; }
  cancelAnimationFrame(rafId); rafId = requestAnimationFrame(() => render(true));
}
document.addEventListener('focusout', () => setTimeout(() => { if (S.dirty && !typing()){ S.dirty = false; render(true); } }, 120));
function go(route, keepScroll){ S.route = route; S.armed = null; render(keepScroll); }

/* ============ arranque ============ */
async function boot(db, user){
  try {
    S.db = db; S.user = user;
    S.owner = await user.isOwner();
    S.uid = await user.id();
    try { S.myName = (await user.name()) || ''; } catch(e){}
    if (S.owner) startCoach();
    else if (S.uid) startClient(S.uid);
    else { S.fatal = 'No hemos podido identificar tu cuenta. Cierra sesión y vuelve a entrar.'; render(); }
  } catch(e){ console.error(e); S.fatal = 'No se ha podido iniciar la app. Recarga la página.'; render(); }
}
window.SAS_boot = boot;
function sub(ref, fn){ return ref.onSnapshot(fn, (e) => { if (e && e.code === 'revoked'){ S.fatal = 'Se ha retirado tu acceso a esta app.'; render(); } }); }

/* ---- cliente ---- */
function startClient(uid){
  S.mode = 'client'; S.route = {v:'home'};
  const me = S.me = {uid, doc:undefined, plan:undefined, logs:{}, msgs:[], logsOk:false};
  const base = 'clients/' + uid;
  sub(S.db.doc(base), s => { me.doc = s.exists ? s.data() : null; schedule(); });
  sub(S.db.doc(base + '/plan/current'), s => { me.plan = s.exists ? s.data() : null; me.logs = deriveLogs(me.raw, me.plan); schedule(); });
  sub(S.db.collection(base + '/logs'), q => { const m = {}; q.docs.forEach(d => { m[d.id] = d.data(); }); me.raw = m; me.logs = deriveLogs(m, me.plan); me.logsOk = true; schedule(); });
  sub(S.db.collection(base + '/msgs'), q => { me.msgs = q.docs.map(d => Object.assign({id:d.id}, d.data())).sort(byAt); me.msgsOk = true; schedule(); });
  render();
}
/* ---- entrenador ---- */
function startCoach(){
  S.mode = 'coach'; S.route = {v:'clients'};
  sub(S.db.collection('clients'), q => {
    const seen = new Set();
    q.docs.forEach(d => { seen.add(d.id); S.c.clients[d.id] = d.data(); if (!S.c.un[d.id]) watchClient(d.id); });
    Object.keys(S.c.clients).forEach(id => { if (!seen.has(id)){ delete S.c.clients[id]; (S.c.un[id] || []).forEach(u => u()); delete S.c.un[id]; } });
    S.c.clientsLoaded = true; resolveNames(); schedule();
  });
  sub(S.db.collection('library'), q => { S.c.plans = {}; q.docs.forEach(d => { S.c.plans[d.id] = d.data(); }); S.c.plansLoaded = true; if (!q.docs.length) seedLibrary(); schedule(); });
  render();
}
/* primera vez: carga los bloques de planes.json en la biblioteca (solo una vez) */
let seeding = false;
async function seedLibrary(){
  if (seeding) return; seeding = true;
  try {
    const flag = await S.db.doc('meta/seeded').get();
    if (flag.exists) return;
    const res = await fetch('planes.json', {cache:'no-store'}); if (!res.ok) return;
    const plans = await res.json();
    for (const id of Object.keys(plans)) await S.db.doc('library/' + id).set(plans[id]);
    await S.db.doc('meta/seeded').set({at:new Date().toISOString(), ids:Object.keys(plans)});
  } catch(e){ console.warn('No se han podido cargar los bloques', e); }
  finally { seeding = false; }
}
function watchClient(uid){
  watchPlan(uid);
  S.c.un[uid] = [
    sub(S.db.collection(`clients/${uid}/msgs`), q => { S.c.msgs[uid] = q.docs.map(d => Object.assign({id:d.id}, d.data())).sort(byAt); schedule(); }),
    sub(S.db.collection(`clients/${uid}/logs`), q => { const m = {}; q.docs.forEach(d => { m[d.id] = d.data(); }); S.c.raw[uid] = m; S.c.logs[uid] = deriveLogs(m, S.c.plan[uid]); schedule(); }),
  ];
}
function watchPlan(uid){
  if (S.c.planUn[uid]) return;
  S.c.planUn[uid] = sub(S.db.doc(`clients/${uid}/plan/current`), s => { S.c.plan[uid] = s.exists ? s.data() : null; S.c.logs[uid] = deriveLogs(S.c.raw[uid], S.c.plan[uid]); schedule(); });
}
async function resolveNames(){
  if (!S.user || !S.user.profiles) return;
  const ids = Object.keys(S.c.clients).filter(id => !S.c.clients[id].demo);
  if (!ids.length) return;
  try { const ps = await S.user.profiles(ids); let ch = false; ids.forEach(id => { const n = ps && ps[id] && ps[id].name || ''; if (n && S.names[id] !== n){ S.names[id] = n; ch = true; } }); if (ch) schedule(); } catch(e){}
}
const clientName = (uid) => { const d = S.c.clients[uid] || {}; return d.label || S.names[uid] || (d.demo ? 'Cliente de prueba' : 'Cliente nuevo'); };

/* contexto de datos de un cliente (el propio cliente o Javi en vista previa) */
function ctxFor(uid){
  if (S.mode === 'client') return S.me;
  watchPlan(uid);
  return {uid, preview:true, doc:S.c.clients[uid] || null, plan:S.c.plan[uid], logs:S.c.logs[uid] || {}, msgs:S.c.msgs[uid] || [], logsOk:true};
}

/* ============ pintado ============ */
function render(keepScroll){
  const y = window.scrollY;
  let tree;
  if (S.fatal) tree = h('div',{class:'card empty'}, h('div',{class:'big'},'Serie a Serie'), h('p',{class:'muted'}, S.fatal));
  else if (S.mode === 'loading') tree = h('p',{class:'muted',style:'padding:40px 0;text-align:center'},'Cargando…');
  else if (S.mode === 'client'){ tree = clientRouter(S.me); maybeSummary(S.me); }
  else tree = coachRouter();
  $app.replaceChildren(h('div',{class:'err',id:'errbox',hidden:!S.err,style:'margin-bottom:12px'}, S.err), tree);
  renderNav();
  if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
}
function refreshLive(){
  const box = document.getElementById('chatlist');
  if (box && box.dataset.uid){ const ctx = S.mode === 'client' ? S.me : ctxFor(box.dataset.uid); fillChat(box, ctx, S.mode === 'coach'); markSeen(ctx, S.mode === 'coach'); }
  renderNav();
}
function renderNav(){
  const nav = document.getElementById('nav'), inn = document.getElementById('navin');
  let items = [];
  const r = S.route.v;
  if (S.mode === 'client' && S.me && S.me.doc){
    if (r === 'session'){ nav.hidden = true; return; }
    items = [['home','Entreno','train'],['progress','Progreso','prog'],['chat','Mensajes','chat', unreadFor(S.me, false)]];
  } else if (S.mode === 'coach'){
    if (r === 'editor' || r === 'session'){ nav.hidden = true; return; }
    const tab = S.route.tab || ({clients:'clients',client:'clients',plans:'plans',inbox:'inbox',preview:'clients'})[r] || 'clients';
    items = [['clients','Clientes','users'],['plans','Planes','plans'],['inbox','Mensajes','chat', totalUnread()]];
    nav.hidden = false;
    inn.replaceChildren(...items.map(([k,l,ic,n]) => h('button',{class: tab === k ? 'on' : '', 'aria-current': tab === k ? 'page' : null, onclick: () => go({v:k})}, h('span',{class:'ic'}, icon(ic)), l, n ? h('span',{class:'count'}, n) : null)));
    return;
  } else { nav.hidden = true; return; }
  nav.hidden = false;
  const cur = r === 'exhist' ? 'progress' : r;
  inn.replaceChildren(...items.map(([k,l,ic,n]) => h('button',{class: cur === k ? 'on' : '', 'aria-current': cur === k ? 'page' : null, onclick: () => go({v:k})}, h('span',{class:'ic'}, icon(ic)), l, n ? h('span',{class:'count'}, n) : null)));
}
function unreadFor(ctx, asCoach){
  if (!ctx || !ctx.doc) return 0;
  const seen = (asCoach ? ctx.doc.coachSeen : ctx.doc.clientSeen) || '';
  return (ctx.msgs || []).filter(m => (asCoach ? m.from === 'client' : (m.from === 'coach' || m.from === 'app')) && String(m.at) > seen).length;
}
function totalUnread(){ return Object.keys(S.c.clients).reduce((a,uid) => a + unreadFor({doc:S.c.clients[uid], msgs:S.c.msgs[uid]}, true), 0); }

/* ============ VISTAS DEL CLIENTE ============ */
function clientRouter(ctx){
  if (ctx.doc === undefined || ctx.plan === undefined) return h('p',{class:'muted',style:'padding:40px 0;text-align:center'},'Cargando tu plan…');
  if (ctx.doc === null) return welcomeView(ctx);
  const r = S.route;
  if (r.v === 'session') return sessionView(ctx, r.w, r.d);
  if (r.v === 'progress') return progressView(ctx);
  if (r.v === 'exhist') return exHistView(ctx, r.id);
  if (r.v === 'chat') return chatView(ctx, false);
  return homeView(ctx);
}
function welcomeView(ctx){
  const first = (S.myName || '').split(' ')[0];
  return h('div',{class:'stack',style:'padding-top:20px'},
    h('div',{class:'hero'},
      h('div',{class:'brand',style:'color:var(--hero-soft)'}, logo(20), 'Serie a Serie'),
      h('h1',{class:'title'}, first ? `Hola, ${first}` : 'Bienvenido'),
      h('p',{class:'soft'},'Aquí verás tus entrenos, apuntarás tus cargas y podrás escribir a Javi. Pulsa Empezar para darte de alta.')),
    h('div',{class:'card stack'},
      h('div',{class:'row'}, h('span',{class:'sum-n'},'1'), h('span',null,'Pulsa Empezar. Javi te verá en su panel.')),
      h('div',{class:'row'}, h('span',{class:'sum-n'},'2'), h('span',null,'Javi te asigna tu planificación y la fecha de inicio.')),
      h('div',{class:'row'}, h('span',{class:'sum-n'},'3'), h('span',null,'Cada día abres tu sesión y apuntas kilos y repeticiones.')),
      (() => { const nm = h('input',{class:'in',id:'myname',value:S.myName || '',placeholder:'Tu nombre',autocomplete:'given-name'});
        return h('label',{class:'lbl'},'¿Cómo te llamas?', nm); })(),
      h('button',{class:'btn full',onclick: async (e) => {
        const btn = e.currentTarget; btn.disabled = true;
        const nm = (document.getElementById('myname') || {}).value || '';
        if (nm.trim() && S.user.setName){ try { await S.user.setName(nm.trim()); S.myName = nm.trim(); } catch(err){} }
        const ok = await safe(() => S.db.doc('clients/' + ctx.uid).set({uid:ctx.uid, joinedAt:new Date().toISOString()}));
        if (!ok) btn.disabled = false;
      }}, 'Empezar')));
}
function previewBar(ctx){
  if (!ctx.preview) return null;
  return h('div',{class:'note row between',style:'background:var(--warn-soft);color:var(--warn)'},
    h('span',null,`Vista de ${clientName(ctx.uid)}. Lo que anotes se guarda en su cuenta.`),
    h('button',{class:'btn sm ghost',onclick: () => go({v:'client', uid:ctx.uid, tab:'semana'})},'Salir'));
}
function curWeek(ctx){ const N = ctx.plan ? ctx.plan.weeks : 1; return S.viewWeek && S.viewWeek.uid === ctx.uid ? S.viewWeek.w : weekNow(ctx.doc, N); }
function setWeek(ctx, w){ S.viewWeek = {uid:ctx.uid, w}; render(true); }
function dayStats(ctx, plan, w, d){
  const lg = ctx.logs[logKey(w, d.id)];
  let tot = 0, done = 0;
  d.ex.forEach(ex => { const wk = ex.wk[w-1] || {}; const n = (wk.s || 0); tot += n; if (!lg) return;
    if (lg.alt && lg.alt[ex.id]) done += Math.min(n, (lg.alt[ex.id].sets || []).filter(s => fmt(s.r) !== '').length);
    else if (lg.sets && lg.sets[ex.id]) done += Math.min(n, lg.sets[ex.id].filter(s => setFilled(ex, s)).length); });
  return {lg, tot, done, p: tot ? done/tot : 0, isDone: !!(lg && lg.done)};
}
const setFilled = (ex, s) => s && (ex.uni ? (fmt(s.rd) !== '' && fmt(s.ri) !== '') : fmt(s.r) !== '');
function homeView(ctx){
  const plan = ctx.plan, wrap = h('div',{class:'stack'});
  const first = ctx.preview ? clientName(ctx.uid).split(' ')[0] : (S.myName || '').split(' ')[0];
  wrap.append(previewBar(ctx) || '');
  if (!plan){
    wrap.append(h('div',null, h('p',{class:'tiny'},'Serie a Serie'), h('h1',{class:'title'}, first ? `Hola, ${first}` : 'Hola')),
      h('div',{class:'card empty'}, h('div',{class:'big'},'Tu plan está en camino'), h('p',{class:'muted'},'Javi todavía no te ha asignado una planificación. Cuando lo haga, aparecerá aquí con tus sesiones.'), h('button',{class:'btn',onclick: () => go({v:'chat'})},'Escribir a Javi')));
    return wrap;
  }
  const N = plan.weeks, w = curWeek(ctx), wi = (plan.weekInfo || [])[w-1] || {};
  const nowW = weekNow(ctx.doc, N);
  wrap.append(h('div',{class:'stack',style:'gap:6px'}, brand(), h('h1',{class:'title'}, first ? `Hola, ${first}` : 'Hola')));
  if (notStarted(ctx.doc)) wrap.append(h('div',{class:'note'}, `Empiezas el ${fmtDay(ctx.doc.startDate)}. Ya puedes ver tus sesiones.`));
  else if (finished(ctx.doc, N)) wrap.append(h('div',{class:'okbox'}, 'Has terminado esta planificación. Javi te asignará la siguiente.'));
  wrap.append(h('div',{class:'hero'},
    h('span',{class:'soft',style:'font-weight:800'}, ctx.doc.startDate ? weekRange(ctx.doc.startDate, w) : `${N} semanas`),
    h('div',{class:'row between',style:'align-items:center'},
      h('div',{class:'stack',style:'gap:0'}, h('div',{class:'h2',style:'font-size:36px;white-space:nowrap'}, `Semana ${w}`), h('span',{class:'soft small',style:'font-weight:700'}, `de ${N} · ${wi.rir ? 'RIR ' + wi.rir : ''}`)),
      (() => { const dd = plan.days.filter(d => { const lg = ctx.logs[logKey(w, d.id)]; return lg && lg.done; }).length; return h('div',{class:'ringbox',style:'width:68px;height:68px'}, ring(dd / plan.days.length, 68, 6), h('span',{class:'stack',style:'gap:0;align-items:center;line-height:1'}, h('b',{class:'num',style:'font-size:22px'}, `${dd}/${plan.days.length}`), h('span',{style:'font-size:9px;font-weight:800;letter-spacing:.06em;color:var(--hero-soft)'},'SESIONES'))); })()),
    wi.note ? h('p',{class:'soft',style:'font-size:14px'}, wi.note) : null,
    h('div',{class:'seg'}, Array.from({length:N}, (_,i) => h('i',{class: i+1 < nowW ? 'done' : (i+1 === w ? 'now' : '')})))));
  wrap.append(h('div',{class:'weeknav'},
    h('button',{class:'icon-btn','aria-label':'Semana anterior',disabled: w <= 1, onclick: () => setWeek(ctx, w-1)}, icon('back',20)),
    h('div',{class:'mid'}, h('b',null, w === nowW ? 'Esta semana' : `Semana ${w}`), w !== nowW ? h('button',{class:'back',style:'margin-left:8px;min-height:30px;color:var(--accent)',onclick: () => setWeek(ctx, nowW)},'Volver a hoy') : null),
    h('button',{class:'icon-btn','aria-label':'Semana siguiente',disabled: w >= N, onclick: () => setWeek(ctx, w+1)}, icon('next',20))));
  let marked = false;
  const pp = pendingPlan(ctx, plan, w);
  plan.days.forEach(d => {
    const st = dayStats(ctx, plan, w, d);
    const isNext = !st.isDone && !marked && w === nowW; if (isNext) marked = true;
    const pn = (pp[d.id] || []).length;
    wrap.append(h('button',{class:'day' + (st.isDone ? ' done' : '') + (isNext ? ' next' : ''), onclick: () => openSession(ctx, w, d.id)},
      h('span',{class:'badge'}, ring(st.isDone ? 1 : st.p, 50, 4), st.isDone ? icon('check',24) : h('span',{style:'position:relative'}, d.id)),
      h('span',{class:'grow stack',style:'gap:4px'},
        h('b',{style:'font-size:16px'}, d.name),
        h('span',{class:'muted small'}, `${visibleEx(d, w).length} ejercicios · ${d.dur || '~70 min'}` + (visibleEx(d, w).some(e => (e.wk[w-1] || {}).test) ? ' · con test' : '') + (st.isDone ? ' · Completada' + (st.lg.min ? ` en ${st.lg.min} min` : '') : (st.p > 0 ? ` · ${Math.round(st.p*100)}%` : ''))),
        pn && !st.isDone ? h('span',{class:'small',style:'color:var(--warn);font-weight:800'}, `+${pn} pendiente${pn > 1 ? 's' : ''} de otro día`) : null,
        st.p > 0 && !st.isDone ? h('div',{class:'bar'}, h('b',{style:`width:${Math.round(st.p*100)}%`})) : null),
      isNext ? h('span',{class:'pill acc'}, st.p > 0 ? 'Seguir' : 'Empezar') : icon('next',18)));
  });
  const un = unreadFor(ctx, false);
  const lastCoach = [...ctx.msgs].reverse().find(m => m.from === 'coach');
  if (lastCoach) wrap.append(h('button',{class:'card row',style:'text-align:left;width:100%;align-items:flex-start',onclick: () => go({v:'chat'})},
    h('span',{class:'avatar'},'J'), h('span',{class:'grow stack',style:'gap:2px'}, h('span',{class:'row between'}, h('b',null,'Mensaje de ' + COACH), un ? h('span',{class:'count inline'}, un) : h('span',{class:'small muted'}, ago(lastCoach.at))), h('span',{class:'muted',style:'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden'}, lastCoach.text))));
  wrap.append(warnBox('Si algo te duele (no cansancio), la máquina está ocupada o no te da tiempo, pulsa «No puedo hacerlo» en el ejercicio.'));
  return wrap;
}

/* ---- sesión ---- */
function openSession(ctx, w, d){ go({v:'session', w, d, uid:ctx.uid}); }
function draftFor(ctx, w, d){
  const key = ctx.uid + '/' + docKey(ctx.plan, w, d);
  if (!S.drafts[key]){
    const src = ctx.logs[logKey(w, d)];
    const lg = src ? clone(src) : {w, d, sets:{}, rir:{}, notes:{}, warm:{}, pain:{}, extra:{}, rpe:'', done:false};
    ['sets','rir','notes','warm','pain','extra','skip','alt','adj'].forEach(k => { lg[k] = lg[k] || {}; });
    S.drafts[key] = lg;
  }
  return S.drafts[key];
}
function persistLog(ctx, w, d){
  const lg = draftFor(ctx, w, d);
  const now = new Date().toISOString();
  lg.w = w; lg.d = d; lg.updated = now; if (!lg.t0) lg.t0 = now;
  queueSet(`clients/${ctx.uid}/logs/${docKey(ctx.plan, w, d)}`, lg);
}
function sendMsg(ctx, fromCoach, text, extra){
  const id = newId();
  const m = Object.assign({from: fromCoach ? 'coach' : 'client', text, at:new Date().toISOString()}, extra || {});
  return safe(() => S.db.doc(`clients/${ctx.uid}/msgs/${id}`).set(m));
}
function sessionView(ctx, w, dayId){
  const plan = ctx.plan; if (!plan) return homeView(ctx);
  const d = plan.days.find(x => x.id === dayId); if (!d) return homeView(ctx);
  const lg = draftFor(ctx, w, dayId), wi = (plan.weekInfo || [])[w-1] || {};
  const root = h('div',{class:'stack'});
  const pend = pendingFor(ctx, plan, w, dayId);
  const items = pend.map(p => ({d:p.d, ex:exW(p.ex, p.w), w:p.w, lg:draftFor(ctx, p.w, p.d.id), pending:true})).concat(visibleEx(d, w).map(ex => ({d, ex:exW(ex, w), w, lg})));
  const doneN = items.filter(it => { const st = exStatus(it.ex, it.lg, it.w); return st === 'done' || st === 'removed' || (st === 'later' && !it.pending); }).length;
  root.append(previewBar(ctx) || '',
    h('div',{class:'sesbar'},
      h('div',{class:'row between'},
        h('button',{class:'back',onclick: async () => { await flushAll(); go(ctx.preview ? {v:'preview', uid:ctx.uid} : {v:'home'}); }}, icon('back',20), 'Inicio'),
        h('span',{class:'save',id:'savestate'}, ''),
        h('b',{class:'num',style:'font-size:18px'}, `${doneN}/${items.length}`)),
      h('div',{class:'bar'}, h('b',{style:`width:${items.length ? Math.round(doneN / items.length * 100) : 0}%`}))),
    h('div',null, h('p',{class:'tiny'}, `Semana ${w}`), h('h1',{class:'title'}, `Día ${d.id} · ${d.name}`),
      h('div',{class:'row wrap',style:'margin-top:8px;gap:6px'}, wi.rir ? h('span',{class:'pill acc'},'RIR ' + wi.rir) : null, h('span',{class:'pill'}, d.dur || '~70 min'), h('span',{class:'pill'}, `${items.length} ejercicios`))));
  if (lg.done) root.append(h('div',{class:'okbox'}, 'Sesión completada' + (lg.min ? ` en ${lg.min} min` : '') + '. Puedes seguir corrigiendo datos.'));
  const dn = (d.notes || [])[w-1]; if (dn) root.append(h('div',{class:'note'}, dn));
  root.append(rirHelp(w));
  if (d.warm && d.warm.length) root.append(warmCard(ctx, d, w, lg));
  const k = sessKey(ctx);
  if (S.openEx[k] === undefined){ const f = items.find(it => { const st = exStatus(it.ex, it.lg, it.w); return st !== 'done' && st !== 'removed' && st !== 'later' || (it.pending && st !== 'done'); }); S.openEx[k] = f ? f.ex.id : null; }
  if (pend.length) root.append(h('div',{class:'note'}, pend.length > 1 ? `Hoy te tocan ${pend.length} ejercicios pendientes de otro día. Están al principio.` : 'Hoy te toca 1 ejercicio pendiente de otro día. Está al principio.'));
  items.forEach((it, i) => {
    const nextIt = items.slice(i + 1).find(x => exStatus(x.ex, x.lg, x.w) !== 'done');
    root.append(exCard(ctx, it.d, it.ex, i + 1, it.w, it.lg, {pending: it.pending, pw: it.w, open: S.openEx[k] === it.ex.id,
      toggle: () => { S.openEx[k] = S.openEx[k] === it.ex.id ? null : it.ex.id; render(true); const el = document.getElementById('ex-' + it.ex.id); if (el && S.openEx[k]) el.scrollIntoView({block:'start', behavior:'smooth'}); },
      next: nextIt ? () => { S.openEx[k] = nextIt.ex.id; render(true); const el = document.getElementById('ex-' + nextIt.ex.id); if (el) el.scrollIntoView({block:'start', behavior:'smooth'}); } : null}));
  });
  const rpe = h('select',{class:'sel',id:'rpe','aria-label':'Cómo de dura ha sido la sesión',onchange:(e) => { lg.rpe = e.target.value; persistLog(ctx, w, dayId); }},
    h('option',{value:''},'Elegir'), ...[5,6,7,8,9,10].map(n => h('option',{value:String(n), selected: String(lg.rpe) === String(n)}, String(n))));
  const cm = h('textarea',{class:'ta',id:'endnote','aria-label':'Comentario para Javi',placeholder:'¿Cómo te has sentido? ¿Algo que deba saber Javi?'});
  root.append(h('div',{class:'hero'},
    h('span',{class:'h2'},'Terminar sesión'),
    h('label',{class:'row between',for:'rpe'}, h('span',{class:'soft',style:'font-weight:700'},'Dureza de la sesión (1-10)'), h('div',{style:'width:110px'}, rpe)),
    cm,
    h('button',{class:'btn full',style:'background:var(--accent);color:var(--accent-ink)',onclick: async (e) => {
      e.currentTarget.disabled = true;
      const now = new Date();
      if (!lg.t0) lg.t0 = now.toISOString();
      lg.done = true; lg.t1 = now.toISOString();
      lg.min = Math.max(1, Math.round((now - new Date(lg.t0)) / 60000));
      persistLog(ctx, w, dayId); await flushAll();
      const st = dayStats({logs:{[logKey(w,dayId)]:lg}}, plan, w, d);
      const txt = cm.value.trim();
      await sendMsg(ctx, false, `Sesión completada: Día ${d.id} · ${d.name}, semana ${w}. ${st.done} de ${st.tot} series · ${lg.min} min` + (lg.rpe ? ` · dureza ${lg.rpe}/10` : '') + (txt ? `\n${txt}` : ''), {kind:'session', w, d:dayId});
      go(ctx.preview ? {v:'preview', uid:ctx.uid} : {v:'home'});
    }}, icon('check',20), lg.done ? 'Guardar y volver' : 'Terminar sesión')));
  return root;
}
function rirHelp(w){
  return h('details',{class:'card',open: w === 1 || null},
    h('summary',{style:'list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px'}, h('span',{class:'h3'},'Cómo usar el peso objetivo y el RIR'), h('span',{class:'small muted',style:'font-weight:700'},'Ver')),
    h('div',{class:'stack',style:'gap:6px;margin-top:8px;font-size:14px'},
      h('p',null, h('b',null,'RIR'), ' = repeticiones que te quedaban en reserva al acabar la serie. RIR 2 = podrías haber hecho 2 más con buena técnica.'),
      h('p',null, h('b',null,'Peso objetivo:'), ' ya aparece escrito en gris en cada serie. Si lo haces tal cual, solo escribe las repeticiones.'),
      h('p',null, h('b',null,'Si no puedes o te sobra:'), ' cambia los kilos de esa serie, o usa − y + del peso objetivo para ajustar todas las series que te quedan.'),
      h('p',null, h('b',null,'Al final de cada ejercicio'), ' marca el RIR de la última serie. Con eso la app calcula tu peso de la semana que viene.')));
}
function summaryCard(ctx, d, w){
  return h('details',{class:'card',open: w === 1 || null},
    h('summary',{style:'list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px'}, h('span',{class:'h2'},'Hoy toca'), h('span',{class:'small muted',style:'font-weight:700'},'Ver orden')),
    h('div',{class:'stack',style:'gap:0;margin-top:8px'},
      ...visibleEx(d, w).map((ex,i) => { const wk = ex.wk[w-1] || {}; return h('div',{class:'sum-row'}, h('span',{class:'sum-n'}, i+1), h('span',{class:'grow',style:'font-weight:700;font-size:14px'}, ex.name), h('span',{class:'pill'}, `${wk.s} × ${wk.r}`)); }),
      h('p',{class:'small muted',style:'padding-top:10px'},'Si un aparato está ocupado, adelanta otro ejercicio y vuelve después.')));
}
function warmCard(ctx, d, w, lg){
  const rows = d.warm.map((it, i) => {
    const st = lg.warm[i] || [false,false];
    const mk = (r) => { const b = h('button',{class:'tick' + (st[r] ? ' on' : ''),'aria-label':`${it.n}, vuelta ${r+1}`,'aria-pressed':String(!!st[r]),onclick: () => {
      const cur = lg.warm[i] || [false,false]; cur[r] = !cur[r]; lg.warm[i] = cur; b.classList.toggle('on', cur[r]); b.setAttribute('aria-pressed', String(cur[r])); persistLog(ctx, w, d.id); }}, icon('check',18)); return b; };
    const parts = String(it.n).split(' · '); const cat = parts.length > 1 ? parts.shift() : ''; const nm = parts.join(' · ');
    return h('div',{class:'row',style:'min-height:48px'}, h('span',{class:'grow'}, h('b',{style:'display:block;font-size:14px'}, nm), h('span',{class:'small muted'}, (cat ? cat + ' · ' : '') + (it.d || ''))), mk(0), mk(1));
  });
  return h('div',{class:'card stack',style:'gap:4px'},
    h('div',{class:'row between wrap',style:'row-gap:6px'}, h('span',{class:'h2'},'Calentamiento'), h('span',{class:'pill soft'}, '~10 min · 2 vueltas')),
    h('div',{class:'row small muted',style:'justify-content:flex-end;gap:8px;font-weight:800'}, h('span',{style:'width:44px;text-align:center'},'1ª'), h('span',{style:'width:44px;text-align:center'},'2ª')),
    ...rows);
}
/* ============ motor de cargas y tests ============ */
const TESTS = {
  rm5: {title:'Test de fuerza: 5 repeticiones con 1 en reserva', steps:[
    'Calienta con la barra o un peso ligero: 8 repeticiones.',
    'Haz 2 o 3 series de aproximación subiendo de peso: 5, 3 y 1-2 repeticiones. Descansa 1-2 minutos entre ellas.',
    'Serie de test (la serie 1): elige el peso con el que hagas 5 repeticiones limpias sintiendo que te queda 1 más. Si haces más de 7 o menos de 4, descansa 3-4 minutos, ajusta el peso y repítela una sola vez.',
    'Anota los kilos, las repeticiones y el RIR (cuántas te quedaban).',
    'El resto de series hazlas con el peso que te calcula la app debajo del test.'],
    safe:'Usa los seguros del rack o pide ayuda. No llegues al fallo: si la técnica cambia, la serie termina ahí.'},
  max: {title:'Test de dominadas: máximo de repeticiones limpias', steps:[
    'Calienta con 2 series de 3 dominadas fáciles (con banda si hace falta) y descansa 3 minutos.',
    'Haz una sola serie al máximo (la serie 1): empieza colgado con los brazos estirados y sube hasta pasar la barbilla por encima de la barra.',
    'Sin balanceo ni patadas. Solo cuentan las repeticiones completas.',
    'Para cuando no puedas hacer otra limpia. Anota las repeticiones (kilos = 0, o el lastre si usas).'],
    safe:'Si notas dolor de codo u hombro (no cansancio), para y avisa a Javi.'},
  sym: {title:'Test de simetría: cada lado por separado', steps:[
    'Empieza siempre por el lado más débil.',
    'Elige un peso con el que hagas 5-8 repeticiones dejando 1-2 en reserva.',
    'Haz el otro lado con el mismo peso y en las mismas condiciones.',
    'Anota kilos y repeticiones de cada lado (D = derecho, I = izquierdo) y el RIR.'],
    safe:'La app calcula la diferencia entre lados. Hasta un 10% es normal.'},
};
const rirW = (plan, w) => { const v = num(((plan.weekInfo || [])[w-1] || {}).rir); return v == null ? 2 : v; };
function repsNum(r){ const m = String(r || '').match(/^(\d+)(?:\s*[-–]\s*(\d+))?/); return m ? (m[2] ? Math.round((Number(m[1]) + Number(m[2])) / 2) : Number(m[1])) : null; }
const isPull = (ex) => /dominad/i.test(ex.name);
function roundKg(kg, name){ const step = /mancuerna/i.test(name) ? 2 : 2.5; return Math.max(step, Math.round(kg / step) * step); }
const vname = (ex, w) => ((ex.wk || [])[w-1] || {}).v || ex.base || ex.name;
function exW(ex, w){
  const wk = (ex.wk || [])[w-1] || {};
  if (!wk.v) return ex;
  return Object.assign({}, ex, {base: ex.base || ex.name, name: wk.v, cue: wk.vc || '', why: 'Variante para cambiar el estímulo: trabaja lo mismo con otro ejercicio.', hip: wk.vh || ''});
}
const visibleEx = (d, w) => d.ex.filter(ex => ((ex.wk[w-1] || {}).s || 0) > 0);
/* mejor estimación de fuerza de un ejercicio en un registro: devuelve {e1, top, reps} */
function bestOf(ex, lg, wRir){
  const sets = ((lg && lg.sets && lg.sets[ex.id]) || []).filter(s => setFilled(ex, s));
  if (!sets.length) return null;
  const rv = lg.rir && lg.rir[ex.id] !== undefined && lg.rir[ex.id] !== '' ? lg.rir[ex.id] : wRir;
  let e1 = null, top = 0, reps = 0;
  sets.forEach(s => {
    if (ex.uni){
      const a = e1rm(s.kd, s.rd, rv), b = e1rm(s.ki, s.ri, rv);
      const v = a && b ? Math.min(a, b) : (a || b);
      if (v && (!e1 || v > e1)) e1 = v;
      top = Math.max(top, num(s.kd) || 0, num(s.ki) || 0);
      reps = Math.max(reps, Math.min(num(s.rd) || 0, num(s.ri) || 0));
    } else {
      const v = e1rm(s.k, s.r, rv); if (v && (!e1 || v > e1)) e1 = v;
      top = Math.max(top, num(s.k) || 0); reps = Math.max(reps, num(s.r) || 0);
    }
  });
  return {e1, top, reps};
}
/* objetivo de una semana: {kg, reps, src: 'coach'|'auto'|'test'|'free', note} */
function targetFor(ctx, plan, d, ex, w, curLg){
  const wk = ex.wk[w-1] || {};
  const R = rirW(plan, w);
  if (isPull(ex) && repsNum(wk.r) == null){
    let M = null;
    for (let k = w; k >= 1; k--){
      const lg = k === w ? curLg : ctx.logs[logKey(k, d.id)];
      if (!lg || !lg.sets || !lg.sets[ex.id]) continue;
      if (k === w && !(wk.test)) continue;
      const reps = lg.sets[ex.id].map(s => num(s.r) || 0);
      if (reps.some(x => x > 0)){ M = Math.max(...reps); break; }
    }
    if (wk.test === 'max') return {kg:null, reps:null, src:'test'};
    return M ? {kg:null, reps:Math.max(1, M - 2), src:'auto', note:`Tu máximo reciente: ${M}. Haz ${Math.max(1, M - 2)} por serie, limpias.`} : {kg:null, reps:null, src:'free', note:'Haz las repeticiones limpias que puedas dejando 1-2 en reserva.'};
  }
  const r = repsNum(wk.r);
  if (fmt(wk.kg) !== '') return {kg:num(wk.kg), reps:r, src:'coach'};
  const dl = plan.deload && plan.deload[w] ? 0.9 : 1;
  if (wk.test === 'rm5' || wk.test === 'sym'){
    const b = curLg ? bestOf(ex, {sets:{[ex.id]:[(curLg.sets[ex.id] || [])[0]].filter(Boolean)}, rir:curLg.rir}, 1) : null;
    if (b && b.e1 && r) return {kg:roundKg(b.e1 / (1 + (r + R) / 30), ex.name), reps:r, src:'test', e1:b.e1};
    return {kg:null, reps:r, src:'test'};
  }
  for (let k = w - 1; k >= 1; k--){
    if (vname(ex, k) !== vname(ex, w)) continue;
    const b = bestOf(ex, ctx.logs[logKey(k, d.id)], rirW(plan, k));
    if (b && b.e1 && r){
      let kg = b.e1 / (1 + (r + R) / 30);
      if (b.top) kg = Math.min(Math.max(kg, b.top * 0.9), b.top * 1.075);
      return {kg:roundKg(kg * dl, ex.name), reps:r, src:'auto', from:k, note: dl < 1 ? 'Semana de descarga: peso más ligero para recuperar' : undefined};
    }
  }
  return {kg:null, reps:r, src:'free'};
}
const srcText = (t) => t.src === 'coach' ? 'Puesto por Javi' : t.src === 'auto' ? 'Calculado con tu última sesión' : t.src === 'test' ? 'Haz primero la serie de test y la app te calcula el peso del resto' : 'Elige el peso para quedarte con el RIR indicado';

/* ============ récords, racha, resumen semanal ============ */
function exScore(ex, s, rir){
  if (isPull(ex) && !(num(s.k) > 0)) return num(s.r) || null;
  if (ex.uni){ const a = e1rm(s.kd, s.rd, rir), b = e1rm(s.ki, s.ri, rir); return a && b ? Math.min(a, b) : (a || b); }
  return e1rm(s.k, s.r, rir);
}
function bestBefore(ctx, plan, d, ex, w){
  let best = null;
  for (let k = 1; k < w; k++){
    if (vname(ex, k) !== vname(ex, w)) continue;
    const lg = ctx.logs[logKey(k, d.id)]; if (!lg || !lg.sets || !lg.sets[ex.id]) continue;
    const rv = lg.rir && lg.rir[ex.id] !== undefined && lg.rir[ex.id] !== '' ? lg.rir[ex.id] : rirW(plan, k);
    lg.sets[ex.id].forEach(s => { if (!setFilled(ex, s)) return; const v = exScore(ex, s, rv); if (v && (!best || v > best)) best = v; });
  }
  return best;
}
const prText = (ex, s) => isPull(ex) && !(num(s.k) > 0) ? `${fmt(s.r)} repeticiones` : (ex.uni ? `${fmt(s.kd)} kg × ${fmt(s.rd)} / ${fmt(s.ki)} kg × ${fmt(s.ri)}` : `${fmt(s.k)} kg × ${fmt(s.r)}`);
function checkPR(ctx, plan, d, ex, w, lg, s){
  if (!setFilled(ex, s)) return;
  const rv = lg.rir[ex.id] !== undefined && lg.rir[ex.id] !== '' ? lg.rir[ex.id] : rirW(plan, w);
  const v = exScore(ex, s, rv), prev = bestBefore(ctx, plan, d, ex, w);
  if (!v || !prev || v <= prev + 0.05) return;
  lg.pr = lg.pr || {};
  const first = !lg.pr[ex.id];
  if (first || v > lg.pr[ex.id].v){ lg.pr[ex.id] = {v, txt: prText(ex, s), name: ex.name}; if (first) toast(`Nuevo récord en ${ex.name}: ${prText(ex, s)}`); }
}
function toast(t){
  let el = document.getElementById('toast');
  if (!el){ el = h('div',{id:'toast',class:'toast',role:'status','aria-live':'polite'}); document.body.append(el); }
  el.replaceChildren(icon('check',18), h('span',null,t)); el.classList.add('show');
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 3800);
}
function allPRs(ctx){
  const out = [];
  const plan = ctx.plan; if (!plan) return out;
  for (let w = 1; w <= plan.weeks; w++) plan.days.forEach(d => { const lg = ctx.logs[logKey(w, d.id)]; if (lg && lg.pr) Object.values(lg.pr).forEach(p => out.push(Object.assign({w, d:d.id}, p))); });
  return out;
}
function weekComplete(ctx, plan, w){ return plan.days.every(d => { const lg = ctx.logs[logKey(w, d.id)]; return lg && lg.done; }); }
function streak(ctx, plan){
  const nowW = weekNow(ctx.doc, plan.weeks); let n = 0;
  for (let k = nowW; k >= 1; k--){ const c = weekComplete(ctx, plan, k); if (k === nowW && !c) continue; if (c) n++; else break; }
  return n;
}
function bestPull(ctx){
  let m = 0; const plan = ctx.plan; if (!plan) return 0;
  for (let w = 1; w <= plan.weeks; w++) plan.days.forEach(d => d.ex.forEach(ex => { if (!isPull(ex)) return; const lg = ctx.logs[logKey(w, d.id)]; ((lg && lg.sets && lg.sets[ex.id]) || []).forEach(s => { if (!(num(s.k) > 0)) m = Math.max(m, num(s.r) || 0); }); }));
  return m;
}
function pullCard(ctx){
  const M = bestPull(ctx), pct = Math.min(100, M * 10);
  const marks = [[6,'Dic'],[8,'Mar'],[10,'May']];
  return h('div',{class:'card stack',style:'gap:10px'},
    h('div',{class:'row between'}, h('span',{class:'h2'},'Meta: 10 dominadas'), h('span',{class:'num',style:'font-size:26px'}, `${M}`, h('span',{class:'muted',style:'font-size:16px'},' / 10'))),
    h('div',{class:'goal'}, h('b',{style:`width:${pct}%`}), ...marks.map(([v,l]) => h('i',{style:`left:${v*10}%`,class: M >= v ? 'hit' : ''}, h('span',null, l)))),
    h('p',{class:'small muted',style:'margin-top:14px'}, (M ? (M >= 10 ? 'Meta conseguida. Ahora a por la siguiente. ' : `Te faltan ${10 - M}. Cuenta tu mejor serie limpia, de prono o de supino. `) : 'Aparecerá tu marca cuando hagas el test de dominadas. ') + 'Hitos: 6 en diciembre, 8 en marzo y 10 en mayo.'));
}
async function maybeSummary(ctx){
  if (S.mode !== 'client' || S.sumBusy || !ctx.plan || !ctx.doc || !ctx.logsOk || !ctx.msgsOk || notStarted(ctx.doc)) return;
  const plan = ctx.plan, nowW = weekNow(ctx.doc, plan.weeks);
  const sw = new Date().getDay() === 0 ? nowW : nowW - 1;
  if (sw < 1) return;
  const tag = (plan.pid || 'p') + ':' + sw;
  if (ctx.doc.lastSummary === tag) return;
  S.sumBusy = true;
  let done = 0; const prs = [];
  plan.days.forEach(d => { const lg = ctx.logs[logKey(sw, d.id)]; if (lg && lg.done) done++; if (lg && lg.pr) Object.values(lg.pr).forEach(p => prs.push(p.name)); });
  const st = streak(ctx, plan), M = bestPull(ctx);
  let t = `Tu semana ${sw}: ${done} de ${plan.days.length} sesiones completadas.`;
  if (prs.length) t += ` ${prs.length} récord${prs.length > 1 ? 's' : ''}: ${prs.join(', ')}.`;
  if (st >= 2) t += ` Llevas ${st} semanas seguidas completas.`;
  if (M) t += ` Dominadas: ${M} de 10.`;
  t += done === plan.days.length ? ' Semana redonda, sigue así.' : (done ? ' Esta semana, a por todas las sesiones.' : ' Esta semana retomamos el ritmo.');
  try {
    await S.db.doc('clients/' + ctx.uid).update({lastSummary: tag});
    await S.db.doc(`clients/${ctx.uid}/msgs/${newId()}`).set({from:'app', kind:'summary', text:t, at:new Date().toISOString(), w:sw});
  } catch(e){}
  S.sumBusy = false;
}

/* ============ cambios: no puedo / otro día ============ */
const PATTERNS = [
  ['isquio', /curl femoral/i], ['biceps', /curl/i], ['triceps', /tríceps|press francés|fondos en banco/i], ['pecho-ais', /aperturas|cruce/i],
  ['hombro-post', /face pull|pájaros/i], ['hombro-lat', /elevaci[oó]n(es)? lateral/i], ['empuje-v', /press militar|press de hombro|arnold|landmine/i],
  ['empuje-h', /press|fondos|flexiones/i], ['tiron-v', /dominad|jalón/i], ['tiron-h', /remo/i], ['cuad-ais', /extensión de cuádriceps/i],
  ['bisagra', /peso muerto|pull-through|hiperextensi/i], ['gluteo', /hip thrust|glúteo|puente|abducci/i], ['rodilla', /sentadilla|prensa|zancada|búlgara|subida/i], ['gemelo', /gemelo/i],
];
const patternOf = (name) => { const p = PATTERNS.find(([,re]) => re.test(name)); return p ? p[0] : 'otro'; };
const UPPER = new Set(['empuje-h','empuje-v','tiron-v','tiron-h','pecho-ais','hombro-lat','hombro-post','biceps','triceps']);
const ALTS = {
  'empuje-h':[{n:'Press en máquina sentado',l:['Hombro','Codo'],e:1,c:'Espalda pegada al respaldo y codos a unos 45°.'},{n:'Press banca con mancuernas',l:['Hombro','Codo','Muñeca'],c:'Escápulas juntas, baja hasta la altura del pecho.'},{n:'Press inclinado en máquina',l:['Hombro','Codo'],e:1,c:'Pecho alto, sube sin bloquear los codos de golpe.'},{n:'Flexiones',l:['Hombro','Muñeca','Codo'],e:1,c:'Cuerpo en bloque, baja el pecho hasta casi el suelo.'}],
  'empuje-v':[{n:'Press de hombro en máquina',l:['Hombro','Codo'],e:1,c:'Espalda pegada al respaldo, sube en línea recta.'},{n:'Press Arnold sentado',l:['Hombro'],c:'Gira las palmas mientras subes, sin arquear la zona lumbar.'},{n:'Press landmine a una mano',l:['Hombro'],e:1,c:'De pie o de rodillas, empuja la barra hacia arriba y adelante.'}],
  'tiron-v':[{n:'Jalón al pecho con agarre neutro',l:['Hombro','Codo'],e:1,c:'Pecho alto y codos hacia las caderas.'},{n:'Dominadas asistidas (máquina o banda)',l:['Hombro','Codo'],e:1,c:'Rango completo, sube el pecho a la barra.'},{n:'Jalón a una mano',l:['Hombro'],c:'Tira del codo hacia la cadera, sin girar el tronco.'}],
  'tiron-h':[{n:'Remo en máquina con pecho apoyado',l:['Codo'],e:1,c:'Pecho pegado, junta escápulas al final.'},{n:'Remo en polea sentado',l:['Codo','Espalda baja'],e:1,c:'Espalda neutra, tira hacia el ombligo.'},{n:'Remo a una mano con mancuerna',l:['Codo','Espalda baja'],c:'Apoya mano y rodilla en el banco, codo hacia la cadera.'}],
  'pecho-ais':[{n:'Aperturas en máquina',l:['Hombro'],e:1,c:'Codos ligeramente flexionados, cierra en 1 s.'},{n:'Cruce de poleas',l:['Hombro'],c:'Pecho alto, junta las manos delante del pecho.'},{n:'Aperturas con mancuernas',l:['Hombro'],c:'Baja hasta notar estiramiento, sin dolor de hombro.'}],
  'hombro-lat':[{n:'Elevación lateral en máquina',l:['Hombro'],e:1,c:'Sube hasta la altura del hombro, sin impulso.'},{n:'Elevación lateral en polea',l:['Hombro'],c:'Codo algo flexionado, baja en 2 s.'},{n:'Elevaciones laterales con mancuernas',l:['Hombro'],c:'Hombros lejos de las orejas.'}],
  'hombro-post':[{n:'Pájaros en máquina',l:['Hombro'],e:1,c:'Abre los brazos sin encoger los hombros.'},{n:'Face pull',l:['Hombro'],c:'Tira hacia la cara abriendo los codos.'},{n:'Pájaros con mancuernas',l:['Hombro','Espalda baja'],c:'Tronco inclinado y espalda neutra.'}],
  'biceps':[{n:'Curl en polea',l:['Codo','Muñeca'],e:1,c:'Codos pegados al cuerpo.'},{n:'Curl martillo',l:['Codo'],e:1,c:'Palmas enfrentadas, sin balancear.'},{n:'Curl en banco Scott',l:['Codo'],c:'Baja controlando sin bloquear el codo de golpe.'}],
  'triceps':[{n:'Extensión en polea con cuerda',l:['Codo'],e:1,c:'Codos fijos, abre la cuerda abajo.'},{n:'Extensión sobre la cabeza en polea',l:['Codo','Hombro'],c:'Codos apuntando al frente, estira del todo.'},{n:'Press cerrado en máquina',l:['Codo','Hombro','Muñeca'],c:'Codos pegados al cuerpo.'}],
  'rodilla':[{n:'Prensa',l:['Rodilla','Cadera'],e:1,c:'Pelvis pegada al respaldo, baja hasta donde no se despegue.'},{n:'Sentadilla goblet',l:['Rodilla','Cadera','Espalda baja'],e:1,c:'Mancuerna pegada al pecho, rodillas en la línea de los pies.'},{n:'Sentadilla hack',l:['Rodilla','Cadera'],c:'Espalda pegada al respaldo.'},{n:'Zancada inversa',l:['Rodilla','Cadera','Tobillo'],c:'Paso atrás, rodilla delantera sobre el pie.'}],
  'cuad-ais':[{n:'Extensión de cuádriceps a una pierna',l:['Rodilla'],e:1,c:'Rodilla alineada con el eje de la máquina.'},{n:'Prensa con pies bajos',l:['Rodilla','Cadera'],c:'Pies en la parte baja de la plataforma.'}],
  'bisagra':[{n:'Hip thrust',l:['Cadera'],e:1,c:'Barbilla al pecho, empuja con los talones.'},{n:'Pull-through en polea',l:['Cadera'],e:1,c:'Cadera atrás y aprieta glúteos al subir.'},{n:'Peso muerto rumano con mancuernas',l:['Espalda baja','Cadera'],c:'Cadera atrás, espalda neutra.'},{n:'Hiperextensiones a 45°',l:['Espalda baja','Cadera'],c:'Mueve desde la cadera, no arquees al subir.'}],
  'gluteo':[{n:'Hip thrust en máquina',l:['Cadera'],e:1,c:'Sube y aguanta 1 s arriba.'},{n:'Puente de glúteo con barra',l:['Cadera'],e:1,c:'Desde el suelo, empuja con los talones.'},{n:'Patada de glúteo en polea',l:['Cadera'],c:'Sin arquear la zona lumbar.'},{n:'Abducción en máquina',l:['Cadera'],e:1,c:'Abre controlando y vuelve en 2 s.'}],
  'isquio':[{n:'Curl femoral sentado',l:['Rodilla'],e:1,c:'Cadera pegada, baja en 3 s.'},{n:'Curl femoral tumbado',l:['Rodilla'],e:1,c:'Pelvis pegada al banco.'},{n:'Curl femoral con fitball',l:['Rodilla'],c:'Cadera arriba durante todo el movimiento.'}],
  'gemelo':[{n:'Gemelo en prensa',l:['Tobillo'],e:1,c:'Rango completo y pausa abajo.'},{n:'Gemelo sentado',l:['Tobillo'],e:1,c:'Sin rebotes.'},{n:'Gemelo de pie',l:['Tobillo'],c:'Sube del todo y baja hasta estirar.'}],
};
const NEAR = {'empuje-h':['pecho-ais','triceps','empuje-v'],'empuje-v':['hombro-lat','triceps','empuje-h'],'tiron-v':['tiron-h','biceps','hombro-post'],'tiron-h':['tiron-v','hombro-post','biceps'],
  'pecho-ais':['empuje-h','triceps'],'hombro-lat':['hombro-post','empuje-v'],'hombro-post':['tiron-h','hombro-lat'],'biceps':['tiron-v','tiron-h'],'triceps':['empuje-h','pecho-ais'],
  'rodilla':['gluteo','cuad-ais','isquio'],'cuad-ais':['rodilla','gluteo'],'bisagra':['gluteo','isquio','rodilla'],'gluteo':['isquio','bisagra','rodilla'],'isquio':['gluteo','bisagra'],'gemelo':['isquio','gluteo']};
function altsFor(ex, mode, zone){
  const p = patternOf(ex.name), same = (ALTS[p] || []).filter(a => a.n.toLowerCase() !== ex.name.toLowerCase());
  if (mode === 'busy') return same.slice(0, 3);
  if (mode === 'tech') return same.filter(a => a.e).slice(0, 3);
  const out = [];
  (NEAR[p] || []).forEach(q => (ALTS[q] || []).forEach(a => { if (!a.l.includes(zone) && out.length < 3 && !out.some(o => o.n === a.n)) out.push(a); }));
  return out;
}
function exFilled(ex, lg, w){
  if (!lg) return false;
  const wk = ex.wk[w-1] || {}, sets = ((lg.sets || {})[ex.id] || []).filter(s => setFilled(ex, s)).length;
  if (wk.test) return sets >= 1;
  return sets >= (wk.s || 1);
}
function exStatus(ex, lg, w){
  if (!lg) return 'todo';
  if (lg.alt && lg.alt[ex.id]) return ((lg.alt[ex.id].sets || []).some(s => fmt(s.r) !== '')) ? 'done' : 'alt';
  const sk = lg.skip && lg.skip[ex.id];
  if (exFilled(ex, lg, w)) return 'done';
  if (sk) return sk.type;
  return ((lg.sets || {})[ex.id] || []).some(s => setFilled(ex, s)) ? 'part' : 'todo';
}
function pendingAll(ctx, plan, w){
  const out = [];
  const scan = (ww, testsOnly) => plan.days.forEach(d => {
    const lg = S.drafts[ctx.uid + '/' + docKey(plan, ww, d.id)] || ctx.logs[logKey(ww, d.id)]; if (!lg) return;
    visibleEx(d, ww).forEach(ex => {
      const wk = ex.wk[ww-1] || {}, sk = lg.skip && lg.skip[ex.id];
      if (lg.alt && lg.alt[ex.id]) return;
      if (sk && sk.type === 'removed') return;
      const later = sk && sk.type === 'later', missedTest = wk.test && lg.done;
      if (!(later || missedTest)) return;
      if (testsOnly && !wk.test) return;
      if (exFilled(ex, lg, ww)) return;
      out.push({d, ex, w:ww});
    });
  });
  if (w > 1) scan(w - 1, true);
  scan(w, false);
  return out;
}
/* reparte los pendientes entre los días de la semana que aún no están hechos (uno a cada día, por turnos) */
function pendingPlan(ctx, plan, w){
  const open = plan.days.filter(d => { const lg = S.drafts[ctx.uid + '/' + docKey(plan, w, d.id)] || ctx.logs[logKey(w, d.id)]; return !(lg && lg.done); }).map(d => d.id);
  const by = {}; open.forEach(id => { by[id] = []; });
  pendingAll(ctx, plan, w).forEach(it => {
    const cands = open.filter(id => !(it.w === w && id === it.d.id));
    if (!cands.length) return;
    const pick = cands.reduce((a, id) => (by[id].length < by[a].length ? id : a), cands[0]);
    by[pick].push(it);
  });
  return by;
}
function pendingFor(ctx, plan, w, hostId){ return pendingPlan(ctx, plan, w)[hostId] || []; }
function changeSheet(ctx, d, ex, w, lg){
  const box = h('div',{class:'stack'}), show = (el) => box.replaceChildren(el);
  const wk = ex.wk[w-1] || {}, isTest = !!wk.test;
  const opt = (t, s, fn, cls) => h('button',{class:'opt' + (cls ? ' ' + cls : ''),onclick:fn}, h('b',null,t), s ? h('span',null,s) : null);
  const where = `Día ${d.id}, semana ${w}`;
  const finish = async (msg, kind) => { persistLog(ctx, w, d.id); closeSheet(); render(true); await sendMsg(ctx, false, msg, {kind: kind || 'change', w, d:d.id, ex:ex.id}); };
  const later = (reason) => { lg.skip[ex.id] = {type:'later', reason, at:new Date().toISOString()}; finish(`${ex.name} (${where}) lo dejo para otro día: ${reason.toLowerCase()}.`); };
  const remove = (reason) => { lg.skip[ex.id] = {type:'removed', reason, at:new Date().toISOString()}; finish(`${ex.name} (${where}) lo quito hoy: ${reason.toLowerCase()}.`); };
  const pickAlt = (a, reason, extra) => { lg.alt[ex.id] = Object.assign({name:a.n, cue:a.c, reason, sets:Array.from({length: wk.s || 3}, () => ({k:'', r:''})), rir:''}, extra || {}); finish(`${ex.name} (${where}) cambiado por ${a.n}: ${reason.toLowerCase()}.`); };
  const altList = (list, reason, extra) => list.length ? list.map(a => opt(a.n, a.c, () => pickAlt(a, reason, extra))) : [h('p',{class:'muted small'},'No tengo un cambio seguro para este caso.')];
  const back = () => h('button',{class:'btn ghost full',onclick: () => show(main())},'Atrás');
  const main = () => h('div',{class:'stack'},
    h('div',null, h('p',{class:'tiny'}, 'No puedo hacerlo'), h('h2',{class:'h2'}, ex.name)),
    opt('No me da tiempo', isTest ? 'El test se pasa solo a tu próxima sesión.' : 'Lo repartimos en tus próximas sesiones de la semana.', () => later('No me da tiempo')),
    opt('Me duele o me molesta', 'Te propongo otro ejercicio que no cargue esa zona.', () => show(pain())),
    opt('La máquina está ocupada o no la hay', 'Te propongo otro del mismo tipo.', () => show(busy())),
    opt('No me sale la técnica', 'Te propongo una versión más sencilla.', () => show(tech())),
    opt('Otro motivo', null, () => show(other())),
    h('button',{class:'btn ghost full',onclick:closeSheet},'Cancelar'));
  const busy = () => h('div',{class:'stack'}, h('h2',{class:'h2'},'Máquina ocupada'),
    h('div',{class:'note'},'Si puedes, adelanta el siguiente ejercicio y vuelve a este cuando quede libre. Si no, elige uno de estos:'),
    ...altList(altsFor(ex, 'busy'), 'Máquina ocupada o no disponible'),
    opt('Dejarlo para otro día', null, () => later('Máquina ocupada')), back());
  const tech = () => h('div',{class:'stack'}, h('h2',{class:'h2'},'Versión más sencilla'),
    h('p',{class:'small muted'},'Javi recibirá un aviso para explicarte la técnica.'),
    ...altList(altsFor(ex, 'tech'), 'No me sale la técnica'),
    opt('Quitarlo hoy', null, () => remove('No me sale la técnica')), back());
  const other = () => { const ta = h('textarea',{class:'ta','aria-label':'Motivo',placeholder:'Cuéntale a Javi qué pasa'});
    return h('div',{class:'stack'}, h('h2',{class:'h2'},'Otro motivo'), ta,
      h('div',{class:'row'}, h('button',{class:'btn grow',onclick: () => later('Otro motivo: ' + (ta.value.trim() || 'sin detalle'))},'Otro día'), h('button',{class:'btn ghost grow',onclick: () => remove('Otro motivo: ' + (ta.value.trim() || 'sin detalle'))},'Quitarlo hoy')), back()); };
  const pain = () => {
    let zone = '', n = '';
    const zb = h('div',{class:'zones'}), go2 = h('button',{class:'btn full',disabled:true},'Continuar');
    const upd = () => { go2.disabled = !(zone && n !== ''); };
    ZONES.forEach(z => zb.append(h('button',{'aria-pressed':'false',onclick:(e) => { zone = z; [...zb.children].forEach(b => { b.classList.toggle('on', b === e.currentTarget); b.setAttribute('aria-pressed', String(b === e.currentTarget)); }); upd(); }}, z)));
    const sel = h('select',{class:'sel','aria-label':'Intensidad de 0 a 10',onchange:(e) => { n = e.target.value; upd(); }}, h('option',{value:''},'Elegir'), ...Array.from({length:11},(_,i) => h('option',{value:String(i)}, String(i))));
    go2.addEventListener('click', () => {
      const nn = Number(n); lg.pain[ex.id] = {zone, n:nn};
      const reason = `Molestia en ${zone.toLowerCase()} (${nn}/10)`;
      if (nn >= 7){
        lg.skip[ex.id] = {type:'removed', reason, at:new Date().toISOString()};
        show(h('div',{class:'stack'}, h('h2',{class:'h2'},'Para por hoy'), warnBox('Con un dolor así, deja el entrenamiento por hoy y no cargues esa zona. Javi te escribirá.'),
          h('button',{class:'btn full',onclick: () => finish(`${reason} en ${ex.name} (${where}). Paro la sesión.`, 'pain')},'Entendido, avisar a Javi')));
        return;
      }
      show(h('div',{class:'stack'}, h('h2',{class:'h2'},'Cambiamos de ejercicio'),
        warnBox('Deja este ejercicio. Si el dolor aumenta, aparece hormigueo o pierdes fuerza, para la sesión.'),
        h('p',{class:'small muted'}, `Otro patrón de movimiento que no carga ${zone.toLowerCase()}:`),
        ...altList(altsFor(ex, 'pain', zone), reason, {zone, n:nn}),
        opt('Quitarlo hoy', null, () => remove(reason))));
    });
    return h('div',{class:'stack'}, h('h2',{class:'h2'},'¿Dónde te molesta?'), zb, h('label',{class:'lbl'},'Intensidad (0 nada, 10 muy fuerte)', sel), go2, back());
  };
  openSheet(box); show(main());
}
function altCard(ctx, d, ex, n, w, lg, opts){
  const a = lg.alt[ex.id], done = (a.sets || []).some(s => fmt(s.r) !== '');
  const card = h('div',{class:'card stack excard' + (done ? ' is-done' : ''),style:'gap:10px',id:'ex-' + ex.id});
  card.append(h('div',{class:'exhead',style:'cursor:default'}, h('span',{class:'exnum ' + (done ? 'done' : '')}, done ? icon('check',18) : String(n)),
    h('span',{class:'grow'}, h('span',{class:'ex-name',style:'display:block'}, a.name), h('span',{class:'small muted'}, `En lugar de ${ex.name}`))));
  card.append(h('div',{class:'note'}, `${a.reason}. Hazlo con ${a.sets.length} series de 10-12 repeticiones, eligiendo el peso por el RIR. No cuenta para tu progreso.`));
  if (a.cue) card.append(h('p',{style:'font-size:13.5px'}, h('b',null,'Foco: '), a.cue));
  const grid = h('div',{class:'sets alt'}); ['Serie','Kg','Reps'].forEach(t => grid.append(h('span',{class:'h'}, t)));
  a.sets.forEach((s, i) => {
    const mk = (f, mode, label) => { const inp = h('input',{type:'text',inputmode:mode,'aria-label':label,value:fmt(s[f])}); inp.addEventListener('input', () => { s[f] = inp.value.trim(); inp.classList.toggle('ok', fmt(s.r) !== ''); persistLog(ctx, w, d.id); }); inp.classList.toggle('ok', fmt(s.r) !== ''); return inp; };
    grid.append(h('span',{class:'sn'}, i+1), mk('k','decimal',`Kilos, serie ${i+1} de ${a.name}`), mk('r','numeric',`Repeticiones, serie ${i+1} de ${a.name}`));
  });
  card.append(grid, h('button',{class:'btn ghost sm',onclick: () => { delete lg.alt[ex.id]; persistLog(ctx, w, d.id); render(true); }},'Deshacer el cambio'));
  return card;
}
function skipCard(ctx, d, ex, n, w, lg){
  const sk = lg.skip[ex.id], later = sk.type === 'later';
  return h('div',{class:'card excard is-skip stack',style:'gap:8px',id:'ex-' + ex.id},
    h('div',{class:'exhead',style:'cursor:default'}, h('span',{class:'exnum skip'}, later ? '↻' : '—'),
      h('span',{class:'grow'}, h('span',{class:'ex-name',style:'display:block'}, ex.name), h('span',{class:'small muted'}, later ? 'Para otro día: lo repartimos en tus próximas sesiones' : `Quitado hoy: ${sk.reason}`))),
    h('button',{class:'btn sm ghost',onclick: () => { delete lg.skip[ex.id]; persistLog(ctx, w, d.id); S.openEx[sessKey(ctx)] = ex.id; render(true); }}, later ? 'Hacerlo ahora' : 'Deshacer'));
}
const sessKey = (ctx) => ctx.uid + '/' + S.route.w + '_' + S.route.d;

function exCard(ctx, d, ex, n, w, lg, opts){
  opts = opts || {};
  const plan = ctx.plan, wk = ex.wk[w-1] || {s:0, r:''};
  const ns = (wk.s || 0) + (lg.extra[ex.id] || 0);
  const arr = lg.sets[ex.id] || (lg.sets[ex.id] = []);
  const prev = vname(ex, w-1) === vname(ex, w) ? ctx.logs[logKey(w-1, d.id)] : null;
  const prevSets = (prev && prev.sets && prev.sets[ex.id]) || [];
  lg.adj = lg.adj || {}; lg.skip = lg.skip || {}; lg.alt = lg.alt || {};
  if (lg.alt[ex.id]) return altCard(ctx, d, ex, n, w, lg, opts);
  if (lg.skip[ex.id] && !opts.pending) return skipCard(ctx, d, ex, n, w, lg);
  const T = targetFor(ctx, plan, d, ex, w, lg);
  const test = wk.test && TESTS[wk.test];
  const stt = exStatus(ex, lg, w);
  const card = h('div',{class:'card stack excard' + (stt === 'done' ? ' is-done' : '') + (opts.open ? ' is-open' : ''),style:'gap:11px',id:'ex-' + ex.id});
  const repsTxt = T.reps != null ? String(T.reps) : (repsNum(wk.r) != null ? String(repsNum(wk.r)) : '');
  const kgNow = lg.adj[ex.id] != null ? lg.adj[ex.id] : T.kg;
  const subTxt = (opts.pending ? `Pendiente del Día ${d.id}` + (opts.pw !== S.route.w ? ` (semana ${opts.pw})` : '') + ' · ' : '') + `${wk.s} × ${T.reps != null && isPull(ex) ? T.reps : wk.r}` + (kgNow != null ? ` · ${fmtN(kgNow)} kg` : '') + (test ? ' · Test' : '');
  card.append(h('button',{class:'exhead','aria-expanded':String(!!opts.open),onclick: () => opts.toggle && opts.toggle()},
    h('span',{class:'exnum ' + stt}, stt === 'done' ? icon('check',18) : String(n)),
    h('span',{class:'grow'}, h('span',{class:'ex-name',style:'display:block'}, ex.name), h('span',{class:'small ' + (test ? '' : 'muted'),style: test ? 'color:var(--warn);font-weight:700' : ''}, subTxt)),
    lg.pr && lg.pr[ex.id] ? h('span',{class:'pill ok'},'Récord') : null,
    icon(opts.open ? 'up' : 'down', 20)));
  if (!opts.open) return card;
  card.append(h('div',{class:'row wrap',style:'gap:6px'}, ex.tempo ? h('span',{class:'chip'}, ex.tempo) : null, ex.rest ? h('span',{class:'chip'}, 'Descanso ' + ex.rest) : null, ex.uni ? h('span',{class:'chip',style:'background:var(--accent-soft);color:var(--accent)'},'Por lado') : null));
  if (test) card.append(h('details',{class:'testbox',open:true},
    h('summary',null, icon('warn',18), h('span',null, test.title)),
    h('ol',null, ...test.steps.map(t => h('li',null,t))),
    h('p',{class:'small',style:'font-weight:700'}, test.safe)));
  if (wk.n) card.append(h('div',{class:'note'}, wk.n));
  if (lg.pain[ex.id]) card.append(warnBox(`Molestia avisada: ${lg.pain[ex.id].zone} (${lg.pain[ex.id].n}/10). Javi ya lo sabe.`));
  // objetivo de peso
  const baseKg = T.kg;
  const workKg = () => lg.adj[ex.id] != null ? lg.adj[ex.id] : (baseKg != null ? baseKg : (test ? targetFor(ctx, plan, d, ex, w, lg).kg : null));
  const objLine = h('div',{class:'target'});
  const kgInputs = [];
  const paintObj = () => {
    const k = workKg();
    objLine.replaceChildren(
      h('div',{class:'grow'}, h('span',{class:'tiny'}, test && !T.kg ? 'Objetivo' : 'Peso objetivo'),
        h('div',{class:'num',style:'font-size:28px;line-height:1.1'}, k != null ? `${fmtN(k)} kg` : (T.reps != null && isPull(ex) ? `${T.reps} reps` : (test ? 'Test' : 'Por RIR')), repsTxt && k != null ? h('span',{style:'font-size:18px;color:var(--muted)'}, ` × ${repsTxt}`) : null),
        h('span',{class:'small muted'}, lg.adj[ex.id] != null ? 'Ajustado por ti hoy' : (test && k != null && T.kg == null ? 'Calculado con tu test de hoy' : (T.note || srcText(T))))),
      ...(k != null ? [h('div',{class:'row',style:'gap:6px'},
        h('button',{class:'icon-btn','aria-label':'Bajar peso objetivo',onclick: () => setAdj(-1)}, '−'),
        h('button',{class:'icon-btn','aria-label':'Subir peso objetivo',onclick: () => setAdj(1)}, '+'))] : []));
    kgInputs.forEach(f => f());
  };
  const setAdj = (dir) => {
    const step = /mancuerna/i.test(ex.name) ? 2 : 2.5;
    const nk = Math.max(0, (workKg() || 0) + dir * step);
    if (nk === baseKg) delete lg.adj[ex.id]; else lg.adj[ex.id] = nk;
    persistLog(ctx, w, d.id); paintObj();
  };
  if (!(isPull(ex) && T.src === 'test')) card.append(objLine);
  const hip = ctx.doc && ctx.doc.hip && ex.hip;
  if (ex.cue || ex.why || ex.warn || hip){
    card.append(h('details',{class:'info',open: w === 1 || null},
      h('summary',null,'Indicaciones'),
      h('div',{class:'stack',style:'gap:8px'},
        ex.cue ? h('p',{style:'font-size:13.5px'}, h('b',null,'Foco: '), ex.cue) : null,
        ex.why ? h('p',{class:'muted',style:'font-size:13px'}, h('b',null,'Para qué: '), ex.why) : null,
        ex.warn ? warnBox(ex.warn) : null,
        hip ? warnBox('Cadera: ' + ex.hip) : null)));
  }
  const grid = h('div',{class:'sets'});
  ['Serie','Objetivo','Kg','Reps'].forEach(t => grid.append(h('span',{class:'h'}, t)));
  const result = h('div',{class:'okbox',hidden:true});
  const paintResult = () => {
    if (!test){ result.hidden = true; return; }
    const s0 = arr[0];
    if (wk.test === 'max'){ const m = s0 && num(s0.r); result.hidden = !m; if (m) result.textContent = `Tu máximo: ${m} dominadas limpias. Meta para el verano: 10.`; return; }
    if (wk.test === 'sym'){
      const a = s0 && e1rm(s0.kd, s0.rd, lg.rir[ex.id] ?? 1), b = s0 && e1rm(s0.ki, s0.ri, lg.rir[ex.id] ?? 1);
      result.hidden = !(a && b); if (a && b){ const lsi = Math.min(a,b)/Math.max(a,b); result.textContent = `Diferencia entre lados: ${fmtN((1-lsi)*100)}% (lado más débil: ${a < b ? 'derecho' : 'izquierdo'}). ` + (lsi >= 0.9 ? 'Está dentro de lo normal.' : 'Javi lo revisará.'); }
      return;
    }
    const e = s0 && e1rm(s0.k, s0.r, lg.rir[ex.id] !== undefined ? lg.rir[ex.id] : 1);
    result.hidden = !e;
    if (e){ const k = workKg(); result.textContent = `Fuerza estimada (1RM): ${fmtN(e)} kg.` + (k != null ? ` Resto de series: ${fmtN(k)} kg × ${repsTxt || repsNum(wk.r)}.` : ''); }
    paintObj();
  };
  for (let i = 0; i < ns; i++){
    const st = arr[i] || (arr[i] = ex.uni ? {kd:'',rd:'',ki:'',ri:''} : {k:'',r:''});
    const pv = prevSets[i];
    const isTestSet = test && i === 0;
    const kgFor = () => isTestSet ? null : workKg();
    const objCell = h('div',{class:'obj'});
    const paintCell = () => {
      const k = kgFor(), rr = isTestSet ? (wk.test === 'max' ? 'máx.' : (repsNum(wk.r) || 5)) : (T.reps != null ? T.reps : repsTxt);
      objCell.replaceChildren(h('b',null, isTestSet ? (wk.test === 'max' ? 'Máximo' : `Test × ${wk.test === 'sym' ? '5-8' : 5}`) : (k != null ? `${fmtN(k)} × ${rr}` : (rr ? `× ${rr}` : 'Libre'))),
        ...(pv && setFilled(ex, pv) ? [h('span',null,'Antes ' + (ex.uni ? `${fmt(pv.kd)}×${fmt(pv.rd)} · ${fmt(pv.ki)}×${fmt(pv.ri)}` : `${fmt(pv.k)}×${fmt(pv.r)}`))] : []));
    };
    let paint = () => {};
    const mk = (f, mode, label, kgField) => {
      const inp = h('input',{type:'text',inputmode:mode,'aria-label':label,autocomplete:'off'});
      const show = () => { if (kgField && fmt(st[f]) === '' && kgFor() != null){ inp.value = fmtN(kgFor()); inp.classList.add('pre'); } else { inp.value = fmt(st[f]); inp.classList.remove('pre'); } };
      if (kgField) kgInputs.push(() => { if (fmt(st[f]) === '') show(); paintCell(); });
      show();
      inp.addEventListener('focus', () => { if (inp.classList.contains('pre')) inp.select(); });
      inp.addEventListener('input', () => {
        st[f] = inp.value.trim(); inp.classList.remove('pre');
        if (!kgField && st[f] !== ''){ const kf = f === 'r' ? 'k' : (f === 'rd' ? 'kd' : 'ki'); if (fmt(st[kf]) === '' && kgFor() != null) st[kf] = fmtN(kgFor()).replace(',','.'); }
        paint(); checkPR(ctx, plan, d, ex, w, lg, st); persistLog(ctx, w, d.id); if (i === 0 && test) paintResult();
      });
      return inp;
    };
    if (!ex.uni){
      const a = mk('k','decimal',`Kilos, serie ${i+1} de ${ex.name}`, true), b = mk('r','numeric',`Repeticiones, serie ${i+1} de ${ex.name}`);
      paint = () => { const ok = fmt(st.r) !== ''; a.classList.toggle('ok', ok); b.classList.toggle('ok', ok); if (ok && fmt(st.k) !== ''){ a.value = fmt(st.k); a.classList.remove('pre'); } };
      grid.append(h('span',{class:'sn'}, isTestSet ? 'Test' : i+1), objCell, a, b);
    } else {
      const a = mk('kd','decimal',`Kilos lado derecho, serie ${i+1} de ${ex.name}`, true), b = mk('rd','numeric',`Repeticiones lado derecho, serie ${i+1} de ${ex.name}`);
      const a2 = mk('ki','decimal',`Kilos lado izquierdo, serie ${i+1} de ${ex.name}`, true), b2 = mk('ri','numeric',`Repeticiones lado izquierdo, serie ${i+1} de ${ex.name}`);
      paint = () => { const o1 = fmt(st.rd) !== '', o2 = fmt(st.ri) !== ''; a.classList.toggle('ok', o1); b.classList.toggle('ok', o1); a2.classList.toggle('ok', o2); b2.classList.toggle('ok', o2); if (o1 && fmt(st.kd) !== ''){ a.value = fmt(st.kd); a.classList.remove('pre'); } if (o2 && fmt(st.ki) !== ''){ a2.value = fmt(st.ki); a2.classList.remove('pre'); } };
      grid.append(h('span',{class:'sn'}, isTestSet ? 'Test D' : (i+1) + ' D'), objCell, a, b, h('span',{class:'sn'}, isTestSet ? 'Test I' : (i+1) + ' I'), h('span'), a2, b2);
    }
    paintCell(); paint();
    kgInputs.push(paintCell);
  }
  card.append(grid, result); paintResult(); paintObj();
  card.append(h('button',{class:'add',onclick: () => { lg.extra[ex.id] = (lg.extra[ex.id] || 0) + 1; persistLog(ctx, w, d.id); render(true); }}, '+ Añadir serie'));
  const rir = h('div',{class:'rirs'}, [0,1,2,3,4].map(v => h('button',{class: String(lg.rir[ex.id]) === String(v) ? 'on' : '','aria-label':`RIR ${v}`,onclick: (e) => {
    lg.rir[ex.id] = v; [...rir.children].forEach((x,k) => x.classList.toggle('on', k === v)); persistLog(ctx, w, d.id); paintResult(); }}, String(v))));
  card.append(h('div',{class:'row between wrap'}, h('span',{style:'font-weight:800;font-size:13px'}, test ? 'RIR de la serie de test' : 'RIR de la última serie'), rir));
  const note = h('textarea',{class:'ta',rows:'2','aria-label':'Nota sobre ' + ex.name,placeholder:'Nota (la verá Javi): sensaciones, técnica, máquina…',style:'min-height:52px'});
  note.value = lg.notes[ex.id] || '';
  note.addEventListener('input', () => { lg.notes[ex.id] = note.value; persistLog(ctx, w, d.id); });
  card.append(note);
  card.append(h('div',{class:'row'},
    h('button',{class:'btn ghost sm grow',onclick: () => changeSheet(ctx, d, ex, w, lg)}, 'No puedo hacerlo'),
    h('button',{class:'icon-btn','aria-label':'Más opciones de ' + ex.name,onclick: () => exMenu(ctx, d, ex, w, lg)}, icon('more',20)),
    opts.next ? h('button',{class:'btn sm grow',onclick: opts.next}, 'Siguiente', icon('next',16)) : null));
  return card;
}
function openSheet(content){
  closeSheet();
  const back = h('div',{class:'backdrop',id:'sheet',onclick:(e) => { if (e.target === back) closeSheet(); }}, h('div',{class:'sheet',role:'dialog','aria-modal':'true'}, content));
  document.body.append(back);
  const f = back.querySelector('button,input,textarea,select'); if (f) f.focus();
}
function closeSheet(){ const s = document.getElementById('sheet'); if (s) s.remove(); }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
function exMenu(ctx, d, ex, w, lg){
  const box = h('div',{class:'stack'});
  const show = (el) => box.replaceChildren(el);
  const opt = (t, s, fn) => h('button',{class:'opt',onclick:fn}, h('b',null,t), s ? h('span',null,s) : null);
  const main = () => h('div',{class:'stack'},
    h('h2',{class:'h2'}, ex.name),
    opt('Ver mi historial','Lo que has hecho en este ejercicio semana a semana.', () => { closeSheet(); go(S.mode === 'coach' ? {v:'exhist', id:ex.id, uid:ctx.uid} : {v:'exhist', id:ex.id}); }),
    opt('Escribir a Javi sobre este ejercicio', null, () => show(write())),
    h('button',{class:'btn ghost full',onclick:closeSheet},'Cerrar'));
  const pain = () => {
    let zone = '', n = '';
    const zb = h('div',{class:'zones'});
    const go2 = h('button',{class:'btn full',disabled:true},'Avisar a Javi');
    const upd = () => { go2.disabled = !(zone && n !== ''); };
    ZONES.forEach(z => zb.append(h('button',{'aria-pressed':'false',onclick:(e) => { zone = z; [...zb.children].forEach(b => { b.classList.toggle('on', b === e.currentTarget); b.setAttribute('aria-pressed', String(b === e.currentTarget)); }); upd(); }}, z)));
    const sel = h('select',{class:'sel','aria-label':'Intensidad de 0 a 10',onchange:(e) => { n = e.target.value; upd(); }}, h('option',{value:''},'Elegir'), ...Array.from({length:11},(_,i) => h('option',{value:String(i)}, String(i))));
    go2.addEventListener('click', async () => {
      go2.disabled = true;
      const nn = Number(n);
      lg.pain[ex.id] = {zone, n:nn}; persistLog(ctx, w, d.id);
      await sendMsg(ctx, false, `Molestia en ${zone.toLowerCase()} (${nn}/10) en ${ex.name} · Día ${d.id}, semana ${w}.`, {kind:'pain', w, d:d.id, ex:ex.id});
      show(h('div',{class:'stack'},
        h('h2',{class:'h2'}, nn >= 7 ? 'Para por hoy' : 'Aviso enviado'),
        warnBox(nn >= 7 ? 'Con un dolor así, deja el entrenamiento por hoy y no cargues esa zona. Javi te escribirá.' : 'No sigas con este ejercicio. Haz los siguientes si no te molestan. Si el dolor aumenta, aparece hormigueo o pierdes fuerza, para la sesión.'),
        h('button',{class:'btn full',onclick: () => { closeSheet(); render(true); }},'Entendido')));
    });
    return h('div',{class:'stack'}, h('h2',{class:'h2'},'¿Dónde te molesta?'), zb, h('label',{class:'lbl'},'Intensidad (0 nada, 10 muy fuerte)', sel), go2, h('button',{class:'btn ghost full',onclick: () => show(main())},'Atrás'));
  };
  const write = () => {
    const ta = h('textarea',{class:'ta','aria-label':'Mensaje para Javi',placeholder:'Escribe tu mensaje'});
    return h('div',{class:'stack'}, h('h2',{class:'h2'},'Mensaje a ' + COACH), h('p',{class:'small muted'}, `Sobre: ${ex.name} · Día ${d.id}, semana ${w}`), ta,
      h('button',{class:'btn full',onclick: async (e) => { const t = ta.value.trim(); if (!t) return; e.currentTarget.disabled = true; await sendMsg(ctx, false, `${ex.name} (Día ${d.id}, sem. ${w}): ${t}`, {kind:'text', w, d:d.id, ex:ex.id}); closeSheet(); }}, icon('send',18), 'Enviar'),
      h('button',{class:'btn ghost full',onclick: () => show(main())},'Atrás'));
  };
  openSheet(box); show(main());
}

/* ---- progreso ---- */
function exHistory(ctx, exId){
  const plan = ctx.plan; let out = [];
  if (!plan) return out;
  const d = plan.days.find(x => x.ex.some(e => e.id === exId)); if (!d) return out;
  const ex0 = d.ex.find(e => e.id === exId);
  for (let w = 1; w <= plan.weeks; w++){
    const ex = exW(ex0, w);
    const lg = ctx.logs[logKey(w, d.id)]; if (!lg || !lg.sets || !lg.sets[exId]) continue;
    const sets = lg.sets[exId].filter(s => setFilled(ex, s)); if (!sets.length) continue;
    let best = null, bestSet = null;
    sets.forEach(s => { const v = ex.uni ? Math.max(e1rm(s.kd, s.rd, lg.rir[exId]) || 0, e1rm(s.ki, s.ri, lg.rir[exId]) || 0) : e1rm(s.k, s.r, lg.rir[exId]); if (v && (!best || v > best)){ best = v; bestSet = s; } });
    out.push({w, name: ex.name, sets, best, bestSet, rir: lg.rir[exId], note: lg.notes && lg.notes[exId]});
  }
  if (out.length){ const nm = out[out.length-1].name; out = out.filter(x => x.name === nm); }
  return out;
}
function spark(vals){
  const W = 96, H = 30, s = document.createElementNS(SVGNS,'svg');
  s.setAttribute('viewBox',`0 0 ${W} ${H}`); s.setAttribute('width',W); s.setAttribute('height',H); s.setAttribute('class','spark'); s.setAttribute('aria-hidden','true');
  const v = vals.filter(x => x != null); if (v.length < 2) return s;
  const mn = Math.min(...v), mx = Math.max(...v), rg = mx - mn || 1;
  const pts = v.map((x,i) => [3 + i*(W-6)/(v.length-1), H-4 - (x-mn)/rg*(H-8)]);
  const p = document.createElementNS(SVGNS,'polyline'); p.setAttribute('points', pts.map(q => q.join(',')).join(' ')); p.setAttribute('fill','none'); p.setAttribute('stroke','var(--accent)'); p.setAttribute('stroke-width','2'); p.setAttribute('stroke-linejoin','round');
  const c = document.createElementNS(SVGNS,'circle'); const L = pts[pts.length-1]; c.setAttribute('cx',L[0]); c.setAttribute('cy',L[1]); c.setAttribute('r','3'); c.setAttribute('fill','var(--accent)');
  s.append(p, c); return s;
}
function progressView(ctx){
  const wrap = h('div',{class:'stack'}); wrap.append(previewBar(ctx) || '');
  wrap.append(h('div',null, h('p',{class:'tiny'},'Tu evolución'), h('h1',{class:'title'},'Progreso')));
  if (!ctx.plan){ wrap.append(h('div',{class:'card empty'}, h('p',{class:'muted'},'Cuando tengas plan y apuntes tus primeras series, aquí verás cómo evolucionan tus cargas.'))); return wrap; }
  const N = ctx.plan.weeks;
  let doneS = 0; for (let w = 1; w <= N; w++) ctx.plan.days.forEach(d => { const lg = ctx.logs[logKey(w, d.id)]; if (lg && lg.done) doneS++; });
  const prs = allPRs(ctx), stk = streak(ctx, ctx.plan);
  wrap.append(h('div',{class:'hero'},
    h('div',{class:'tiles hero-tiles'},
      h('div',{class:'tile'}, h('span',{class:'tiny'},'Sesiones'), h('b',{class:'num',style:'font-size:28px'}, `${doneS}`), h('span',{class:'small'}, `de ${N * ctx.plan.days.length}`)),
      h('div',{class:'tile'}, h('span',{class:'tiny'},'Racha'), h('b',{class:'num',style:'font-size:28px'}, `${stk}`), h('span',{class:'small'}, stk === 1 ? 'semana completa' : 'semanas completas')),
      h('div',{class:'tile'}, h('span',{class:'tiny'},'Récords'), h('b',{class:'num',style:'font-size:28px'}, `${prs.length}`), h('span',{class:'small'},'superados'))),
    h('div',{class:'bar',style:'background:var(--hero-line)'}, h('b',{style:`width:${Math.round(doneS / (N * ctx.plan.days.length) * 100)}%`}))));
  wrap.append(pullCard(ctx));
  if (prs.length) wrap.append(h('div',{class:'card stack',style:'gap:4px'}, h('div',{class:'h2',style:'padding-bottom:4px'},'Últimos récords'),
    ...prs.slice(-5).reverse().map(p => h('div',{class:'row between',style:'border-top:1px solid var(--line);min-height:44px'}, h('span',{class:'grow'}, h('b',{style:'display:block;font-size:14px'}, p.name), h('span',{class:'small muted'}, `Semana ${p.w} · Día ${p.d}`)), h('span',{class:'pill ok'}, p.txt)))));
  const tc = testsCard(ctx); if (tc) wrap.append(tc);
  wrap.append(h('p',{class:'small muted'},'La fuerza estimada se calcula con tu mejor serie de cada semana (kilos, repeticiones y RIR). Sirve para ver la tendencia.'));
  let any = false;
  ctx.plan.days.forEach(d => {
    const rows = d.ex.map(ex => {
      const hist = exHistory(ctx, ex.id); if (!hist.length) return null; any = true;
      const last = hist[hist.length-1], first = hist[0];
      const ch = first.best && last.best && hist.length > 1 ? (last.best/first.best - 1) * 100 : null;
      const bs = last.bestSet;
      return h('button',{class:'row',style:'width:100%;text-align:left;background:none;border:0;border-top:1px solid var(--line);padding:10px 0;min-height:56px',onclick: () => go(S.mode === 'coach' ? {v:'exhist', id:ex.id, uid:ctx.uid} : {v:'exhist', id:ex.id})},
        h('span',{class:'grow stack',style:'gap:2px'}, h('b',{style:'font-size:14px'}, last.name), h('span',{class:'small muted'}, `Sem. ${last.w}: ` + (ex.uni ? `${fmt(bs.kd)}×${fmt(bs.rd)} · ${fmt(bs.ki)}×${fmt(bs.ri)}` : `${fmt(bs.k)} kg × ${fmt(bs.r)}`))),
        spark(hist.map(x => x.best)),
        ch != null ? h('span',{class:'pill ' + (ch >= 0 ? 'ok' : 'warn')}, (ch >= 0 ? '+' : '') + fmtN(ch) + '%') : null);
    }).filter(Boolean);
    if (rows.length) wrap.append(h('div',{class:'card',style:'padding-block:12px'}, h('div',{class:'h3',style:'padding-bottom:6px'}, `Día ${d.id} · ${d.name}`), ...rows));
  });
  if (!any) wrap.append(h('div',{class:'card empty'}, h('p',{class:'muted'},'Aún no hay series apuntadas. Cuando completes tus primeras sesiones aparecerán aquí.')));
  return wrap;
}
function exHistView(ctx, exId){
  const wrap = h('div',{class:'stack'}); wrap.append(previewBar(ctx) || '');
  const d = ctx.plan && ctx.plan.days.find(x => x.ex.some(e => e.id === exId));
  const ex = d && d.ex.find(e => e.id === exId);
  wrap.append(h('button',{class:'back',onclick: () => go(S.mode === 'coach' ? {v:'client', uid:ctx.uid, tab:'progreso'} : {v:'progress'})}, icon('back',20), 'Progreso'));
  if (!ex){ wrap.append(h('p',{class:'muted'},'Este ejercicio ya no está en tu plan.')); return wrap; }
  const hist = exHistory(ctx, exId);
  wrap.append(h('div',null, h('p',{class:'tiny'}, `Día ${d.id} · ${d.name}`), h('h1',{class:'title'}, hist.length ? hist[hist.length-1].name : ex.name)));
  if (!hist.length){ wrap.append(h('div',{class:'card empty'}, h('p',{class:'muted'},'Todavía no has apuntado series de este ejercicio.'))); return wrap; }
  [...hist].reverse().forEach(x => {
    wrap.append(h('div',{class:'card stack',style:'gap:6px'},
      h('div',{class:'row between'}, h('b',null, `Semana ${x.w}`), x.best ? h('span',{class:'pill soft'}, 'Fuerza est. ' + fmtN(x.best) + ' kg') : null),
      h('div',{class:'row wrap',style:'gap:6px'}, ...x.sets.map((s,i) => h('span',{class:'chip'}, ex.uni ? `${i+1}: D ${fmt(s.kd)}×${fmt(s.rd)} · I ${fmt(s.ki)}×${fmt(s.ri)}` : `${i+1}: ${fmt(s.k)} kg × ${fmt(s.r)}`))),
      x.rir !== undefined && x.rir !== '' ? h('span',{class:'small muted'}, `RIR última serie: ${x.rir}`) : null,
      x.note ? h('p',{class:'small'}, h('b',null,'Nota: '), x.note) : null));
  });
  return wrap;
}

/* ---- mensajes ---- */
function fillChat(box, ctx, asCoach){
  const msgs = ctx.msgs || [];
  if (!msgs.length){ box.replaceChildren(h('div',{class:'card empty'}, h('p',{class:'muted'}, asCoach ? 'Todavía no hay mensajes con este cliente.' : `Escribe aquí a ${COACH}: dudas, molestias o cómo te ha ido. Él verá tus mensajes en su panel.`))); return; }
  let lastDay = '';
  const items = [];
  msgs.forEach(m => {
    const dy = String(m.at).slice(0,10);
    if (dy !== lastDay){ lastDay = dy; items.push(h('div',{class:'tiny',style:'text-align:center;padding:6px 0'}, fmtDay(dy))); }
    const mine = asCoach ? m.from === 'coach' : m.from === 'client';
    items.push(h('div',{class:'msg ' + (mine ? 'me' : 'them') + (m.kind === 'pain' ? ' alert' : '')},
      m.kind === 'pain' ? h('b',{style:'display:block;color:var(--warn)'},'Aviso de molestia') : null,
      m.kind === 'session' ? h('b',{style:'display:block'},'Resumen de sesión') : null,
      m.kind === 'summary' ? h('b',{style:'display:block;color:var(--accent)'},'Resumen semanal') : null,
      String(m.text).replace(/^Sesión completada: /,''),
      h('span',{class:'meta'}, (mine ? '' : (m.from === 'coach' ? COACH + ' · ' : m.from === 'app' ? 'Serie a Serie · ' : (asCoach ? clientName(ctx.uid) + ' · ' : ''))) + hhmm(m.at))));
  });
  const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
  box.replaceChildren(...items);
  if (atBottom) requestAnimationFrame(() => window.scrollTo(0, document.body.scrollHeight));
}
let seenBusy = false;
async function markSeen(ctx, asCoach){
  if (seenBusy || !ctx || !ctx.doc || !unreadFor(ctx, asCoach)) return;
  seenBusy = true;
  const f = asCoach ? 'coachSeen' : 'clientSeen';
  const last = (ctx.msgs[ctx.msgs.length-1] || {}).at || new Date().toISOString();
  try { await S.db.doc('clients/' + ctx.uid).update({[f]: last}); } catch(e){}
  seenBusy = false;
}
function chatView(ctx, asCoach, embedded){
  const wrap = h('div',{class:'stack'});
  if (!embedded){ wrap.append(previewBar(ctx) || ''); wrap.append(h('div',null, h('p',{class:'tiny'}, asCoach ? 'Chat' : 'Tu entrenador'), h('h1',{class:'title'}, asCoach ? clientName(ctx.uid) : COACH))); }
  const box = h('div',{class:'chat',id:'chatlist','data-uid':ctx.uid});
  fillChat(box, ctx, asCoach);
  const ta = h('textarea',{class:'ta',id:'composer','aria-label':'Escribe un mensaje',placeholder: asCoach ? `Escribe a ${clientName(ctx.uid).split(' ')[0]}` : `Escribe a ${COACH}`,rows:'1'});
  S.compose = S.compose || {}; ta.value = S.compose[ctx.uid] || '';
  ta.addEventListener('input', () => { S.compose[ctx.uid] = ta.value; });
  const send = h('button',{class:'btn','aria-label':'Enviar',style:'width:52px;padding:0;flex-shrink:0',onclick: async () => {
    const t = ta.value.trim(); if (!t) return; send.disabled = true;
    const ok = await sendMsg(ctx, asCoach, t, {kind:'text'});
    send.disabled = false; if (ok){ ta.value = ''; S.compose[ctx.uid] = ''; ta.focus(); }
  }}, icon('send',20));
  ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send.click(); });
  wrap.append(box, h('div',{class:'composer'}, ta, send));
  setTimeout(() => { markSeen(ctx, asCoach); window.scrollTo(0, document.body.scrollHeight); }, 50);
  return wrap;
}


async function toggleDeload(uid, plan, w){
  const p = clone(plan); p.deload = p.deload || {};
  if (p.deload[w]){
    const o = p.deload[w]; p.weekInfo[w-1] = o.wi;
    p.days.forEach(d => d.ex.forEach(ex => { if (o.s[ex.id] !== undefined && ex.wk[w-1]) ex.wk[w-1].s = o.s[ex.id]; }));
    delete p.deload[w];
  } else {
    const o = {wi: clone(p.weekInfo[w-1] || {}), s:{}};
    p.days.forEach(d => d.ex.forEach(ex => { const wk = ex.wk[w-1]; if (!wk) return; o.s[ex.id] = wk.s; if (wk.s > 0) wk.s = Math.max(1, Math.round(wk.s * 0.6)); }));
    p.weekInfo[w-1] = Object.assign({}, p.weekInfo[w-1], {phase:'Descarga', rir:'3', note:'Semana de descarga: menos series y un peso más ligero para recuperar y volver con más fuerza.'});
    p.deload[w] = o;
  }
  p.updated = new Date().toISOString();
  return safe(() => S.db.doc(`clients/${uid}/plan/current`).set(p));
}
/* ---- revisión semanal automática ---- */
function weekReview(ctx, plan, w){
  const doc = ctx.doc || {};
  let planned = 0, done = 0, daysDone = 0, rirSum = 0, rirN = 0, pains = 0, notes = 0; const mins = [], rpes = [];
  plan.days.forEach(d => {
    const st = dayStats(ctx, plan, w, d); planned += st.tot; done += st.done; if (st.isDone) daysDone++;
    const lg = st.lg; if (!lg) return;
    if (lg.min && lg.done) mins.push(lg.min); if (num(lg.rpe)) rpes.push(num(lg.rpe));
    visibleEx(d, w).forEach(ex => { const v = lg.rir && lg.rir[ex.id]; if (!(ex.wk[w-1] || {}).test && v !== undefined && v !== '' && v !== null){ rirSum += Number(v); rirN++; } if (lg.pain && lg.pain[ex.id]) pains++; if (lg.notes && lg.notes[ex.id]) notes++; });
  });
  const avg = (a) => a.length ? a.reduce((x,y) => x + y, 0) / a.length : null;
  const R = rirW(plan, w), dev = rirN ? rirSum / rirN - R : null, adh = planned ? done / planned : 0;
  const nowW = weekNow(doc, plan.weeks), past = w < nowW, rpe = avg(rpes), mn = avg(mins);
  const todo = [];
  if (pains) todo.push(['bad', `${pains} aviso${pains > 1 ? 's' : ''} de molestia. Escríbele hoy. Si se repite en la misma zona, cambia ese ejercicio el resto del bloque.`]);
  if (past && adh < 0.85) todo.push(['warn', `Hizo el ${Math.round(adh*100)}% de las series. Pregúntale qué pasó antes de tocar el plan.`]);
  if (dev != null && dev >= 1) todo.push(['warn', `Le sobran repeticiones (RIR real ${fmtN(dev + R)} con objetivo ${R}). Los pesos automáticos ya suben. Recuérdale que el RIR es lo que de verdad le quedaba.`]);
  if (dev != null && dev <= -1) todo.push([rpe >= 9 ? 'bad' : 'warn', `Llega sin reserva (RIR real ${fmtN(dev + R)} con objetivo ${R})` + (rpe >= 9 ? ' y con dureza alta. Si se repite la semana que viene, pulsa «Convertir en semana de descarga» en la semana siguiente.' : '. Los pesos automáticos ya bajan. Vigila sueño y estrés.')]);
  if (mn && mn > 80) todo.push(['warn', `Sesiones de ${Math.round(mn)} min de media. Recorta accesorios, nunca los básicos.`]);
  if (notes) todo.push(['info', `Ha dejado ${notes} nota${notes > 1 ? 's' : ''} en los ejercicios. Las tienes abajo, en cada día.`]);
  if (plan.days.some(d => visibleEx(d, w).some(e => (e.wk[w-1] || {}).test))) todo.push(['info', 'Semana de test: mira los resultados en la pestaña Progreso.']);
  const prW = []; plan.days.forEach(d => { const lg = ctx.logs[logKey(w, d.id)]; if (lg && lg.pr) Object.values(lg.pr).forEach(p => prW.push(p.name)); });
  if (prW.length) todo.push(['info', `${prW.length} récord${prW.length > 1 ? 's' : ''} esta semana: ${prW.join(', ')}. Felicítale.`]);
  if (!todo.length) todo.push(['ok', done ? 'Todo en orden. No hace falta cambiar nada.' : (notStarted(doc) ? 'Todavía no ha empezado el plan.' : 'Aún no ha registrado nada esta semana.')]);
  const level = todo.some(t => t[0] === 'bad') ? 'bad' : (todo.some(t => t[0] === 'warn') ? 'warn' : 'ok');
  return {planned, done, adh, daysDone, ndays: plan.days.length, dev, R, mn, rpe, todo, level};
}
function reviewCard(rv, w){
  const tile = (label, val, sub, cls) => h('div',{class:'tile ' + (cls || '')}, h('span',{class:'tiny'}, label), h('b',{class:'num',style:'font-size:24px'}, val), sub ? h('span',{class:'small muted'}, sub) : null);
  const devCls = rv.dev == null ? '' : (Math.abs(rv.dev) >= 1 ? 'warn' : 'ok');
  return h('div',{class:'card stack'},
    h('div',{class:'row between'}, h('span',{class:'h2'}, `Revisión · semana ${w}`), h('span',{class:'pill ' + rv.level}, rv.level === 'ok' ? 'Todo bien' : rv.level === 'warn' ? 'Revisar' : 'Atención')),
    h('div',{class:'tiles'},
      tile('Sesiones', `${rv.daysDone}/${rv.ndays}`, 'completadas'),
      tile('Series', `${Math.round(rv.adh*100)}%`, `${rv.done} de ${rv.planned}`, rv.adh >= 0.85 ? 'ok' : (rv.done ? 'warn' : '')),
      tile('RIR real', rv.dev == null ? '—' : fmtN(rv.dev + rv.R), `objetivo ${rv.R}`, devCls),
      tile('Duración', rv.mn ? `${Math.round(rv.mn)}′` : '—', rv.rpe ? `dureza ${fmtN(rv.rpe)}` : 'media')),
    h('div',{class:'stack',style:'gap:6px'}, h('span',{class:'tiny'},'Qué hacer'),
      ...rv.todo.map(([lv, t]) => h('div',{class: lv === 'bad' ? 'err' : lv === 'warn' ? 'warn' : lv === 'ok' ? 'okbox' : 'note'}, t))));
}
function testsCard(ctx){
  const plan = ctx.plan, rows = [];
  for (let w = 1; w <= plan.weeks; w++) plan.days.forEach(d => d.ex.forEach(ex => {
    const wk = ex.wk[w-1] || {}; if (!wk.test) return;
    const lg = ctx.logs[logKey(w, d.id)], s0 = lg && lg.sets && lg.sets[ex.id] && lg.sets[ex.id][0];
    if (!s0 || !setFilled(ex, s0)) return;
    const rr = lg.rir && lg.rir[ex.id] !== undefined ? lg.rir[ex.id] : 1;
    let res = '';
    if (wk.test === 'max') res = `${fmt(s0.r)} reps`;
    else if (wk.test === 'sym'){ const a = e1rm(s0.kd, s0.rd, rr), b = e1rm(s0.ki, s0.ri, rr); if (a && b) res = `${fmtN((1 - Math.min(a,b)/Math.max(a,b))*100)}% dif.`; }
    else { const e = e1rm(s0.k, s0.r, rr); if (e) res = `1RM ${fmtN(e)} kg`; }
    rows.push(h('tr',null, h('td',null,'S' + w), h('td',null, ex.name.replace(/ \(test\)$/,'')), h('td',{style:'white-space:nowrap;font-weight:800'}, res)));
  }));
  if (!rows.length) return null;
  const cmp = [];
  const byName = {};
  for (let w = 1; w <= plan.weeks; w++) plan.days.forEach(d => d.ex.forEach(ex => {
    const wk = ex.wk[w-1] || {}; if (!wk.test || wk.test === 'sym') return;
    const lg = ctx.logs[logKey(w, d.id)], s0 = lg && lg.sets && lg.sets[ex.id] && lg.sets[ex.id][0];
    if (!s0 || !setFilled(ex, s0)) return;
    const v = wk.test === 'max' ? num(s0.r) : e1rm(s0.k, s0.r, lg.rir && lg.rir[ex.id] !== undefined ? lg.rir[ex.id] : 1);
    if (v) (byName[ex.name] = byName[ex.name] || []).push({w, v, max: wk.test === 'max'});
  }));
  Object.entries(byName).forEach(([n, arr]) => { if (arr.length < 2) return; const a = arr[0], b = arr[arr.length-1];
    cmp.push(h('div',{class:'row between',style:'border-top:1px solid var(--line);min-height:46px'}, h('b',{class:'grow',style:'font-size:14px'}, n),
      h('span',{class:'small muted',style:'white-space:nowrap'}, a.max ? `S${a.w}: ${a.v} → S${b.w}: ${b.v} reps` : `S${a.w}: ${fmtN(a.v)} → S${b.w}: ${fmtN(b.v)} kg`),
      h('span',{class:'pill ' + (b.v >= a.v ? 'ok' : 'warn')}, a.max ? `${b.v - a.v >= 0 ? '+' : ''}${b.v - a.v}` : `${b.v >= a.v ? '+' : ''}${fmtN((b.v/a.v - 1)*100)}%`))); });
  return h('div',{class:'card stack',style:'gap:6px'}, h('div',{class:'h2'},'Tests'),
    ...(cmp.length ? [h('span',{class:'tiny'},'Antes y ahora'), ...cmp, h('span',{class:'tiny',style:'padding-top:8px'},'Todos los tests')] : []),
    h('div',{class:'tblwrap'}, h('table',{class:'t'}, h('tr',null, h('th',null,'Sem'), h('th',null,'Ejercicio'), h('th',null,'Resultado')), ...rows)));
}

/* ============ VISTAS DEL ENTRENADOR ============ */
function coachRouter(){
  const r = S.route;
  if (r.v === 'client') return clientDetail(r.uid, r.tab || 'semana');
  if (r.v === 'plans') return plansView();
  if (r.v === 'editor') return editorView();
  if (r.v === 'inbox') return inboxView();
  if (r.v === 'preview' || r.v === 'session' || r.v === 'exhist'){
    const ctx = ctxFor(r.uid);
    if (ctx.plan === undefined) return h('p',{class:'muted',style:'padding:40px 0;text-align:center'},'Cargando…');
    if (r.v === 'session') return sessionView(ctx, r.w, r.d);
    if (r.v === 'exhist') return exHistView(ctx, r.id);
    return homeView(ctx);
  }
  return clientsView();
}
function clientsView(){
  const wrap = h('div',{class:'stack'});
  const ids = Object.keys(S.c.clients).sort((a,b) => clientName(a).localeCompare(clientName(b)));
  wrap.append(h('div',{class:'row between'}, h('div',{class:'stack',style:'gap:6px'}, brand(), h('h1',{class:'title'},'Clientes')), h('span',{class:'pill'}, `${ids.length}`)));
  if (!S.c.clientsLoaded){ wrap.append(h('p',{class:'muted'},'Cargando…')); return wrap; }
  if (!ids.length){
    wrap.append(h('div',{class:'card stack'},
      h('div',{class:'h2'},'Da de alta a tus clientes'),
      h('div',{class:'row',style:'align-items:flex-start'}, h('span',{class:'sum-n'},'1'), h('span',null,'Pulsa «Dar de alta un cliente» y ponle nombre, usuario y contraseña.')),
      h('div',{class:'row',style:'align-items:flex-start'}, h('span',{class:'sum-n'},'2'), h('span',null,'Mándale el enlace de la app con su usuario y su contraseña. Puede cambiar la contraseña abajo del todo.')),
      h('div',{class:'row',style:'align-items:flex-start'}, h('span',{class:'sum-n'},'3'), h('span',null,'Entras en su ficha, le asignas un plan y la fecha de inicio.')),
      h('p',{class:'small muted'},'Cada cliente solo ve sus datos; tú los ves todos.'),
      h('button',{class:'btn ghost',onclick: () => safe(() => S.db.doc('clients/demo-prueba').set({uid:'demo-prueba', demo:true, label:'Cliente de prueba', joinedAt:new Date().toISOString()}))}, 'Crear un cliente de prueba')));
    wrap.append(newClientCard());
    return wrap;
  }
  const un = totalUnread();
  if (un) wrap.append(h('button',{class:'note row between',style:'border:0;width:100%;text-align:left',onclick: () => go({v:'inbox'})}, h('span',null, `Tienes ${un} mensaje${un > 1 ? 's' : ''} sin leer`), icon('next',18)));
  ids.forEach(uid => {
    const doc = S.c.clients[uid], logs = S.c.logs[uid] || {}, msgs = S.c.msgs[uid] || [];
    const nm = clientName(uid), u = unreadFor({doc, msgs}, true);
    const W = doc.weeks || 0, w = weekNow(doc, W);
    const dayIds = doc.dayIds || [];
    let last = ''; Object.values(logs).forEach(l => { if (l.updated > last) last = l.updated; });
    const pain = msgs.some(m => m.kind === 'pain' && String(m.at) > (doc.coachSeen || ''));
    const cp = S.c.plan[uid];
    let rvChip = null;
    if (cp && !notStarted(doc)){ const rw = w > 1 && new Date().getDay() === 1 ? w - 1 : w; const rv = weekReview({doc, plan:cp, logs}, cp, rw); rvChip = h('span',{class:'pill ' + rv.level,style:'align-self:flex-start'}, (rv.level === 'ok' ? 'Todo bien' : rv.level === 'warn' ? 'Revisar' : 'Atención') + ` · sem. ${rw}`); }
    wrap.append(h('button',{class:'client',onclick: () => go({v:'client', uid, tab:'semana'})},
      h('span',{class:'avatar'}, initials(nm)),
      h('span',{class:'grow stack',style:'gap:4px'},
        h('span',{class:'row between'}, h('b',{style:'font-size:16px'}, nm), u ? h('span',{class:'count inline'}, u) : null),
        h('span',{class:'small muted'}, doc.planTitle ? `${doc.planTitle} · semana ${w} de ${W}` + (notStarted(doc) ? ` · empieza ${fmtDay(doc.startDate)}` : '') : 'Sin plan asignado'),
        dayIds.length ? h('span',{class:'row',style:'gap:8px'}, h('span',{class:'dots'}, ...dayIds.map(d => { const lg = logs[logKey(w, d)]; return h('i',{class: lg && lg.done ? 'done' : (lg ? 'part' : '')}, d); })), h('span',{class:'small muted'}, last ? ago(last) : 'sin actividad')) : null,
        h('span',{class:'row wrap',style:'gap:6px'}, rvChip, pain ? h('span',{class:'pill warn'}, icon('warn',14), 'Aviso de molestia') : null)),
      icon('next',18)));
  });
  wrap.append(newClientCard());
  return wrap;
}
/* ---- alta de clientes con usuario y contraseña ---- */
const slug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,24);
const genPass = () => { const w = ['banca','remo','sentadilla','dominada','press','zancada','hipthrust','peso']; return w[Math.floor(Math.random()*w.length)] + (100 + Math.floor(Math.random()*900)); };
function newClientCard(){
  if (!S.user || !S.user.admin) return '';
  if (S.ncCard) return S.ncCard;           // se conserva entre repintados (no se pierde lo escrito)
  const card = S.ncCard = h('div',{class:'card stack'});
  const closed = () => card.replaceChildren(h('button',{class:'btn full',onclick: open}, icon('plus',18), 'Dar de alta un cliente'));
  function open(){
    const nm = h('input',{class:'in',placeholder:'Nombre',autocomplete:'off'});
    const us = h('input',{class:'in',placeholder:'usuario',autocapitalize:'none',autocorrect:'off',spellcheck:'false'});
    const pw = h('input',{class:'in',value:genPass(),autocapitalize:'none',autocorrect:'off',spellcheck:'false'});
    let touched = false;
    nm.addEventListener('input', () => { if (!touched) us.value = slug(nm.value.split(' ')[0] || ''); });
    us.addEventListener('input', () => { touched = true; });
    const box = h('div',{class:'err',hidden:true});
    const go2 = h('button',{class:'btn full'}, 'Crear cliente');
    go2.addEventListener('click', async () => {
      box.hidden = true;
      const name = nm.value.trim(), username = slug(us.value), password = pw.value.trim();
      if (!name){ box.textContent = 'Escribe su nombre.'; box.hidden = false; return; }
      if (username.length < 3){ box.textContent = 'El usuario necesita al menos 3 letras o números.'; box.hidden = false; return; }
      if (password.length < 6){ box.textContent = 'La contraseña necesita al menos 6 caracteres.'; box.hidden = false; return; }
      go2.disabled = true; go2.textContent = 'Creando…';
      try {
        await S.user.admin({action:'create', name, username, password});
        const msg = `¡Hola ${name.split(' ')[0]}! Ya tienes tu app de entreno: ${location.origin + location.pathname}\nUsuario: ${username}\nContraseña: ${password}\n(La puedes cambiar abajo del todo en la app.)`;
        const ta = h('textarea',{class:'in',rows:5,readonly:true,style:'width:100%;font-size:14px'}); ta.value = msg;
        const cp = h('button',{class:'btn full'}, 'Copiar mensaje');
        cp.addEventListener('click', async () => { try { await navigator.clipboard.writeText(msg); cp.textContent = 'Copiado'; } catch(e){ ta.select(); } });
        card.replaceChildren(h('div',{class:'okbox'}, `${name} ya está dado de alta.`), h('p',{class:'small muted'},'Mándale este mensaje por WhatsApp:'), ta, cp, h('button',{class:'btn ghost full',onclick: closed},'Hecho'));
      } catch(e){ box.textContent = e.userMsg || 'No se ha podido crear.'; box.hidden = false; go2.disabled = false; go2.textContent = 'Crear cliente'; }
    });
    card.replaceChildren(h('div',{class:'h2'},'Nuevo cliente'),
      h('label',{class:'lbl'},'Nombre', nm), h('label',{class:'lbl'},'Usuario (para entrar)', us), h('label',{class:'lbl'},'Contraseña provisional', pw),
      box, go2, h('button',{class:'btn ghost full',onclick: closed},'Cancelar'));
    setTimeout(() => nm.focus(), 30);
  }
  closed();
  return card;
}
function passwordCard(uid, doc){
  if (!S.user || !S.user.admin || doc.demo) return '';
  S.pwCards = S.pwCards || {};
  if (S.pwCards[uid]) return S.pwCards[uid];
  return (S.pwCards[uid] = passwordCardBuild(uid, doc));
}
function passwordCardBuild(uid, doc){
  const pw = h('input',{class:'in',value:genPass(),autocapitalize:'none',autocorrect:'off',spellcheck:'false','aria-label':'Contraseña nueva'});
  const box = h('div',{class:'okbox',hidden:true});
  const b = h('button',{class:'btn sm'}, 'Poner');
  b.addEventListener('click', async () => {
    if (pw.value.trim().length < 6){ box.className = 'err'; box.textContent = 'Al menos 6 caracteres.'; box.hidden = false; return; }
    b.disabled = true;
    try { await S.user.admin({action:'password', uid, password: pw.value.trim()}); box.className = 'okbox'; box.textContent = `Hecho. Su contraseña nueva es: ${pw.value.trim()}`; }
    catch(e){ box.className = 'err'; box.textContent = e.userMsg || 'No se ha podido cambiar.'; }
    box.hidden = false; b.disabled = false;
  });
  return h('div',{class:'card stack'}, h('div',{class:'h3'},'Acceso'),
    doc.username ? h('p',null, 'Usuario: ', h('b',null, doc.username)) : null,
    h('label',{class:'lbl'},'Contraseña nueva (si se le olvida)', h('div',{class:'row'}, pw, b)), box);
}
function inboxView(){
  const wrap = h('div',{class:'stack'});
  wrap.append(h('div',null, h('p',{class:'tiny'},'Panel de ' + COACH), h('h1',{class:'title'},'Mensajes')));
  const ids = Object.keys(S.c.clients).filter(id => (S.c.msgs[id] || []).length)
    .sort((a,b) => String((S.c.msgs[b].slice(-1)[0] || {}).at).localeCompare(String((S.c.msgs[a].slice(-1)[0] || {}).at)));
  if (!ids.length){ wrap.append(h('div',{class:'card empty'}, h('p',{class:'muted'},'Aquí aparecerán los mensajes, los avisos de molestia y los resúmenes de sesión de tus clientes.'))); return wrap; }
  ids.forEach(uid => {
    const msgs = S.c.msgs[uid], last = msgs[msgs.length-1], u = unreadFor({doc:S.c.clients[uid], msgs}, true);
    wrap.append(h('button',{class:'client',onclick: () => go({v:'client', uid, tab:'chat'})},
      h('span',{class:'avatar'}, initials(clientName(uid))),
      h('span',{class:'grow stack',style:'gap:2px'},
        h('span',{class:'row between'}, h('b',null, clientName(uid)), h('span',{class:'small muted'}, ago(last.at))),
        h('span',{class: u ? '' : 'muted',style:'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:14px;' + (u ? 'font-weight:700' : '')}, (last.from === 'coach' ? 'Tú: ' : '') + (last.kind === 'pain' ? '⚠ ' : '') + last.text)),
      u ? h('span',{class:'count inline'}, u) : null));
  });
  return wrap;
}
function clientDetail(uid, tab){
  const doc = S.c.clients[uid];
  if (!doc) return h('div',{class:'stack'}, h('button',{class:'back',onclick: () => go({v:'clients'})}, icon('back',20),'Clientes'), h('p',{class:'muted'},'Este cliente ya no está.'));
  watchPlan(uid);
  const ctx = ctxFor(uid), nm = clientName(uid);
  const wrap = h('div',{class:'stack'});
  wrap.append(h('button',{class:'back',onclick: () => go({v:'clients'})}, icon('back',20), 'Clientes'),
    h('div',{class:'row'}, h('span',{class:'avatar',style:'width:54px;height:54px;font-size:20px;border-radius:27px'}, initials(nm)),
      h('div',{class:'grow'}, h('h1',{class:'title',style:'font-size:28px'}, nm), h('p',{class:'small muted'}, doc.planTitle ? `${doc.planTitle} · semana ${weekNow(doc, doc.weeks)} de ${doc.weeks}` : 'Sin plan asignado'))));
  const u = unreadFor(ctx, true);
  const tabs = [['semana','Semana'],['plan','Plan'],['chat','Mensajes' + (u ? ` (${u})` : '')],['progreso','Progreso']];
  wrap.append(h('div',{class:'seg-ctl',role:'tablist'}, tabs.map(([k,l]) => h('button',{class: tab === k ? 'on' : '',role:'tab','aria-selected':String(tab === k),onclick: () => go({v:'client', uid, tab:k})}, l))));
  if (tab === 'chat') wrap.append(chatView(ctx, true, true));
  else if (tab === 'plan') wrap.append(planTab(uid, ctx));
  else if (tab === 'progreso') wrap.append(ctx.plan === undefined ? h('p',{class:'muted'},'Cargando…') : progressView(Object.assign({}, ctx, {preview:false})));
  else wrap.append(weekTab(uid, ctx));
  return wrap;
}
function weekTab(uid, ctx){
  const wrap = h('div',{class:'stack'}), plan = ctx.plan, doc = ctx.doc;
  if (plan === undefined) return h('p',{class:'muted'},'Cargando…');
  if (!plan) return h('div',{class:'card empty'}, h('p',{class:'muted'},'Este cliente aún no tiene plan.'), h('button',{class:'btn',onclick: () => go({v:'client', uid, tab:'plan'})},'Asignar plan'));
  const N = plan.weeks, w = curWeek(ctx), wi = (plan.weekInfo || [])[w-1] || {};
  wrap.append(h('div',{class:'weeknav'},
    h('button',{class:'icon-btn','aria-label':'Semana anterior',disabled: w <= 1, onclick: () => setWeek(ctx, w-1)}, icon('back',20)),
    h('div',{class:'mid'}, h('b',null, `Semana ${w} de ${N}`), h('div',{class:'small muted'}, (doc.startDate ? weekRange(doc.startDate, w) + ' · ' : '') + (wi.phase || '') + (wi.rir ? ' · RIR ' + wi.rir : ''))),
    h('button',{class:'icon-btn','aria-label':'Semana siguiente',disabled: w >= N, onclick: () => setWeek(ctx, w+1)}, icon('next',20))));
  wrap.append(reviewCard(weekReview(ctx, plan, w), w));
  const edit = S.route.edit === w;
  wrap.append(h('div',{class:'row wrap btnrow'},
    h('button',{class:'btn sm ' + (edit ? '' : 'ghost'),onclick: () => { S.tgt = null; S.route = Object.assign({}, S.route, {edit: edit ? null : w}); render(true); }}, edit ? 'Cerrar objetivos' : 'Poner kilos objetivo'),
    h('button',{class:'btn sm line',onclick: () => go({v:'preview', uid})}, icon('eye',16), 'Ver como cliente')));
  const isDl = !!(plan.deload && plan.deload[w]);
  const dlBtn = h('button',{class:'btn sm ' + (isDl ? 'danger' : 'ghost')}, isDl ? 'Quitar la descarga' : 'Convertir en semana de descarga');
  dlBtn.addEventListener('click', async () => {
    if (dlBtn.dataset.armed !== '1'){ dlBtn.dataset.armed = '1'; dlBtn.textContent = isDl ? 'Pulsa otra vez: vuelve la semana original' : 'Pulsa otra vez: 60% de series y −10% de peso'; return; }
    dlBtn.disabled = true; await toggleDeload(uid, plan, w);
  });
  wrap.append(h('div',{class:'row wrap'}, dlBtn, isDl ? h('span',{class:'pill warn'},'Semana de descarga') : null));
  if (edit) wrap.append(targetsEditor(uid, plan, w));
  plan.days.forEach(d => {
    const st = dayStats(ctx, plan, w, d), lg = st.lg;
    const card = h('div',{class:'card stack',style:'gap:8px'});
    card.append(h('div',{class:'row between'},
      h('div',null, h('b',{style:'font-size:16px'}, `Día ${d.id} · ${d.name}`), h('div',{class:'small muted'}, lg ? (lg.done ? 'Completada' : 'En curso') + ` · ${st.done}/${st.tot} series` + (lg.min ? ` · ${lg.min} min` : '') + (lg.rpe ? ` · dureza ${lg.rpe}` : '') : 'Sin empezar')),
      h('span',{class:'pill ' + (st.isDone ? 'ok' : (lg ? 'warn' : ''))}, st.isDone ? 'Hecha' : (lg ? Math.round(st.p*100) + '%' : '—'))));
    if (lg){
      const rows = visibleEx(d, w).map(ex0 => {
        const ex = exW(ex0, w);
        const sets = (lg.sets[ex.id] || []).filter(s => setFilled(ex, s));
        const wk = ex.wk[w-1] || {};
        const p = lg.pain && lg.pain[ex.id], nt = lg.notes && lg.notes[ex.id];
        return h('tr',null,
          h('td',null, h('b',null, ex.name), h('div',{class:'small muted'}, (() => { const t = targetFor(ctx, plan, d, ex, w, lg); return `Obj. ${wk.s} × ${t.reps != null ? t.reps : wk.r}` + (t.kg != null ? ` · ${fmtN(t.kg)} kg` + (t.src === 'auto' ? ' (auto)' : '') : '') + (wk.test ? ' · TEST' : ''); })()),
            nt ? h('div',{class:'small',style:'margin-top:3px'}, h('b',null,'Nota: '), nt) : null,
            p ? h('div',{class:'small',style:'color:var(--warn);font-weight:700;margin-top:3px'}, `Molestia: ${p.zone} ${p.n}/10`) : null,
            lg.alt && lg.alt[ex.id] ? h('div',{class:'small',style:'color:var(--accent);font-weight:700;margin-top:3px'}, `Cambiado por ${lg.alt[ex.id].name}: ${lg.alt[ex.id].reason}`) : null,
            lg.skip && lg.skip[ex.id] ? h('div',{class:'small',style:'color:var(--warn);font-weight:700;margin-top:3px'}, lg.skip[ex.id].type === 'later' ? `Para otro día: ${lg.skip[ex.id].reason}` + (exFilled(ex, lg, w) ? ' (ya hecho)' : '') : `Quitado: ${lg.skip[ex.id].reason}`) : null),
          h('td',{style:'white-space:nowrap'}, lg.alt && lg.alt[ex.id] ? (lg.alt[ex.id].sets || []).filter(x => fmt(x.r) !== '').map(x => h('div',null, `${fmt(x.k)}×${fmt(x.r)}`)) : sets.length ? sets.map((s,i) => h('div',null, ex.uni ? `D ${fmt(s.kd)}×${fmt(s.rd)} · I ${fmt(s.ki)}×${fmt(s.ri)}` : `${fmt(s.k)}×${fmt(s.r)}`)) : '—'),
          h('td',{class:'num',style:'text-align:center'}, lg.rir[ex.id] !== undefined ? String(lg.rir[ex.id]) : '—'));
      });
      card.append(h('div',{class:'tblwrap'}, h('table',{class:'t'}, h('tr',null, h('th',null,'Ejercicio'), h('th',null,'Kg × reps'), h('th',null,'RIR')), ...rows)));
    }
    wrap.append(card);
  });
  return wrap;
}
function targetsEditor(uid, plan, w){
  if (!S.tgt || S.tgt.uid !== uid || S.tgt.w !== w) S.tgt = {uid, w, p: clone(plan)};
  const p = S.tgt.p;
  const box = h('div',{class:'card stack'});
  box.append(h('div',null, h('div',{class:'h2'},`Objetivos · semana ${w}`), h('p',{class:'small muted'},'Vacío = automático: la app calcula el peso con su última sesión (en gris, lo que propone). Escribe un número solo si quieres fijarlo tú.')));
  p.days.forEach(d => {
    box.append(h('div',{class:'h3',style:'padding-top:6px'}, `Día ${d.id} · ${d.name}`));
    visibleEx(d, w).forEach(ex0 => {
      const ex = exW(ex0, w), wk = ex0.wk[w-1];
      const auto = targetFor(Object.assign({}, ctxFor(uid), {plan}), plan, d, Object.assign({}, ex, {wk: ex.wk.map((x,k) => k === w-1 ? Object.assign({}, x, {kg:''}) : x)}), w, null);
      const kg = h('input',{class:'in',inputmode:'decimal','aria-label':`Kilos objetivo de ${ex.name}`,value:fmt(wk.kg),placeholder: auto.kg != null ? fmtN(auto.kg) : 'auto',style:'width:84px;text-align:center'});
      const rp = h('input',{class:'in','aria-label':`Repeticiones de ${ex.name}`,value:fmt(wk.r),style:'width:110px;text-align:center'});
      const ss = h('input',{class:'in',inputmode:'numeric','aria-label':`Series de ${ex.name}`,value:fmt(wk.s),style:'width:58px;text-align:center'});
      kg.addEventListener('input', () => { wk.kg = kg.value.trim(); });
      rp.addEventListener('input', () => { wk.r = rp.value.trim(); });
      ss.addEventListener('input', () => { const n = parseInt(ss.value, 10); wk.s = Number.isFinite(n) ? n : 0; });
      box.append(h('div',{class:'row wrap',style:'gap:6px'}, h('span',{class:'grow',style:'font-size:14px;font-weight:600;min-width:140px'}, ex.name), ss, h('span',{class:'muted'},'×'), rp, kg));
    });
  });
  const save = h('button',{class:'btn full',onclick: async () => {
    save.disabled = true;
    const ok = await safe(() => S.db.doc(`clients/${uid}/plan/current`).set(Object.assign(p, {updated:new Date().toISOString()})));
    save.disabled = false; save.textContent = ok ? 'Guardado' : 'Guardar objetivos';
    if (ok) setTimeout(() => { S.tgt = null; S.route = Object.assign({}, S.route, {edit:null}); render(true); }, 700);
  }}, 'Guardar objetivos');
  box.append(save);
  return box;
}
function planTab(uid, ctx){
  const doc = ctx.doc, plan = ctx.plan, wrap = h('div',{class:'stack'});
  const lib = Object.entries(S.c.plans).sort((a,b) => String(a[1].title).localeCompare(String(b[1].title)));
  if (plan) wrap.append(h('div',{class:'card stack'},
    h('div',{class:'row between'}, h('div',null, h('p',{class:'tiny'},'Plan actual'), h('div',{class:'h2'}, plan.title)), h('span',{class:'pill'}, `${plan.weeks} sem.`)),
    h('p',{class:'small muted'}, (doc.startDate ? `Empieza el ${fmtDay(doc.startDate)} · ` : '') + plan.days.map(d => `${d.id} ${d.name}`).join(' · ')),
    h('div',{class:'row wrap'},
      h('button',{class:'btn sm',onclick: () => openEditor({src:'client', uid}, plan)}, 'Editar su plan'),
      h('button',{class:'btn sm line',onclick: () => go({v:'preview', uid})}, icon('eye',16), 'Ver como cliente'))));
  // asignar
  const sel = h('select',{class:'sel','aria-label':'Planificación'}, h('option',{value:''}, lib.length ? 'Elegir planificación' : 'Crea antes un plan en Planes'), ...lib.map(([id,p]) => h('option',{value:id}, `${p.title} · ${p.weeks} semanas`)));
  const date = h('input',{class:'in',type:'date','aria-label':'Fecha de inicio',value: nextMonday()});
  const go2 = h('button',{class:'btn full'}, plan ? 'Sustituir plan' : 'Asignar plan');
  go2.addEventListener('click', async () => {
    if (!sel.value){ sel.focus(); return; }
    if (plan && go2.dataset.armed !== '1'){ go2.dataset.armed = '1'; go2.textContent = 'Pulsa otra vez para sustituir'; return; }
    go2.disabled = true;
    const t = clone(S.c.plans[sel.value]); t.assignedAt = new Date().toISOString(); t.templateId = sel.value; t.pid = 'p' + newId();
    const ok = await safe(async () => {
      await S.db.doc(`clients/${uid}/plan/current`).set(t);
      await S.db.doc('clients/' + uid).update({planTitle:t.title, weeks:t.weeks, startDate:date.value || nextMonday(), dayIds:t.days.map(d => d.id)});
    });
    go2.disabled = false;
    if (ok){ S.viewWeek = null; go({v:'client', uid, tab:'semana'}); }
  });
  wrap.append(h('div',{class:'card stack'}, h('div',{class:'h2'}, plan ? 'Cambiar de plan' : 'Asignar plan'),
    h('p',{class:'small muted'},'Se hace una copia del plan para este cliente: lo que cambies en su ficha no toca la plantilla.'),
    h('label',{class:'lbl'},'Planificación', sel), h('label',{class:'lbl'},'Fecha de inicio (lunes)', date), go2));
  if (doc.startDate && plan){
    const d2 = h('input',{class:'in',type:'date','aria-label':'Cambiar fecha de inicio',value:doc.startDate});
    wrap.append(h('div',{class:'card stack'}, h('div',{class:'h3'},'Fecha de inicio'), h('div',{class:'row'}, d2, h('button',{class:'btn sm',onclick: () => safe(() => S.db.doc('clients/' + uid).update({startDate:d2.value}))}, 'Guardar'))));
  }
  // ficha
  const lab = h('input',{class:'in','aria-label':'Nombre para mostrar',value: doc.label || '',placeholder: S.names[uid] || 'Nombre'});
  const hip = h('input',{type:'checkbox',id:'hip-' + uid,checked: !!doc.hip,style:'width:22px;height:22px'});
  hip.addEventListener('change', () => safe(() => S.db.doc('clients/' + uid).update({hip: hip.checked})));
  wrap.append(h('div',{class:'card stack'}, h('div',{class:'h3'},'Ficha'),
    h('label',{class:'lbl'},'Nombre que ves tú', h('div',{class:'row'}, lab, h('button',{class:'btn sm',onclick: () => safe(() => S.db.doc('clients/' + uid).update({label: lab.value.trim()}))}, 'Guardar'))),
    h('label',{class:'row',for:'hip-' + uid,style:'gap:10px;font-weight:600'}, hip, 'Mostrar avisos de cadera en sus ejercicios'),
    doc.joinedAt ? h('p',{class:'small muted'}, `Alta: ${fmtDay(doc.joinedAt.slice(0,10))}`) : null,
    doc.demo ? delBtn('Borrar cliente de prueba', () => safe(() => S.db.doc('clients/' + uid).delete()).then(() => go({v:'clients'}))) : null));
  wrap.append(passwordCard(uid, doc));
  return wrap;
}
function delBtn(label, fn){
  const b = h('button',{class:'btn danger sm'}, label);
  b.addEventListener('click', () => { if (b.dataset.armed !== '1'){ b.dataset.armed = '1'; b.textContent = 'Pulsa otra vez para confirmar'; return; } b.disabled = true; fn(); });
  return b;
}

/* ---- planes (plantillas) ---- */
function blankPlan(weeks, ndays){
  const ids = 'ABCDEF'.slice(0, ndays).split('');
  return {title:'Nuevo plan', desc:'', weeks, weekInfo:Array.from({length:weeks}, () => ({phase:'', rir:'2', note:''})),
    days: ids.map(id => ({id, name:'Sesión ' + id, dur:'~70 min', warm:[], notes:Array(weeks).fill(''), ex:[]}))};
}
function plansView(){
  const wrap = h('div',{class:'stack'});
  wrap.append(h('div',{class:'row between'}, h('div',null, h('p',{class:'tiny'},'Plantillas'), h('h1',{class:'title'},'Planes')),
    h('button',{class:'btn sm',onclick: newPlanSheet}, icon('plus',18), 'Nuevo')));
  if (!S.c.plansLoaded){ wrap.append(h('p',{class:'muted'},'Cargando…')); return wrap; }
  const lib = Object.entries(S.c.plans).sort((a,b) => String(a[1].title).localeCompare(String(b[1].title)));
  if (!lib.length) wrap.append(h('div',{class:'card empty'}, h('div',{class:'big'},'Sin planes'), h('p',{class:'muted'},'Crea tu primera planificación de 8 o 10 semanas. Luego la asignas a cada cliente desde su ficha.'), h('button',{class:'btn',onclick:newPlanSheet},'Crear plan')));
  lib.forEach(([id, p]) => {
    const tot = p.days.reduce((a,d) => a + d.ex.length, 0);
    const used = Object.values(S.c.clients).filter(c => c.planTitle === p.title).length;
    wrap.append(h('div',{class:'card stack',style:'gap:8px'},
      h('div',{class:'row between',style:'align-items:flex-start'}, h('div',{class:'grow'}, h('div',{class:'h2'}, p.title), p.desc ? h('p',{class:'small muted',style:'margin-top:4px'}, p.desc) : null), h('span',{class:'pill acc'}, `${p.weeks} sem.`)),
      h('div',{class:'row wrap',style:'gap:6px'}, ...p.days.map(d => h('span',{class:'chip'}, `${d.id} · ${d.name}`))),
      h('p',{class:'small muted'}, `${p.days.length} días · ${tot} ejercicios` + (used ? ` · asignado a ${used}` : '')),
      h('div',{class:'row wrap'},
        h('button',{class:'btn sm',onclick: () => openEditor({src:'library', id}, p)}, 'Editar'),
        h('button',{class:'btn sm ghost',onclick: () => { const c = clone(p); c.title = p.title + ' (copia)'; openEditor({src:'library', id:'p' + newId()}, c, true); }}, icon('copy',16), 'Duplicar'),
        delBtn('Eliminar', () => safe(() => S.db.doc('library/' + id).delete())))));
  });
  return wrap;
}
function newPlanSheet(){
  let weeks = 8, nd = 4;
  const wb = h('div',{class:'seg-ctl'}), db2 = h('div',{class:'seg-ctl'});
  const other = h('input',{class:'in',inputmode:'numeric','aria-label':'Otro número de semanas',placeholder:'Otro',style:'width:90px;min-height:40px'});
  const paintW = () => [...wb.children].forEach(b => b.classList.toggle('on', Number(b.dataset.v) === weeks));
  [8,10].forEach(v => wb.append(h('button',{'data-v':String(v),onclick: () => { weeks = v; other.value = ''; paintW(); }}, `${v} semanas`)));
  other.addEventListener('input', () => { const n = parseInt(other.value, 10); if (n >= 1 && n <= 20){ weeks = n; paintW(); } });
  [2,3,4,5].forEach(v => db2.append(h('button',{'data-v':String(v),class: v === nd ? 'on' : '',onclick: (e) => { nd = v; [...db2.children].forEach(b => b.classList.toggle('on', b === e.currentTarget)); }}, `${v} días`)));
  paintW();
  openSheet(h('div',{class:'stack'}, h('h2',{class:'h2'},'Nuevo plan'),
    h('span',{class:'lbl'},'Duración'), h('div',{class:'row'}, h('div',{class:'grow'}, wb), other),
    h('span',{class:'lbl'},'Días por semana'), db2,
    h('button',{class:'btn full',onclick: () => { closeSheet(); openEditor({src:'library', id:'p' + newId()}, blankPlan(weeks, nd), true); }}, 'Crear y editar'),
    h('button',{class:'btn ghost full',onclick:closeSheet},'Cancelar')));
}

/* ---- editor de planes ---- */
function openEditor(target, plan, isNew){
  S.ed = {target, plan: clone(plan), day: 0, open: {}, isNew: !!isNew, saved: !isNew ? true : false, back: S.route};
  go({v:'editor'});
}
function edDirty(){ if (S.ed){ S.ed.saved = false; const b = document.getElementById('edsave'); if (b){ b.textContent = 'Guardar'; b.disabled = false; } } }
function resizeWeeks(p, n){
  const fix = (arr, mk) => { const out = arr.slice(0, n); while (out.length < n) out.push(mk(out[out.length-1])); return out; };
  p.weekInfo = fix(p.weekInfo || [], (l) => l ? clone(l) : {phase:'', rir:'2', note:''});
  p.days.forEach(d => { d.notes = fix(d.notes || [], () => ''); d.ex.forEach(ex => { ex.wk = fix(ex.wk || [], (l) => l ? Object.assign(clone(l), {n:''}) : {s:3, r:'10', kg:'', n:''}); }); });
  p.weeks = n;
}
function editorView(){
  const ed = S.ed; if (!ed) return plansView();
  const p = ed.plan, wrap = h('div',{class:'stack'});
  const leave = () => { S.ed = null; go(ed.back && ed.back.v !== 'editor' ? ed.back : {v:'plans'}); };
  const save = h('button',{class:'btn sm',id:'edsave',disabled: ed.saved || null}, ed.saved ? 'Guardado' : 'Guardar');
  save.addEventListener('click', async () => {
    save.disabled = true; save.textContent = 'Guardando…';
    p.updated = new Date().toISOString();
    const path = ed.target.src === 'library' ? 'library/' + ed.target.id : `clients/${ed.target.uid}/plan/current`;
    const ok = await safe(async () => {
      await S.db.doc(path).set(clone(p));
      if (ed.target.src === 'client') await S.db.doc('clients/' + ed.target.uid).update({planTitle:p.title, weeks:p.weeks, dayIds:p.days.map(d => d.id)});
    });
    ed.saved = ok; save.textContent = ok ? 'Guardado' : 'Guardar'; save.disabled = ok;
  });
  wrap.append(h('div',{class:'row between',style:'position:sticky;top:env(safe-area-inset-top,0px);background:var(--bg);z-index:5;padding:6px 0'},
    h('button',{class:'back',onclick: () => { if (!ed.saved && save.dataset.warn !== '1'){ save.dataset.warn = '1'; const n = document.getElementById('edwarn'); if (n) n.hidden = false; return; } leave(); }}, icon('back',20), 'Salir'),
    h('span',{class:'small muted',style:'font-weight:700'}, ed.target.src === 'client' ? 'Plan de ' + clientName(ed.target.uid) : 'Plantilla'),
    save));
  wrap.append(h('div',{class:'warn',id:'edwarn',hidden:true}, icon('warn',18), h('span',null,'Hay cambios sin guardar. Pulsa Guardar o vuelve a pulsar Salir para descartarlos.')));
  if (ed.target.src === 'client') wrap.append(h('div',{class:'note'},'Estás editando la copia de este cliente. La plantilla no cambia.'));
  // datos generales
  const tIn = h('input',{class:'in','aria-label':'Nombre del plan',value:p.title,style:'font-weight:800;font-size:17px'});
  tIn.addEventListener('input', () => { p.title = tIn.value; edDirty(); });
  const dIn = h('input',{class:'in','aria-label':'Descripción',value:p.desc || '',placeholder:'Fechas, objetivo del bloque…'});
  dIn.addEventListener('input', () => { p.desc = dIn.value; edDirty(); });
  const wSel = h('select',{class:'sel','aria-label':'Semanas'}, ...Array.from({length:20},(_,i) => h('option',{value:String(i+1),selected: i+1 === p.weeks}, `${i+1} semanas`)));
  wSel.addEventListener('change', () => { resizeWeeks(p, Number(wSel.value)); edDirty(); render(true); });
  wrap.append(h('div',{class:'card stack'}, h('label',{class:'lbl'},'Nombre', tIn), h('label',{class:'lbl'},'Descripción', dIn), h('label',{class:'lbl'},'Duración', wSel)));
  // semanas
  const wkBox = h('details',{class:'card'}, h('summary',{style:'cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center'}, h('span',{class:'h2'},'Semanas: fase, RIR y nota'), h('span',{class:'small muted',style:'font-weight:700'},'Abrir')));
  const wkList = h('div',{class:'stack',style:'margin-top:10px;gap:8px'});
  p.weekInfo.forEach((wi, i) => {
    const ph = h('input',{class:'in','aria-label':`Fase de la semana ${i+1}`,value:wi.phase || '',placeholder:'Fase'});
    const rr = h('input',{class:'in','aria-label':`RIR de la semana ${i+1}`,value:wi.rir || '',placeholder:'RIR',style:'width:70px;text-align:center'});
    const nt = h('input',{class:'in','aria-label':`Nota de la semana ${i+1}`,value:wi.note || '',placeholder:'Mensaje para el cliente esta semana'});
    ph.addEventListener('input', () => { wi.phase = ph.value; edDirty(); }); rr.addEventListener('input', () => { wi.rir = rr.value; edDirty(); }); nt.addEventListener('input', () => { wi.note = nt.value; edDirty(); });
    wkList.append(h('div',{class:'stack',style:'gap:6px;padding-bottom:8px;border-bottom:1px solid var(--line)'}, h('div',{class:'row'}, h('b',{style:'width:46px'}, 'S' + (i+1)), ph, rr), nt));
  });
  wkBox.append(wkList); wrap.append(wkBox);
  // días
  const di = Math.min(ed.day, p.days.length - 1);
  wrap.append(h('div',{class:'daytabs',role:'tablist'}, ...p.days.map((d,i) => h('button',{class: i === di ? 'on' : '',role:'tab','aria-selected':String(i === di),onclick: () => { ed.day = i; render(true); }}, d.id)),
    p.days.length < 6 ? h('button',{'aria-label':'Añadir día',onclick: () => { const used = p.days.map(d => d.id); const id = 'ABCDEF'.split('').find(x => !used.includes(x)); p.days.push({id, name:'Sesión ' + id, dur:'~70 min', warm:[], notes:Array(p.weeks).fill(''), ex:[]}); ed.day = p.days.length - 1; edDirty(); render(true); }}, '+ Día') : null));
  if (p.days[di]) wrap.append(dayEditor(p, p.days[di], di));
  return wrap;
}
function dayEditor(p, d, di){
  const ed = S.ed, wrap = h('div',{class:'stack'});
  const nm = h('input',{class:'in','aria-label':'Nombre del día',value:d.name});
  nm.addEventListener('input', () => { d.name = nm.value; edDirty(); });
  const du = h('input',{class:'in','aria-label':'Duración aproximada',value:d.dur || '',style:'width:110px'});
  du.addEventListener('input', () => { d.dur = du.value; edDirty(); });
  const tot = d.ex.reduce((a,e) => a + ((e.wk[0] || {}).s || 0), 0);
  wrap.append(h('div',{class:'card stack'},
    h('div',{class:'row between'}, h('span',{class:'h2'}, `Día ${d.id}`), h('span',{class:'small muted'}, `${d.ex.length} ejercicios · ${tot} series (sem. 1)`)),
    h('div',{class:'row'}, h('label',{class:'lbl grow'},'Nombre', nm), h('label',{class:'lbl'},'Duración', du)),
    p.days.length > 1 ? delBtn('Eliminar este día', () => { p.days.splice(di, 1); ed.day = 0; edDirty(); render(true); }) : null));
  // calentamiento
  const warm = h('div',{class:'card stack',style:'gap:8px'}, h('div',{class:'row between'}, h('span',{class:'h3'},'Calentamiento'), h('span',{class:'small muted'},'2 vueltas')));
  d.warm.forEach((it, i) => {
    const a = h('input',{class:'in','aria-label':`Ejercicio de calentamiento ${i+1}`,value:it.n,placeholder:'Movilidad · Rotación torácica'});
    const b = h('input',{class:'in','aria-label':`Dosis del calentamiento ${i+1}`,value:it.d,placeholder:'8 por lado',style:'width:120px'});
    a.addEventListener('input', () => { it.n = a.value; edDirty(); }); b.addEventListener('input', () => { it.d = b.value; edDirty(); });
    a.style.flex = '1 1 100%'; b.style.flex = '1 1 auto'; b.style.width = 'auto';
    warm.append(h('div',{class:'row wrap warmrow',style:'gap:6px;padding-bottom:6px;border-bottom:1px solid var(--line)'}, a, b, h('button',{class:'icon-btn','aria-label':'Quitar',onclick: () => { d.warm.splice(i,1); edDirty(); render(true); }}, icon('trash',18))));
  });
  warm.append(h('button',{class:'add',onclick: () => { d.warm.push({n:'', d:''}); edDirty(); render(true); }}, '+ Añadir ejercicio de calentamiento'));
  wrap.append(warm);
  // ejercicios
  d.ex.forEach((ex, i) => wrap.append(exEditor(p, d, ex, i)));
  wrap.append(h('div',{class:'row'},
    h('button',{class:'btn grow',onclick: () => { const id = d.id + newId().slice(-4); d.ex.push({id, name:'', uni:false, tempo:'', rest:'90 s', cue:'', why:'', warn:'', hip:'', wk:Array.from({length:p.weeks}, () => ({s:3, r:'10', kg:'', n:''}))}); ed.open[id] = true; edDirty(); render(true); }}, icon('plus',18), 'Añadir ejercicio'),
    h('button',{class:'btn ghost',onclick: () => pasteSheet(p, d)}, 'Pegar desde Excel')));
  return wrap;
}
function exEditor(p, d, ex, i){
  const ed = S.ed, open = !!ed.open[ex.id];
  const wk0 = ex.wk[0] || {s:0, r:''};
  const card = h('div',{class:'card stack',style:'gap:10px'});
  const move = (dir) => { const j = i + dir; if (j < 0 || j >= d.ex.length) return; [d.ex[i], d.ex[j]] = [d.ex[j], d.ex[i]]; edDirty(); render(true); };
  card.append(h('div',{class:'row'},
    h('button',{class:'exsum grow','aria-expanded':String(open),onclick: () => { ed.open[ex.id] = !open; render(true); }},
      h('span',{class:'sum-n'}, i+1), h('span',{class:'grow',style:'overflow-wrap:anywhere'}, h('b',{style:'display:block'}, ex.name || 'Ejercicio sin nombre'), h('span',{class:'small muted'}, [`${wk0.s} × ${wk0.r}`, ex.rest, ex.wk.some(x => x.v) ? 'con variante' : ''].filter(Boolean).join(' · ')))),
    h('button',{class:'icon-btn','aria-label':'Subir',disabled: i === 0 || null,onclick: () => move(-1)}, icon('up',18)),
    h('button',{class:'icon-btn','aria-label':'Bajar',disabled: i === d.ex.length - 1 || null,onclick: () => move(1)}, icon('down',18))));
  if (!open) return card;
  const f = (label, key, ph, ta) => {
    const el = ta ? h('textarea',{class:'ta','aria-label':label,placeholder:ph || '',style:'min-height:58px'}) : h('input',{class:'in','aria-label':label,value:ex[key] || '',placeholder:ph || ''});
    if (ta) el.value = ex[key] || '';
    el.addEventListener('input', () => { ex[key] = el.value; edDirty(); });
    return h('label',{class:'lbl'}, label, el);
  };
  const uni = h('input',{type:'checkbox',id:'uni-' + ex.id,checked: !!ex.uni,style:'width:20px;height:20px'});
  uni.addEventListener('change', () => { ex.uni = uni.checked; edDirty(); });
  card.append(f('Nombre del ejercicio','name','Press banca'),
    h('div',{class:'edrow'}, f('Tempo','tempo','Bajada de 2 s'), f('Descanso','rest','2 min')),
    f('Foco técnico','cue','Lo que debe tener en cuenta en cada repetición', true),
    f('Para qué sirve','why','Qué músculo o capacidad trabaja'),
    f('Aviso de seguridad','warn','Cuándo parar'),
    f('Aviso de cadera (solo se muestra si lo activas en la ficha del cliente)','hip',''),
    h('label',{class:'row',for:'uni-' + ex.id,style:'gap:10px;font-weight:600'}, uni, 'Unilateral: anota cada lado por separado'));
  // series x reps rápidas
  const qs = h('input',{class:'in',inputmode:'numeric','aria-label':'Series para todas las semanas',value:fmt(wk0.s),style:'width:64px;text-align:center'});
  const qr = h('input',{class:'in','aria-label':'Repeticiones para todas las semanas',value:fmt(wk0.r),style:'width:120px;text-align:center'});
  card.append(h('div',{class:'stack',style:'gap:6px'}, h('span',{class:'lbl'},'Series × repeticiones'),
    h('div',{class:'row wrap',style:'gap:6px'}, qs, h('span',{class:'muted'},'×'), qr,
      h('button',{class:'btn sm ghost',onclick: () => { const s = parseInt(qs.value,10); ex.wk.forEach(w => { if (Number.isFinite(s)) w.s = s; if (qr.value.trim()) w.r = qr.value.trim(); }); edDirty(); render(true); }}, 'Aplicar a todas las semanas'))));
  // progresión
  const grid = h('div',{class:'grid-ed'}, ...['Sem','Series','Reps','Kg','Variante (otro ejercicio)','Nota de la semana'].map(t => h('span',{class:'tiny'}, t)));
  ex.wk.forEach((w, k) => {
    const s = h('input',{class:'in',inputmode:'numeric','aria-label':`Series semana ${k+1}`,value:fmt(w.s),style:'text-align:center'});
    const r = h('input',{class:'in','aria-label':`Reps semana ${k+1}`,value:fmt(w.r)});
    const kg = h('input',{class:'in',inputmode:'decimal','aria-label':`Kilos semana ${k+1}`,value:fmt(w.kg),placeholder:'—',style:'text-align:center'});
    const n = h('input',{class:'in','aria-label':`Nota semana ${k+1}`,value:fmt(w.n),placeholder:'Drop set, parciales…'});
    s.addEventListener('input', () => { const v = parseInt(s.value,10); w.s = Number.isFinite(v) ? v : 0; edDirty(); });
    r.addEventListener('input', () => { w.r = r.value; edDirty(); }); kg.addEventListener('input', () => { w.kg = kg.value.trim(); edDirty(); }); n.addEventListener('input', () => { w.n = n.value; edDirty(); });
    const vv = h('input',{class:'in','aria-label':`Variante semana ${k+1}`,value:fmt(w.v),placeholder:'Igual'});
    vv.addEventListener('input', () => { const t = vv.value.trim(); if (t){ if (t !== w.v){ w.v = t; w.vc = ''; w.vh = ''; } } else { delete w.v; delete w.vc; delete w.vh; } edDirty(); });
    grid.append(h('b',{style:'text-align:center'}, 'S' + (k+1)), s, r, kg, vv, n);
  });
  card.append(h('span',{class:'lbl'},'Progresión por semana'), h('div',{class:'tblwrap'}, grid));
  card.append(h('div',{class:'row wrap'},
    h('button',{class:'btn sm ghost',onclick: () => { const c = clone(ex); c.id = d.id + newId().slice(-4); d.ex.splice(i+1, 0, c); ed.open[c.id] = true; edDirty(); render(true); }}, icon('copy',16), 'Duplicar'),
    delBtn('Quitar ejercicio', () => { d.ex.splice(i,1); edDirty(); render(true); })));
  return card;
}
function pasteSheet(p, d){
  const ta = h('textarea',{class:'ta','aria-label':'Filas pegadas',placeholder:'Press banca\t4\t6\t2-3 min\tEscápulas juntas…\nRemo con pecho apoyado\t4\t8\t2 min',style:'min-height:150px;font-family:ui-monospace,monospace;font-size:13px'});
  openSheet(h('div',{class:'stack'}, h('h2',{class:'h2'},'Pegar desde Excel'),
    h('p',{class:'small muted'},'Copia en Excel o Sheets una fila por ejercicio con estas columnas, en este orden: Ejercicio · Series · Reps · Descanso · Foco técnico. Las columnas que no tengas puedes dejarlas vacías.'),
    ta,
    h('button',{class:'btn full',onclick: () => {
      const rows = ta.value.split(/\r?\n/).map(l => l.split(/\t|;/).map(x => x.trim())).filter(r => r[0]);
      rows.forEach(r => { const s = parseInt(r[1],10); d.ex.push({id:d.id + newId().slice(-4), name:r[0], uni:/por (lado|pierna|brazo)/i.test(r[2] || ''), tempo:'', rest:r[3] || '', cue:r[4] || '', why:'', warn:'', hip:'', wk:Array.from({length:p.weeks}, () => ({s: Number.isFinite(s) ? s : 3, r:r[2] || '10', kg:'', n:''}))}); });
      closeSheet(); edDirty(); render(true);
    }}, 'Añadir ejercicios'),
    h('button',{class:'btn ghost full',onclick:closeSheet},'Cancelar')));
}

window.addEventListener('beforeunload', () => { flushAll(); });
