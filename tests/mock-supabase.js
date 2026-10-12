// Faux client Supabase pour les tests du navigateur (remplace vendor/supabase.min.js).
var supabase = (function () {
  const K = '__mockdb';
  const load = () => JSON.parse(localStorage.getItem(K) || 'null') || { progress: {}, league: {}, push: {}, members: [] };
  const save = db => localStorage.setItem(K, JSON.stringify(db));
  const users = { 'antoine@exemple.fr': 'u-antoine', 'jules@exemple.fr': 'u-jules', 'intrus@exemple.fr': 'u-intrus' };
  function createClient() {
    const listeners = [];
    const sess = () => JSON.parse(localStorage.getItem('__mocksession') || 'null');
    const emit = (ev, s) => listeners.forEach(cb => setTimeout(() => cb(ev, s), 0));
    const email = () => (sess() || {}).user ? sess().user.email : '';
    const uid = () => (sess() || {}).user ? sess().user.id : null;
    const isMember = () => load().members.some(m => m.email === email());
    const isAdmin = () => load().members.some(m => m.email === email() && m.role === 'admin');
    const ok = data => Promise.resolve({ data, error: null });
    const err = (code, message) => Promise.resolve({ data: null, error: { code, message } });
    const auth = {
      getSession: async () => ({ data: { session: sess() }, error: null }),
      onAuthStateChange: cb => { listeners.push(cb); setTimeout(() => cb('INITIAL_SESSION', sess()), 0); return { data: { subscription: { unsubscribe() {} } } }; },
      signInWithOtp: async ({ email }) => { window.__otpSent = email; return users[email] ? { data: {}, error: null } : { data: null, error: { message: 'Email address not authorized', status: 400 } }; },
      verifyOtp: async ({ email, token }) => {
        if (token !== '123456') return { data: {}, error: { message: 'Token has expired or is invalid' } };
        const s = { access_token: 'tok-' + users[email], user: { id: users[email], email } };
        localStorage.setItem('__mocksession', JSON.stringify(s)); emit('SIGNED_IN', s);
        return { data: { session: s, user: s.user }, error: null };
      },
      signOut: async () => { localStorage.removeItem('__mocksession'); emit('SIGNED_OUT', null); return { error: null }; }
    };
    function rpc(name, args) {
      const db = load();
      if (name === 'mon_profil') return ok(db.members.filter(m => m.email === email()).map(m => ({ email: m.email, display_name: m.display_name, role: m.role })));
      if (name === 'claim_first_admin') { if (!db.members.length) { db.members.push({ email: email(), display_name: email().split('@')[0], role: 'admin', added_at: new Date().toISOString() }); save(db); } return ok(isMember()); }
      if (name === 'list_members') return isAdmin() ? ok(db.members) : err('42501', 'not_admin');
      if (name === 'add_member') { if (!isAdmin()) return err('42501', 'not_admin'); db.members.push({ email: args.p_email, display_name: args.p_name, role: 'member', added_at: new Date().toISOString() }); save(db); return ok(null); }
      if (name === 'remove_member') { if (!isAdmin()) return err('42501', 'not_admin'); db.members = db.members.filter(m => m.email !== args.p_email); save(db); return ok(null); }
      if (name === 'set_display_name') { db.members.forEach(m => { if (m.email === email()) m.display_name = args.p_name; }); if (db.league[uid()]) db.league[uid()].name = args.p_name; save(db); return ok(null); }
      return err('PGRST202', 'unknown rpc ' + name);
    }
    function from(table) {
      const q = { filters: [], op: 'select', payload: null, single: false };
      const run = () => {
        const db = load();
        if (!isMember()) return { data: null, error: { code: '42501', message: 'RLS' } };
        const key = table === 'push_subscriptions' ? 'push' : table;
        const rows = Object.values(db[key]);
        const match = r => q.filters.every(([c, v]) => r[c] === v);
        if (q.op === 'select') { let out = rows.filter(match); if (table === 'progress') out = out.filter(r => r.user_id === uid()); return { data: q.single ? (out[0] || null) : out, error: null }; }
        if (q.op === 'upsert') { const p = q.payload; if (p.user_id !== uid()) return { data: null, error: { code: '42501', message: 'RLS' } }; const id = table === 'push_subscriptions' ? p.endpoint : p.user_id; db[key][id] = Object.assign({}, db[key][id] || {}, p); save(db); return { data: null, error: null }; }
        if (q.op === 'update') { rows.filter(match).forEach(r => Object.assign(r, q.payload)); save(db); return { data: null, error: null }; }
        if (q.op === 'delete') { Object.keys(db[key]).forEach(k => { if (match(db[key][k])) delete db[key][k]; }); save(db); return { data: null, error: null }; }
      };
      const b = {
        select() { q.op = 'select'; return b; }, upsert(p) { q.op = 'upsert'; q.payload = p; return b; },
        update(p) { q.op = 'update'; q.payload = p; return b; }, delete() { q.op = 'delete'; return b; },
        eq(c, v) { q.filters.push([c, v]); return b; }, maybeSingle() { q.single = true; return b; },
        then(res, rej) { return Promise.resolve(run()).then(res, rej); }
      };
      return b;
    }
    return { auth, rpc, from };
  }
  return { createClient };
})();
