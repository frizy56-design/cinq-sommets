/* Cinq Sommets — couche « site web » :
   connexion par nom d'utilisateur, mot de passe et phrase de récupération (sans e-mail),
   sauvegarde et ligue dans Supabase, notifications et installation. */
(function () {
  'use strict';
  const C = window.CS_CONFIG || {};
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SCREEN = $('#login');
  const APP = $('#app');
  const BRAND = '<div class="lg-brand"><span class="lg-logo" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M2 20l5.5-9.5 3 5 4-7.5L22 20H2z"/></svg></span><span>Cinq Sommets</span></div>';
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const SITE_URL = location.origin + location.pathname.replace(/index\.html$/, '');
  const SESSION_KEY = 'cs-session';

  function screen(html) { SCREEN.innerHTML = '<div class="lg-card">' + BRAND + html + '</div>'; SCREEN.hidden = false; APP.hidden = true; window.scrollTo(0, 0); }
  function splash(label) { screen('<div class="lg-wait"><span class="spin"></span><span>' + esc(label) + '</span></div>'); }

  /* ---------- Service worker (hors ligne + notifications) ---------- */
  let swReg = null;
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').then(r => { swReg = r; }).catch(() => { /* hors service worker */ });
  }
  let installEvt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; });

  const KEY = String(C.supabaseKey || C.supabaseAnonKey || '');
  const configured = typeof C.supabaseUrl === 'string' && /^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/.test(C.supabaseUrl) && KEY && KEY.indexOf('A_REMPLIR') < 0;
  if (!configured) {
    screen('<h1>Site pas encore branché</h1><p>Il manque l\'adresse et la clé publique du projet Supabase dans <code>public/config.js</code>. Le README du dépôt explique comment les obtenir.</p>');
    return;
  }

  /* ---------- Appels à la base (fonctions public.cs_*) ---------- */
  async function rpc(fn, args) {
    const headers = { 'Content-Type': 'application/json', apikey: KEY };
    if (/^eyJ/.test(KEY)) headers.Authorization = 'Bearer ' + KEY;
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctl ? setTimeout(() => ctl.abort(), 20000) : null;
    let res;
    try {
      res = await fetch(C.supabaseUrl + '/rest/v1/rpc/' + fn, { method: 'POST', headers, body: JSON.stringify(args || {}), signal: ctl ? ctl.signal : undefined, cache: 'no-store' });
    } catch (e) {
      throw { code: 'network', message: 'Pas de connexion' };
    } finally { if (timer) clearTimeout(timer); }
    let body = null;
    try { body = await res.json(); } catch (e) { /* vide */ }
    if (!res.ok) throw { code: res.status >= 500 || res.status === 0 ? 'server' : 'http', status: res.status, message: (body && (body.message || body.hint)) || ('HTTP ' + res.status) };
    return body;
  }

  let SESSION = null;
  try { SESSION = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { SESSION = null; }
  if (SESSION && !(SESSION.token && SESSION.account && SESSION.account.id)) SESSION = null;
  function saveSession(token, account) {
    SESSION = { token, account };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(SESSION)); } catch (e) { /* stockage indisponible */ }
  }
  function clearSession() { SESSION = null; try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ok */ } }

  async function call(fn, args) {
    if (!SESSION) throw { code: 'session_expired', message: 'Session expirée' };
    const r = await rpc(fn, Object.assign({ p_token: SESSION.token }, args || {}));
    if (r && r.ok === false && r.error === 'session') { sessionExpired(); throw { code: 'session_expired', message: 'Session expirée' }; }
    return r;
  }

  /* ---------- Messages d'erreur ---------- */
  const ERR = {
    invalid: 'Nom d\'utilisateur ou mot de passe incorrect.',
    username_invalid: 'Le nom d\'utilisateur fait 3 à 24 caractères : lettres minuscules sans accent, chiffres, point, tiret ou tiret bas.',
    username_taken: 'Ce nom d\'utilisateur est déjà pris.',
    password_short: 'Le mot de passe doit faire au moins 8 caractères.',
    password_long: 'Le mot de passe est trop long (72 caractères au plus).',
    password_is_username: 'Le mot de passe ne peut pas être ton nom d\'utilisateur.',
    invite_invalid: 'Ce code d\'invitation n\'est pas valable : il est faux, déjà utilisé ou expiré.',
    name_long: 'Le prénom fait 40 caractères au plus.',
    name_empty: 'Indique un prénom.',
    not_admin: 'Réservé aux administrateurs.',
    last_admin: 'Tu es le seul administrateur : retire d\'abord les autres membres, ou invite un autre administrateur.',
    too_many_invites: 'Il y a déjà 20 invitations en attente. Annule-en avant d\'en créer d\'autres.',
    self: 'Tu ne peux pas te retirer toi-même.',
    network: 'Pas de connexion. Vérifie ton réseau et réessaie.',
    server: 'Le serveur ne répond pas pour le moment. Réessaie dans un instant.'
  };
  function errText(r, ctx) {
    const code = (r && (r.error || r.code)) || '';
    if (code === 'locked') {
      const min = Math.max(1, Math.ceil((r.retry_in || 900) / 60));
      return 'Trop d\'essais ratés : compte bloqué ' + min + ' minute' + (min > 1 ? 's' : '') + ' par sécurité.';
    }
    if (code === 'invalid' && ctx === 'recover') return 'Nom d\'utilisateur ou phrase de récupération incorrects.';
    if (code === 'invalid' && ctx === 'password') return 'Mot de passe actuel incorrect.';
    return ERR[code] || ('Erreur inattendue' + (r && r.message ? ' : ' + r.message : '.'));
  }
  const normUser = s => String(s || '').trim().toLowerCase();
  const USER_RE = /^[a-z0-9][a-z0-9._-]{2,23}$/;
  function pwProblem(p, u) {
    if (!p || p.length < 8) return 'password_short';
    if (new TextEncoder().encode(p).length > 72) return 'password_long';
    if (p.toLowerCase() === String(u || '').toLowerCase()) return 'password_is_username';
    return null;
  }

  /* ---------- Écrans de connexion ---------- */
  let started = false, view = 'login', pendingPhrase = null, pendingAccount = null, pendingToken = null, notice = '';
  const field = (id, label, attrs, hint) => '<label for="' + id + '">' + label + '</label>' + (hint ? '<p class="hint">' + hint + '</p>' : '') + '<input id="' + id + '" ' + attrs + '>';
  function errHTML(err) { return err ? '<p class="lg-err" role="alert">' + esc(err) + '</p>' : ''; }
  function renderAuth(v, err, keep) {
    view = v || view;
    keep = keep || {};
    const val = k => esc(keep[k] || '');
    if (view === 'signup') {
      screen('<h1>Créer ton compte</h1><p>L\'accès se fait sur invitation : l\'administrateur t\'a donné un code de 8 caractères.</p>' +
        '<form id="lg-signup" class="lg-form" novalidate>' +
        field('lg-invite', 'Code d\'invitation', 'name="invite" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12" placeholder="ABCD-EFGH" value="' + val('invite') + '" required') +
        field('lg-user', 'Nom d\'utilisateur', 'name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="24" placeholder="antoine" value="' + val('username') + '" required', 'Lettres minuscules, chiffres, point ou tiret. Il sert à te connecter.') +
        field('lg-name', 'Prénom affiché', 'name="name" autocomplete="given-name" maxlength="40" placeholder="Antoine" value="' + val('name') + '"') +
        field('lg-pass', 'Mot de passe', 'type="password" name="password" autocomplete="new-password" minlength="8" maxlength="72" required', '8 caractères au moins.') +
        field('lg-pass2', 'Confirme le mot de passe', 'type="password" name="password2" autocomplete="new-password" minlength="8" maxlength="72" required') +
        errHTML(err) + '<button class="btn block" type="submit">Créer mon compte</button></form>' +
        '<div class="lg-links"><button class="link small" data-lg="login">J\'ai déjà un compte</button></div>');
      return;
    }
    if (view === 'recover') {
      screen('<h1>Mot de passe oublié</h1><p>Saisis ta phrase de récupération de 12 mots, notée à la création du compte, puis choisis un nouveau mot de passe.</p>' +
        '<form id="lg-recover" class="lg-form" novalidate>' +
        field('lg-user', 'Nom d\'utilisateur', 'name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="24" value="' + val('username') + '" required') +
        '<label for="lg-phrase">Phrase de récupération</label><textarea id="lg-phrase" name="phrase" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="12 mots séparés par des espaces" required>' + val('phrase') + '</textarea>' +
        field('lg-pass', 'Nouveau mot de passe', 'type="password" name="password" autocomplete="new-password" minlength="8" maxlength="72" required') +
        field('lg-pass2', 'Confirme le mot de passe', 'type="password" name="password2" autocomplete="new-password" minlength="8" maxlength="72" required') +
        errHTML(err) + '<button class="btn block" type="submit">Changer mon mot de passe</button></form>' +
        '<p class="small muted" style="margin:0">Phrase perdue elle aussi ? Demande à l\'administrateur de retirer ton compte et de t\'envoyer une nouvelle invitation. Pense à exporter ta progression depuis ton profil quand tu y as encore accès.</p>' +
        '<div class="lg-links"><button class="link small" data-lg="login">Retour à la connexion</button></div>');
      return;
    }
    if (view === 'phrase') {
      const words = String(pendingPhrase || '').split(' ');
      screen('<h1>Ta phrase de récupération</h1><p>Sans e-mail, c\'est le seul moyen de retrouver ton compte si tu oublies ton mot de passe. Personne d\'autre ne peut le réinitialiser.</p>' +
        '<ol class="phrase" aria-label="Phrase de récupération">' + words.map(w => '<li>' + esc(w) + '</li>').join('') + '</ol>' +
        '<div class="warn">Note-la sur papier ou dans ton gestionnaire de mots de passe, dans l\'ordre. Ne la partage avec personne. Elle ne sera plus affichée.</div>' +
        '<button class="btn ghost block" data-lg="copy-phrase">Copier la phrase</button>' +
        '<form id="lg-phrase-ok" class="lg-form" novalidate><label class="lg-check"><input type="checkbox" id="lg-noted" required><span>J\'ai noté ma phrase de récupération en lieu sûr</span></label>' + errHTML(err) +
        '<button class="btn block" type="submit">Continuer</button></form>');
      return;
    }
    screen('<h1>Quelques minutes par jour pour progresser</h1><p>Vendre, écrire, comprendre les gens, marketer et faire fructifier ton argent, avec des cas tirés de ton quotidien.</p>' +
      (notice ? '<div class="warn" role="status">' + esc(notice) + '</div>' : '') +
      '<form id="lg-login" class="lg-form" novalidate>' +
      field('lg-user', 'Nom d\'utilisateur', 'name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="24" value="' + val('username') + '" required') +
      field('lg-pass', 'Mot de passe', 'type="password" name="password" autocomplete="current-password" maxlength="72" required') +
      errHTML(err) + '<button class="btn block" type="submit">Se connecter</button></form>' +
      '<div class="lg-links"><button class="link small" data-lg="signup">J\'ai un code d\'invitation</button><button class="link small" data-lg="recover">Mot de passe oublié ?</button></div>');
    notice = '';
  }
  const v = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  function busy(form, label) { const b = form.querySelector('button[type=submit]'); if (b) { b.disabled = true; b.dataset.label = b.textContent; b.textContent = label || '…'; } }

  SCREEN.addEventListener('submit', async ev => {
    ev.preventDefault();
    const f = ev.target;
    if (f.id === 'lg-login') {
      const u = normUser(v('lg-user')), p = v('lg-pass');
      if (!u || !p) { renderAuth('login', 'Indique ton nom d\'utilisateur et ton mot de passe.', { username: u }); return; }
      busy(f, 'Connexion…');
      try {
        const r = await rpc('cs_connexion', { p_username: u, p_password: p });
        if (!r || !r.ok) { renderAuth('login', errText(r), { username: u }); return; }
        loggedIn(r.token, r.account);
      } catch (e) { renderAuth('login', errText(e), { username: u }); }
    } else if (f.id === 'lg-signup') {
      const keep = { invite: v('lg-invite'), username: normUser(v('lg-user')), name: v('lg-name').trim() };
      const p = v('lg-pass');
      if (keep.invite.replace(/[^a-z0-9]/gi, '').length !== 8) { renderAuth('signup', 'Le code d\'invitation fait 8 caractères, par exemple ABCD-EFGH.', keep); return; }
      if (!USER_RE.test(keep.username)) { renderAuth('signup', ERR.username_invalid, keep); return; }
      const pb = pwProblem(p, keep.username);
      if (pb) { renderAuth('signup', ERR[pb], keep); return; }
      if (p !== v('lg-pass2')) { renderAuth('signup', 'Les deux mots de passe ne sont pas identiques.', keep); return; }
      busy(f, 'Création…');
      try {
        const r = await rpc('cs_inscription', { p_username: keep.username, p_password: p, p_display_name: keep.name, p_invite: keep.invite });
        if (!r || !r.ok) { renderAuth('signup', errText(r), keep); return; }
        pendingPhrase = r.phrase; pendingToken = r.token; pendingAccount = r.account;
        renderAuth('phrase');
      } catch (e) { renderAuth('signup', errText(e), keep); }
    } else if (f.id === 'lg-recover') {
      const keep = { username: normUser(v('lg-user')), phrase: v('lg-phrase') };
      const p = v('lg-pass');
      const phrase = keep.phrase.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]+/g, ' ').trim();
      if (!keep.username) { renderAuth('recover', 'Indique ton nom d\'utilisateur.', keep); return; }
      if (phrase.split(' ').length !== 12) { renderAuth('recover', 'La phrase compte exactement 12 mots (' + (phrase ? phrase.split(' ').length : 0) + ' saisis).', keep); return; }
      const pb = pwProblem(p, keep.username);
      if (pb) { renderAuth('recover', ERR[pb], keep); return; }
      if (p !== v('lg-pass2')) { renderAuth('recover', 'Les deux mots de passe ne sont pas identiques.', keep); return; }
      busy(f, 'Vérification…');
      try {
        const r = await rpc('cs_recuperation', { p_username: keep.username, p_phrase: phrase, p_new_password: p });
        if (!r || !r.ok) { renderAuth('recover', errText(r, 'recover'), keep); return; }
        pendingPhrase = r.phrase; pendingToken = r.token; pendingAccount = r.account;
        renderAuth('phrase');
      } catch (e) { renderAuth('recover', errText(e), keep); }
    } else if (f.id === 'lg-phrase-ok') {
      if (!$('#lg-noted').checked) { renderAuth('phrase', 'Coche la case une fois ta phrase notée : elle ne sera plus affichée.'); return; }
      const t = pendingToken, a = pendingAccount;
      pendingPhrase = null; pendingToken = null; pendingAccount = null;
      loggedIn(t, a);
    }
  });
  SCREEN.addEventListener('click', ev => {
    const t = ev.target.closest('[data-lg]'); if (!t) return;
    const a = t.dataset.lg;
    if (a === 'login' || a === 'signup' || a === 'recover') renderAuth(a, '', { username: normUser(v('lg-user')) });
    else if (a === 'copy-phrase') copy(pendingPhrase || '', () => { t.textContent = 'Phrase copiée'; });
  });
  function copy(text, ok) {
    try { navigator.clipboard.writeText(text).then(ok, () => {}); } catch (e) { /* ok */ }
  }
  function loggedIn(token, account) {
    saveSession(token, account);
    if (started) { location.reload(); return; }
    start(account, false);
  }
  function sessionExpired() {
    clearSession();
    notice = 'Ta session a expiré ou a été fermée depuis un autre appareil. Reconnecte-toi : ta progression est enregistrée.';
    renderAuth('login');
  }

  /* ---------- Pont entre le jeu et la base ---------- */
  function parseLoose(text) {
    const t = String(text || '').trim();
    try { return JSON.parse(t); } catch (e) { /* suite */ }
    const i = t.search(/[[{]/), j = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
    if (i >= 0 && j > i) { try { return JSON.parse(t.slice(i, j + 1)); } catch (e) { /* suite */ } }
    return undefined;
  }
  const META = { fromCache: false, hasPendingWrites: false };
  const unavailable = r => ({ code: (r && r.code === 'session_expired') ? 'invalid_argument' : 'unavailable', message: (r && (r.message || r.error)) || 'indisponible' });

  function start(account, offline) {
    started = true;
    const uid = account.id;
    const P = window.CS_PLATFORM = {
      kind: 'web', userId: uid, username: account.username, email: '', role: account.role, displayName: account.display_name || account.username,
      offline: !!offline,
      syncLabel: 'Progression enregistrée dans ton compte',
      teamEmptyText: account.role === 'admin'
        ? 'Invite ton équipe depuis Profil, rubrique Équipe : chaque personne reçoit un code pour créer son compte. Chacun garde sa progression privée, et vous vous affrontez ici chaque semaine.'
        : 'Ton classement d\'équipe s\'affichera dès qu\'un autre membre aura grimpé cette semaine.',
      profileHTML, actions, onProfile, pathAlert
    };
    const names = {};
    let rev = null;

    const progressRef = {
      async get() {
        let r;
        try { r = await call('cs_lire_progression'); } catch (e) { throw unavailable(e); }
        if (!r || !r.ok) throw unavailable(r);
        const changed = rev !== null && r.rev !== rev;
        rev = r.rev;
        return { id: 'progress', exists: !!r.state, changed, data: () => (r.state ? { v: 2, state: r.state } : undefined), metadata: META };
      },
      async set(doc) {
        let r;
        try {
          r = await call('cs_ecrire_progression', { p_state: doc.state, p_base_rev: rev == null ? 0 : rev });
          if (r && r.ok) { rev = r.rev; return { ok: true }; }
          if (r && r.error === 'conflict') {
            const server = r.state || {};
            // Deux appareils ont écrit : la version la plus avancée l'emporte.
            if ((doc.state.xp || 0) >= (server.xp || 0)) {
              r = await call('cs_ecrire_progression', { p_state: doc.state, p_base_rev: r.rev });
              if (r && r.ok) { rev = r.rev; return { ok: true }; }
            } else {
              rev = r.rev;
              return { conflict: true, state: server };
            }
          }
        } catch (e) { throw unavailable(e); }
        if (r && r.error === 'too_large') throw { code: 'invalid_argument', message: 'Progression trop volumineuse' };
        throw unavailable(r);
      }
    };
    const leagueRef = {
      async set(d) {
        try { await call('cs_ecrire_ligue', { p_week: d.week, p_xp: Math.max(0, Math.round(d.xp || 0)), p_streak: Math.max(0, Math.round(d.streak || 0)) }); }
        catch (e) { throw unavailable(e); }
      }
    };
    function leagueQuery() {
      const q = { week: null };
      q.where = (fieldName, op, value) => { if (fieldName === 'week' && op === '==') q.week = value; return q; };
      q.onSnapshot = (next) => {
        let stop = false;
        const load = async () => {
          if (!q.week) return;
          let r;
          try { r = await call('cs_lire_ligue', { p_week: q.week }); } catch (e) { return; }
          if (stop || !r || !r.ok) return;
          const rows = r.rows || [];
          rows.forEach(x => { names[x.id] = x.name || ''; });
          const docs = rows.map(x => ({ id: x.id, exists: true, data: () => ({ week: x.week, xp: x.xp, streak: x.streak }), metadata: META }));
          next({ docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: META });
        };
        load();
        const timer = setInterval(() => { if (document.visibilityState === 'visible') load(); }, 60000);
        const onVis = () => { if (document.visibilityState === 'visible') load(); };
        document.addEventListener('visibilitychange', onVis);
        return () => { stop = true; clearInterval(timer); document.removeEventListener('visibilitychange', onVis); };
      };
      return q;
    }
    const db = {
      doc(path) {
        const p = String(path).split('/');
        if (p[0] === 'data' && p[1] === 'users' && p[3] === 'progress') return progressRef;
        if (p[0] === 'league' && p.length === 2) return leagueRef;
        throw new TypeError('Chemin non géré : ' + path);
      },
      collection(path) {
        if (path === 'league') return leagueQuery();
        throw new TypeError('Collection non gérée : ' + path);
      }
    };
    const user = {
      id: async () => uid,
      me: async () => ({ id: uid, name: P.displayName || '', email: null, isOwner: P.role === 'admin', canEdit: true, avatarUrl: '', color: '' }),
      isOwner: async () => P.role === 'admin',
      canEdit: async () => true,
      can: async () => true,
      profiles: async ids => { const o = {}; [].concat(ids).forEach(id => { o[id] = { id, name: names[id] || '', avatarUrl: '', color: '', email: null, isMe: id === uid, guest: false }; }); return o; }
    };
    // Aucune clé API : le jeu ne fait jamais appel à un modèle. Les séances « Avec Claude » se passent dans l'appli Claude.
    const caps = { db, user, sample: null };
    window.claude = { use: async name => caps[name] || null };

    SCREEN.hidden = true; SCREEN.innerHTML = '';
    APP.hidden = false;
    if (typeof window.__startGame === 'function') window.__startGame();
    refreshPush().then(() => { if (lastCtx && !lastCtx.inSession()) lastCtx.renderView(); });
  }

  /* ---------- Notifications (rappel du soir) ---------- */
  const push = { supported: false, subscribed: false, hour: 20, busy: false, checked: false };
  push.supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && !!C.vapidPublicKey && C.vapidPublicKey.indexOf('A_REMPLIR') < 0;
  function b64ToBytes(b64) {
    const pad = '='.repeat((4 - b64.length % 4) % 4);
    const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(raw, c => c.charCodeAt(0));
  }
  async function getReg() { if (swReg) return swReg; if (!('serviceWorker' in navigator)) return null; try { return (await navigator.serviceWorker.getRegistration()) || null; } catch (e) { return null; } }
  async function currentSub() { const reg = await getReg(); return reg ? reg.pushManager.getSubscription() : null; }
  async function refreshPush() {
    if (!push.supported) { push.checked = true; return; }
    try {
      const sub = await currentSub();
      push.subscribed = false;
      if (sub) {
        const r = await call('cs_abonnement', { p_endpoint: sub.endpoint });
        if (r && r.ok && r.subscribed) { push.subscribed = true; push.hour = r.hour; }
      }
    } catch (e) { /* ok */ }
    push.checked = true;
  }
  async function saveSub(sub, hour) {
    const j = sub.toJSON();
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone) || 'Europe/Paris';
    return call('cs_abonner', { p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth, p_hour: hour, p_tz: tz });
  }
  async function enablePush(hour, ctx) {
    if (Notification.permission === 'denied') { ctx.toast('Les notifications sont bloquées pour ce site. Autorise-les dans les réglages du navigateur.'); return; }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { ctx.toast('Sans ton autorisation, le rappel ne peut pas s\'afficher.'); return; }
    const reg = await getReg();
    if (!reg) { ctx.toast('Le service de notifications n\'est pas prêt. Recharge la page et réessaie.'); return; }
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(C.vapidPublicKey) });
    const r = await saveSub(sub, hour);
    if (!r || !r.ok) { ctx.toast('Enregistrement impossible : ' + errText(r)); return; }
    push.subscribed = true; push.hour = hour;
    ctx.toast('Rappel activé à ' + hour + ' h');
  }
  async function disablePush(ctx) {
    const sub = await currentSub();
    if (sub) { try { await call('cs_desabonner', { p_endpoint: sub.endpoint }); } catch (e) { /* ok */ } try { await sub.unsubscribe(); } catch (e) { /* ok */ } }
    push.subscribed = false;
    ctx.toast('Rappel désactivé sur cet appareil');
  }

  /* ---------- Équipe (administrateurs) ---------- */
  const team = { data: null, loading: false, err: '' };
  async function loadTeam() {
    if (team.loading) return;
    team.loading = true;
    try {
      const r = await call('cs_equipe');
      if (r && r.ok) { team.data = r; team.err = ''; } else { team.data = team.data || { membres: [], invitations: [] }; team.err = errText(r); }
    } catch (e) { team.data = team.data || { membres: [], invitations: [] }; team.err = errText(e); }
    team.loading = false;
  }
  const fmtDate = d => { try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }); } catch (e) { return ''; } };
  const inviteMessage = i => 'Rejoins-moi sur Cinq Sommets, le jeu pour progresser en vente, écriture, psychologie, marketing et argent, quelques minutes par jour.\n\n1. Ouvre ' + SITE_URL + '\n2. Touche « J\'ai un code d\'invitation »\n3. Saisis le code ' + i.code + ' (valable jusqu\'au ' + fmtDate(i.expires_at) + ')';

  /* ---------- Rendu dans l'onglet Profil ---------- */
  let lastCtx = null;
  function onProfile(ctx) {
    const jobs = [];
    if (!push.checked) jobs.push(refreshPush());
    if (window.CS_PLATFORM.role === 'admin' && team.data === null && !team.loading) jobs.push(loadTeam());
    if (!jobs.length) return;
    Promise.all(jobs).then(() => { if (ctx.getTab() === 'profile' && !ctx.inSession()) ctx.renderView(); });
  }
  function pathAlert(ctx) {
    lastCtx = ctx;
    let dismissed = false;
    try { dismissed = !!localStorage.getItem('cs-push-hint'); } catch (e) { /* ok */ }
    if (dismissed || push.subscribed) return '';
    if (push.supported && push.checked) return '<button class="alert info" style="width:100%;text-align:left" data-act="pf-hint">' + ctx.ic('clock') + '<span class="grow">Active le rappel du soir pour ne jamais casser ta série.</span></button>';
    if (!push.supported && isIOS && !standalone && C.vapidPublicKey && C.vapidPublicKey.indexOf('A_REMPLIR') < 0) return '<button class="alert info" style="width:100%;text-align:left" data-act="pf-hint">' + ctx.ic('down') + '<span class="grow">Installe Cinq Sommets sur ton écran d\'accueil pour recevoir le rappel du soir.</span></button>';
    return '';
  }
  function profileHTML(ctx, part) {
    lastCtx = ctx;
    if (part === 'top') return reminderHTML(ctx);
    return teamHTML(ctx) + accountHTML(ctx);
  }
  function reminderHTML(ctx) {
    const ic = ctx.ic;
    let h = '<section class="card list"><div class="eyebrow">Rappel du soir</div>';
    if (!push.supported && isIOS && !standalone) {
      h += '<p class="small" style="margin:0">Sur iPhone, les notifications ne marchent qu\'avec le site installé sur l\'écran d\'accueil : touche <b>Partager</b>, puis <b>Sur l\'écran d\'accueil</b>, puis ouvre Cinq Sommets depuis son icône.</p>';
    } else if (!push.supported) {
      h += '<p class="small muted" style="margin:0">Ce navigateur ne gère pas les notifications, ou elles ne sont pas encore configurées sur le site.</p>';
    } else if (!push.checked) {
      h += '<div class="thinking"><span class="spin"></span>Vérification…</div>';
    } else {
      h += '<div class="switch"><span>Me prévenir si ma séance du jour n\'est pas faite</span><button class="tog' + (push.subscribed ? ' on' : '') + '" data-act="pf-push" role="switch" aria-checked="' + push.subscribed + '" aria-label="Rappel du soir"' + (push.busy ? ' disabled' : '') + '></button></div>';
      if (push.subscribed) {
        h += '<div><div class="eyebrow" style="margin-bottom:8px">Heure du rappel</div><div class="seg">' + [18, 19, 20, 21, 22].map(x => '<button class="' + (push.hour === x ? 'on' : '') + '" data-act="pf-hour" data-v="' + x + '">' + x + ' h</button>').join('') + '</div></div>' +
          '<button class="link small" style="align-self:flex-start" data-act="pf-test">Afficher une notification de test</button>';
      }
      h += '<p class="small muted" style="margin:0">Une notification par jour au plus, envoyée dans l\'heure choisie, seulement si tu n\'as pas encore fait ta séance. Le réglage vaut pour cet appareil.</p>';
    }
    if (installEvt && !standalone) h += '<div class="sep"></div><button class="btn ghost block" data-act="pf-install">' + ic('down') + 'Installer l\'appli sur cet appareil</button>';
    h += '</section>';
    return h;
  }
  function teamHTML(ctx) {
    const P = window.CS_PLATFORM, ic = ctx.ic;
    if (P.role !== 'admin') return '';
    let h = '<h3 class="sec">Équipe</h3><section class="card list">';
    if (team.data === null) return h + '<div class="thinking"><span class="spin"></span>Chargement…</div></section>';
    const m = team.data.membres || [], inv = team.data.invitations || [];
    h += m.map(x => '<div class="row small"><span class="av" style="--avc:' + (x.role === 'admin' ? 'var(--accent)' : 'var(--c-ecrire)') + ';width:30px;height:30px;font-size:12px">' + esc((x.display_name || x.username).charAt(0).toUpperCase()) + '</span><span class="grow" style="min-width:0"><b>' + esc(x.display_name || x.username) + '</b><span class="muted" style="display:block;overflow:hidden;text-overflow:ellipsis">@' + esc(x.username) + (x.role === 'admin' ? ' · admin' : '') + (x.last_login_at ? ' · vu le ' + esc(fmtDate(x.last_login_at)) : '') + '</span></span>' +
      (x.me ? '<span class="muted small">Toi</span>' : '<button class="link small" style="color:var(--bad)" data-act="pf-remove" data-id="' + esc(x.id) + '" data-name="' + esc(x.display_name || x.username) + '">Retirer</button>') + '</div>').join('<div class="sep"></div>');
    if (inv.length) {
      h += '<div class="sep"></div><div class="eyebrow">Invitations en attente</div>' + inv.map(i => '<div class="invite"><span class="invite-code">' + esc(i.code) + '</span><span class="small muted grow">jusqu\'au ' + esc(fmtDate(i.expires_at)) + (i.role === 'admin' ? ' · admin' : '') + '</span><button class="link small" data-act="pf-inv-copy" data-code="' + esc(i.code) + '">Copier le message</button><button class="link small" style="color:var(--bad)" data-act="pf-inv-cancel" data-code="' + esc(i.code) + '">Annuler</button></div>').join('');
    }
    if (team.err) h += '<p class="small bad" style="margin:0">' + esc(team.err) + '</p>';
    h += '<div class="sep"></div><button class="btn block" data-act="pf-invite">' + ic('users') + 'Inviter quelqu\'un</button>' +
      '<p class="small muted" style="margin:0">Chaque invitation donne un code à usage unique, valable 14 jours. Envoie-le comme tu veux (SMS, WhatsApp…) : la personne crée elle-même son nom d\'utilisateur et son mot de passe.</p></section>';
    return h;
  }
  function accountHTML(ctx) {
    const P = window.CS_PLATFORM;
    return '<h3 class="sec">Compte</h3><section class="card list">' +
      '<div class="small muted">Connecté en tant que <b>@' + esc(P.username) + '</b>' + (P.role === 'admin' ? ' · administrateur' : '') + '</div>' +
      '<form class="pf-add" data-form="name"><label class="eyebrow" for="pf-dn">Prénom affiché dans la ligue</label><input id="pf-dn" type="text" maxlength="40" value="' + esc(P.displayName) + '" autocomplete="given-name"><button class="btn ghost block" type="submit">Enregistrer</button></form>' +
      '<div class="sep"></div>' +
      '<button class="btn ghost block" data-act="pf-password">Changer de mot de passe</button>' +
      '<button class="btn ghost block" data-act="pf-phrase">Nouvelle phrase de récupération</button>' +
      '<div class="sep"></div>' +
      '<div class="row" style="gap:14px;flex-wrap:wrap"><button class="link small" data-act="pf-export">Exporter ma progression</button><button class="link small" data-act="pf-import">Importer une progression</button></div>' +
      '<button class="btn ghost block" data-act="pf-logout">Se déconnecter</button>' +
      '<button class="link small" style="align-self:flex-start;color:var(--bad)" data-act="pf-delete">Supprimer mon compte</button></section>';
  }
  function phraseSheetHTML(phrase) {
    return '<h3>Ta nouvelle phrase de récupération</h3><p class="small">L\'ancienne ne fonctionne plus. Note celle-ci en lieu sûr, dans l\'ordre : elle ne sera plus affichée.</p>' +
      '<ol class="phrase">' + phrase.split(' ').map(w => '<li>' + esc(w) + '</li>').join('') + '</ol>' +
      '<button class="btn ghost block" data-act="pf-copy-phrase" data-text="' + esc(phrase) + '">Copier la phrase</button><button class="btn block" data-act="close-sheet">C\'est noté</button>';
  }

  function actions(ctx) {
    const rerender = () => { if (ctx.getTab() === 'profile' && !ctx.inSession()) ctx.renderView(); };
    const lsKey = 'cinq-sommets-v1:' + window.CS_PLATFORM.userId;
    return {
      'pf-push': async () => {
        if (push.busy) return;
        push.busy = true; rerender();
        try { if (push.subscribed) await disablePush(ctx); else await enablePush(push.hour || 20, ctx); }
        catch (e) { ctx.toast('Activation impossible : ' + ((e && e.message) || 'erreur inconnue')); }
        push.busy = false; rerender();
      },
      'pf-hour': async t => {
        const h = +t.dataset.v;
        const sub = await currentSub();
        if (!sub) { push.subscribed = false; rerender(); return; }
        let r; try { r = await saveSub(sub, h); } catch (e) { r = e; }
        if (!r || !r.ok) { ctx.toast('Changement impossible : ' + errText(r)); return; }
        push.hour = h; ctx.toast('Rappel à ' + h + ' h'); rerender();
      },
      'pf-hint': () => {
        try { localStorage.setItem('cs-push-hint', '1'); } catch (e) { /* ok */ }
        ctx.goTo('profile');
      },
      'pf-test': async () => {
        const reg = await getReg();
        if (!reg) return;
        try { await reg.showNotification('Cinq Sommets', { body: 'Les rappels s\'afficheront comme ceci.', icon: 'icons/icon-192.png', badge: 'icons/badge-72.png', tag: 'test' }); }
        catch (e) { ctx.toast('Notification impossible sur cet appareil.'); }
      },
      'pf-install': async () => {
        if (!installEvt) return;
        installEvt.prompt();
        try { await installEvt.userChoice; } catch (e) { /* ok */ }
        installEvt = null; rerender();
      },
      'pf-invite': async () => {
        let r; try { r = await call('cs_creer_invitation', { p_role: 'member' }); } catch (e) { r = e; }
        if (!r || !r.ok) { ctx.toast(errText(r)); return; }
        await loadTeam(); rerender();
        ctx.sheet('<h3>Invitation créée</h3><p class="small">Envoie ce code à la personne. Il sert une seule fois et reste valable jusqu\'au ' + esc(fmtDate(r.expires_at)) + '.</p><div class="invite" style="justify-content:center"><span class="invite-code" style="font-size:28px">' + esc(r.code) + '</span></div>' +
          '<button class="btn block" data-act="pf-inv-copy" data-code="' + esc(r.code) + '">Copier le message d\'invitation</button><button class="btn ghost block" data-act="close-sheet">Fermer</button>');
      },
      'pf-inv-copy': t => {
        const i = ((team.data && team.data.invitations) || []).find(x => x.code === t.dataset.code) || { code: t.dataset.code, expires_at: Date.now() + 14 * 86400000 };
        copy(inviteMessage(i), () => ctx.toast('Message copié : colle-le dans un SMS ou une messagerie'));
      },
      'pf-inv-cancel': async t => {
        let r; try { r = await call('cs_annuler_invitation', { p_code: t.dataset.code }); } catch (e) { r = e; }
        if (!r || !r.ok) { ctx.toast(errText(r)); return; }
        await loadTeam(); ctx.toast('Invitation annulée'); rerender();
      },
      'pf-remove': t => {
        ctx.sheet('<h3>Retirer ' + esc(t.dataset.name) + ' ?</h3><p>Son compte et sa progression seront supprimés. Tu pourras lui envoyer une nouvelle invitation, mais elle repartira de zéro.</p><button class="btn block" style="--b:var(--bad)" data-act="pf-remove-ok" data-id="' + esc(t.dataset.id) + '">Retirer</button><button class="btn ghost block" data-act="close-sheet">Annuler</button>');
      },
      'pf-remove-ok': async t => {
        ctx.closeSheet();
        let r; try { r = await call('cs_retirer_membre', { p_member: t.dataset.id }); } catch (e) { r = e; }
        if (!r || !r.ok) { ctx.toast(errText(r)); return; }
        await loadTeam(); ctx.toast('Membre retiré'); rerender();
      },
      'pf-password': () => {
        ctx.sheet('<h3>Changer de mot de passe</h3><form class="pf-add" data-form="password"><label class="eyebrow" for="pf-old">Mot de passe actuel</label><input id="pf-old" type="password" autocomplete="current-password" maxlength="72"><label class="eyebrow" for="pf-new">Nouveau mot de passe</label><input id="pf-new" type="password" autocomplete="new-password" minlength="8" maxlength="72"><label class="eyebrow" for="pf-new2">Confirme-le</label><input id="pf-new2" type="password" autocomplete="new-password" minlength="8" maxlength="72"><button class="btn block" type="submit">Changer</button></form><p class="small muted">Tes autres appareils seront déconnectés.</p><button class="btn ghost block" data-act="close-sheet">Annuler</button>');
      },
      'pf-phrase': () => {
        ctx.sheet('<h3>Nouvelle phrase de récupération</h3><p class="small">Utile si tu as perdu la tienne ou si quelqu\'un a pu la voir. L\'ancienne cessera de fonctionner.</p><form class="pf-add" data-form="phrase"><label class="eyebrow" for="pf-pw">Ton mot de passe</label><input id="pf-pw" type="password" autocomplete="current-password" maxlength="72"><button class="btn block" type="submit">Générer une nouvelle phrase</button></form><button class="btn ghost block" data-act="close-sheet">Annuler</button>');
      },
      'pf-copy-phrase': t => copy(t.dataset.text || '', () => ctx.toast('Phrase copiée')),
      'pf-export': () => {
        let raw = '';
        try { raw = localStorage.getItem(lsKey) || ''; } catch (e) { /* ok */ }
        if (!raw) { ctx.toast('Aucune progression à exporter sur cet appareil.'); return; }
        copy(raw, () => ctx.toast('Progression copiée : colle-la dans une note pour la garder'));
      },
      'pf-import': () => {
        ctx.sheet('<h3>Importer une progression</h3><p class="small">Colle ici une progression exportée (depuis ce site ou depuis la version artefact). Elle remplacera la progression actuelle.</p><textarea class="essay" id="pf-json" style="min-height:160px" aria-label="Progression JSON"></textarea><button class="btn block" data-act="pf-import-ok">Importer</button><button class="btn ghost block" data-act="close-sheet">Annuler</button>');
      },
      'pf-import-ok': () => {
        const raw = ($('#pf-json') || {}).value || '';
        const val = parseLoose(raw);
        const st = val && (val.state || val);
        if (!st || typeof st !== 'object' || !st.streak || !st.lessons) { ctx.toast('Ce contenu ne ressemble pas à une progression Cinq Sommets.'); return; }
        ctx.closeSheet();
        ctx.replaceState(st);
        ctx.toast('Progression importée');
      },
      'pf-logout': async () => {
        try { const sub = await currentSub(); if (sub) { await call('cs_desabonner', { p_endpoint: sub.endpoint }); await sub.unsubscribe(); } } catch (e) { /* ok */ }
        try { await call('cs_deconnexion'); } catch (e) { /* ok */ }
        clearSession();
        location.reload();
      },
      'pf-delete': () => {
        ctx.sheet('<h3>Supprimer ton compte ?</h3><p class="small">Ton compte, ta progression, ta ligne dans la ligue et tes rappels seront effacés définitivement.</p><form class="pf-add" data-form="delete"><label class="eyebrow" for="pf-delpw">Ton mot de passe</label><input id="pf-delpw" type="password" autocomplete="current-password" maxlength="72"><button class="btn block" style="--b:var(--bad)" type="submit">Supprimer définitivement</button></form><button class="btn ghost block" data-act="close-sheet">Annuler</button>');
      },
      __submit: async (form) => {
        const kind = form.dataset.form;
        const btn = form.querySelector('button[type=submit]');
        const val = id => String((document.getElementById(id) || {}).value || '');
        const run = async (fn, args, ctxErr) => {
          if (btn) btn.disabled = true;
          let r; try { r = await call(fn, args); } catch (e) { r = e; }
          if (btn) btn.disabled = false;
          if (!r || !r.ok) { ctx.toast(errText(r, ctxErr)); return null; }
          return r;
        };
        if (kind === 'name') {
          const n = val('pf-dn').trim().slice(0, 40);
          if (!n) { ctx.toast(ERR.name_empty); return; }
          const r = await run('cs_changer_nom', { p_name: n });
          if (!r) return;
          window.CS_PLATFORM.displayName = n;
          try { saveSession(SESSION.token, r.account); } catch (e) { /* ok */ }
          ctx.setName(n);
          ctx.toast('Prénom enregistré');
        } else if (kind === 'password') {
          const np = val('pf-new');
          const pb = pwProblem(np, window.CS_PLATFORM.username);
          if (pb) { ctx.toast(ERR[pb]); return; }
          if (np !== val('pf-new2')) { ctx.toast('Les deux mots de passe ne sont pas identiques.'); return; }
          const r = await run('cs_changer_mot_de_passe', { p_old: val('pf-old'), p_new: np }, 'password');
          if (!r) return;
          ctx.closeSheet(); ctx.toast('Mot de passe changé');
        } else if (kind === 'phrase') {
          const r = await run('cs_nouvelle_phrase', { p_password: val('pf-pw') }, 'password');
          if (!r) return;
          ctx.sheet(phraseSheetHTML(r.phrase), true);
        } else if (kind === 'delete') {
          const r = await run('cs_supprimer_compte', { p_password: val('pf-delpw') }, 'password');
          if (!r) return;
          try { localStorage.removeItem(lsKey); } catch (e) { /* ok */ }
          clearSession();
          location.reload();
        }
      }
    };
  }

  /* ---------- Démarrage ---------- */
  async function boot() {
    if (!SESSION) { renderAuth('login'); return; }
    splash('Connexion…');
    try {
      const r = await rpc('cs_moi', { p_token: SESSION.token });
      if (r && r.ok) { saveSession(SESSION.token, r.account); start(r.account, false); return; }
      if (r && r.error === 'session') { sessionExpired(); return; }
      start(SESSION.account, true);
    } catch (e) {
      // Hors ligne : on joue avec la progression de l'appareil, la synchro reprendra au retour du réseau.
      start(SESSION.account, true);
    }
  }
  boot();
})();
