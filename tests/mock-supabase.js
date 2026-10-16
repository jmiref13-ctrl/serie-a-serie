/* Supabase simulado para las pruebas (sustituye a vendor/supabase.js).
   Guarda los datos en localStorage y reproduce los permisos de la migración. */
(function(){
  const USERS = [
    { id: '11111111-1111-4111-8111-111111111111', email: 'javi@test.es', name: 'Javi', coach: true },
    { id: '22222222-2222-4222-8222-222222222222', email: 'pepe@test.es', name: '' },
    { id: '33333333-3333-4333-8333-333333333333', email: 'raul@test.es', name: 'Raúl' },
  ];
  const LS = window.localStorage;
  const load = (k, d) => { try { return JSON.parse(LS.getItem(k)) || d; } catch(e){ return d; } };
  const save = (k, v) => LS.setItem(k, JSON.stringify(v));
  if (!LS.getItem('mock_docs')) save('mock_docs', window.__mockSeed || {});
  if (!LS.getItem('mock_profiles')) save('mock_profiles', Object.fromEntries(USERS.map(u => [u.id, { id: u.id, name: u.name, email: u.email }])));
  const parentOf = p => p.includes('/') ? p.replace(/\/[^/]+$/, '') : '';
  const ownerOf = p => { const m = /^clients\/([0-9a-f-]{36})(\/|$)/.exec(p); return m ? m[1] : null; };
  const me = () => load('mock_session', null);
  const isCoach = () => { const s = me(); return !!(s && USERS.find(u => u.id === s.user.id && u.coach)); };
  const canRead = p => isCoach() || (me() && ownerOf(p) === me().user.id);
  const denied = () => ({ data: null, error: { code: '42501', message: 'new row violates row-level security policy' } });
  const rtSubs = [];
  window.__mockWrites = 0;
  function broadcast(ev){ setTimeout(() => rtSubs.forEach(cb => { const p = (ev.new || ev.old).path; if (ev.eventType === 'DELETE' || canRead(p)) cb(ev); }), 40); }

  function exec(st){
    const s = me(); if (!s) return denied();
    if (st.table === 'docs'){
      const docs = load('mock_docs', {});
      if (st.op === 'select'){
        let rows = Object.keys(docs).filter(canRead).map(p => ({ path: p, parent: parentOf(p), owner: ownerOf(p), data: docs[p] }));
        st.filters.forEach(f => { rows = rows.filter(f); });
        rows.sort((a, b) => a.path.localeCompare(b.path));
        if (st.range) rows = rows.slice(st.range[0], st.range[1] + 1);
        return { data: st.single ? (rows[0] ? { path: rows[0].path, data: rows[0].data } : null) : rows.map(r => ({ path: r.path, data: r.data })), error: null };
      }
      if (st.op === 'upsert'){
        const p = st.payload.path; if (!canRead(p)) return denied();
        docs[p] = st.payload.data; save('mock_docs', docs); window.__mockWrites++;
        broadcast({ eventType: 'UPDATE', new: { path: p, parent: parentOf(p), data: docs[p] } }); return { data: null, error: null };
      }
      if (st.op === 'delete'){
        if (!isCoach()) return { data: null, error: null };
        Object.keys(docs).filter(p => st.filters.every(f => f({ path: p }))).forEach(p => { delete docs[p]; broadcast({ eventType: 'DELETE', old: { path: p } }); });
        save('mock_docs', docs); return { data: null, error: null };
      }
    }
    if (st.table === 'profiles'){
      const pr = load('mock_profiles', {});
      if (st.op === 'select'){
        let rows = Object.values(pr).filter(r => isCoach() || r.id === s.user.id);
        st.filters.forEach(f => { rows = rows.filter(f); });
        return { data: st.single ? (rows[0] || null) : rows, error: null };
      }
      if (st.op === 'update'){
        Object.values(pr).filter(r => r.id === s.user.id && st.filters.every(f => f(r))).forEach(r => Object.assign(r, st.payload));
        save('mock_profiles', pr); return { data: null, error: null };
      }
    }
    return { data: null, error: { message: 'mock: no soportado ' + st.table + ' ' + st.op } };
  }
  function from(table){
    const st = { table, op: 'select', filters: [], range: null, single: false, payload: null };
    const b = {
      select(){ return b; }, order(){ return b; },
      eq(c, v){ st.filters.push(r => r[c] === v); return b; },
      in(c, vs){ st.filters.push(r => vs.includes(r[c])); return b; },
      range(a, z){ st.range = [a, z]; return b; },
      maybeSingle(){ st.single = true; return b; },
      upsert(o){ st.op = 'upsert'; st.payload = o; return b; },
      update(o){ st.op = 'update'; st.payload = o; return b; },
      delete(){ st.op = 'delete'; return b; },
      then(res, rej){ return new Promise(r => setTimeout(r, 25)).then(() => exec(st)).then(res, rej); },
    };
    return b;
  }
  async function rpc(name, args){
    await new Promise(r => setTimeout(r, 25));
    if (!me()) return denied();
    if (name === 'is_coach') return { data: isCoach(), error: null };
    if (name === 'doc_update'){
      const docs = load('mock_docs', {}); const p = args.p_path;
      if (!(p in docs) || !canRead(p)) return { data: null, error: { code: 'P0002', message: 'no existe' } };
      Object.assign(docs[p], args.p_patch); save('mock_docs', docs); window.__mockWrites++;
      broadcast({ eventType: 'UPDATE', new: { path: p, parent: parentOf(p), data: docs[p] } });
      return { data: null, error: null };
    }
    return { data: null, error: { message: 'rpc desconocida' } };
  }
  const authCbs = [];
  const auth = {
    onAuthStateChange(cb){ authCbs.push(cb); setTimeout(() => cb('INITIAL_SESSION', me()), 10); return { data: { subscription: { unsubscribe(){} } } }; },
    async signInWithPassword({ email, password }){
      const u = USERS.find(x => x.email === email);
      if (!u || password !== 'test1234') return { data: null, error: { message: 'Invalid login credentials' } };
      const s = { user: { id: u.id, email: u.email } }; save('mock_session', s);
      authCbs.forEach(cb => cb('SIGNED_IN', s)); return { data: s, error: null };
    },
    async signOut(){ LS.removeItem('mock_session'); authCbs.forEach(cb => cb('SIGNED_OUT', null)); return { error: null }; },
    async resetPasswordForEmail(){ window.__mockReset = true; return { error: null }; },
    async updateUser(){ return { data: {}, error: null }; },
  };
  function channel(){
    const ch = {
      on(_t, _f, cb){ rtSubs.push(cb); return ch; },
      subscribe(cb){ setTimeout(() => cb && cb('SUBSCRIBED'), 5); return ch; },
    };
    return ch;
  }
  window.supabase = { createClient: () => ({ from, rpc, auth, channel }) };
})();
