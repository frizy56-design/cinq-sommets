  /* ---------- Séances (leçon, défi, révision, test de passage) ---------- */
  let L = null;
  function lessonEl() { return $('#lesson'); }
  function openOverlay() { const el = lessonEl(); el.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeOverlay() {
    const el = lessonEl(); el.hidden = true; el.innerHTML = ''; document.body.style.overflow = '';
    if (L) {
      if (L.cur && L.cur.ctl) { try { L.cur.ctl.abort(); } catch (e) { /* ok */ } }
      if (L.ctl) { try { L.ctl.abort(); } catch (e) { /* ok */ } }
      if (L.timer) clearInterval(L.timer);
    }
    L = null;
    remote.paused = false;
    if (remote.pending) {
      const rs = remote.pending; remote.pending = null;
      // Garde la version la plus avancée : celle de l'autre appareil, ou celle-ci avec la séance qui vient de finir.
      if ((rs.xp || 0) > (S.xp || 0)) applyRemote(rs); else { persist(); renderAll(); }
    } else renderAll();
  }
  function getItem(iid) { return ITEMS[iid]; }
  function newSession(mode, extra) {
    return Object.assign({ mode, lid: null, s: null, title: '', queue: [], total: 0, solved: 0, seen: {}, firstOk: 0, combo: 0, maxCombo: 0, mistakes: 0, start: Date.now(), phase: 'ex', card: 0, cards: [], cur: null, ends: [], endIdx: 0 }, extra || {});
  }

  function startLesson(lid) {
    const m = LESSONS[lid];
    regenHearts();
    if (!m.l.defi && S.hearts <= 0) { outOfHearts(false); return; }
    const ids = m.l.ex.map(e => e.id);
    const showCards = (m.l.cards && m.l.cards.length) && (!S.seenCards[lid] || m.l.defi);
    L = newSession(m.l.defi ? 'defi' : 'lesson', { lid, s: m.s, title: m.l.title, queue: m.l.defi ? ids : shuffle(ids), total: ids.length, phase: showCards ? 'cards' : 'ex', cards: m.l.cards || [] });
    openOverlay(); sfx.tap();
    if (L.phase === 'ex') nextEx(); else renderOverlay();
  }
  function startReview(opts) {
    opts = opts || {};
    const ids = pickReview(opts.n || 8, opts.only);
    if (ids.length < 3) { toast('Termine d\'abord quelques leçons pour débloquer la révision.'); return false; }
    L = newSession('review', { title: opts.title || 'Révision', queue: ids, total: ids.length, fromHearts: !!opts.fromHearts });
    openOverlay(); nextEx();
    return true;
  }
  function startPassage(sid, ui) {
    const s = SBYID[sid];
    const pool = [];
    s.units.slice(0, ui + 1).forEach(u => u.lessons.forEach(l => l.ex.forEach(e => { if (['qcm', 'vf', 'trou', 'paires'].indexOf(e.t) >= 0) pool.push(e.id); })));
    const ids = shuffle(pool).slice(0, 8);
    L = newSession('passage', { s, title: 'Test de passage', queue: ids, total: ids.length, passage: { sid, ui } });
    openOverlay(); nextEx();
  }
  function nextEx() {
    if (!L.queue.length) { finishSession(); return; }
    const iid = L.queue.shift(), it = getItem(iid), e = it.e;
    const st = { iid, e, s: it.s, answered: false, correct: null };
    const idx = (e.o || e.items || e.p || []).map((_, i) => i);
    if (e.t === 'qcm' || e.t === 'trou') { st.order = shuffle(idx); st.sel = null; }
    else if (e.t === 'vf') st.sel = null;
    else if (e.t === 'ordre') { let p = shuffle(idx); for (let g = 0; g < 5 && p.every((v, i) => v === i); g++) p = shuffle(idx); st.pool = p; st.ans = []; }
    else if (e.t === 'paires') { st.left = shuffle(idx); st.right = shuffle(idx); st.mL = []; st.mR = []; st.selL = null; st.selR = null; st.miss = 0; st.flash = null; }
    else if (e.t === 'calc') st.val = '';
    else if (e.t === 'ecrit') { const prev = S.essays[iid]; st.text = (prev && prev.draft) || ''; st.stage = 'write'; st.checks = []; }
    L.cur = st; L.phase = 'ex';
    renderOverlay();
    const b = $('#lesson .lbody'); if (b) b.scrollTop = 0;
  }
  function curColor() { if (L.phase === 'ex' && L.cur && L.cur.s) return L.cur.s.color; return L.s ? L.s.color : 'var(--accent)'; }

  function renderOverlay() {
    if (!L) return;
    if (L.mode === 'claude') return renderClaude();
    if (L.mode === 'sprint') return renderSprint();
    renderLesson();
  }
  function headerHTML(prog, right) {
    return '<div class="lh"><button class="x" data-act="quit" aria-label="Quitter">' + ic('x') + '</button><div class="lprog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(prog * 100) + '"><i style="width:' + Math.max(3, prog * 100) + '%"></i></div>' + right + '</div>';
  }
  function renderLesson() {
    const el = lessonEl();
    if (L.phase === 'end') { renderEnd(); return; }
    const prog = L.phase === 'cards' ? 0 : L.solved / L.total;
    const label = { review: L.title, defi: 'Défi', passage: 'Test' }[L.mode];
    const right = L.mode === 'lesson' ? '<span class="lhearts num">' + ic('flask') + S.hearts + '</span>' : '<span class="lhearts inf">' + esc(label || '') + '</span>';
    let body = '', foot = '';
    if (L.phase === 'cards') {
      const c = L.cards[L.card];
      body = '<div class="row" style="justify-content:space-between;gap:8px"><span class="qtag">' + ic('cards') + 'Fiche · ' + esc(L.title) + '</span>' + (ttsOK() ? '<button class="qtag" data-act="listen-card" aria-label="Écouter la fiche">' + ic('headphones') + 'Écouter</button>' : '') + '</div><article class="fcard"><div class="eyebrow">' + (L.card + 1) + ' / ' + L.cards.length + '</div><h3>' + esc(c.h) + '</h3><p>' + md(c.b) + '</p><div class="src">' + ic('quote') + '<span>' + esc(c.src) + '</span></div></article>' +
        '<div class="dots">' + L.cards.map((_, i) => '<i class="' + (i === L.card ? 'on' : '') + '"></i>').join('') + '</div>';
      foot = '<div class="row" style="gap:10px">' + (L.card > 0 ? '<button class="btn ghost" data-act="card-prev" aria-label="Fiche précédente">←</button>' : '') + '<button class="btn block grow" data-act="card-next">' + (L.card < L.cards.length - 1 ? 'Suivant' : 'C\'est parti') + '</button></div>';
    } else { body = exerciseHTML(); foot = footerHTML(); }
    el.style.setProperty('--sc', curColor());
    el.innerHTML = headerHTML(prog, right) + '<div class="lbody"><div class="in">' + body + '</div></div><div class="lfoot"><div class="in">' + foot + '</div></div>';
    if (L.phase === 'ex' && L.cur && L.cur.e.t === 'calc' && !L.cur.answered) { const inp = $('#calc-in'); if (inp) inp.value = L.cur.val; }
    if (L.phase === 'ex' && L.cur && L.cur.e.t === 'ecrit' && L.cur.stage === 'write') { const ta = $('#essay'); if (ta) { ta.value = L.cur.text; updateWC(); } }
  }

  function exerciseHTML() {
    const st = L.cur, e = st.e;
    let h = '';
    const tags = [];
    if (L.mode === 'review' || L.mode === 'passage') tags.push('<span class="qtag">' + ic(L.mode === 'passage' ? 'level' : 'refresh') + esc(st.s.short) + '</span>');
    if (e.c) tags.push('<span class="qtag">' + ic('case') + 'Cas pratique Les Traileurs</span>');
    if (e.t === 'ecrit') tags.push('<span class="qtag">' + ic('pen') + 'Défi écrit</span>');
    if (tags.length) h += '<div class="row" style="flex-wrap:wrap;gap:6px">' + tags.join('') + '</div>';
    if (L.combo >= 3 && !st.answered) h += '<span class="combo">' + ic('flame') + plural(L.combo, 'bonne réponse', 'bonnes réponses') + ' d\'affilée</span>';
    const dis = st.answered ? ' disabled' : '';
    if (e.t === 'qcm') {
      h += '<p class="qtext">' + esc(e.q) + '</p><div class="opts" role="radiogroup">' + st.order.map(i => {
        let c = 'opt'; if (st.sel === i) c += ' sel'; if (st.answered) { if (i === e.a) c += ' ok'; else if (i === st.sel) c += ' ko'; }
        return '<button class="' + c + '" role="radio" aria-checked="' + (st.sel === i) + '" data-act="pick" data-i="' + i + '"' + dis + '>' + esc(e.o[i]) + '</button>';
      }).join('') + '</div>';
    } else if (e.t === 'vf') {
      h += '<div class="eyebrow">Vrai ou faux ?</div><p class="qtext">' + esc(e.q) + '</p><div class="vf">' + [true, false].map(v => {
        let c = 'opt'; if (st.sel === v) c += ' sel'; if (st.answered) { if (v === e.a) c += ' ok'; else if (v === st.sel) c += ' ko'; }
        return '<button class="' + c + '" data-act="pickvf" data-v="' + v + '"' + dis + '>' + (v ? 'Vrai' : 'Faux') + '</button>';
      }).join('') + '</div>';
    } else if (e.t === 'trou') {
      const parts = e.q.split('___');
      const fill = st.sel != null ? esc(e.o[st.sel]) : '&nbsp;';
      h += '<div class="eyebrow">Complète la phrase</div><p class="sentence">' + esc(parts[0]) + '<span class="blank">' + fill + '</span>' + esc(parts[1] || '') + '</p><div class="bank">' + st.order.map(i => {
        let c = 'word'; if (st.sel === i) c += ' sel'; if (st.answered && i === e.a) c += ' sel';
        return '<button class="' + c + '" data-act="pick" data-i="' + i + '"' + dis + '>' + esc(e.o[i]) + '</button>';
      }).join('') + '</div>';
    } else if (e.t === 'ordre') {
      h += '<div class="eyebrow">Remets dans l\'ordre</div><p class="qtext" style="font-size:18px">' + esc(e.q) + '</p><div class="answer-zone">' +
        (st.ans.length ? st.ans.map((i, k) => '<button class="word" data-act="unplace" data-k="' + k + '"' + dis + '><span class="slot-n">' + (k + 1) + '</span>' + esc(e.items[i]) + '</button>').join('') : '<span class="ph">Touche les éléments dans le bon ordre</span>') +
        '</div><div class="bank" style="flex-direction:column">' + st.pool.filter(i => st.ans.indexOf(i) < 0).map(i => '<button class="word" data-act="place" data-i="' + i + '"' + dis + '>' + esc(e.items[i]) + '</button>').join('') + '</div>';
    } else if (e.t === 'paires') {
      h += '<div class="eyebrow">Associe les paires</div><p class="qtext" style="font-size:18px">' + esc(e.q) + '</p><div class="pairs"><div class="col">' +
        st.left.map(i => '<button class="word' + (st.mL.indexOf(i) >= 0 ? ' ok' : '') + (st.selL === i ? ' sel' : '') + (st.flash && st.flash[0] === i ? ' ko' : '') + '" data-act="pl" data-i="' + i + '">' + esc(e.p[i][0]) + '</button>').join('') +
        '</div><div class="col">' + st.right.map(i => '<button class="word' + (st.mR.indexOf(i) >= 0 ? ' ok' : '') + (st.selR === i ? ' sel' : '') + (st.flash && st.flash[1] === i ? ' ko' : '') + '" data-act="pr" data-i="' + i + '">' + esc(e.p[i][1]) + '</button>').join('') + '</div></div>';
    } else if (e.t === 'calc') {
      h += '<div class="eyebrow">Calcule</div><p class="qtext" style="font-size:19px">' + esc(e.q) + '</p><div class="calc"><input id="calc-in" data-in="calc" inputmode="decimal" autocomplete="off" placeholder="Ta réponse" aria-label="Ta réponse"' + (st.answered ? ' disabled' : '') + '><span class="u">' + esc(e.unit || '') + '</span></div>';
    } else if (e.t === 'ecrit') h += ecritHTML();
    return h;
  }

  function ecritHTML() {
    const st = L.cur, e = st.e;
    let h = '<div class="ctx">' + esc(e.ctx) + '</div><p class="qtext" style="font-size:19px">' + esc(e.q) + '</p>';
    if (st.stage === 'write') {
      h += '<details><summary class="small muted" style="cursor:pointer;font-weight:700">Les critères de réussite</summary><ul class="crit">' + e.crit.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></details>' +
        '<textarea class="essay" id="essay" data-in="essay" placeholder="Écris ta réponse ici…" aria-label="Ta réponse"></textarea><div class="wc num" id="wc"></div>';
    } else if (st.stage === 'claude') {
      h += '<section class="card"><div class="eyebrow" style="margin-bottom:6px">Ta réponse</div><div class="ver">' + esc(st.text) + '</div></section>' +
        claudeStepsHTML(st.copied, 'Claude corrige ta réponse avec les critères du défi et te propose une version améliorée.') +
        '<section class="card list"><label class="eyebrow" for="cl-score">3 · La note donnée par Claude</label><div class="calc"><input id="cl-score" data-in="claude-score" inputmode="numeric" maxlength="3" autocomplete="off" placeholder="0 à 100" aria-label="Note sur 100" value="' + esc(st.score == null ? '' : st.score) + '"><span class="u">/ 100</span></div>' +
        '<label class="eyebrow" for="cl-version">Sa version améliorée (facultatif)</label><textarea class="essay" id="cl-version" data-in="claude-version" style="min-height:110px" placeholder="Colle-la ici pour la garder dans ton carnet." aria-label="Version améliorée">' + esc(st.version || '') + '</textarea></section>';
    } else if (st.stage === 'self') {
      h += '<section class="card"><div class="eyebrow" style="margin-bottom:6px">Ta réponse</div><div class="ver">' + esc(st.text) + '</div></section>' +
        '<section class="card coach"><div><h5>Exemple de référence</h5><div class="ver">' + esc(e.ex) + '</div></div><div class="checklist"><h5>Coche les critères que ta réponse remplit</h5>' +
        e.crit.map((c, i) => '<label><input type="checkbox" data-in="chk" data-i="' + i + '" id="chk-' + i + '"' + (st.checks[i] ? ' checked' : '') + '><span>' + esc(c) + '</span></label>').join('') + '</div></section>';
    }
    return h;
  }
  function footerHTML() {
    const st = L.cur, e = st.e;
    if (e.t === 'ecrit') {
      if (st.stage === 'write') return '<div class="list"><button class="btn block" data-act="selfcheck">Me corriger avec la grille</button><button class="btn ghost block" data-act="defi-claude">' + ic('chat') + 'Faire corriger par Claude</button></div>';
      if (st.stage === 'claude') return '<div class="row" style="gap:10px"><button class="btn ghost" data-act="rewrite">Réécrire</button><button class="btn block grow" data-act="defi-claude-done">Valider ma note</button></div><button class="link small" style="display:block;margin:10px auto 0" data-act="selfcheck">Plutôt me corriger avec la grille</button>';
      if (st.stage === 'self') return '<div class="row" style="gap:10px"><button class="btn ghost" data-act="rewrite">Réécrire</button><button class="btn block grow" data-act="self-done">Valider</button></div>';
    }
    if (!st.answered) {
      if (e.t === 'paires') return '<div class="small muted center">Touche un élément à gauche puis son partenaire à droite.</div>';
      return '<button class="btn block" data-act="check" id="check-btn"' + (ready() ? '' : ' disabled') + '>Vérifier</button>';
    }
    let sol = '';
    if (!st.correct) {
      if (e.t === 'qcm' || e.t === 'trou') sol = 'Bonne réponse : ' + esc(e.o[e.a]);
      else if (e.t === 'vf') sol = 'Bonne réponse : ' + (e.a ? 'Vrai' : 'Faux');
      else if (e.t === 'ordre') sol = 'Ordre correct : ' + e.items.map((x, i) => (i + 1) + '. ' + esc(x)).join(' · ');
      else if (e.t === 'calc') sol = 'Bonne réponse : ' + esc(String(e.a).replace('.', ',')) + ' ' + esc(e.unit || '');
      else if (e.t === 'paires') sol = 'Associé avec ' + plural(st.miss, 'erreur', 'erreurs') + '.';
    }
    const title = st.correct ? ['Bien vu !', 'Exact !', 'Parfait !', 'Tout juste !'][Math.floor(Math.random() * 4)] : 'Pas tout à fait';
    const requeue = !st.correct && (L.mode === 'lesson' || L.mode === 'review');
    return '<div class="fb ' + (st.correct ? 'ok' : 'ko') + '"><h4>' + ic(st.correct ? 'check' : 'x') + title + '</h4>' + (sol ? '<div class="sol">' + sol + '</div>' : '') + '<p>' + esc(e.x || '') + '</p>' + (requeue ? '<p class="small" style="margin-top:6px;color:var(--muted)">Cette question reviendra avant la fin.</p>' : '') + '</div>' +
      '<button class="btn block" style="--b:' + (st.correct ? 'var(--good)' : 'var(--bad)') + '" data-act="continue">Continuer</button>';
  }

  function parseNum(v) { const x = parseFloat(String(v).replace(/\s/g, '').replace(',', '.')); return isNaN(x) ? null : x; }
  function ready() {
    const st = L.cur, e = st.e;
    if (e.t === 'qcm' || e.t === 'trou' || e.t === 'vf') return st.sel !== null;
    if (e.t === 'ordre') return st.ans.length === e.items.length;
    if (e.t === 'calc') return parseNum(st.val) !== null;
    return false;
  }
  function refreshCheckBtn() { const b = $('#check-btn'); if (b) b.disabled = !ready(); }

  function grade() {
    const st = L.cur, e = st.e;
    let ok = false;
    if (e.t === 'qcm' || e.t === 'trou' || e.t === 'vf') ok = st.sel === e.a;
    else if (e.t === 'ordre') ok = st.ans.every((v, i) => v === i);
    else if (e.t === 'calc') { const v = parseNum(st.val); ok = v !== null && Math.abs(v - e.a) <= (e.tol || 0) + 1e-9; }
    else if (e.t === 'paires') ok = st.miss === 0;
    st.answered = true; st.correct = ok;
    const first = !L.seen[st.iid];
    L.seen[st.iid] = true;
    if (first) { srUpdate(st.iid, ok); S.stats.answered++; if (ok) { S.stats.correct++; L.firstOk++; } }
    if (ok) {
      L.solved++; L.combo++; L.maxCombo = Math.max(L.maxCombo, L.combo); S.stats.bestCombo = Math.max(S.stats.bestCombo, L.combo);
      bump('correct', 1); bump('combo', L.combo); sfx.ok();
      if (L.combo === 5 || L.combo === 10 || L.combo === 15) toast(L.combo + ' bonnes réponses d\'affilée !');
    } else {
      L.combo = 0; L.mistakes++; sfx.bad(); buzz(60);
      if (L.mode === 'passage') L.solved++;
      else L.queue.push(st.iid);
      if (L.mode === 'lesson') { if (S.hearts >= MAX_HEARTS) S.heartsAt = Date.now(); S.hearts = Math.max(0, S.hearts - 1); }
    }
    persist(); renderLesson(); renderStats();
  }

  function outOfHearts(inLesson) {
    sheet('<h3>Gourdes vides</h3><p>Il n\'y a plus d\'eau pour continuer. Une gourde se remplit toutes les 4 heures, la prochaine dans ' + msToHM(nextHeartIn()) + '.</p>' +
      '<button class="btn block" style="--b:var(--water)" data-act="buy" data-item="refill"' + (S.gels < PRICES.refill ? ' disabled' : '') + '>' + ic('flask') + 'Remplir · ' + PRICES.refill + ' gels</button>' +
      '<button class="btn ghost block" data-act="hearts-review">' + ic('refresh') + 'Faire une révision (+1 gourde)</button>' +
      '<button class="btn ghost block" data-act="' + (inLesson ? 'quit-now' : 'close-sheet') + '">' + (inLesson ? 'Quitter la leçon' : 'Plus tard') + '</button>', !!inLesson);
  }

  /* ---------- Défis écrits ---------- */
  function defiXP(score) { return 30 + Math.round(Math.max(0, Math.min(100, score)) * 0.5); }
  const CONTEXT = 'Les Traileurs est un média trail français (compte Instagram d\'environ 100 000 abonnés, revenus surtout issus de partenariats avec des marques outdoor), avec des clubs de course locaux et un jeu de pronostics, Champions by Les Traileurs.';
  // Prompt à coller dans une conversation avec Claude : aucune clé API, tout passe par le compte Claude du joueur.
  function defiPrompt(st) {
    const e = st.e, m = LESSONS[ITEMS[st.iid].lid];
    return 'Tu es mon coach dans un jeu d\'apprentissage quotidien. Je m\'appelle ' + NAME + ' et je travaille chez Les Traileurs. ' + CONTEXT + '\n' +
      'Corrige mon exercice écrit.\n\n' +
      'Compétence : ' + m.s.short + ' — ' + m.l.title + '\nContexte : ' + e.ctx + '\nConsigne : ' + e.q + '\n' +
      'Critères de réussite :\n' + e.crit.map((c, i) => (i + 1) + '. ' + c).join('\n') + '\n\n' +
      'Exemple de bonne réponse (pour te situer, ne l\'exige pas mot pour mot) :\n' + e.ex + '\n\n' +
      'Ma réponse, entre les balises :\n<reponse>\n' + st.text.slice(0, 4000) + '\n</reponse>\n\n' +
      'Évalue avec exigence et bienveillance, en me tutoyant. Si ma réponse ne respecte pas la consigne (longueur, nombre de phrases), baisse la note.\n' +
      '1. Commence par « Note : X/100 » et un verdict en une phrase.\n2. Reprends chaque critère avec ✅ ou ❌.\n3. Deux points forts, puis trois améliorations concrètes.\n4. Termine par une version améliorée de ma réponse, qui respecte la consigne.';
  }
  function saveDraft(st) { const prev = S.essays[st.iid] || { best: 0 }; prev.draft = st.text.slice(0, 3000); S.essays[st.iid] = prev; persist(); }
  function updateWC() { const ta = $('#essay'), w = $('#wc'); if (!ta || !w) return; w.textContent = plural(words(ta.value), 'mot', 'mots'); }
  function finishDefi(score, version) {
    const st = L.cur;
    const prev = S.essays[st.iid] || { best: 0 };
    prev.best = Math.max(prev.best || 0, score); prev.last = score; prev.text = st.text.slice(0, 3000); prev.draft = ''; prev.at = Date.now();
    if (version) prev.coach = String(version).slice(0, 3000);
    S.essays[st.iid] = prev;
    L.seen[st.iid] = true; L.solved = 1;
    finishSession(score);
  }

  /* ---------- Fin de séance ---------- */
  function finishSession(defiScore) {
    const today = dayKey();
    const wasGoal = (S.days[today] || 0) >= S.goal;
    const perfect = L.mistakes === 0;
    const seconds = Math.round((Date.now() - L.start) / 1000);
    const nSeen = Math.max(1, Object.keys(L.seen).length);
    const acc = L.mode === 'defi' ? null : Math.round(100 * L.firstOk / nSeen);
    let xp;
    if (L.mode === 'lesson') xp = 50 + 5 * L.firstOk + (perfect ? 20 : 0) + Math.floor(L.maxCombo / 5) * 5;
    else if (L.mode === 'review') xp = 30 + 5 * L.firstOk;
    else if (L.mode === 'passage') xp = 20 + 5 * L.firstOk;
    else xp = defiXP(defiScore);
    const boosted = Date.now() < S.boostUntil;
    if (boosted) xp *= 2;
    S.xp += xp; S.days[today] = (S.days[today] || 0) + xp; S.league.xp += xp; S.stats.seconds += seconds;
    bump('xp', xp);
    let gels = 0, heartBack = false, passed = null;
    if (L.mode === 'lesson' || L.mode === 'defi') {
      const r = S.lessons[L.lid] || { n: 0, best: 0 };
      r.n++; r.best = Math.max(r.best, L.mode === 'defi' ? defiScore : acc); r.last = today;
      S.lessons[L.lid] = r; S.summitLast[L.s.id] = Date.now(); S.seenCards[L.lid] = 1;
      bump('lessons', 1); bump('summits', L.s.id); S.stats.lessons++;
      gels += 5;
      if (L.mode === 'lesson' && perfect) { gels += 5; S.stats.perfect++; bump('perfect', 1); }
    }
    if (L.mode === 'defi') { bump('defi', 1); S.stats.defis++; S.stats.defiScore += defiScore; gels += defiScore >= 70 ? 10 : 0; }
    if (L.mode === 'review') { S.stats.reviews++; bump('review', 1); gels += 5; if (S.hearts < MAX_HEARTS) { S.hearts++; heartBack = true; } }
    if (L.mode === 'passage') {
      passed = L.firstOk >= Math.min(7, L.total - 1);
      if (passed) {
        const { sid, ui } = L.passage, s = SBYID[sid];
        s.units.forEach((u, k) => { if (k > ui) return; u.lessons.forEach(l => { if (k === ui && l.defi) return; if (!S.lessons[l.id]) S.lessons[l.id] = { n: 1, best: 0, skip: true, last: today }; }); });
        gels += 15;
      }
    }
    const sr = extendStreak();
    if (sr.reward) gels += sr.reward;
    const goalHit = !wasGoal && S.days[today] >= S.goal;
    if (goalHit) gels += 10;
    S.gels += gels;
    const badges = checkBadges();
    persist(); pushLeague();
    sfx.done();
    L.result = { xp, gels, perfect, acc, seconds, boosted, sr, goalHit, badges, heartBack, defiScore, passed };
    L.ends = ['result'];
    if (L.mode === 'lesson' && MISSIONS[L.lid] && !S.missions[L.lid] && activeMissions().length < 4) L.ends.push('mission');
    if (sr.extended) L.ends.push('streak');
    if (goalHit) L.ends.push('goal');
    if (badges.length) L.ends.push('badges');
    L.endIdx = 0; L.phase = 'end';
    renderOverlay();
    confetti();
  }

  function weekStrip() {
    const ws = weekStart(), today = dayKey(), fz = new Set(S.streak.frozen || []);
    return '<div class="week">' + ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => {
      const k = dayKey(new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + i));
      const on = (S.days[k] || 0) > 0, f = fz.has(k);
      return '<div class="wd' + (on ? ' on' : f ? ' fz' : '') + (k === today ? ' now' : '') + '"><i>' + (on ? ic('check') : f ? ic('moon') : '') + '</i>' + d + '</div>';
    }).join('') + '</div>';
  }
  let missionWhen = 'tomorrow';
  function renderEnd() {
    if (L.ends[L.endIdx] === 'custom') { renderEndCustom(); return; }
    const el = lessonEl(), R = L.result, kind = L.ends[L.endIdx];
    let body = '', foot = '<button class="btn block" data-act="end-next">Continuer</button>';
    const sc = L.s ? L.s.color : 'var(--accent)';
    if (kind === 'result') {
      const titles = { review: 'Révision terminée', defi: 'Défi relevé', passage: R.passed ? 'Test réussi !' : 'Pas encore' };
      const t = titles[L.mode] || (R.perfect ? 'Sans faute !' : 'Leçon terminée');
      let sub = R.perfect ? 'Aucune erreur, c\'est la meilleure façon de retenir.' : 'Les erreurs reviendront dans tes révisions : c\'est voulu.';
      if (L.mode === 'defi') sub = 'Note : ' + R.defiScore + '/100. ' + (R.defiScore >= 70 ? 'Belle copie.' : 'Tu peux le refaire plus tard pour progresser.');
      if (L.mode === 'passage') sub = R.passed ? 'Les leçons de ces camps sont validées. Le défi du camp t\'attend.' : L.firstOk + ' bonnes réponses sur ' + L.total + '. Il en faut 7 : suis le parcours, tu iras vite.';
      body = '<div class="end"><div class="hero-ic" style="--sc:' + sc + '">' + ic(L.mode === 'defi' ? 'pen' : L.mode === 'passage' ? 'level' : R.perfect ? 'spark' : 'star') + '</div><h2>' + t + '</h2><p>' + esc(sub) + '</p>' +
        '<div class="tiles"><div class="tile" style="--tc:var(--flame)"><div class="tt">D+ gagné</div><div class="tv num">' + fmt(R.xp) + ' m</div></div>' +
        '<div class="tile" style="--tc:var(--good)"><div class="tt">' + (L.mode === 'defi' ? 'Note' : 'Précision') + '</div><div class="tv num">' + (L.mode === 'defi' ? R.defiScore : R.acc + ' %') + '</div></div>' +
        '<div class="tile" style="--tc:var(--gel)"><div class="tt">Gels</div><div class="tv num">+' + R.gels + '</div></div></div>' +
        (R.boosted ? '<p class="small" style="color:var(--flame);font-weight:700">Boost actif : D+ doublé</p>' : '') +
        (R.heartBack ? '<p class="small" style="color:var(--water);font-weight:700">+1 gourde remplie</p>' : '') +
        '<p class="small num">Temps : ' + Math.floor(R.seconds / 60) + ' min ' + pad(R.seconds % 60) + ' s · Ligue ' + esc(TIERS[S.league.tier].n) + ' : ' + rankNow() + '<sup>e</sup></p></div>';
    } else if (kind === 'mission') {
      missionWhen = 'tomorrow';
      body = '<div class="end"><div class="hero-ic" style="--sc:var(--c-marketing)">' + ic('flag') + '</div><h2>Mission terrain</h2><p>Une leçon ne sert que si tu l\'appliques. Choisis quand tu le fais : c\'est ce qui fait passer à l\'acte.</p>' +
        '<div class="card mission-pick" style="text-align:left;width:100%"><p style="margin:0;font-weight:700;color:var(--ink)">' + esc(MISSIONS[L.lid]) + '</p></div>' +
        '<div class="seg" id="when" role="radiogroup" aria-label="Quand ?">' + [['today', 'Aujourd\'hui'], ['tomorrow', 'Demain'], ['week', 'Cette semaine']].map(w => '<button class="' + (w[0] === missionWhen ? 'on' : '') + '" data-act="mission-when" data-v="' + w[0] + '">' + w[1] + '</button>').join('') + '</div></div>';
      foot = '<div class="row" style="gap:10px"><button class="btn ghost" data-act="end-next">Plus tard</button><button class="btn block grow" style="--b:var(--c-marketing)" data-act="mission-commit">' + ic('flag') + 'Je m\'engage</button></div>';
    } else if (kind === 'streak') {
      body = '<div class="end"><div class="hero-ic flame">' + ic('flame') + '</div><div class="bignum num">' + R.sr.count + '</div><h2>' + (R.sr.count === 1 ? 'jour de série' : 'jours de série') + '</h2>' + weekStrip() +
        '<p>' + (R.sr.count === 1 ? 'Ta série démarre. Reviens demain pour la faire grandir.' : 'Reviens demain pour passer à ' + (R.sr.count + 1) + '.') + (R.sr.reward ? ' Palier atteint : +' + R.sr.reward + ' gels.' : '') + '</p></div>';
    } else if (kind === 'goal') {
      body = '<div class="end"><div class="ring" style="width:110px;height:110px">' + ringSVG(1, 'var(--flame)', 110) + '<div class="lbl" style="color:var(--flame)">' + ic('check') + '</div></div><h2>Objectif du jour atteint</h2><p>' + fmt(S.days[dayKey()]) + ' m de D+ aujourd\'hui. +10 gels.</p></div>';
    } else if (kind === 'badges') {
      body = '<div class="end"><div class="hero-ic flame">' + ic('trophy') + '</div><h2>' + (R.badges.length > 1 ? 'Nouveaux badges' : 'Nouveau badge') + '</h2><div class="badges" style="width:100%">' + R.badges.map(b => '<div class="bdg"><div class="ic">' + ic(b.i) + '</div><b>' + esc(b.n) + '</b><span>' + esc(b.d) + '</span></div>').join('') + '</div></div>';
    }
    el.style.setProperty('--sc', sc);
    el.innerHTML = '<div class="lbody"><div class="in">' + body + '</div></div><div class="lfoot"><div class="in">' + foot + '</div></div>';
  }
  function rankNow() { const list = standings(S.league.week, S.league.tier, S.league.xp, weekFrac()); return list.findIndex(x => x.me) + 1; }
