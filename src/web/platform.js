/* Cinq Sommets — couche « site web » : connexion Supabase, sauvegarde,
   ligue d'équipe, coach via la fonction Edge, notifications et installation. */
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

  function screen(html) { SCREEN.innerHTML = '<div class="lg-card">' + BRAND + html + '</div>'; SCREEN.hidden = false; APP.hidden = true; }
  function splash(label) { screen('<div class="lg-wait"><span class="spin"></span><span>' + esc(label) + '</span></div>'); }

  /* ---------- Service worker (hors ligne + notifications) ---------- */
  let swReg = null;
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').then(r => { swReg = r; }).catch(() => { /* hors service worker */ });
  }
  let installEvt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; });

  const configured = typeof C.supabaseUrl === 'string' && /^https:\/\/.+\.supabase\.co$/.test(C.supabaseUrl) && C.supabaseAnonKey && C.supabaseAnonKey.indexOf('A_REMPLIR') < 0;
  if (!configured) {
    screen('<h1>Site pas encore branché</h1><p>Il manque l\'adresse et la clé publique du projet Supabase dans <code>public/config.js</code>. Le README du dépôt explique comment les obtenir.</p>');
    return;
  }
  if (!window.supabase || !window.supabase.createClient) {
    screen('<h1>Chargement impossible</h1><p>La bibliothèque Supabase n\'a pas pu être chargée. Vérifie ta connexion puis recharge la page.</p><button class="btn block" onclick="location.reload()">Recharger</button>');
    return;
  }

  const sb = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'cs-auth' }
  });

  /* ---------- Connexion ---------- */
  let started = false, entering = false, loginEmail = '', resendAt = 0;
  const authError = (e, fallback) => {
    const m = String((e && (e.message || e.error_description)) || '');
    if (/not authorized/i.test(m)) return 'Supabase n\'envoie pour l\'instant des e-mails qu\'aux membres de l\'équipe du projet. Demande à l\'administrateur de t\'y inviter, ou de brancher un service d\'e-mail (voir le README).';
    if (/rate limit|too many|security purposes/i.test(m) || (e && e.status === 429)) return 'Trop de demandes d\'e-mail pour le moment. Attends un peu avant de réessayer.';
    if (/expired|invalid/i.test(m)) return 'Code incorrect ou expiré. Vérifie le dernier e-mail reçu ou demande un nouveau code.';
    if (/fetch|network/i.test(m)) return 'Pas de connexion. Vérifie ton réseau et réessaie.';
    return fallback + (m ? ' (' + m + ')' : '');
  };
  function renderLogin(step, err) {
    if (step === 'code') {
      screen('<h1>Vérifie tes e-mails</h1><p>Un message vient de partir vers <b>' + esc(loginEmail) + '</b>. Saisis le code qu\'il contient, ou ouvre son lien sur cet appareil.</p>' +
        '<form id="lg-code" class="lg-form" novalidate><label for="lg-otp">Code reçu</label><input id="lg-otp" name="otp" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength="10" placeholder="123456" required>' +
        (err ? '<p class="lg-err" role="alert">' + esc(err) + '</p>' : '') +
        '<button class="btn block" type="submit">Valider</button></form>' +
        '<div class="lg-links"><button class="link small" data-lg="back">Changer d\'adresse</button><button class="link small" data-lg="resend">Renvoyer l\'e-mail</button></div>');
      const i = $('#lg-otp'); if (i) i.focus();
      return;
    }
    screen('<h1>Quelques minutes par jour pour progresser</h1><p>Vendre, écrire, comprendre les gens, marketer et faire fructifier ton argent, avec des cas tirés de ton quotidien.</p>' +
      '<form id="lg-mail" class="lg-form" novalidate><label for="lg-email">Ton adresse e-mail</label><input id="lg-email" type="email" name="email" autocomplete="email" inputmode="email" placeholder="prenom@exemple.fr" value="' + esc(loginEmail) + '" required>' +
      (err ? '<p class="lg-err" role="alert">' + esc(err) + '</p>' : '') +
      '<button class="btn block" type="submit">Recevoir mon code</button></form><p class="small muted">Pas de mot de passe : tu reçois un code de connexion par e-mail. L\'accès est réservé aux membres ajoutés par l\'administrateur.</p>');
  }
  async function sendCode() {
    const { error } = await sb.auth.signInWithOtp({ email: loginEmail, options: { emailRedirectTo: location.origin + location.pathname, shouldCreateUser: true } });
    if (error) throw error;
    resendAt = Date.now() + 60000;
  }
  SCREEN.addEventListener('submit', async ev => {
    ev.preventDefault();
    const btn = ev.target.querySelector('button[type=submit]');
    if (btn) { btn.disabled = true; btn.textContent = '…'; }
    if (ev.target.id === 'lg-mail') {
      loginEmail = String($('#lg-email').value || '').trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(loginEmail)) { renderLogin('mail', 'Cette adresse ne semble pas valide.'); return; }
      try { await sendCode(); renderLogin('code'); } catch (e) { renderLogin('mail', authError(e, 'L\'e-mail n\'a pas pu partir.')); }
    } else if (ev.target.id === 'lg-code') {
      const token = String($('#lg-otp').value || '').replace(/\D/g, '');
      if (token.length < 6) { renderLogin('code', 'Le code fait au moins 6 chiffres.'); return; }
      const { data, error } = await sb.auth.verifyOtp({ email: loginEmail, token, type: 'email' });
      if (error) { renderLogin('code', authError(error, 'Connexion impossible.')); return; }
      if (data && data.session) enter(data.session);
    }
  });
  SCREEN.addEventListener('click', async ev => {
    const t = ev.target.closest('[data-lg]'); if (!t) return;
    const a = t.dataset.lg;
    if (a === 'back') renderLogin('mail');
    else if (a === 'resend') {
      if (Date.now() < resendAt) { renderLogin('code', 'Patiente encore ' + Math.ceil((resendAt - Date.now()) / 1000) + ' s avant de redemander un e-mail.'); return; }
      try { await sendCode(); renderLogin('code'); } catch (e) { renderLogin('code', authError(e, 'L\'e-mail n\'a pas pu partir.')); }
    } else if (a === 'logout') { await sb.auth.signOut(); location.reload(); }
  });

  /* ---------- Profil et accès ---------- */
  const profKey = uid => 'cs-profile:' + uid;
  async function fetchProfile(uid) {
    const { data, error } = await sb.rpc('mon_profil');
    if (error) {
      try { const c = JSON.parse(localStorage.getItem(profKey(uid)) || 'null'); if (c) return Object.assign(c, { offline: true }); } catch (e) { /* ok */ }
      throw error;
    }
    const p = Array.isArray(data) ? data[0] : data;
    if (p) { try { localStorage.setItem(profKey(uid), JSON.stringify(p)); } catch (e) { /* ok */ } }
    return p || null;
  }
  async function pingCoach(token) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 7000);
    try {
      const r = await fetch(C.supabaseUrl + '/functions/v1/coach', { method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'application/json', apikey: C.supabaseAnonKey, Authorization: 'Bearer ' + token }, body: '{"ping":true}' });
      if (!r.ok) return false;
      const j = await r.json();
      return !!(j && j.ok);
    } catch (e) { return false; } finally { clearTimeout(timer); }
  }
  async function enter(session) {
    if (started || entering) return;
    entering = true;
    splash('Connexion…');
    try {
      let prof = await fetchProfile(session.user.id);
      if (!prof) {
        const { data: ok } = await sb.rpc('claim_first_admin');
        if (ok) prof = await fetchProfile(session.user.id);
      }
      if (!prof) {
        screen('<h1>Accès pas encore ouvert</h1><p>Le compte <b>' + esc(session.user.email) + '</b> n\'est pas encore autorisé. Demande à l\'administrateur de l\'ajouter dans Profil, rubrique Équipe.</p><button class="btn block" data-lg="logout">Se déconnecter</button>');
        entering = false;
        return;
      }
      const coachOk = prof.offline ? false : await pingCoach(session.access_token);
      start(session, prof, coachOk);
    } catch (e) {
      entering = false;
      screen('<h1>Connexion impossible</h1><p>' + esc(authError(e, 'Le serveur ne répond pas.')) + '</p><button class="btn block" onclick="location.reload()">Réessayer</button><button class="link small" data-lg="logout">Se déconnecter</button>');
    }
  }

  /* ---------- Pont entre le jeu et Supabase ---------- */
  function parseLoose(text) {
    const t = String(text || '').trim();
    try { return JSON.parse(t); } catch (e) { /* suite */ }
    const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) { try { return JSON.parse(fence[1]); } catch (e) { /* suite */ } }
    const i = t.search(/[[{]/), j = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
    if (i >= 0 && j > i) { try { return JSON.parse(t.slice(i, j + 1)); } catch (e) { /* suite */ } }
    return undefined;
  }
  const dbErr = (error, fallback) => ({ code: error && (error.code === '42501' || error.code === 'PGRST301') ? 'invalid_argument' : (fallback || 'unavailable'), message: (error && error.message) || 'erreur' });

  function start(session, prof, coachOk) {
    started = true;
    const uid = session.user.id;
    const P = window.CS_PLATFORM = {
      kind: 'web', userId: uid, email: prof.email || session.user.email, role: prof.role, displayName: prof.display_name || '',
      syncLabel: 'Progression enregistrée dans ton compte',
      teamEmptyText: prof.role === 'admin'
        ? 'Ajoute les e-mails de ton équipe dans Profil, rubrique Équipe. Chacun garde sa progression privée, et vous vous affrontez ici chaque semaine.'
        : 'Ton classement d\'équipe s\'affichera dès qu\'un autre membre aura grimpé cette semaine.',
      profileHTML, actions, onProfile, pathAlert
    };
    const names = {};

    const progressRef = {
      async get() {
        const { data, error } = await sb.from('progress').select('state, updated_at').eq('user_id', uid).maybeSingle();
        if (error) throw dbErr(error);
        return { id: 'progress', exists: !!data, data: () => (data ? { v: 2, state: data.state } : undefined), metadata: { fromCache: false, hasPendingWrites: false } };
      },
      async set(doc) {
        const { error } = await sb.from('progress').upsert({ user_id: uid, state: doc.state, updated_at: new Date().toISOString() });
        if (error) throw dbErr(error);
      }
    };
    const leagueRef = {
      async set(d) {
        const { error } = await sb.from('league').upsert({ user_id: uid, week: d.week, xp: Math.max(0, Math.round(d.xp || 0)), streak: Math.max(0, Math.round(d.streak || 0)), name: P.displayName || null, updated_at: new Date().toISOString() });
        if (error) throw dbErr(error);
      }
    };
    function leagueQuery() {
      const q = { week: null };
      q.where = (field, op, value) => { if (field === 'week' && op === '==') q.week = value; return q; };
      q.onSnapshot = (next, onErr) => {
        let stop = false;
        const load = async () => {
          let req = sb.from('league').select('user_id, week, xp, streak, name');
          if (q.week) req = req.eq('week', q.week);
          const { data, error } = await req;
          if (stop) return;
          if (error) { if (onErr && error.code === '42501') onErr(dbErr(error)); return; }
          (data || []).forEach(r => { names[r.user_id] = r.name || ''; });
          const docs = (data || []).map(r => ({ id: r.user_id, exists: true, data: () => ({ week: r.week, xp: r.xp, streak: r.streak }), metadata: { fromCache: false, hasPendingWrites: false } }));
          next({ docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: { fromCache: false, hasPendingWrites: false } });
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
      me: async () => ({ id: uid, name: P.displayName || '', email: P.email, isOwner: P.role === 'admin', canEdit: true, avatarUrl: '', color: '' }),
      isOwner: async () => P.role === 'admin',
      canEdit: async () => true,
      can: async () => true,
      profiles: async ids => { const o = {}; [].concat(ids).forEach(id => { o[id] = { id, name: names[id] || '', avatarUrl: '', color: '', email: null, isMe: id === uid, guest: false }; }); return o; }
    };
    async function coachCall(input, opts, json) {
      opts = opts || {};
      const ctl = new AbortController();
      if (opts.signal) {
        if (opts.signal.aborted) throw { code: 'cancelled', message: 'annulé' };
        opts.signal.addEventListener('abort', () => ctl.abort(), { once: true });
      }
      let res;
      try {
        const { data: s } = await sb.auth.getSession();
        res = await fetch(C.supabaseUrl + '/functions/v1/coach', {
          method: 'POST', signal: ctl.signal,
          headers: { 'Content-Type': 'application/json', apikey: C.supabaseAnonKey, Authorization: 'Bearer ' + ((s && s.session && s.session.access_token) || '') },
          body: JSON.stringify({ input, json: !!json, tier: opts.modelTier || 'default' })
        });
      } catch (e) {
        if (ctl.signal.aborted) throw { code: 'cancelled', message: 'annulé' };
        throw { code: 'upstream_error', message: 'réseau' };
      }
      let body = {};
      try { body = await res.json(); } catch (e) { /* ok */ }
      if (!res.ok) {
        const map = { 401: 'session_expired', 403: 'not_granted', 422: 'refused', 429: 'rate_limited', 503: 'sampling_disabled' };
        throw { code: body.code || map[res.status] || 'upstream_error', message: body.message || ('HTTP ' + res.status) };
      }
      return { text: String(body.text || ''), truncated: !!body.truncated, modelTierApplied: opts.modelTier || 'default' };
    }
    const sample = (input, opts) => coachCall(input, opts, false);
    sample.json = async (input, opts) => {
      const r = await coachCall(input, opts, true);
      const v = parseLoose(r.text);
      if (v === undefined) throw { code: 'invalid_json', message: 'Réponse illisible', text: r.text };
      return v;
    };
    sample.limits = async () => ({ maxPromptBytes: 200000 });

    const caps = { db, user, sample: coachOk ? sample : null };
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
  async function refreshPush() {
    if (!push.supported) { push.checked = true; return; }
    try {
      const reg = await getReg();
      const sub = reg && await reg.pushManager.getSubscription();
      push.subscribed = false;
      if (sub) {
        const { data } = await sb.from('push_subscriptions').select('remind_hour').eq('endpoint', sub.endpoint).maybeSingle();
        if (data) { push.subscribed = true; push.hour = data.remind_hour; }
      }
    } catch (e) { /* ok */ }
    push.checked = true;
  }
  async function enablePush(hour, ctx) {
    if (Notification.permission === 'denied') { ctx.toast('Les notifications sont bloquées pour ce site. Autorise-les dans les réglages du navigateur.'); return; }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { ctx.toast('Sans ton autorisation, le rappel ne peut pas s\'afficher.'); return; }
    const reg = await getReg();
    if (!reg) { ctx.toast('Le service de notifications n\'est pas prêt. Recharge la page et réessaie.'); return; }
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(C.vapidPublicKey) });
    const j = sub.toJSON();
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone) || 'Europe/Paris';
    const { error } = await sb.from('push_subscriptions').upsert({ endpoint: j.endpoint, user_id: window.CS_PLATFORM.userId, p256dh: j.keys.p256dh, auth: j.keys.auth, remind_hour: hour, tz });
    if (error) { ctx.toast('Enregistrement impossible : ' + error.message); return; }
    push.subscribed = true; push.hour = hour;
    ctx.toast('Rappel activé à ' + hour + ' h');
  }
  async function disablePush(ctx) {
    const reg = await getReg();
    const sub = reg && await reg.pushManager.getSubscription();
    if (sub) { await sb.from('push_subscriptions').delete().eq('endpoint', sub.endpoint); try { await sub.unsubscribe(); } catch (e) { /* ok */ } }
    push.subscribed = false;
    ctx.toast('Rappel désactivé sur cet appareil');
  }

  /* ---------- Équipe (administrateurs) ---------- */
  const team = { list: null, loading: false, err: '' };
  async function loadTeam() {
    if (team.loading) return;
    team.loading = true;
    const { data, error } = await sb.rpc('list_members');
    team.loading = false;
    team.list = error ? [] : (data || []);
    team.err = error ? error.message : '';
  }

  /* ---------- Rendu dans l'onglet Profil ---------- */
  function onProfile(ctx) {
    let again = false;
    const jobs = [];
    if (!push.checked) jobs.push(refreshPush());
    if (window.CS_PLATFORM.role === 'admin' && team.list === null && !team.loading) jobs.push(loadTeam());
    if (!jobs.length) return;
    Promise.all(jobs).then(() => { if (ctx.getTab() === 'profile' && !ctx.inSession()) ctx.renderView(); again = true; });
    return again;
  }
  let lastCtx = null;
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
    const P = window.CS_PLATFORM, ic = ctx.ic;
    if (part === 'top') return reminderHTML(ctx);
    return teamAndAccountHTML(ctx);
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
  function teamAndAccountHTML(ctx) {
    const P = window.CS_PLATFORM, ic = ctx.ic;
    let h = '';
    if (P.role === 'admin') {
      h += '<h3 class="sec">Équipe</h3><section class="card list">';
      if (team.list === null) h += '<div class="thinking"><span class="spin"></span>Chargement…</div>';
      else {
        h += team.list.map(m => '<div class="row small"><span class="av" style="--avc:' + (m.role === 'admin' ? 'var(--accent)' : 'var(--c-ecrire)') + ';width:30px;height:30px;font-size:12px">' + esc((m.display_name || m.email).charAt(0).toUpperCase()) + '</span><span class="grow" style="min-width:0"><b>' + esc(m.display_name || m.email.split('@')[0]) + '</b><span class="muted" style="display:block;overflow:hidden;text-overflow:ellipsis">' + esc(m.email) + (m.role === 'admin' ? ' · admin' : '') + '</span></span>' +
          (m.email === P.email ? '' : '<button class="link small" style="color:var(--bad)" data-act="pf-remove" data-email="' + esc(m.email) + '">Retirer</button>') + '</div>').join('<div class="sep"></div>');
        if (team.err) h += '<p class="small bad">' + esc(team.err) + '</p>';
      }
      h += '<div class="sep"></div><form class="pf-add" data-form="team-add"><label class="eyebrow" for="pf-email">Ajouter un membre</label><input id="pf-email" type="email" placeholder="prenom@exemple.fr" autocomplete="off"><input id="pf-name" type="text" placeholder="Prénom (facultatif)" maxlength="40" autocomplete="off"><button class="btn block" type="submit">' + ic('users') + 'Ajouter</button></form>' +
        '<p class="small muted" style="margin:0">Le membre se connecte ensuite avec cette adresse. Tant qu\'aucun service d\'e-mail n\'est branché sur Supabase, il doit aussi faire partie de l\'équipe du projet Supabase pour recevoir son code (voir le README).</p></section>';
    }

    h += '<h3 class="sec">Compte</h3><section class="card list">' +
      '<form class="pf-add" data-form="name"><label class="eyebrow" for="pf-dn">Prénom affiché dans la ligue</label><input id="pf-dn" type="text" maxlength="40" value="' + esc(P.displayName) + '" autocomplete="given-name"><button class="btn ghost block" type="submit">Enregistrer</button></form>' +
      '<div class="sep"></div><div class="small muted">Connecté avec ' + esc(P.email) + '</div>' +
      '<button class="link small" style="align-self:flex-start" data-act="pf-import">Importer une progression (copie JSON)</button>' +
      '<button class="btn ghost block" data-act="pf-logout">Se déconnecter</button></section>';
    return h;
  }

  function actions(ctx) {
    const rerender = () => { if (ctx.getTab() === 'profile' && !ctx.inSession()) ctx.renderView(); };
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
        const reg = await getReg();
        const sub = reg && await reg.pushManager.getSubscription();
        if (!sub) { push.subscribed = false; rerender(); return; }
        const { error } = await sb.from('push_subscriptions').update({ remind_hour: h, last_reminded_on: null }).eq('endpoint', sub.endpoint);
        if (error) { ctx.toast('Changement impossible : ' + error.message); return; }
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
      'pf-remove': async t => {
        const email = t.dataset.email;
        ctx.sheet('<h3>Retirer ' + esc(email) + ' ?</h3><p>Cette personne ne pourra plus se connecter. Sa progression reste enregistrée et revient si tu l\'ajoutes de nouveau.</p><button class="btn block" style="--b:var(--bad)" data-act="pf-remove-ok" data-email="' + esc(email) + '">Retirer</button><button class="btn ghost block" data-act="close-sheet">Annuler</button>');
      },
      'pf-remove-ok': async t => {
        ctx.closeSheet();
        const { error } = await sb.rpc('remove_member', { p_email: t.dataset.email });
        if (error) { ctx.toast('Impossible : ' + error.message); return; }
        await loadTeam(); ctx.toast('Membre retiré'); rerender();
      },
      'pf-import': () => {
        ctx.sheet('<h3>Importer une progression</h3><p class="small">Colle ici le contenu JSON d\'une progression exportée. Elle remplacera la progression actuelle.</p><textarea class="essay" id="pf-json" style="min-height:160px" aria-label="Progression JSON"></textarea><button class="btn block" data-act="pf-import-ok">Importer</button><button class="btn ghost block" data-act="close-sheet">Annuler</button>');
      },
      'pf-import-ok': () => {
        const raw = ($('#pf-json') || {}).value || '';
        const v = parseLoose(raw);
        const st = v && (v.state || v);
        if (!st || typeof st !== 'object' || !st.streak || !st.lessons) { ctx.toast('Ce contenu ne ressemble pas à une progression Cinq Sommets.'); return; }
        ctx.closeSheet();
        ctx.replaceState(st);
        ctx.toast('Progression importée');
      },
      'pf-logout': async () => {
        await sb.auth.signOut();
        location.reload();
      },
      __submit: async (form) => {
        const kind = form.dataset.form;
        if (kind === 'name') {
          const n = String(($('#pf-dn') || {}).value || '').trim().slice(0, 40);
          const { error } = await sb.rpc('set_display_name', { p_name: n });
          if (error) { ctx.toast('Enregistrement impossible : ' + error.message); return; }
          window.CS_PLATFORM.displayName = n;
          ctx.setName(n);
          ctx.toast('Prénom enregistré');
        } else if (kind === 'team-add') {
          const email = String(($('#pf-email') || {}).value || '').trim().toLowerCase();
          const name = String(($('#pf-name') || {}).value || '').trim();
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { ctx.toast('Adresse e-mail invalide.'); return; }
          const { error } = await sb.rpc('add_member', { p_email: email, p_name: name || null, p_role: 'member' });
          if (error) { ctx.toast('Ajout impossible : ' + error.message); return; }
          await loadTeam(); ctx.toast(email + ' peut maintenant se connecter'); rerender();
        }
      }
    };
  }

  /* ---------- Démarrage ---------- */
  sb.auth.onAuthStateChange((event, session) => {
    if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && !started) enter(session);
    if (event === 'SIGNED_OUT' && started) location.reload();
  });
  splash('Chargement…');
  sb.auth.getSession().then(({ data }) => {
    if (data && data.session) enter(data.session);
    else if (!started && !entering) renderLogin('mail');
  }).catch(() => renderLogin('mail', 'Le serveur ne répond pas. Vérifie ta connexion.'));
})();
