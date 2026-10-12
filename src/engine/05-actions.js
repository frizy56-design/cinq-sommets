  /* ---------- Actions ---------- */
  function copyText(text) {
    try {
      navigator.clipboard.writeText(text).then(() => toast('Copié'), () => toast('Copie impossible : sélectionne le texte à la main.'));
    } catch (e) { toast('Copie impossible : sélectionne le texte à la main.'); }
  }
  const ACT = {
    tab(t) { TAB = t.dataset.tab; renderTabs(); renderView(); window.scrollTo(0, 0); },
    summit(t) { S.summit = t.dataset.id; persist(); renderView(); },
    'carnet-tab'(t) { CARNET_TAB = t.dataset.v; renderView(); },
    session() {
      const r = recommend();
      if (!r) return;
      if (r.type === 'review') startReview(); else { S.summit = LESSONS[r.lid].s.id; startLesson(r.lid); }
    },
    review() { startReview(); },
    'review-fragile'() { const ids = fragileItems(8); if (ids.length < 3) { startReview(); return; } startReview({ only: ids, n: ids.length, title: 'Notions fragiles' }); },
    node(t) {
      const lid = t.dataset.lid, m = LESSONS[lid];
      if (!isUnlocked(lid)) { sheet('<h3>Balise verrouillée</h3><p>Termine l\'étape précédente de ce sommet pour débloquer « ' + esc(m.l.title) + ' ». Tu peux aussi passer le test de niveau du camp.</p><button class="btn block" data-act="close-sheet">Compris</button>'); return; }
      const r = S.lessons[lid];
      const due = r && !m.l.defi ? lessonDue(lid) : 0;
      const info = m.l.defi ? 'Défi écrit · un coach corrige ta réponse' : m.l.ex.length + ' exercices · environ 4 minutes';
      const mission = MISSIONS[lid] && S.missions[lid] ? '<p class="small"><b>Mission :</b> ' + esc(MISSIONS[lid]) + ' <span class="muted">(' + ({ active: 'en cours', done: 'accomplie', expired: 'expirée' }[S.missions[lid].status] || '') + ')</span></p>' : '';
      sheet('<div class="eyebrow" style="color:' + m.s.color + '">' + esc(m.s.name) + ' · Camp ' + (m.ui + 1) + '</div><h3>' + esc(m.l.title) + '</h3><p class="small muted">' + info + (r ? ' · faite ' + plural(r.n, 'fois', 'fois') + (r.skip ? ' (validée par test)' : ', meilleur score ' + r.best + (m.l.defi ? '/100' : ' %')) : '') + '</p>' + mission +
        (due >= 2 ? '<div class="alert info">' + ic('refresh') + '<span>' + plural(due, 'notion s\'efface', 'notions s\'effacent') + '. Les raviver maintenant les ancre pour longtemps.</span></div><button class="btn block" style="--b:var(--good)" data-act="revive" data-lid="' + lid + '">' + ic('refresh') + 'Raviver · ' + due + '</button>' : '') +
        '<button class="btn block' + (due >= 2 ? ' ghost' : '') + '" style="--b:' + m.s.color + '" data-act="start" data-lid="' + lid + '">' + (r ? 'Refaire la leçon' : 'Commencer') + '</button>' +
        (r && m.l.cards && !m.l.defi ? '<button class="btn ghost block" data-act="guide" data-s="' + m.s.id + '" data-u="' + m.ui + '">Revoir la fiche</button>' : ''));
    },
    revive(t) { closeSheet(); const lid = t.dataset.lid; const ids = LESSONS[lid].l.ex.map(e => e.id); startReview({ only: ids, n: Math.min(6, ids.length), title: 'Raviver' }); },
    start(t) { closeSheet(); startLesson(t.dataset.lid); },
    chest(t) {
      const key = t.dataset.key, [sid, ui] = key.split('-'), u = SBYID[sid].units[+ui];
      if (S.chests[key]) { toast('Coffre déjà ouvert.'); return; }
      if (!u.lessonIds.every(isDone)) { toast('Termine les étapes du camp pour ouvrir ce coffre.'); return; }
      const g = 20 + Math.floor(Math.random() * 16);
      S.chests[key] = dayKey(); S.gels += g; persist(); sfx.coin(); confetti(); renderAll(); toast('Coffre ouvert : +' + g + ' gels');
    },
    guide(t) {
      closeSheet();
      const s = SBYID[t.dataset.s], ui = +t.dataset.u, u = s.units[ui];
      const cards = unitCards(s, ui);
      sheet('<div class="eyebrow" style="color:' + s.color + '">Fiche · Camp ' + (ui + 1) + '</div><h3>' + esc(u.title) + '</h3>' + (ttsOK() ? '<button class="btn ghost block" data-act="listen-unit" data-s="' + s.id + '" data-u="' + ui + '">' + ic('headphones') + 'Écouter ce camp</button>' : '') + cards.map(c => '<article class="fcard" style="--sc:' + s.color + ';box-shadow:none"><h3 style="font-size:17px;margin-top:0">' + esc(c.h) + '</h3><p class="small">' + md(c.b) + '</p><div class="src">' + ic('quote') + '<span>' + esc(c.src) + '</span></div></article>').join('') + '<button class="btn block" data-act="close-sheet">Fermer</button>');
    },
    passage(t) {
      const s = SBYID[t.dataset.s], ui = +t.dataset.u;
      sheet('<div class="eyebrow" style="color:' + s.color + '">Test de niveau</div><h3>Sauter au camp ' + (ui + 1) + ' de « ' + esc(s.name) + ' »</h3><p class="small">8 questions sur ce camp et les précédents. Avec 7 bonnes réponses, les leçons sont validées et le camp s\'ouvre. Aucune gourde en jeu.</p><button class="btn block" style="--b:' + s.color + '" data-act="passage-go" data-s="' + s.id + '" data-u="' + ui + '">' + ic('level') + 'Passer le test</button><button class="btn ghost block" data-act="close-sheet">Annuler</button>');
    },
    'passage-go'(t) { closeSheet(); startPassage(t.dataset.s, +t.dataset.u); },
    'close-sheet'() { closeSheet(); },
    'card-next'() { if (L.card < L.cards.length - 1) { L.card++; renderLesson(); } else { S.seenCards[L.lid] = 1; nextEx(); } },
    'card-prev'() { if (L.card > 0) { L.card--; renderLesson(); } },
    'listen-card'() { const c = L.cards[L.card]; listen([c], L.title, null); },
    'listen-unit'(t) { closeSheet(); const s = SBYID[t.dataset.s], ui = +t.dataset.u; listen(unitCards(s, ui), s.short + ' · Camp ' + (ui + 1), s.id + '-' + ui); },
    'listen-open'() { listenSheet(); },
    'tts-toggle'() { ttsToggle(); },
    'tts-skip'() { ttsSkip(); },
    'tts-stop'() { ttsStop(); },
    pick(t) { if (L.cur.answered) return; L.cur.sel = +t.dataset.i; sfx.tap(); renderLesson(); },
    pickvf(t) { if (L.cur.answered) return; L.cur.sel = t.dataset.v === 'true'; sfx.tap(); renderLesson(); },
    place(t) { const st = L.cur; if (st.answered) return; const i = +t.dataset.i; if (st.ans.indexOf(i) < 0) st.ans.push(i); sfx.tap(); renderLesson(); },
    unplace(t) { const st = L.cur; if (st.answered) return; st.ans.splice(+t.dataset.k, 1); renderLesson(); },
    pl(t) { pairTap('L', +t.dataset.i); },
    pr(t) { pairTap('R', +t.dataset.i); },
    check() { if (ready()) grade(); },
    continue() {
      if (L.mode === 'lesson' && S.hearts <= 0 && L.cur && !L.cur.correct) { outOfHearts(true); return; }
      nextEx();
    },
    quit() {
      if (!L) return;
      if (L.phase === 'end' || L.mode === 'gen-wait' || (L.mode === 'rp' && L.stage === 'brief') || (L.mode === 'atelier' && L.stage === 'input' && !(($('#at-in') || {}).value || '').trim())) { ACT['quit-now'](); return; }
      sheet('<h3>Quitter ?</h3><p>Ta progression dans cette séance sera perdue. Le D+ ne compte qu\'à l\'arrivée.</p><button class="btn block" data-act="close-sheet">Continuer</button><button class="btn ghost block" style="color:var(--bad)" data-act="quit-now">Quitter</button>');
    },
    'quit-now'() { closeSheet(); if (L && L.cur && L.cur.e && L.cur.e.t === 'ecrit') saveDraft(L.cur); closeOverlay(); },
    'end-next'() {
      if (L.endIdx < L.ends.length - 1) {
        L.endIdx++;
        if (L.ends[L.endIdx] === 'custom') renderEndCustom(); else renderEnd();
        if (L.ends[L.endIdx] === 'streak') { sfx.done(); confetti(); }
        return;
      }
      const fromHearts = L.fromHearts;
      closeOverlay();
      if (fromHearts) toast('Une gourde de plus. Tu peux reprendre ta leçon.');
    },
    'mission-when'(t) { missionWhen = t.dataset.v; document.querySelectorAll('#when button').forEach(b => b.classList.toggle('on', b.dataset.v === missionWhen)); },
    'mission-commit'() { commitMission(L.lid, missionWhen); sfx.coin(); toast('Mission ajoutée : ' + dueLabel(S.missions[L.lid].due).toLowerCase()); ACT['end-next'](); },
    'mission-done'(t) { missionDoneSheet(t.dataset.lid); },
    'mission-validate'(t) { const note = ($('#mission-note') || {}).value || ''; closeSheet(); validateMission(t.dataset.lid, note); },
    'mission-drop'(t) { const m = S.missions[t.dataset.lid]; if (!m) return; delete S.missions[t.dataset.lid]; persist(); renderAll(); toast('Mission retirée'); },
    coach() { runCoach(); },
    'coach-stop'() { if (L.cur.ctl) L.cur.ctl.abort(); },
    selfcheck() {
      const st = L.cur; st.text = ($('#essay') || {}).value || st.text;
      if (words(st.text) < 5) { toast('Écris au moins quelques phrases.'); return; }
      saveDraft(st); st.stage = 'self'; st.checks = st.e.crit.map(() => false); renderLesson();
    },
    rewrite() { L.cur.stage = 'write'; renderLesson(); },
    'defi-done'() { finishDefi(L.cur.res.score); },
    'self-done'() { const st = L.cur; const n = st.checks.filter(Boolean).length; finishDefi(Math.round(100 * n / st.e.crit.length)); },
    'rp-open'(t) { startRP(t.dataset.id); },
    'rp-start'() { L.stage = 'chat'; renderRP(); },
    'rp-send'() { rpSend(); },
    'rp-end'() { if (L.userTurns >= 1) rpDebrief(); },
    'rp-stop'() { if (L.ctl) L.ctl.abort(); },
    'rp-again'() { const id = L.sc.id; L = null; startRP(id); },
    'rp-done'() { rpFinish(); },
    'atelier-open'() { startAtelier(); },
    'at-type'(t) { L.text = ($('#at-in') || {}).value || L.text; L.type = t.dataset.v; renderAtelier(); },
    'at-lens'(t) { L.text = ($('#at-in') || {}).value || L.text; L.lens = t.dataset.v; renderAtelier(); },
    'at-run'() { atelierRun(); },
    'at-stop'() { if (L.ctl) L.ctl.abort(); },
    'at-again'() { L.stage = 'input'; L.text = ''; L.res = null; renderAtelier(); },
    'at-done'() { atelierDone(); },
    'gen-open'(t) { if (t.dataset.s) { startGen(t.dataset.s); return; } genSheet(); },
    'gen-start'(t) { closeSheet(); startGen(t.dataset.s); },
    sprint() { startSprint(); },
    'sprint-go'() { sprintGo(); },
    'sprint-ans'(t) { sprintAnswer(t.dataset.v); },
    'copy-text'(t) { copyText(t.dataset.text || ''); },
    claim(t) { const q = S.quests.list[+t.dataset.i]; if (!q || q.c || !questDone(q)) return; q.c = true; S.gels += 10; persist(); sfx.coin(); renderAll(); toast('+10 gels'); },
    daychest() { const q = S.quests; if (q.chest || !q.list.every(x => x.c)) return; q.chest = true; S.gels += 20; S.boostUntil = Date.now() + 15 * 60000; persist(); sfx.coin(); confetti(); renderAll(); toast('+20 gels et D+ doublé pendant 15 minutes'); },
    buy(t) {
      const it = t.dataset.item, p = PRICES[it];
      if (S.gels < p) { toast('Pas assez de gels (' + S.gels + ' / ' + p + ').'); return; }
      if (it === 'freeze') { if (S.streak.freezes >= 2) return; S.streak.freezes++; }
      else if (it === 'refill') { if (S.hearts >= MAX_HEARTS) return; S.hearts = MAX_HEARTS; S.heartsAt = Date.now(); }
      else if (it === 'boost') { S.boostUntil = Date.now() + 15 * 60000; }
      S.gels -= p; persist(); sfx.coin();
      const inLesson = !!L && L.phase === 'ex' && (L.mode === 'lesson');
      closeSheet(); renderStats(); renderTabs(); if (!L) renderView();
      toast(it === 'freeze' ? 'Jour de repos équipé' : it === 'refill' ? 'Gourdes remplies' : 'D+ doublé pendant 15 minutes');
      if (inLesson && it === 'refill' && L.cur && L.cur.answered) nextEx();
    },
    'hearts-review'() {
      closeSheet();
      if (L) { L = null; lessonEl().hidden = true; lessonEl().innerHTML = ''; }
      if (!startReview({ fromHearts: true })) { document.body.style.overflow = ''; renderAll(); }
    },
    repair() {
      if (!canRepair()) return;
      if (S.gels < PRICES.repair) { toast('Il te faut ' + PRICES.repair + ' gels pour réparer ta série.'); return; }
      const st = S.streak, today = dayKey();
      S.gels -= PRICES.repair;
      if (st.last === today) st.count = st.lost.count + st.count; else { st.count = st.lost.count; st.last = addDays(today, -1); }
      st.best = Math.max(st.best, st.count); st.lost = null; persist(); sfx.coin(); renderAll(); toast('Série réparée : ' + st.count + ' jours');
    },
    'streak-info'() {
      const st = S.streak, today = dayKey();
      sheet('<div class="row"><span style="color:var(--flame);font-size:40px">' + ic('flame') + '</span><div><h3>' + plural(st.count, 'jour', 'jours') + ' de série</h3><div class="small muted">Record : ' + plural(st.best, 'jour', 'jours') + '</div></div></div>' + weekStrip() +
        '<p class="small">' + (st.last === today ? 'Série prolongée aujourd\'hui. Reviens demain.' : 'Termine une séance aujourd\'hui (leçon, révision, jeu de rôle, sprint…) pour prolonger ta série.') + ' Un <b>jour de repos</b> la protège si tu manques une journée : tu en as ' + st.freezes + ' sur 2.</p>' +
        '<button class="btn block" style="--b:var(--freeze)" data-act="buy" data-item="freeze"' + (st.freezes >= 2 ? ' disabled' : '') + '>' + ic('moon') + 'Jour de repos · ' + PRICES.freeze + ' gels</button><button class="btn ghost block" data-act="close-sheet">Fermer</button>');
    },
    'hearts-info'() {
      regenHearts();
      sheet('<div class="row"><span style="color:var(--water);font-size:40px">' + ic('flask') + '</span><div><h3>' + S.hearts + ' gourdes sur 5</h3><div class="small muted">' + (S.hearts >= MAX_HEARTS ? 'Pleines' : 'Prochaine dans ' + msToHM(nextHeartIn())) + '</div></div></div>' +
        '<p class="small">Chaque erreur dans une leçon vide une gourde. Les révisions, les défis, les jeux de rôle et l\'entraînement illimité n\'en consomment pas, et chaque révision terminée en remplit une.</p>' +
        '<button class="btn block" style="--b:var(--water)" data-act="buy" data-item="refill"' + (S.hearts >= MAX_HEARTS ? ' disabled' : '') + '>Remplir · ' + PRICES.refill + ' gels</button><button class="btn ghost block" data-act="close-sheet">Fermer</button>');
    },
    book(t) {
      const k = t.dataset.key;
      if (S.books[k]) { delete S.books[k]; } else { S.books[k] = dayKey(); S.gels += 10; sfx.coin(); toast('+10 gels'); checkBadges(); }
      persist(); renderStats(); renderView();
    },
    goal(t) { S.goal = +t.dataset.v; if (S.quests) S.quests.list[0].n = Math.max(50, S.goal); persist(); renderView(); },
    sound() { S.sound = !S.sound; persist(); renderView(); },
    reset() { sheet('<h3>Tout remettre à zéro ?</h3><p>Ta série, ton D+, tes leçons, ton carnet et tes badges seront effacés. Impossible de revenir en arrière.</p><button class="btn block" style="--b:var(--bad)" data-act="reset-now">Effacer ma progression</button><button class="btn ghost block" data-act="close-sheet">Annuler</button>'); },
    'reset-now'() { S = fresh(); S.seenIntro = true; S.seenV2 = true; tick(true); persist(); pushLeague(); closeSheet(); TAB = 'path'; renderAll(); toast('Progression remise à zéro'); },
    'intro-goal'(t) { S.goal = +t.dataset.v; document.querySelectorAll('#sheet .seg button').forEach(b => b.classList.toggle('on', +b.dataset.v === S.goal)); },
    'intro-go'() { S.seenIntro = true; S.seenV2 = true; if (S.quests) S.quests.list[0].n = Math.max(50, S.goal); persist(); closeSheet(); renderAll(); },
    'v2-ok'(t) { S.seenV2 = true; persist(); closeSheet(); if (t.dataset.go) { TAB = t.dataset.go; renderAll(); } },
    'notice-ok'() { closeSheet(); afterNotices(); },
    'repair-notice'() { closeSheet(); ACT.repair(); afterNotices(); }
  };

  const PCTX = {
    toast, sheet, closeSheet, ic, esc,
    renderView: () => renderAll(), getTab: () => TAB, inSession: () => !!L,
    goTo: tab => { TAB = tab; renderAll(); window.scrollTo(0, 0); },
    replaceState: st => { S = migrate(st); S.updatedAt = Date.now(); tick(true); persist(); pushLeague(); renderAll(); },
    setName: n => { if (n) NAME = n.split(' ')[0]; renderAll(); pushLeague(); }
  };
  if (PLATFORM && PLATFORM.actions) {
    const pa = PLATFORM.actions(PCTX);
    Object.keys(pa).forEach(k => { if (k !== '__submit') ACT[k] = pa[k]; });
    if (pa.__submit) document.addEventListener('submit', ev => { const f = ev.target.closest('form[data-form]'); if (!f) return; ev.preventDefault(); pa.__submit(f); });
  }

  function pairTap(side, i) {
    const st = L.cur, e = st.e;
    if (st.answered || (side === 'L' ? st.mL : st.mR).indexOf(i) >= 0) return;
    st.flash = null;
    if (side === 'L') st.selL = st.selL === i ? null : i; else st.selR = st.selR === i ? null : i;
    if (st.selL !== null && st.selR !== null) {
      if (e.p[st.selL][1] === e.p[st.selR][1]) { st.mL.push(st.selL); st.mR.push(st.selR); sfx.tap(); }
      else { st.miss++; st.flash = [st.selL, st.selR]; sfx.bad(); buzz(40); }
      st.selL = null; st.selR = null;
      if (st.mL.length === e.p.length) { grade(); return; }
    } else sfx.tap();
    renderLesson();
  }

  /* ---------- Avis au chargement ---------- */
  const notices = [];
  function collectNotices() {
    const st = S.streak;
    if (st.notice && !st.notice.seen) {
      if (st.notice.type === 'freeze') notices.push('<div class="row"><span style="color:var(--freeze);font-size:40px">' + ic('moon') + '</span><h3>Ton jour de repos a protégé ta série</h3></div><p>Tu as manqué ' + plural(st.notice.n, 'jour', 'jours') + ', mais ta série de ' + st.count + ' jours est intacte. Fais une séance aujourd\'hui pour la prolonger.</p>');
      else notices.push('<div class="row"><span style="color:var(--bad);font-size:40px">' + ic('flame') + '</span><h3>Ta série de ' + st.notice.n + ' jours s\'est arrêtée</h3></div><p>Tu peux la réparer aujourd\'hui ou demain pour ' + PRICES.repair + ' gels. Sinon, une nouvelle série commence avec ta prochaine séance.</p>' + (S.gels >= PRICES.repair ? '<button class="btn block" data-act="repair-notice">Réparer ma série · ' + PRICES.repair + ' gels</button>' : ''));
      st.notice.seen = true;
    }
    const lr = S.league && S.league.result;
    if (lr && !lr.seen) {
      const t = lr.move > 0 ? 'Promotion en Ligue ' + TIERS[lr.to].n : lr.move < 0 ? 'Retour en Ligue ' + TIERS[lr.to].n : 'Tu restes en Ligue ' + TIERS[lr.to].n;
      notices.push('<div class="row"><span style="color:' + TIERS[lr.to].c + ';font-size:40px">' + ic('shield') + '</span><h3>' + esc(t) + '</h3></div><p>' + (lr.active ? 'Tu as fini ' + lr.rank + '<sup>e</sup> la semaine dernière.' : 'Tu n\'as pas grimpé la semaine dernière.') + (lr.reward ? ' Récompense du podium : +' + lr.reward + ' gels.' : '') + ' Une nouvelle semaine commence.</p>');
      lr.seen = true;
    }
  }
  function afterNotices() {
    if (notices.length) { sheet(notices.shift() + '<button class="btn ghost block" data-act="notice-ok">Continuer</button>'); return; }
    if (!S.seenIntro) { showIntro(); return; }
    if (!S.seenV2) showWhatsNew();
  }
  function introRow(icn, col, html) { return '<div class="row"><span style="color:' + col + '">' + ic(icn) + '</span><span>' + html + '</span></div>'; }
  function showIntro() {
    sheet('<div class="eyebrow" style="color:var(--accent)">Bienvenue</div><h3>Cinq sommets, quelques minutes par jour</h3>' +
      '<p class="small">Vendre, écrire, comprendre les gens, marketer, faire fructifier son argent : chaque parcours s\'appuie sur les livres et les études de référence, avec des cas pratiques tirés de Les Traileurs.</p>' +
      '<div class="list small">' + introRow('flame', 'var(--flame)', 'Une séance par jour garde ta <b>série</b> en vie.') +
      introRow('mountain', 'var(--accent)', 'Chaque bonne réponse te fait grimper en <b>D+</b>, et le D+ te classe dans ta <b>ligue</b>.') +
      introRow('flag', 'var(--c-marketing)', 'Après chaque leçon, une <b>mission terrain</b> à appliquer dans ton travail.') +
      introRow('chat', 'var(--c-vente)', 'Dans <b>Pratique</b> : jeux de rôle, atelier sur tes vrais textes, questions illimitées.') + '</div>' +
      '<div><div class="eyebrow" style="margin-bottom:8px">Ton objectif quotidien</div><div class="seg">' + GOALS.map(g => '<button class="' + (S.goal === g.v ? 'on' : '') + '" data-act="intro-goal" data-v="' + g.v + '">' + esc(g.n) + ' · ' + g.v + ' m</button>').join('') + '</div></div>' +
      '<button class="btn block" data-act="intro-go">C\'est parti</button>', true);
  }
  function showWhatsNew() {
    sheet('<div class="eyebrow" style="color:var(--accent)">Nouvelle version</div><h3>Cinq Sommets passe à la pratique</h3>' +
      '<div class="list small">' + introRow('mountain', 'var(--c-marketing)', 'Le sommet <b>Cuisiner</b> devient <b>Marketer</b> : Sharp, Binet & Field, Dunford, Godin, Berger, Eyal.') +
      introRow('chat', 'var(--c-vente)', '<b>Jeux de rôle</b> : négocie avec une marque, mène un appel découverte, recrute une ambassadrice. Un coach débriefe.') +
      introRow('flag', 'var(--good)', '<b>Missions terrain</b> après chaque leçon, à valider dans tes quêtes.') +
      introRow('wrench', 'var(--c-ecrire)', '<b>Atelier</b> : colle un vrai texte, il revient corrigé avec les principes du jeu.') +
      introRow('infinity', 'var(--c-psycho)', '<b>Entraînement illimité</b>, <b>sprint 60 s</b>, <b>écoute</b> des fiches et notions qui s\'effacent à raviver.') +
      introRow('users', 'var(--accent)', '<b>Ligue d\'équipe</b> : partage le jeu à ton équipe pour un vrai classement.') + '</div>' +
      '<button class="btn block" data-act="v2-ok" data-go="practice">Découvrir la pratique</button><button class="btn ghost block" data-act="v2-ok">Plus tard</button>', true);
  }

  /* ---------- Événements ---------- */
  document.addEventListener('click', ev => {
    const t = ev.target.closest('[data-act]');
    if (!t) { if (ev.target.id === 'sheet' && !sheetLocked) closeSheet(); return; }
    if (t.disabled) return;
    const f = ACT[t.dataset.act];
    if (f) { ev.preventDefault(); f(t); }
  });
  document.addEventListener('input', ev => {
    const t = ev.target;
    if (t.dataset.in === 'atelier') { if (L) L.text = t.value; updateWCFor(t); return; }
    if (t.dataset.in === 'rp') { if (L) L.draft = t.value; return; }
    if (!L || !L.cur) return;
    if (t.dataset.in === 'calc') { L.cur.val = t.value; refreshCheckBtn(); }
    else if (t.dataset.in === 'essay') { L.cur.text = t.value; updateWC(); clearTimeout(L.cur.dt); L.cur.dt = setTimeout(() => { if (L && L.cur && L.cur.e.t === 'ecrit') saveDraft(L.cur); }, 1500); }
  });
  document.addEventListener('change', ev => {
    const t = ev.target;
    if (L && L.cur && t.dataset.in === 'chk') L.cur.checks[+t.dataset.i] = t.checked;
  });
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape' && !$('#sheet').hidden && !sheetLocked) { closeSheet(); return; }
    if (ev.key === 'Enter' && L && L.mode === 'rp' && L.stage === 'chat' && ev.target.id === 'rp-in' && !ev.shiftKey) { ev.preventDefault(); rpSend(); return; }
    if (ev.key === 'Enter' && L && L.phase === 'ex' && L.cur && L.cur.e && L.cur.e.t === 'calc') {
      ev.preventDefault();
      if (!L.cur.answered && ready()) grade(); else if (L.cur.answered) ACT.continue();
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { const ch = tick(); if (!L) renderAll(); else renderStats(); if (ch) collectNotices(); } });
  setInterval(() => { const ch = tick(true); if (ch) { saveLocal(); collectNotices(); if (!L) { renderAll(); afterNotices(); } } else { regenHearts(); renderStats(); } }, 60000);

  /* ---------- Démarrage ---------- */
  function start(data) {
    if (data && data.tab) TAB = data.tab;
    tick(true); saveLocal(); collectNotices(); renderAll(); afterNotices(); initRemote();
    try { if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => ({ tab: TAB })); } catch (e) { /* ok */ }
  }
  window.__CS = { get S() { return S; }, get L() { return L; }, ITEMS, LESSONS, SUMMITS };
  if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start);
  else start((window.claude && window.claude.hot && window.claude.hot.data) || {});
})();
