  /* ---------- Avec Claude ----------
     Jeux de rôle, atelier et entraînement illimité se passent dans une conversation
     avec Claude (appli ou claude.ai). Le jeu prépare le prompt, le joueur le colle,
     puis revient noter sa séance. Aucune clé API, aucun coût en plus. */
  const CLAUDE_URL = 'https://claude.ai/new';
  const RP_MAX_TURNS = 8;
  const ATELIER_TYPES = ['E-mail à une marque', 'Proposition commerciale', 'Légende Instagram', 'Cover de carrousel', 'Message au club ou à l\'équipe', 'Pitch ou présentation', 'Autre'];

  function copyPrompt(text, done) {
    const fallback = () => {
      let ok = false;
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;width:2px;height:2px;opacity:0';
      document.body.appendChild(ta);
      try { ta.select(); ta.setSelectionRange(0, text.length); ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      done(ok);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(() => done(true), fallback); return; }
    } catch (e) { /* suite */ }
    fallback();
  }
  function openClaude() {
    const w = window.open(CLAUDE_URL, '_blank');
    if (w) { try { w.opener = null; } catch (e) { /* ok */ } } else location.href = CLAUDE_URL;
  }
  function claudeStepsHTML(copied, what) {
    return '<section class="card list claude-steps"><div class="row"><span class="prac-ic" style="--pc:var(--accent)">' + ic('chat') + '</span><div class="small">' + esc(what) + ' La conversation passe par ton compte Claude : aucune clé API, aucun coût en plus.</div></div>' +
      '<button class="btn block' + (copied ? ' ghost' : '') + '" data-act="claude-copy">' + ic(copied ? 'check' : 'cards') + (copied ? 'Prompt copié · recopier' : '1 · Copier le prompt') + '</button>' +
      '<button class="btn block' + (copied ? '' : ' ghost') + '" data-act="claude-open">' + ic('send') + '2 · Ouvrir Claude et coller</button></section>';
  }
  function claudeFallbackHTML() {
    if (!L || !L.copyFailed) return '';
    return '<section class="card list"><div class="small"><b>Copie automatique impossible.</b> Sélectionne le texte ci-dessous, copie-le, puis colle-le dans Claude.</div><textarea class="essay" readonly style="min-height:160px" aria-label="Prompt à copier">' + esc(claudePromptNow()) + '</textarea></section>';
  }

  function rpPrompt(sc, s) {
    return 'Jouons un jeu de rôle d\'entraînement. Je m\'appelle ' + NAME + ' et je travaille chez Les Traileurs. ' + CONTEXT + '\n\n' +
      'Compétence travaillée : ' + s.name + '.\nMon objectif dans la scène : ' + sc.brief + '\n\n' +
      'Tu joues mon interlocuteur. Voici ton personnage, à ne pas me révéler :\n' + sc.persona + '\n\n' +
      'Règles :\n- Reste dans ton rôle. Réponds comme dans une vraie conversation, en 1 à 3 phrases, en français.\n' +
      '- Ne révèle tes informations cachées que si je les obtiens par de bonnes questions.\n' +
      '- Ne me donne aucun conseil pendant la scène et ne commente pas ma façon de faire.\n' +
      '- Réagis de façon réaliste : tu peux résister, poser des questions, accepter ou refuser. Si un accord ou un refus clair est atteint, dis-le.\n' +
      '- La scène dure au plus ' + RP_MAX_TURNS + ' répliques de ma part. Quand j\'écris FIN, ou après ma ' + RP_MAX_TURNS + 'e réplique, sors du rôle et fais le débrief.\n\n' +
      'Débrief, en me tutoyant, exigeant et bienveillant :\n1. Commence par « Note : X/100 ».\n2. L\'issue de la conversation en une phrase.\n' +
      '3. Chaque critère avec ✅ ou ❌ :\n' + sc.crit.map((c, i) => '   ' + (i + 1) + '. ' + c).join('\n') + '\n' +
      '4. Deux points forts, puis trois améliorations concrètes.\n5. Le moment clé : cite une de mes répliques et propose une meilleure formulation.\n\n' +
      'Commence directement par ta première réplique, sans préambule : « ' + sc.opening.replace('Antoine', NAME) + ' »';
  }
  function atelierPrinciples(sid) {
    const s = SBYID[sid];
    const out = [];
    s.units.forEach(u => u.lessons.forEach(l => (l.cards || []).forEach(c => { if (!l.defi) out.push('- ' + c.h + ' (' + c.src + ') : ' + plain(c.b).replace(/\n/g, ' ').slice(0, 260)); })));
    return out.join('\n');
  }
  function atelierPrompt(type, lens, text) {
    const s = SBYID[lens];
    return 'Tu es mon coach en ' + s.short.toLowerCase() + '. Je m\'appelle ' + NAME + ' et je travaille chez Les Traileurs. ' + CONTEXT + '\n' +
      'Je te soumets un vrai texte de travail. Type : ' + type + '.\n\nPrincipes à appliquer, issus des livres de référence de mon programme :\n' + atelierPrinciples(lens) + '\n\n' +
      'Analyse mon texte avec exigence et bienveillance, en français, en me tutoyant :\n1. Commence par « Note : X/100 » et un diagnostic en deux phrases.\n' +
      '2. Deux à quatre principes ci-dessus, en les nommant : pour chacun, ce que fait mon texte et ce qu\'il faut changer.\n' +
      '3. Une version retravaillée, pour le même usage et dans la même langue. N\'invente aucun fait ni chiffre : garde les informations de mon texte.\n' +
      '4. Une règle courte à retenir.\n\n' +
      (words(text) >= 3 ? 'Mon texte, entre les balises :\n<texte>\n' + text.slice(0, 8000) + '\n</texte>' : 'Je te colle mon texte dans le message suivant : attends-le avant de répondre.');
  }
  function genSource(s) {
    const units = s.units.filter((u, ui) => ui === 0 || u.lessonIds.some(isDone));
    const lessons = [];
    units.forEach(u => u.lessons.forEach(l => { if (!l.defi) lessons.push(l); }));
    return lessons;
  }
  function genPrompt(s) {
    const lessons = genSource(s);
    const known = []; lessons.forEach(l => l.ex.forEach(e => known.push('- ' + e.q.slice(0, 90))));
    return 'Tu es mon coach dans un jeu d\'apprentissage quotidien. Je m\'appelle ' + NAME + ' et je travaille chez Les Traileurs. ' + CONTEXT + '\n' +
      'Sommet travaillé : ' + s.name + '.\n\nFiches de cours (seule source autorisée) :\n' +
      lessons.map(l => '## ' + l.title + '\n' + (l.cards || []).map(c => c.h + ' : ' + plain(c.b) + ' (Source : ' + c.src + ')').join('\n')).join('\n\n') +
      '\n\nPose-moi 6 questions inédites, UNE PAR UNE, et attends ma réponse avant de passer à la suivante :\n' +
      '- 3 QCM à 4 options (A, B, C, D) de longueur comparable, une seule bonne réponse, avec des distracteurs plausibles qui reprennent des erreurs fréquentes ;\n' +
      '- 2 vrai ou faux ;\n- 1 phrase à trou avec 4 propositions.\n' +
      'Au moins 3 questions sont des cas pratiques réalistes dans mon contexte.\n' +
      'Appuie-toi UNIQUEMENT sur les fiches : n\'ajoute aucun chiffre, étude, auteur ou citation qui n\'y figure pas.\n' +
      'Évite ces questions, que je connais déjà :\n' + known.slice(0, 40).join('\n') + '\n\n' +
      'Après chaque réponse, dis-moi si c\'est juste et explique en une ou deux phrases. À la fin, donne mon score sur 6 et les notions à revoir.\nCommence par la première question.';
  }
  function claudePromptNow() {
    if (!L) return '';
    if (L.mode === 'defi' && L.cur) return defiPrompt(L.cur);
    if (L.kind === 'rp') return rpPrompt(L.sc, L.s);
    if (L.kind === 'atelier') return atelierPrompt(L.type, L.lens, L.text || '');
    if (L.kind === 'gen') return genPrompt(L.s);
    return '';
  }

  function startClaude(kind, opts) {
    opts = opts || {};
    if (kind === 'rp') {
      const sc = ROLEPLAYS.find(r => r.id === opts.id); if (!sc) return;
      L = newSession('claude', { kind, sc, s: SBYID[sc.skill] || SUMMITS[0], title: sc.title });
    } else if (kind === 'atelier') {
      const lens = SBYID[opts.lens] ? opts.lens : 'vente';
      L = newSession('claude', { kind, lens, s: SBYID[lens], type: ATELIER_TYPES.indexOf(opts.type) >= 0 ? opts.type : ATELIER_TYPES[0], text: opts.text || '', title: 'Atelier' });
    } else if (kind === 'gen') {
      const s = SBYID[opts.sid]; if (!s) return;
      L = newSession('claude', { kind, s, title: 'Entraînement illimité' });
    } else return;
    Object.assign(L, { stage: opts.back ? 'back' : 'brief', copied: false, copyFailed: false, score: null, note: '', version: '', genScore: null });
    openOverlay(); renderOverlay();
  }
  function rememberClaude() {
    const o = { kind: L.kind, at: Date.now(), title: L.title };
    if (L.kind === 'rp') o.id = L.sc.id;
    if (L.kind === 'atelier') { o.lens = L.lens; o.type = L.type; o.text = (L.text || '').slice(0, 6000); }
    if (L.kind === 'gen') o.sid = L.s.id;
    S.claudeOpen = o; saveLocal();
  }
  function resumeClaude() {
    const o = S.claudeOpen; if (!o) return;
    startClaude(o.kind, { id: o.id, lens: o.lens, type: o.type, text: o.text, sid: o.sid, back: true });
  }
  function readClaudeInputs() {
    if (!L) return;
    const v = id => { const el = $(id); return el ? el.value : null; };
    const T = (L.mode === 'defi' && L.cur) ? L.cur : L;
    const sc = v('#cl-score'); if (sc !== null) T.score = sc;
    const n = v('#cl-note'); if (n !== null) T.note = n;
    const ver = v('#cl-version'); if (ver !== null) T.version = ver;
    if (L.mode === 'claude' && L.kind === 'atelier' && L.stage === 'brief') { const t = v('#at-in'); if (t !== null) L.text = t; }
  }
  function parseScore(v) {
    const n = Math.round(Number(String(v == null ? '' : v).replace(',', '.').replace(/[^0-9.]/g, '')));
    return String(v == null ? '' : v).trim() !== '' && isFinite(n) && n >= 0 && n <= 100 ? n : null;
  }

  function renderClaude() {
    const el = lessonEl(), s = L.s;
    el.style.setProperty('--sc', s.color);
    let body = '', foot = '';
    if (L.stage === 'brief') {
      if (L.kind === 'rp') {
        const sc = L.sc;
        body = '<span class="qtag">' + ic('chat') + 'Jeu de rôle · ' + esc(s.short) + '</span><h2 class="h-display" style="font-size:24px;margin:0">' + esc(sc.title) + '</h2><div class="ctx">' + esc(sc.brief) + '</div>' +
          '<section class="card"><h5 style="margin:0 0 6px" class="eyebrow">Claude évaluera</h5><ul class="crit" style="color:var(--ink)">' + sc.crit.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></section>' +
          claudeStepsHTML(L.copied, 'Claude joue ton interlocuteur, ' + RP_MAX_TURNS + ' répliques au plus. Écris FIN pour passer au débrief et à la note.') +
          '<p class="small muted" style="margin:0">Le prompt contient le rôle secret de ton interlocuteur : colle-le sans le lire pour garder la surprise.</p>';
      } else if (L.kind === 'atelier') {
        body = '<span class="qtag">' + ic('wrench') + 'Atelier</span><h2 class="h-display" style="font-size:22px;margin:0">Ton vrai travail, relu par Claude</h2><p class="small muted" style="margin:0">Un texte que tu t\'apprêtes à envoyer ou à publier. Claude l\'analyse avec les principes du sommet choisi et te propose une version retravaillée.</p>' +
          '<div><div class="eyebrow" style="margin-bottom:6px">Type de texte</div><div class="seg">' + ATELIER_TYPES.map(t => '<button class="' + (L.type === t ? 'on' : '') + '" data-act="at-type" data-v="' + esc(t) + '">' + esc(t) + '</button>').join('') + '</div></div>' +
          '<div><div class="eyebrow" style="margin-bottom:6px">Angle d\'analyse</div><div class="seg">' + SUMMITS.map(x => '<button class="' + (L.lens === x.id ? 'on' : '') + '" data-act="at-lens" data-v="' + x.id + '">' + esc(x.short) + '</button>').join('') + '</div></div>' +
          '<textarea class="essay" id="at-in" data-in="atelier" placeholder="Colle ton texte ici, ou directement dans Claude après le prompt…" aria-label="Ton texte"></textarea><div class="wc num" id="wc"></div>' +
          claudeStepsHTML(L.copied, 'Le prompt contient les principes du sommet et ton texte.');
      } else {
        body = '<span class="qtag">' + ic('infinity') + 'Entraînement illimité</span><h2 class="h-display" style="font-size:22px;margin:0">' + esc(s.name) + '</h2><p class="small muted" style="margin:0">Claude te pose 6 questions inédites tirées des fiches des camps que tu as ouverts, avec des cas Les Traileurs. Il corrige chaque réponse et te donne ton score à la fin. Fini les réponses apprises par cœur.</p>' +
          claudeStepsHTML(L.copied, 'Le prompt contient tes fiches de cours, pour que Claude s\'y tienne.');
      }
      body += claudeFallbackHTML();
      foot = '<button class="btn block" data-act="claude-back">' + ic('check') + 'J\'ai fini avec Claude : noter ma séance</button>';
    } else {
      let form = '';
      if (L.kind === 'gen') {
        form = '<div class="eyebrow">Ton score donné par Claude</div><div class="seg" role="radiogroup" aria-label="Bonnes réponses sur 6">' + [0, 1, 2, 3, 4, 5, 6].map(n => '<button class="' + (L.genScore === n ? 'on' : '') + '" data-act="gen-score" data-v="' + n + '">' + n + ' / 6</button>').join('') + '</div>';
      } else {
        form = '<label class="eyebrow" for="cl-score">La note donnée par Claude</label><div class="calc"><input id="cl-score" data-in="claude-score" inputmode="numeric" maxlength="3" autocomplete="off" placeholder="0 à 100" aria-label="Note sur 100" value="' + esc(L.score == null ? '' : L.score) + '"><span class="u">/ 100</span></div>';
        if (L.kind === 'rp') form += '<label class="eyebrow" for="cl-note">Ce que tu retiens (facultatif)</label><textarea class="essay" id="cl-note" data-in="claude-note" style="min-height:100px" placeholder="L\'issue, le moment clé, la formulation à réutiliser…" aria-label="Ce que tu retiens">' + esc(L.note || '') + '</textarea>';
        else form += '<label class="eyebrow" for="cl-version">La version retravaillée (facultatif)</label><textarea class="essay" id="cl-version" data-in="claude-version" style="min-height:120px" placeholder="Colle-la ici pour la retrouver dans ton carnet." aria-label="Version retravaillée">' + esc(L.version || '') + '</textarea>' +
          '<label class="eyebrow" for="cl-note">La règle à retenir (facultatif)</label><input class="field" id="cl-note" data-in="claude-note" maxlength="300" autocomplete="off" aria-label="Règle à retenir" value="' + esc(L.note || '') + '">';
      }
      body = '<span class="qtag">' + ic(L.kind === 'rp' ? 'chat' : L.kind === 'atelier' ? 'wrench' : 'infinity') + esc(L.title) + '</span><h2 class="h-display" style="font-size:22px;margin:0">Comment ça s\'est passé ?</h2>' +
        '<p class="small muted" style="margin:0">Reporte ici ce que Claude t\'a donné à la fin de la conversation. Ta série et ton D+ comptent dès que tu valides.</p><section class="card list">' + form + '</section>' +
        '<button class="link small" style="align-self:flex-start" data-act="claude-brief">Revenir au prompt</button>';
      const xp = L.kind === 'gen' ? 30 + 5 * (L.genScore || 0) : L.kind === 'rp' ? defiXP(parseScore(L.score) || 0) : atelierXP();
      foot = '<div class="row" style="gap:10px"><button class="btn ghost" data-act="claude-drop">Abandonner</button><button class="btn block grow" data-act="claude-done">Valider' + (xp ? ' · +' + xp + ' m' : '') + '</button></div>';
    }
    el.innerHTML = headerHTML(L.stage === 'back' ? 0.85 : 0.35, '<span class="lhearts inf">Avec Claude</span>') + '<div class="lbody"><div class="in">' + body + '</div></div><div class="lfoot"><div class="in">' + foot + '</div></div>';
    const ta = $('#at-in'); if (ta) { ta.value = L.text || ''; updateWCFor(ta); }
  }
  function updateWCFor(ta) { const w = $('#wc'); if (w) w.textContent = plural(words(ta.value), 'mot', 'mots'); }
  function atelierXP() { const today = dayKey(); const n = S.atelierDay && S.atelierDay.day === today ? S.atelierDay.n : 0; return n < 3 ? 40 : 0; }

  function claudeCopy() {
    readClaudeInputs();
    const text = claudePromptNow();
    if (!text) return;
    copyPrompt(text, ok => {
      if (!L) return;
      const target = L.mode === 'defi' ? L.cur : L;
      target.copied = ok; L.copyFailed = !ok;
      if (ok) { toast('Prompt copié. Colle-le dans une nouvelle conversation.'); sfx.tap(); }
      renderOverlay();
    });
  }
  function claudeOpenNow() {
    readClaudeInputs();
    const T = L && L.mode === 'defi' ? L.cur : L;
    if (T && !T.copied) { try { navigator.clipboard.writeText(claudePromptNow()).then(() => { T.copied = true; }, () => {}); } catch (e) { /* ok */ } }
    openClaude();
    if (L && L.mode === 'claude') { rememberClaude(); if (L.stage === 'brief') { L.stage = 'back'; renderOverlay(); } }
  }
  function claudeDone() {
    readClaudeInputs();
    const today = dayKey();
    if (L.kind === 'gen') {
      if (L.genScore == null) { toast('Indique ton score sur 6.'); return; }
      S.claudeOpen = null;
      S.stats.gens++; bump('gen', 1); bump('summits', L.s.id);
      sessionReward(30 + 5 * L.genScore, 5, 'Entraînement terminé', L.genScore + ' / 6 avec Claude sur ' + L.s.name + '.', 'infinity');
      return;
    }
    const score = parseScore(L.score);
    if (score == null) { toast('Indique la note sur 100 donnée par Claude.'); return; }
    S.claudeOpen = null;
    if (L.kind === 'rp') {
      const sc = L.sc;
      S.stats.rp++; bump('rp', 1); bump('summits', sc.skill);
      S.rpBest[sc.id] = Math.max(S.rpBest[sc.id] || 0, score);
      S.carnet.rp.push({ id: sc.id, at: Date.now(), score, verdict: (L.note || '').slice(0, 1500) });
      if (S.carnet.rp.length > 25) S.carnet.rp = S.carnet.rp.slice(-25);
      sessionReward(defiXP(score), score >= 70 ? 15 : 5, 'Jeu de rôle terminé', score + '/100 · ' + sc.title, 'chat');
      return;
    }
    const s = SBYID[L.lens], xp = atelierXP();
    S.carnet.atelier.push({ at: Date.now(), type: L.type, lens: s.short, text: (L.text || '').slice(0, 2000), score, diagnostic: '', version: (L.version || '').slice(0, 2000), retenir: (L.note || '').slice(0, 300) });
    if (S.carnet.atelier.length > 15) S.carnet.atelier = S.carnet.atelier.slice(-15);
    S.stats.ateliers++; bump('atelier', 1);
    if (!S.atelierDay || S.atelierDay.day !== today) S.atelierDay = { day: today, n: 0 };
    S.atelierDay.n++;
    L.s = s;
    sessionReward(xp, 5, 'Rangé dans ton carnet', 'Tu retrouveras ce texte' + (L.version ? ' et sa version retravaillée' : '') + ' dans l\'onglet Carnet.', 'wrench');
  }

  /* Choix du sommet pour l'entraînement illimité */
  function genSheet() {
    const done = SUMMITS.filter(s => summitDone(s) > 0);
    sheet('<div class="eyebrow" style="color:var(--c-psycho)">Entraînement illimité avec Claude</div><h3>Sur quel sommet ?</h3><p class="small muted">Claude crée 6 questions inédites à partir des fiches des camps que tu as ouverts, avec des cas Les Traileurs. Elles ne coûtent pas de gourde.</p>' +
      '<div class="list">' + SUMMITS.map(s => '<button class="btn ghost block" style="justify-content:flex-start;border-color:' + s.color + '" data-act="gen-start" data-s="' + s.id + '"><i class="dot" style="width:12px;height:12px;border-radius:50%;background:' + s.color + '"></i>' + esc(s.name) + (summitDone(s) ? '' : ' · découverte') + '</button>').join('') + '</div>' +
      (done.length ? '' : '<p class="small muted">Tu n\'as encore ouvert aucun camp : les questions porteront sur le premier camp.</p>') + '<button class="btn ghost block" data-act="close-sheet">Annuler</button>');
  }

  /* Récompense commune pour les activités hors parcours */
  function sessionReward(xp, gels, title, sub, icon) {
    const today = dayKey();
    const wasGoal = (S.days[today] || 0) >= S.goal;
    const boosted = Date.now() < S.boostUntil;
    if (boosted) xp *= 2;
    S.xp += xp; S.days[today] = (S.days[today] || 0) + xp; S.league.xp += xp;
    bump('xp', xp);
    const sr = extendStreak();
    if (sr.reward) gels += sr.reward;
    const goalHit = !wasGoal && S.days[today] >= S.goal;
    if (goalHit) gels += 10;
    S.gels += gels;
    const badges = checkBadges();
    persist(); pushLeague(); sfx.done();
    const sc = L.s ? L.s.color : 'var(--accent)';
    L.mode = 'lesson'; L.s = L.s || null;
    L.result = { xp, gels, perfect: false, acc: 0, seconds: Math.round((Date.now() - L.start) / 1000), boosted, sr, goalHit, badges, heartBack: false, custom: { title, sub, icon, color: sc } };
    L.ends = ['custom']; if (sr.extended) L.ends.push('streak'); if (goalHit) L.ends.push('goal'); if (badges.length) L.ends.push('badges');
    L.endIdx = 0; L.phase = 'end';
    renderEndCustom();
    confetti();
  }
  function renderEndCustom() {
    const R = L.result;
    if (L.ends[L.endIdx] !== 'custom') { renderEnd(); return; }
    const c = R.custom;
    lessonEl().style.setProperty('--sc', c.color);
    lessonEl().innerHTML = '<div class="lbody"><div class="in"><div class="end"><div class="hero-ic" style="--sc:' + c.color + '">' + ic(c.icon) + '</div><h2>' + esc(c.title) + '</h2><p>' + esc(c.sub) + '</p>' +
      '<div class="tiles"><div class="tile" style="--tc:var(--flame)"><div class="tt">D+ gagné</div><div class="tv num">' + fmt(R.xp) + ' m</div></div><div class="tile" style="--tc:var(--gel)"><div class="tt">Gels</div><div class="tv num">+' + R.gels + '</div></div><div class="tile" style="--tc:var(--good)"><div class="tt">Série</div><div class="tv num">' + S.streak.count + ' j</div></div></div>' +
      (R.boosted ? '<p class="small" style="color:var(--flame);font-weight:700">Boost actif : D+ doublé</p>' : '') + '</div></div></div><div class="lfoot"><div class="in"><button class="btn block" data-act="end-next">Continuer</button></div></div>';
  }

  /* ---------- Sprint 60 s ---------- */
  function startSprint() {
    const pool = seenItems().filter(id => ['qcm', 'vf', 'trou'].indexOf(ITEMS[id].e.t) >= 0);
    if (pool.length < 6) { toast('Termine quelques leçons de plus pour débloquer le sprint.'); return; }
    L = newSession('sprint', { stage: 'ready', queue: shuffle(pool), score: 0, wrong: 0, endAt: 0, flash: null });
    openOverlay(); renderOverlay();
  }
  function sprintNext() {
    if (!L.queue.length) L.queue = shuffle(seenItems().filter(id => ['qcm', 'vf', 'trou'].indexOf(ITEMS[id].e.t) >= 0));
    const iid = L.queue.shift(), it = ITEMS[iid];
    L.cur = { iid, e: it.e, s: it.s, order: it.e.o ? shuffle(it.e.o.map((_, i) => i)) : null };
  }
  function sprintGo() {
    L.stage = 'run'; L.endAt = Date.now() + 60000; L.start = Date.now();
    sprintNext(); renderSprint();
    L.timer = setInterval(() => {
      if (!L || L.mode !== 'sprint') return;
      const left = L.endAt - Date.now();
      const bar = $('#sprint-bar'); if (bar) bar.style.width = Math.max(0, 100 * left / 60000) + '%';
      const t = $('#sprint-t'); if (t) t.textContent = Math.max(0, Math.ceil(left / 1000)) + ' s';
      if (left <= 0) { clearInterval(L.timer); L.timer = null; sprintEnd(); }
    }, 200);
  }
  function sprintAnswer(v) {
    if (!L || L.stage !== 'run' || L.flash) return;
    const e = L.cur.e;
    const ok = e.t === 'vf' ? (v === 'true') === e.a : Number(v) === e.a;
    srUpdate(L.cur.iid, ok);
    if (ok) { L.score++; sfx.ok(); } else { L.wrong++; sfx.bad(); buzz(40); }
    L.flash = ok ? 'ok' : 'ko'; renderSprint();
    setTimeout(() => { if (!L || L.mode !== 'sprint' || L.stage !== 'run') return; L.flash = null; sprintNext(); renderSprint(); }, ok ? 280 : 650);
  }
  function sprintEnd() {
    L.stage = 'done';
    const record = L.score > S.sprintBest;
    if (record) S.sprintBest = L.score;
    S.stats.sprints++; bump('sprint', 1);
    L.s = null;
    sessionReward(5 * L.score + (record ? 20 : 0), record ? 10 : 3, record ? 'Nouveau record !' : 'Sprint terminé', plural(L.score, 'bonne réponse', 'bonnes réponses') + ' en 60 secondes' + (L.wrong ? ', ' + plural(L.wrong, 'erreur', 'erreurs') : '') + '.', 'timer');
  }
  function renderSprint() {
    const el = lessonEl();
    el.style.setProperty('--sc', 'var(--flame)');
    if (L.stage === 'ready') {
      el.innerHTML = '<div class="lh"><button class="x" data-act="quit-now" aria-label="Quitter">' + ic('x') + '</button></div><div class="lbody"><div class="in"><div class="end"><div class="hero-ic flame">' + ic('timer') + '</div><h2>Sprint 60 secondes</h2><p>Réponds au plus de questions possible. Une touche, pas de validation. Record actuel : ' + plural(S.sprintBest, 'bonne réponse', 'bonnes réponses') + '.</p></div></div></div><div class="lfoot"><div class="in"><button class="btn block" style="--b:var(--flame)" data-act="sprint-go">' + ic('play') + 'Partez !</button></div></div>';
      return;
    }
    const st = L.cur, e = st.e, left = Math.max(0, L.endAt - Date.now());
    let opts = '';
    if (e.t === 'vf') opts = '<div class="vf">' + [true, false].map(v => '<button class="opt' + (L.flash && v === e.a ? ' ok' : '') + '" data-act="sprint-ans" data-v="' + v + '">' + (v ? 'Vrai' : 'Faux') + '</button>').join('') + '</div>';
    else opts = '<div class="opts">' + st.order.map(i => '<button class="opt' + (L.flash && i === e.a ? ' ok' : '') + '" data-act="sprint-ans" data-v="' + i + '">' + esc(e.o[i]) + '</button>').join('') + '</div>';
    const q = e.t === 'trou' ? e.q.replace('___', '…') : e.q;
    el.innerHTML = '<div class="lh"><button class="x" data-act="quit-now" aria-label="Quitter">' + ic('x') + '</button><div class="lprog"><i id="sprint-bar" style="width:' + (100 * left / 60000) + '%;background:var(--flame)"></i></div><span class="lhearts num" style="color:var(--flame)"><span id="sprint-t">' + Math.ceil(left / 1000) + ' s</span></span></div>' +
      '<div class="lbody' + (L.flash ? ' flash-' + L.flash : '') + '"><div class="in"><div class="row" style="justify-content:space-between"><span class="qtag" style="--sc:' + st.s.color + '">' + esc(st.s.short) + '</span><span class="sprint-score num">' + L.score + '</span></div><p class="qtext" style="font-size:19px">' + esc(q) + '</p>' + opts + '</div></div>';
  }

  /* ---------- Écoute (synthèse vocale) ---------- */
  const TTS = { q: [], i: 0, label: '', key: null, paused: false, stopped: true };
  function ttsOK() { try { return 'speechSynthesis' in window && typeof SpeechSynthesisUtterance === 'function'; } catch (e) { return false; } }
  function voiceFr() { try { const vs = speechSynthesis.getVoices(); return vs.find(v => /^fr[-_]FR/i.test(v.lang)) || vs.find(v => /^fr/i.test(v.lang)) || null; } catch (e) { return null; } }
  function chunks(card) {
    const text = (card.h + '. ' + plain(card.b)).replace(/\n/g, ' ');
    const parts = text.match(/[^.!?]+[.!?]*/g) || [text];
    const out = []; let cur = '';
    parts.forEach(p => { if ((cur + p).length > 220 && cur) { out.push(cur.trim()); cur = p; } else cur += p; });
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function listen(cards, label, key) {
    if (!ttsOK()) { toast('La lecture à voix haute n\'est pas disponible sur cet appareil.'); return; }
    try { speechSynthesis.cancel(); } catch (e) { /* ok */ }
    TTS.q = []; cards.forEach((c, ci) => chunks(c).forEach(t => TTS.q.push({ t, ci, h: c.h })));
    TTS.n = cards.length; TTS.i = 0; TTS.label = label; TTS.key = key; TTS.paused = false; TTS.stopped = false; TTS.errors = 0;
    speakNext(); renderPlayer();
  }
  function speakNext() {
    if (TTS.stopped) return;
    const it = TTS.q[TTS.i];
    if (!it) { ttsDone(); return; }
    const u = new SpeechSynthesisUtterance(it.t);
    const token = TTS.token = (TTS.token || 0) + 1;
    u.lang = 'fr-FR'; const v = voiceFr(); if (v) u.voice = v; u.rate = 1;
    u.onend = () => { if (TTS.stopped || token !== TTS.token) return; TTS.i++; renderPlayer(); speakNext(); };
    u.onerror = ev => {
      if (TTS.stopped || token !== TTS.token) return;
      const err = ev && ev.error;
      if (err === 'interrupted' || err === 'canceled') return;
      TTS.errors++;
      if (TTS.errors >= 2) { ttsStop(); toast('La lecture à voix haute ne fonctionne pas sur cet appareil.'); return; }
      TTS.i++; speakNext();
    };
    try { speechSynthesis.speak(u); } catch (e) { ttsStop(); }
  }
  function ttsDone() {
    const key = TTS.errors ? null : TTS.key; ttsStop();
    if (key) {
      const today = dayKey();
      const log = S.listenLog[today] || [];
      if (log.indexOf(key) < 0) {
        log.push(key); S.listenLog = { [today]: log };
        S.stats.listens++; bump('listen', 1);
        const r = award(15, 0); checkBadges(); persist(); renderStats();
        toast('Camp écouté : +' + r.xp + ' m de D+');
      }
    }
  }
  function ttsStop() { TTS.stopped = true; TTS.token = (TTS.token || 0) + 1; try { speechSynthesis.cancel(); } catch (e) { /* ok */ } TTS.q = []; renderPlayer(); }
  function ttsToggle() {
    try {
      if (TTS.paused) { speechSynthesis.resume(); TTS.paused = false; }
      else { speechSynthesis.pause(); TTS.paused = true; }
    } catch (e) { /* ok */ }
    renderPlayer();
  }
  function ttsSkip() {
    const ci = TTS.q[TTS.i] ? TTS.q[TTS.i].ci : 0;
    let j = TTS.i; while (TTS.q[j] && TTS.q[j].ci === ci) j++;
    TTS.i = j; TTS.token = (TTS.token || 0) + 1; try { speechSynthesis.cancel(); } catch (e) { /* ok */ }
    setTimeout(() => { if (!TTS.stopped) { TTS.paused = false; speakNext(); renderPlayer(); } }, 60);
  }
  function renderPlayer() {
    const p = $('#player');
    if (TTS.stopped || !TTS.q.length) { p.hidden = true; p.innerHTML = ''; return; }
    const it = TTS.q[Math.min(TTS.i, TTS.q.length - 1)];
    p.hidden = false;
    p.innerHTML = '<div class="pl-in"><span class="pl-ic">' + ic('headphones') + '</span><div class="pl-t"><b>' + esc(TTS.label) + '</b><span class="small muted">Fiche ' + (it.ci + 1) + ' / ' + TTS.n + ' · ' + esc(it.h) + '</span></div>' +
      '<button class="pl-b" data-act="tts-toggle" aria-label="' + (TTS.paused ? 'Reprendre' : 'Pause') + '">' + ic(TTS.paused ? 'play' : 'pause') + '</button><button class="pl-b" data-act="tts-skip" aria-label="Fiche suivante">' + ic('next') + '</button><button class="pl-b" data-act="tts-stop" aria-label="Arrêter">' + ic('stop') + '</button></div>';
  }
  function unitCards(s, ui) { const out = []; s.units[ui].lessons.forEach(l => (l.cards || []).forEach(c => out.push(c))); return out; }
  function listenSheet() {
    sheet('<div class="eyebrow" style="color:var(--c-marketing)">Écoute</div><h3>Quel camp écouter ?</h3><p class="small muted">Les fiches sont lues par la voix de ton appareil. Chaque camp écouté en entier rapporte 15 m de D+ par jour.</p>' +
      SUMMITS.map(s => '<div class="lib-h" style="--sc:' + s.color + '"><i class="dot"></i><h3 style="font-size:16px">' + esc(s.name) + '</h3></div><div class="list">' + s.units.map((u, ui) => '<button class="btn ghost block" style="justify-content:flex-start" data-act="listen-unit" data-s="' + s.id + '" data-u="' + ui + '">' + ic('play') + 'Camp ' + (ui + 1) + ' · ' + esc(u.title) + '</button>').join('') + '</div>').join('') +
      '<button class="btn ghost block" data-act="close-sheet">Fermer</button>');
  }

  /* ---------- Missions terrain ---------- */
  function commitMission(lid, when) {
    const today = dayKey();
    const due = when === 'today' ? today : when === 'tomorrow' ? addDays(today, 1) : addDays(today, 6);
    S.missions[lid] = { text: MISSIONS[lid], when, at: today, due, status: 'active' };
    persist();
  }
  function missionDoneSheet(lid) {
    const m = S.missions[lid]; if (!m) return;
    sheet('<div class="eyebrow" style="color:var(--c-marketing)">Mission terrain</div><h3>Comment ça s\'est passé ?</h3><p class="small">' + esc(m.text) + '</p>' +
      '<textarea class="essay" id="mission-note" style="min-height:110px" placeholder="Facultatif : ce que tu as fait, ce que ça a donné, ce que tu referais autrement." aria-label="Ton retour"></textarea>' +
      '<p class="small muted" style="margin:0">Écrire ce que tu en retiens aide à le mémoriser. Ton retour reste dans ton carnet.</p>' +
      '<button class="btn block" style="--b:var(--good)" data-act="mission-validate" data-lid="' + lid + '">' + ic('check') + 'Valider · +60 m</button><button class="btn ghost block" data-act="close-sheet">Annuler</button>');
  }
  function validateMission(lid, note) {
    const m = S.missions[lid]; if (!m || m.status !== 'active') return;
    m.status = 'done'; m.doneAt = Date.now(); m.note = (note || '').slice(0, 800);
    S.stats.missions++; bump('mission', 1);
    const r = award(60, 15);
    const b = checkBadges();
    persist(); sfx.done(); confetti(); renderAll();
    toast('Mission accomplie : +' + r.xp + ' m et +' + r.gels + ' gels' + (b.length ? ' · badge « ' + b[0].n + ' »' : ''));
  }

  /* ---------- Ligue d'équipe (vraies personnes) ---------- */
  const TEAM = { db: null, user: null, uid: null, rows: [], names: {}, unsub: null, week: null };
  let leagueWriting = false, leagueAgain = false;
  function initTeam(db, user, uid) {
    TEAM.db = db; TEAM.user = user; TEAM.uid = uid;
    teamResubscribe(); pushLeague();
  }
  function teamResubscribe() {
    if (!TEAM.db) return;
    if (TEAM.unsub) { try { TEAM.unsub(); } catch (e) { /* ok */ } TEAM.unsub = null; }
    TEAM.week = S.league.week; TEAM.rows = [];
    try {
      TEAM.unsub = TEAM.db.collection('league').where('week', '==', TEAM.week).onSnapshot(snap => {
        TEAM.rows = snap.docs.filter(d => d.id !== TEAM.uid).map(d => Object.assign({ id: d.id }, d.data()));
        resolveTeamNames();
        if (TAB === 'league' && !L) renderView();
      }, () => { TEAM.unsub = null; });
    } catch (e) { TEAM.unsub = null; }
  }
  async function resolveTeamNames() {
    const ids = TEAM.rows.map(r => r.id);
    if (!ids.length || !TEAM.user) return;
    try { const ps = await TEAM.user.profiles(ids); ids.forEach(id => { TEAM.names[id] = (ps[id] && ps[id].name) || 'Coéquipier'; }); } catch (e) { /* ok */ }
    if (TAB === 'league' && !L) renderView();
  }
  async function pushLeague() {
    if (!TEAM.db || !TEAM.uid || !S.league) return;
    if (leagueWriting) { leagueAgain = true; return; }
    leagueWriting = true;
    try { await TEAM.db.doc('league/' + TEAM.uid).set({ week: S.league.week, xp: S.league.xp, streak: S.streak.count }); } catch (e) { /* ok */ }
    leagueWriting = false;
    if (leagueAgain) { leagueAgain = false; pushLeague(); }
  }
  function teamHTML() {
    if (!TEAM.db) return '';
    const rows = TEAM.rows.map(r => ({ nm: TEAM.names[r.id] || 'Coéquipier', xp: Number(r.xp) || 0, streak: Number(r.streak) || 0, me: false }));
    rows.push({ nm: 'Toi', xp: S.league.xp, streak: S.streak.count, me: true });
    rows.sort((a, b) => b.xp - a.xp);
    if (rows.length < 2) {
      return '<section class="card team-empty"><div class="row"><span class="prac-ic" style="--pc:var(--c-vente)">' + ic('users') + '</span><div><b>Ligue d\'équipe</b><p class="small muted" style="margin:2px 0 0">' + (PLATFORM ? esc(PLATFORM.teamEmptyText) : 'Partage ce jeu avec ton équipe depuis le menu Partager, en accès Contributeur. Chacun garde sa progression privée, et vous vous affrontez ici chaque semaine, en vrai.') + '</p></div></div></section>';
    }
    return '<section class="card list"><div class="row"><span class="prac-ic" style="--pc:var(--c-vente)">' + ic('users') + '</span><div class="grow"><b>Ligue d\'équipe</b><div class="small muted">Vraies personnes, cette semaine</div></div></div>' +
      rows.map((r, i) => '<div class="lrow' + (r.me ? ' me' : '') + '"><span class="rk num' + (i < 3 ? ' top' : '') + '">' + (i + 1) + '</span><span class="av" style="--avc:' + (r.me ? 'var(--accent)' : AV_COLORS[hash(r.nm) % AV_COLORS.length]) + '">' + esc((r.me ? (NAME || 'A') : r.nm).charAt(0).toUpperCase()) + '</span><span class="nm">' + esc(r.nm) + ' <span class="small muted">' + ic('flame') + r.streak + '</span></span><span class="xp num">' + fmt(r.xp) + ' m</span></div>').join('') + '</section>';
  }
