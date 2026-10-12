(function () {
  'use strict';

  /* ---------- Index du contenu ---------- */
  const ORDER = ['vente', 'ecrire', 'psycho', 'marketing', 'argent'];
  const SUMMITS = (window.SUMMITS || []).filter(s => ORDER.indexOf(s.id) >= 0).sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
  const MISSIONS = window.MISSIONS || {};
  const ROLEPLAYS = window.ROLEPLAYS || [];
  const PLATFORM = window.CS_PLATFORM || null;
  const SBYID = {}, LESSONS = {}, ITEMS = {};
  SUMMITS.forEach(s => {
    SBYID[s.id] = s;
    s.lessonIds = [];
    s.units.forEach((u, ui) => {
      u.lessonIds = [];
      u.lessons.forEach((l, li) => {
        const lid = s.id + '-' + ui + '-' + li;
        l.id = lid;
        LESSONS[lid] = { s, u, ui, li, l };
        s.lessonIds.push(lid);
        u.lessonIds.push(lid);
        l.ex.forEach((e, ei) => { e.id = lid + '-' + ei; ITEMS[e.id] = { e, lid, s }; });
      });
    });
  });

  /* ---------- Outils ---------- */
  const $ = (q, r) => (r || document).querySelector(q);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  const plain = s => String(s || '').replace(/\*\*/g, '');
  const fmt = n => Math.round(n).toLocaleString('fr-FR');
  const pad = n => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parseDay = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d); };
  const daysBetween = (a, b) => { const [y1, m1, d1] = a.split('-').map(Number); const [y2, m2, d2] = b.split('-').map(Number); return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000); };
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(arr, r) { const a = arr.slice(); const R = r || Math.random; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const plural = (n, one, many) => n + ' ' + (n > 1 ? many : one);
  const words = t => (String(t || '').trim() ? String(t).trim().split(/\s+/).length : 0);
  const HOUR = 3600000, DAY = 86400000;

  /* ---------- Icônes ---------- */
  const SG = '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  const P = {
    flame: '<path fill="currentColor" d="M12 2c1.6 3.4 5.5 5.6 5.5 10.3a5.5 5.5 0 0 1-11 .3c0-2.3 1-3.9 2.3-5.1.2 1.7.9 2.8 1.9 3.3C10.9 7.4 11.1 4.5 12 2z"/>',
    gel: '<path fill="currentColor" d="M7 2.5h10l-.8 2.3.8 2.2V19a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V7l.8-2.2L7 2.5z"/><path d="M9.5 10.5h5M9.5 13.5h5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".75"/>',
    flask: '<path fill="currentColor" d="M10 2h4v2.6l1.7 1.7A4.5 4.5 0 0 1 17 9.5V19a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3V9.5c0-1.2.5-2.3 1.3-3.2L10 4.6V2z"/><path d="M9.5 14h5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>',
    mountain: '<path fill="currentColor" d="M2 20l5.5-9.5 3 5 4-7.5L22 20H2z"/>',
    trophy: SG + '<path d="M8 4h8v4a4 4 0 0 1-8 0V4z"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 12v3M9 20h6M10 15h4v5h-4z"/></g>',
    target: SG + '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/></g><circle cx="12" cy="12" r="1.6" fill="currentColor"/>',
    book: SG + '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5v-15z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/></g>',
    user: SG + '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6"/></g>',
    users: SG + '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.4 3.6-5 6.5-5s5.5 1.6 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .6 3.3 2.2 3.8 5"/></g>',
    check: '<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></g>',
    x: SG + '<path d="M6 6l12 12M18 6L6 18"/></g>',
    lock: SG + '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></g>',
    pen: SG + '<path d="M4 20l1-4L16 5l3 3L8 19l-4 1z"/><path d="M14 7l3 3"/></g>',
    chest: SG + '<path d="M3 10.5h18V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8.5z"/><path d="M3 10.5V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2.5"/><path d="M10 10.5v3h4v-3"/></g>',
    star: '<path fill="currentColor" d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8L12 2.5z"/>',
    bolt: '<path fill="currentColor" d="M13.5 2L4 13.5h6.5L9.5 22 20 9.5h-6.5L13.5 2z"/>',
    moon: '<path fill="currentColor" d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
    cards: SG + '<rect x="4" y="7" width="12" height="14" rx="2"/><path d="M8 3h10a2 2 0 0 1 2 2v12"/></g>',
    refresh: SG + '<path d="M20 11a8 8 0 1 0-2.4 5.7"/><path d="M20 4v7h-7"/></g>',
    play: '<path fill="currentColor" d="M8 5v14l11-7L8 5z"/>',
    pause: '<path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/>',
    next: '<path fill="currentColor" d="M6 5v14l9-7-9-7zM16 5h3v14h-3z"/>',
    quote: SG + '<path d="M4 5h16v11H9l-5 4V5z"/></g>',
    chat: SG + '<path d="M4 5h11v8H8l-4 3V5z"/><path d="M15 9h5v8l-3-2h-6v-2"/></g>',
    clock: SG + '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>',
    shield: '<path fill="currentColor" d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5l8-3z"/>',
    up: SG + '<path d="M12 19V5M6 11l6-6 6 6"/></g>',
    down: SG + '<path d="M12 5v14M6 13l6 6 6-6"/></g>',
    case: SG + '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/></g>',
    spark: '<path fill="currentColor" d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/>',
    stop: '<rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor"/>',
    flag: SG + '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></g>',
    headphones: SG + '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="5" height="7" rx="2"/><rect x="16" y="14" width="5" height="7" rx="2"/></g>',
    wrench: SG + '<path d="M14.5 6.5a4 4 0 0 0 5 5l-8 8a2.1 2.1 0 0 1-3-3l8-8a4 4 0 0 0-2-2z"/></g>',
    timer: SG + '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></g>',
    infinity: SG + '<path d="M7 9c-3 0-4 2-4 3s1 3 4 3c4 0 6-6 10-6 3 0 4 2 4 3s-1 3-4 3c-4 0-6-6-10-6z"/></g>',
    send: '<path fill="currentColor" d="M3 11.5L21 3l-7.5 18-2.5-7.5L3 11.5z"/>',
    level: SG + '<path d="M4 20V14M10 20V9M16 20V4"/></g>'
  };
  const ic = (n, cls) => '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (P[n] || '') + '</svg>';

  /* ---------- Constantes de jeu ---------- */
  const MAX_HEARTS = 5, HEART_REGEN = 4 * HOUR;
  const SR_DAYS = [0, 1, 3, 7, 16, 35];
  const GOALS = [{ n: 'Footing', v: 50 }, { n: 'Sortie', v: 100 }, { n: 'Sortie longue', v: 200 }, { n: 'Ultra', v: 350 }];
  const PRICES = { freeze: 50, refill: 45, boost: 40, repair: 150 };
  const STREAK_REWARDS = { 3: 20, 7: 50, 14: 50, 30: 100, 50: 100, 100: 200, 200: 300, 365: 500 };
  const TIERS = [
    { n: 'Sentier', c: '#8C7A5B', max: 1000 }, { n: 'Single', c: '#4E8A57', max: 1400 }, { n: 'Crête', c: '#3874AE', max: 1900 },
    { n: 'Col', c: '#7F55AE', max: 2600 }, { n: 'Sommet', c: '#C9601F', max: 3400 }, { n: 'Ultra', c: '#B3243A', max: 4400 }
  ];
  const BOT_NAMES = ['Léa M.', 'Hugo B.', 'Camille R.', 'Théo L.', 'Manon G.', 'Nina P.', 'Bastien F.', 'Chloé V.', 'Romain T.', 'Inès K.', 'Yann D.', 'Sarah C.', 'Paul H.', 'Elsa N.', 'Mathis A.', 'Jade S.', 'Tom E.', 'Lucie O.', 'Arthur J.', 'Zoé W.', 'Rémi Q.', 'Clara Y.', 'Noé I.', 'Anaïs U.', 'Victor Z.', 'Margaux X.', 'Simon B.', 'Louise R.'];
  const AV_COLORS = ['#C2562B', '#2F6FA3', '#6E4A9E', '#3C7F45', '#9A6B0B', '#A33A5A', '#2C8A86', '#5B6470'];
  const QPOOL = [
    { k: 'lessons', n: 2 }, { k: 'perfect', n: 1 }, { k: 'combo', n: 6 }, { k: 'review', n: 1 }, { k: 'defi', n: 1 },
    { k: 'summits', n: 2 }, { k: 'correct', n: 15 }, { k: 'rp', n: 1, coach: true }, { k: 'sprint', n: 1 }, { k: 'gen', n: 1, coach: true },
    { k: 'atelier', n: 1, coach: true }, { k: 'mission', n: 1, needsMission: true }, { k: 'listen', n: 1 }
  ];
  const QLABEL = {
    xp: n => 'Grimpe ' + fmt(n) + ' m de D+', lessons: n => 'Termine ' + n + ' leçons', perfect: () => 'Termine une leçon sans erreur',
    combo: n => 'Enchaîne ' + n + ' bonnes réponses', review: () => 'Fais une révision', defi: () => 'Relève un défi écrit',
    summits: n => 'Travaille ' + n + ' sommets différents', correct: n => 'Réussis ' + n + ' exercices', rp: () => 'Fais un jeu de rôle',
    sprint: () => 'Fais un sprint de 60 secondes', gen: () => 'Fais un entraînement illimité', atelier: () => 'Passe un vrai texte à l\'atelier',
    mission: () => 'Valide une mission terrain', listen: () => 'Écoute les fiches d\'un camp'
  };
  const QICON = { xp: 'mountain', lessons: 'star', perfect: 'spark', combo: 'flame', review: 'refresh', defi: 'pen', summits: 'target', correct: 'check', rp: 'chat', sprint: 'timer', gen: 'infinity', atelier: 'wrench', mission: 'flag', listen: 'headphones' };
  const PEAKS = [{ n: 'Ventoux', h: 1910 }, { n: 'Mont Blanc', h: 4806 }, { n: 'Kilimandjaro', h: 5895 }, { n: 'Aconcagua', h: 6961 }, { n: 'Everest', h: 8849 }, { n: 'Deux Everest', h: 17698 }, { n: 'Cinq Everest', h: 44245 }];
  const BADGES = [
    { id: 'first', n: 'Premier pas', d: 'Termine ta première leçon', i: 'star', t: S => S.stats.lessons >= 1 },
    { id: 'perfect', n: 'Sans faute', d: 'Une leçon sans erreur', i: 'spark', t: S => S.stats.perfect >= 1 },
    { id: 'five', n: 'Cinq départs', d: 'Une leçon dans chaque sommet', i: 'target', t: S => SUMMITS.every(s => s.lessonIds.some(id => S.lessons[id])) },
    { id: 's7', n: 'Une semaine', d: 'Série de 7 jours', i: 'flame', t: S => S.streak.best >= 7 },
    { id: 's30', n: 'Un mois de prépa', d: 'Série de 30 jours', i: 'flame', t: S => S.streak.best >= 30 },
    { id: 's100', n: 'Centurion', d: 'Série de 100 jours', i: 'flame', t: S => S.streak.best >= 100 },
    { id: 'coach', n: 'Premier défi', d: 'Relève un défi écrit', i: 'pen', t: S => S.stats.defis >= 1 },
    { id: 'review5', n: 'Mémoire longue', d: 'Termine 5 révisions', i: 'refresh', t: S => S.stats.reviews >= 5 },
    { id: 'combo10', n: 'Dans le rythme', d: '10 bonnes réponses d\'affilée', i: 'bolt', t: S => S.stats.bestCombo >= 10 },
    { id: 'pen', n: 'Plume', d: '3 défis écrits à 80 ou plus', i: 'pen', t: S => Object.values(S.essays).filter(e => e.best >= 80).length >= 3 },
    { id: 'rp', n: 'Négociateur', d: 'Un jeu de rôle à 70 ou plus', i: 'chat', t: S => (S.carnet.rp || []).some(r => r.score >= 70) },
    { id: 'rp5', n: 'Rodé', d: '5 jeux de rôle terminés', i: 'chat', t: S => S.stats.rp >= 5 },
    { id: 'mission1', n: 'Sur le terrain', d: 'Valide une mission terrain', i: 'flag', t: S => S.stats.missions >= 1 },
    { id: 'mission10', n: 'Praticien', d: 'Valide 10 missions terrain', i: 'flag', t: S => S.stats.missions >= 10 },
    { id: 'atelier', n: 'Atelier', d: 'Fais corriger un vrai texte', i: 'wrench', t: S => S.stats.ateliers >= 1 },
    { id: 'sprint15', n: 'Sprinteur', d: '15 bonnes réponses en un sprint', i: 'timer', t: S => S.sprintBest >= 15 },
    { id: 'gen', n: 'Inépuisable', d: 'Un entraînement illimité', i: 'infinity', t: S => S.stats.gens >= 1 },
    { id: 'listen', n: 'À l\'écoute', d: 'Écoute un camp en entier', i: 'headphones', t: S => S.stats.listens >= 1 },
    { id: 'reader', n: 'Bibliothécaire', d: 'Marque 5 livres comme lus', i: 'book', t: S => Object.keys(S.books).length >= 5 },
    { id: 'summit1', n: 'Premier sommet', d: 'Termine un parcours entier', i: 'mountain', t: S => SUMMITS.some(s => s.lessonIds.every(id => S.lessons[id])) },
    { id: 'summit5', n: 'Les cinq sommets', d: 'Termine les cinq parcours', i: 'trophy', t: S => SUMMITS.every(s => s.lessonIds.every(id => S.lessons[id])) },
    { id: 'ventoux', n: 'Ventoux', d: '1 910 m de D+ cumulés', i: 'mountain', t: S => S.xp >= 1910 },
    { id: 'montblanc', n: 'Mont Blanc', d: '4 806 m de D+ cumulés', i: 'mountain', t: S => S.xp >= 4806 },
    { id: 'everest', n: 'Everest', d: '8 849 m de D+ cumulés', i: 'mountain', t: S => S.xp >= 8849 },
    { id: 'league', n: 'Promu', d: 'Monte d\'une ligue', i: 'up', t: S => S.league && S.league.tier >= 1 },
    { id: 'master', n: 'Maître', d: 'Un sommet maîtrisé à 80 %', i: 'level', t: S => SUMMITS.some(s => summitMastery(s) >= 0.8) },
    { id: 'ultra', n: 'Ligue Ultra', d: 'Atteins la plus haute ligue', i: 'trophy', t: S => S.league && S.league.tier >= 5 }
  ];

  /* ---------- État ---------- */
  const LS_KEY = 'cinq-sommets-v1' + (PLATFORM && PLATFORM.userId ? ':' + PLATFORM.userId : '');
  function fresh() {
    return {
      v: 2, updatedAt: 0, created: Date.now(), xp: 0, gels: 60, hearts: MAX_HEARTS, heartsAt: Date.now(), goal: 100,
      days: {}, streak: { count: 0, last: null, freezes: 0, best: 0, frozen: [], lost: null, notice: null },
      lessons: {}, items: {}, summitLast: {}, quests: null, league: null, boostUntil: 0,
      badges: {}, chests: {}, books: {}, essays: {}, seenCards: {}, missions: {}, carnet: { atelier: [], rp: [] },
      sprintBest: 0, listenLog: {}, atelierDay: null, rpBest: {},
      stats: { correct: 0, answered: 0, lessons: 0, perfect: 0, defis: 0, defiScore: 0, bestCombo: 0, reviews: 0, coach: 0, seconds: 0, rp: 0, missions: 0, ateliers: 0, sprints: 0, gens: 0, listens: 0 },
      sound: true, seenIntro: false, seenV2: false, summit: 'vente'
    };
  }
  function migrate(o) {
    const f = fresh();
    if (!o || typeof o !== 'object') return f;
    const s = Object.assign(f, o);
    s.streak = Object.assign(fresh().streak, o.streak || {});
    s.stats = Object.assign(fresh().stats, o.stats || {});
    ['days', 'lessons', 'items', 'summitLast', 'badges', 'chests', 'books', 'essays', 'seenCards', 'missions', 'listenLog', 'rpBest'].forEach(k => { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; });
    s.carnet = Object.assign({ atelier: [], rp: [] }, (o.carnet && typeof o.carnet === 'object') ? o.carnet : {});
    if (!Array.isArray(s.carnet.atelier)) s.carnet.atelier = [];
    if (!Array.isArray(s.carnet.rp)) s.carnet.rp = [];
    if (!SBYID[s.summit]) s.summit = 'vente';
    if (!o.v || o.v < 2) { s.seenV2 = !!o.seenIntro ? false : true; s.v = 2; }
    return s;
  }
  function loadLocal() { try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
  function saveLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) { /* stockage indisponible */ } }
  let S = migrate(loadLocal());
  let NAME = (PLATFORM && ((PLATFORM.displayName || '').split(' ')[0] || (PLATFORM.email || '').split('@')[0])) || 'Antoine', IS_OWNER = PLATFORM ? PLATFORM.role === 'admin' : true;

  const remote = { ref: null, status: 'local', writing: false, again: false, timer: null, pending: null };
  function persist() { S.updatedAt = Date.now(); saveLocal(); scheduleRemote(); }
  function scheduleRemote() { if (!remote.ref) return; clearTimeout(remote.timer); remote.timer = setTimeout(flushRemote, 1200); }
  async function flushRemote() {
    if (!remote.ref) return;
    if (remote.writing) { remote.again = true; return; }
    remote.writing = true;
    try { await remote.ref.set({ v: 2, state: JSON.parse(JSON.stringify(S)) }); remote.status = 'cloud'; }
    catch (e) { remote.status = (e && e.code === 'invalid_argument') ? 'local' : 'retry'; if (e && e.code === 'invalid_argument') remote.ref = null; }
    remote.writing = false;
    if (remote.again) { remote.again = false; flushRemote(); }
  }
  async function initRemote() {
    if (!window.claude || typeof window.claude.use !== 'function') return;
    try {
      const [user, db] = await Promise.all([window.claude.use('user'), window.claude.use('db')]);
      if (user) {
        try { const me = await user.me(); if (me && me.name) NAME = me.name.split(' ')[0]; IS_OWNER = !!me.isOwner || (await user.isOwner()); } catch (e) { /* ok */ }
      }
      if (!user || !db) { if (!L) renderAll(); return; }
      const uid = await user.id();
      if (!uid) { if (!L) renderAll(); return; }
      const ref = db.doc('data/users/' + uid + '/progress');
      const snap = await ref.get();
      remote.ref = ref;
      remote.status = 'cloud';
      if (snap.exists) {
        const d = snap.data();
        const rs = d && d.state;
        if (rs && (rs.updatedAt || 0) > (S.updatedAt || 0)) {
          const copy = JSON.parse(JSON.stringify(rs));
          if (L) remote.pending = copy; else applyRemote(copy);
        } else if ((S.updatedAt || 0) > ((rs && rs.updatedAt) || 0)) scheduleRemote();
      } else if (S.updatedAt) scheduleRemote();
      initTeam(db, user, uid);
      if (!L) renderAll();
    } catch (e) { remote.status = 'local'; }
  }
  function applyRemote(rs) { S = migrate(rs); saveLocal(); tick(true); if (S.seenIntro && sheetLocked && !L) closeSheet(); renderAll(); pushLeague(); }

  let SAMPLE = null, COACH_OFF = false;
  const samplePromise = (window.claude && typeof window.claude.use === 'function')
    ? window.claude.use('sample').then(s => { SAMPLE = s; if (!s) COACH_OFF = true; return s; }).catch(() => { COACH_OFF = true; return null; })
    : Promise.resolve(null).then(() => { COACH_OFF = true; return null; });
  function coachRefused(code) { return ['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].indexOf(code) >= 0; }
  function coachErrorText(code) {
    if (coachRefused(code)) return 'Le coach n\'est pas disponible ici.';
    if (code === 'rate_limited') return 'Le coach est très sollicité. Réessaie dans un moment.';
    if (code === 'refused') return 'Le coach a refusé cette demande. Reformule ton texte.';
    if (code === 'invalid_json') return 'La réponse du coach était illisible. Réessaie.';
    return 'Le coach n\'a pas pu répondre. Réessaie.';
  }

  /* ---------- Maintenance quotidienne ---------- */
  function regenHearts() {
    if (S.hearts >= MAX_HEARTS) { S.hearts = MAX_HEARTS; S.heartsAt = Date.now(); return; }
    const n = Math.floor((Date.now() - S.heartsAt) / HEART_REGEN);
    if (n > 0) { S.hearts = Math.min(MAX_HEARTS, S.hearts + n); S.heartsAt += n * HEART_REGEN; if (S.hearts >= MAX_HEARTS) S.heartsAt = Date.now(); }
  }
  const nextHeartIn = () => Math.max(0, S.heartsAt + HEART_REGEN - Date.now());
  function streakCheck() {
    const st = S.streak, today = dayKey();
    if (!st.last || st.count <= 0) return;
    const gap = daysBetween(st.last, today);
    if (gap <= 1) return;
    const missed = gap - 1;
    if (st.freezes >= missed) {
      st.freezes -= missed;
      for (let i = 1; i <= missed; i++) st.frozen.push(addDays(st.last, i));
      if (st.frozen.length > 90) st.frozen = st.frozen.slice(-90);
      st.last = addDays(today, -1);
      st.notice = { type: 'freeze', n: missed, day: today };
    } else {
      st.lost = { count: st.count, day: today };
      st.freezes = 0; st.count = 0;
      st.notice = { type: 'lost', n: st.lost.count, day: today };
    }
  }
  function extendStreak() {
    const st = S.streak, today = dayKey();
    if (st.last === today) return { extended: false, count: st.count };
    if (st.last && daysBetween(st.last, today) === 1 && st.count > 0) st.count += 1; else st.count = 1;
    st.last = today;
    const before = st.best;
    st.best = Math.max(st.best, st.count);
    const reward = STREAK_REWARDS[st.count] && st.count > before ? STREAK_REWARDS[st.count] : 0;
    return { extended: true, count: st.count, reward };
  }
  function canRepair() { const l = S.streak.lost; return !!(l && l.count > 0 && daysBetween(l.day, dayKey()) <= 1); }
  function activeMissions() { return Object.keys(S.missions).filter(k => S.missions[k].status === 'active').map(k => Object.assign({ lid: k }, S.missions[k])).sort((a, b) => a.due < b.due ? -1 : 1); }
  function questsEnsure() {
    const d = dayKey();
    if (S.quests && S.quests.day === d) return;
    const r = rng(hash('q' + d));
    const hasMission = activeMissions().length > 0;
    const pool = QPOOL.filter(q => (!q.coach || !COACH_OFF) && (!q.needsMission || hasMission) && (q.k !== 'review' || seenItems().length >= 3));
    const pick = shuffle(pool, r).slice(0, 2);
    S.quests = { day: d, list: [{ k: 'xp', n: Math.max(50, S.goal), p: 0, c: false }].concat(pick.map(q => ({ k: q.k, n: q.n, p: 0, c: false }))), sums: [], chest: false };
  }
  function bump(k, v) {
    if (!S.quests) return;
    S.quests.list.forEach(q => {
      if (q.k !== k) return;
      if (k === 'combo') q.p = Math.max(q.p, v);
      else if (k === 'summits') { if (S.quests.sums.indexOf(v) < 0) S.quests.sums.push(v); q.p = S.quests.sums.length; }
      else q.p += v;
    });
  }
  const questDone = q => q.p >= q.n;
  function questAlert() { if (!S.quests) return false; return S.quests.list.some(q => questDone(q) && !q.c) || (S.quests.list.every(q => q.c) && !S.quests.chest); }
  function missionsExpire() {
    const today = dayKey();
    Object.keys(S.missions).forEach(k => { const m = S.missions[k]; if (m.status === 'active' && daysBetween(m.due, today) > 3) m.status = 'expired'; });
  }

  /* ---------- Ligue ---------- */
  function weekStart(d = new Date()) { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
  const weekKey = (d) => dayKey(weekStart(d));
  function weekFrac() { const s = weekStart(); return Math.min(1, Math.max(0, (Date.now() - s.getTime()) / (7 * DAY))); }
  function bots(week, tier) {
    const r = rng(hash(week + '|' + tier));
    const names = shuffle(BOT_NAMES, r).slice(0, 14);
    const max = TIERS[tier].max;
    return names.map((nm, i) => {
      const a = r(), b = r(), c = r(), d = r();
      const T = a < 0.18 ? Math.round(max * 0.14 * b) : Math.round(max * (0.16 + 0.84 * Math.pow(b, 0.85)));
      return { nm, T, p: 0.7 + c * 0.7, sess: 1 + Math.floor(d * 3), col: AV_COLORS[(i + tier) % AV_COLORS.length] };
    });
  }
  function botXP(b, t) { if (t >= 1) return b.T; const steps = 7 * b.sess; const q = Math.floor(t * steps) / steps; return Math.round(b.T * Math.pow(q, b.p) / 5) * 5; }
  function standings(week, tier, myXP, t) {
    const list = bots(week, tier).map(b => ({ nm: b.nm, xp: botXP(b, t), col: b.col, me: false }));
    list.push({ nm: 'Toi', xp: myXP, col: 'var(--accent)', me: true });
    list.sort((x, y) => (y.xp - x.xp) || (x.me ? -1 : y.me ? 1 : 0));
    return list;
  }
  function leagueEnsure() {
    const wk = weekKey();
    if (!S.league) { S.league = { week: wk, tier: 0, xp: 0, hist: [], result: null }; return; }
    const lg = S.league;
    if (lg.week === wk) return;
    const list = standings(lg.week, lg.tier, lg.xp, 1);
    const rank = list.findIndex(x => x.me) + 1;
    let move = 0;
    if (lg.xp > 0 && rank <= 5 && lg.tier < TIERS.length - 1) move = 1;
    else if ((rank >= 11 || lg.xp === 0) && lg.tier > 0) move = -1;
    const reward = lg.xp > 0 ? ({ 1: 60, 2: 40, 3: 25 }[rank] || 0) : 0;
    S.gels += reward;
    lg.hist = (lg.hist || []).concat([{ week: lg.week, tier: lg.tier, rank, xp: lg.xp }]).slice(-12);
    lg.result = { rank, move, reward, from: lg.tier, to: lg.tier + move, seen: false, active: lg.xp > 0 };
    lg.tier += move; lg.week = wk; lg.xp = 0;
  }

  /* ---------- Répétition espacée et maîtrise ---------- */
  function srUpdate(iid, ok) {
    if (!ITEMS[iid]) return;
    const it = S.items[iid] || { box: 0, due: 0, w: 0, c: 0 };
    if (ok) { it.box = Math.min(SR_DAYS.length - 1, it.box + 1); it.c++; } else { it.box = 0; it.w++; }
    it.due = Date.now() + SR_DAYS[it.box] * DAY;
    S.items[iid] = it;
  }
  function seenItems() { return Object.keys(S.items).filter(id => ITEMS[id] && ITEMS[id].e.t !== 'ecrit'); }
  function dueCount() { const now = Date.now(); return seenItems().filter(id => S.items[id].due <= now).length; }
  function lessonDue(lid) { const now = Date.now(); return LESSONS[lid].l.ex.filter(e => e.t !== 'ecrit' && S.items[e.id] && S.items[e.id].due <= now).length; }
  function itemStrength(id) {
    const it = S.items[id]; if (!it) return 0;
    const base = it.box / (SR_DAYS.length - 1);
    return it.due <= Date.now() ? base * 0.5 : base;
  }
  function summitMastery(s) {
    const ids = []; s.lessonIds.forEach(lid => LESSONS[lid].l.ex.forEach(e => { if (e.t !== 'ecrit') ids.push(e.id); }));
    if (!ids.length) return 0;
    return ids.reduce((a, id) => a + itemStrength(id), 0) / ids.length;
  }
  function summitAccuracy(s) {
    let c = 0, w = 0;
    s.lessonIds.forEach(lid => LESSONS[lid].l.ex.forEach(e => { const it = S.items[e.id]; if (it) { c += it.c; w += it.w; } }));
    return c + w ? c / (c + w) : null;
  }
  function pickReview(n, only) {
    const now = Date.now();
    const ids = only ? only.filter(id => ITEMS[id] && ITEMS[id].e.t !== 'ecrit') : seenItems();
    const due = ids.filter(id => S.items[id] && S.items[id].due <= now).sort((a, b) => S.items[a].box - S.items[b].box || S.items[a].due - S.items[b].due);
    let pick = due.slice(0, n);
    if (pick.length < n) {
      const score = id => { const it = S.items[id]; return it ? (it.w - it.c * 0.3) : 0; };
      const rest = ids.filter(id => pick.indexOf(id) < 0).sort((a, b) => score(b) - score(a));
      pick = pick.concat(rest.slice(0, n - pick.length));
    }
    return shuffle(pick);
  }
  function fragileItems(n) {
    return seenItems().filter(id => S.items[id].w > 0).sort((a, b) => (S.items[b].w - S.items[b].c * 0.5) - (S.items[a].w - S.items[a].c * 0.5)).slice(0, n);
  }

  /* ---------- Progression ---------- */
  const isDone = lid => !!S.lessons[lid];
  function isUnlocked(lid) { const m = LESSONS[lid]; const i = m.s.lessonIds.indexOf(lid); return i === 0 || isDone(m.s.lessonIds[i - 1]); }
  function nextLesson(s) { return s.lessonIds.find(id => !isDone(id)) || null; }
  const summitDone = s => s.lessonIds.filter(isDone).length;
  function recommend() {
    if (dueCount() >= 6 && seenItems().length >= 8) return { type: 'review' };
    const c = SUMMITS.map(s => ({ s, lid: nextLesson(s) })).filter(x => x.lid);
    if (!c.length) return seenItems().length >= 3 ? { type: 'review' } : null;
    c.sort((a, b) => (S.summitLast[a.s.id] || 0) - (S.summitLast[b.s.id] || 0) || ORDER.indexOf(a.s.id) - ORDER.indexOf(b.s.id));
    return { type: 'lesson', lid: c[0].lid };
  }
  function checkBadges() { const out = []; BADGES.forEach(b => { try { if (!S.badges[b.id] && b.t(S)) { S.badges[b.id] = dayKey(); out.push(b); } } catch (e) { /* ok */ } }); return out; }

  /* Gain de D+ hors leçon (missions, atelier, écoute…) */
  function award(xp, gels) {
    const today = dayKey();
    const wasGoal = (S.days[today] || 0) >= S.goal;
    if (Date.now() < S.boostUntil) xp *= 2;
    S.xp += xp; S.days[today] = (S.days[today] || 0) + xp; S.league.xp += xp;
    bump('xp', xp);
    let g = gels || 0;
    const goalHit = !wasGoal && S.days[today] >= S.goal;
    if (goalHit) g += 10;
    S.gels += g;
    pushLeague();
    return { xp, gels: g, goalHit };
  }

  let lastTickDay = dayKey();
  function tick(silent) {
    regenHearts(); missionsExpire(); questsEnsure(); streakCheck();
    const prevWeek = S.league && S.league.week;
    leagueEnsure();
    if (prevWeek && S.league.week !== prevWeek) teamResubscribe();
    const d = dayKey();
    const changed = d !== lastTickDay;
    lastTickDay = d;
    if (!silent) persist();
    return changed;
  }

  /* ---------- Son, vibration, confettis, toast ---------- */
  let actx = null;
  function tone(freqs, dur, type, gain) {
    if (!S.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = actx.currentTime + 0.01;
      freqs.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type || 'sine'; o.frequency.value = f;
        const st = t0 + i * dur * 0.85;
        g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(gain || 0.08, st + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, st + dur);
        o.connect(g); g.connect(actx.destination); o.start(st); o.stop(st + dur + 0.02);
      });
    } catch (e) { /* audio indisponible */ }
  }
  const sfx = {
    ok: () => tone([660, 990], 0.11, 'sine', 0.09), bad: () => tone([196, 147], 0.16, 'triangle', 0.07),
    done: () => tone([523, 659, 784, 1046], 0.13, 'sine', 0.09), coin: () => tone([988, 1319], 0.08, 'square', 0.03),
    tap: () => tone([420], 0.04, 'sine', 0.025), tick: () => tone([880], 0.03, 'sine', 0.02)
  };
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* non supporté */ } }
  let toastTimer;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2600); }
  function confetti() {
    try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) { /* ok */ }
    const c = $('#confetti'), ctx = c.getContext('2d'); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1, W = c.width = innerWidth * dpr, H = c.height = innerHeight * dpr;
    const cols = ['#E4571F', '#1B6CA8', '#7649A3', '#0E7C86', '#D6A03A', '#EC8410'];
    const ps = Array.from({ length: 130 }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .38, vx: (Math.random() - .5) * 15 * dpr, vy: (-Math.random() * 15 - 5) * dpr, s: (5 + Math.random() * 6) * dpr, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[Math.floor(Math.random() * cols.length)] }));
    let f = 0;
    (function step() {
      ctx.clearRect(0, 0, W, H);
      ps.forEach(p => { p.vy += 0.42 * dpr; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.66); ctx.restore(); });
      if (++f < 170) requestAnimationFrame(step); else ctx.clearRect(0, 0, W, H);
    })();
  }
  function msToHM(ms) { const m = Math.ceil(ms / 60000); const h = Math.floor(m / 60); return h > 0 ? h + ' h ' + pad(m % 60) : m + ' min'; }
  function untilMidnight() { const n = new Date(); const m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1); return m - n; }

  /* ---------- Feuille modale ---------- */
  let sheetLocked = false;
  function sheet(html, locked) { const el = $('#sheet'); el.innerHTML = '<div class="panel" role="dialog" aria-modal="true">' + html + '</div>'; el.hidden = false; sheetLocked = !!locked; }
  function closeSheet() { const el = $('#sheet'); el.hidden = true; el.innerHTML = ''; sheetLocked = false; }
