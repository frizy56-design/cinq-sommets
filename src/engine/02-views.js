  /* ---------- Rendu principal ---------- */
  let TAB = 'path', CARNET_TAB = 'ecrits';
  function renderAll() { renderStats(); renderTabs(); renderView(); }
  function renderStats() {
    const st = S.streak, today = dayKey();
    const doneToday = st.last === today;
    $('#me-btn').textContent = (NAME || 'A').charAt(0).toUpperCase();
    $('#me-btn').classList.toggle('on', TAB === 'profile');
    $('#stats').innerHTML =
      '<button class="stat flame' + (doneToday ? '' : ' off') + '" data-act="streak-info" aria-label="Série : ' + st.count + ' jours">' + ic('flame') + '<span class="n num">' + st.count + '</span></button>' +
      '<button class="stat gel" data-act="tab" data-tab="quests" aria-label="' + S.gels + ' gels">' + ic('gel') + '<span class="n num">' + fmt(S.gels) + '</span></button>' +
      '<button class="stat water" data-act="hearts-info" aria-label="' + S.hearts + ' gourdes">' + ic('flask') + '<span class="n num">' + S.hearts + '</span></button>';
  }
  function renderTabs() {
    const T = [['path', 'mountain', 'Parcours'], ['practice', 'bolt', 'Pratique'], ['league', 'trophy', 'Ligue'], ['quests', 'target', 'Quêtes'], ['carnet', 'book', 'Carnet']];
    $('#tabs').innerHTML = T.map(t => '<button class="tab' + (TAB === t[0] ? ' on' : '') + '" data-act="tab" data-tab="' + t[0] + '"' + (TAB === t[0] ? ' aria-current="page"' : '') + '>' + ic(t[1]) + '<span>' + t[2] + '</span>' +
      ((t[0] === 'quests' && (questAlert() || missionDueToday())) || (t[0] === 'practice' && dueCount() >= 6) ? '<i class="badge" aria-label="À voir"></i>' : '') + '</button>').join('');
  }
  function renderView() {
    const v = $('#view');
    const f = { path: viewPath, practice: viewPractice, league: viewLeague, quests: viewQuests, carnet: viewCarnet, profile: viewProfile }[TAB] || viewPath;
    v.innerHTML = f();
    renderStats();
  }
  function missionDueToday() { const t = dayKey(); return activeMissions().some(m => m.due <= t); }

  function ringSVG(frac, color, size) {
    const r = 32, c = 2 * Math.PI * r, f = Math.max(0, Math.min(1, frac));
    return '<svg viewBox="0 0 76 76" width="' + (size || 76) + '" height="' + (size || 76) + '" aria-hidden="true"><circle cx="38" cy="38" r="' + r + '" fill="none" stroke="var(--line)" stroke-width="8"/><circle cx="38" cy="38" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + (c * f).toFixed(1) + ' ' + c.toFixed(1) + '"/></svg>';
  }
  function topo(seed) {
    let p = '';
    for (let k = 1; k <= 8; k++) {
      const R = 16 * k; let d = '';
      for (let i = 0; i <= 48; i++) {
        const a = i / 48 * Math.PI * 2;
        const rr = R * (1 + 0.13 * Math.sin(a * 3 + k * 0.7 + seed) + 0.06 * Math.sin(a * 5 + seed * 2));
        d += (i ? 'L' : 'M') + (250 + rr * Math.cos(a) * 1.35).toFixed(1) + ' ' + (92 + rr * Math.sin(a)).toFixed(1);
      }
      p += '<path d="' + d + 'Z"/>';
    }
    return '<svg class="topo" viewBox="0 0 320 170" preserveAspectRatio="xMaxYMid slice" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="1.3">' + p + '</g></svg>';
  }
  function dueLabel(due) {
    const d = daysBetween(dayKey(), due);
    if (d < 0) return 'En retard';
    if (d === 0) return 'Aujourd\'hui';
    if (d === 1) return 'Demain';
    return 'D\'ici ' + parseDay(due).toLocaleDateString('fr-FR', { weekday: 'long' });
  }

  function viewPath() {
    const today = dayKey();
    const xpToday = S.days[today] || 0;
    const st = S.streak;
    const rec = recommend();
    const due = dueCount();
    let alerts = '';
    if (canRepair() && st.count <= 1) alerts += '<div class="alert warn">' + ic('flame') + '<div class="grow">Ta série de ' + S.streak.lost.count + ' jours s\'est arrêtée. <button class="link" data-act="repair">La réparer (' + PRICES.repair + ' gels)</button></div></div>';
    else if (st.count > 0 && st.last !== today) {
      const h = new Date().getHours();
      alerts += h >= 18
        ? '<div class="alert warn">' + ic('flame') + '<span>Ta série de ' + plural(st.count, 'jour', 'jours') + ' s\'arrête à minuit. Il reste ' + msToHM(untilMidnight()) + '.</span></div>'
        : '<div class="alert info">' + ic('flame') + '<span>Une leçon aujourd\'hui et ta série passe à ' + (st.count + 1) + ' jours.</span></div>';
    } else if (st.count === 0 && !st.last) alerts += '<div class="alert info">' + ic('flame') + '<span>Termine une leçon pour allumer ta première série.</span></div>';
    const dm = activeMissions().filter(m => m.due <= today);
    if (dm.length) alerts += '<button class="alert mission" data-act="tab" data-tab="quests">' + ic('flag') + '<span class="grow" style="text-align:left">Mission terrain : ' + esc(dm[0].text) + '</span></button>';
    if (PLATFORM && PLATFORM.pathAlert) alerts += PLATFORM.pathAlert(PCTX);
    if (Date.now() < S.boostUntil) alerts += '<div class="alert info">' + ic('bolt') + '<span>D+ doublé encore ' + msToHM(S.boostUntil - Date.now()) + '.</span></div>';
    let recLbl = 'Tout est fait !';
    if (rec && rec.type === 'lesson') { const m = LESSONS[rec.lid]; recLbl = m.s.name + ' · ' + m.l.title; }
    else if (rec && rec.type === 'review') recLbl = 'Révision de tes points faibles';
    let h = '<section class="card today" aria-label="Aujourd\'hui">' +
      '<div class="ring">' + ringSVG(xpToday / S.goal, 'var(--flame)') + (xpToday >= S.goal ? '<div class="lbl" style="color:var(--flame)">' + ic('check') + '<small>ATTEINT</small></div></div>' : '<div class="lbl num">' + Math.round(100 * xpToday / S.goal) + '%<small>OBJECTIF</small></div></div>') +
      '<div class="today-txt"><div class="eyebrow">Aujourd\'hui</div><div class="h-display num">' + fmt(xpToday) + ' / ' + fmt(S.goal) + ' m D+</div><div class="small muted">Prochaine étape : ' + esc(recLbl) + '</div></div>' +
      (alerts ? '<div class="list" style="grid-column:1/-1;gap:8px">' + alerts + '</div>' : '') +
      '<div class="today-actions">' +
      (rec ? '<button class="btn" data-act="session">' + ic('play') + 'Séance du jour</button>' : '<button class="btn" data-act="tab" data-tab="practice">' + ic('bolt') + 'Pratiquer</button>') +
      '<button class="btn ghost" data-act="review"' + (seenItems().length < 3 ? ' disabled' : '') + '>' + ic('refresh') + (due ? due : 'Réviser') + '</button>' +
      '</div></section>';
    h += '<div class="chips" role="tablist" aria-label="Sommets">' + SUMMITS.map(s => '<button class="chip' + (S.summit === s.id ? ' on' : '') + '" role="tab" aria-selected="' + (S.summit === s.id) + '" style="--sc:' + s.color + '" data-act="summit" data-id="' + s.id + '"><i class="dot"></i>' + esc(s.short) + ' <span class="frac num">' + summitDone(s) + '/' + s.lessonIds.length + '</span></button>').join('') + '</div>';
    const s = SBYID[S.summit];
    const done = summitDone(s), tot = s.lessonIds.length, mast = Math.round(100 * summitMastery(s));
    h += '<section class="summit" style="--sc:' + s.color + '">' + topo(ORDER.indexOf(s.id) + 1) +
      '<svg class="ridge" viewBox="0 0 190 96" aria-hidden="true"><path fill="#fff" d="M0 96L38 54l20 16 44-58 26 34 20-14 42 50v14z"/></svg>' +
      '<div class="eyebrow">Sommet ' + (ORDER.indexOf(s.id) + 1) + ' sur 5</div><h2 class="h-display">' + esc(s.name) + '</h2><p>' + esc(s.tagline) + '</p>' +
      '<div class="bar"><i style="width:' + (100 * done / tot) + '%"></i></div><div class="meta"><span>' + done + ' / ' + tot + ' étapes</span><span>Maîtrise ' + mast + ' %</span></div></section>';
    const OFF = [0, 54, 80, 54, 0, -54, -80, -54];
    let k = 0;
    const cur = nextLesson(s);
    s.units.forEach((u, ui) => {
      const last = ui === s.units.length - 1;
      const locked = !isUnlocked(u.lessonIds[0]);
      h += '<div class="unit-h" style="--sc:' + s.color + '"><div class="t"><div class="eyebrow">' + (last ? 'Camp ' + (ui + 1) + ' · Sommet' : 'Camp ' + (ui + 1)) + '</div><b>' + esc(u.title) + '</b><div class="src">' + esc(u.sub) + '</div>' +
        (locked ? '<button class="link small" style="margin-top:6px" data-act="passage" data-s="' + s.id + '" data-u="' + ui + '">' + ic('level') + ' Tester mon niveau pour sauter ici</button>' : '') + '</div>' +
        '<div class="unit-btns"><button class="fiche-btn" data-act="guide" data-s="' + s.id + '" data-u="' + ui + '" aria-label="Fiche du camp ' + (ui + 1) + '">' + ic('cards') + 'Fiche</button>' +
        (ttsOK() ? '<button class="fiche-btn" data-act="listen-unit" data-s="' + s.id + '" data-u="' + ui + '" aria-label="Écouter le camp ' + (ui + 1) + '">' + ic('headphones') + 'Écouter</button>' : '') + '</div></div>';
      const nodes = u.lessonIds.map(lid => ({ kind: 'lesson', lid })).concat([{ kind: 'chest', key: s.id + '-' + ui }]);
      const rowH = 98, top0 = 44;
      const pts = [];
      let inner = '';
      nodes.forEach((n, i) => {
        const off = OFF[k % OFF.length]; k++;
        const cx = 140 + off, cy = top0 + i * rowH + 34;
        pts.push([cx, cy, n]);
        if (n.kind === 'lesson') {
          const m = LESSONS[n.lid], d = isDone(n.lid), un = isUnlocked(n.lid), isCur = n.lid === cur;
          const fading = d && !m.l.defi && lessonDue(n.lid) >= 2;
          const cls = 'node' + (m.l.defi ? ' defi' : '') + (!un ? ' locked' : '') + (isCur ? ' current' : '') + (fading ? ' fading' : '');
          const icon = !un ? 'lock' : d ? 'check' : m.l.defi ? 'pen' : 'star';
          const cnt = d && S.lessons[n.lid].n > 1 ? '<span class="cnt num">×' + S.lessons[n.lid].n + '</span>' : '';
          const crack = fading ? '<span class="crack" aria-hidden="true">' + ic('refresh') + '</span>' : '';
          inner += '<button class="' + cls + '" style="left:' + (cx - 34) + 'px;top:' + (cy - 34) + 'px" data-act="node" data-lid="' + n.lid + '" aria-label="' + esc(m.l.title) + (d ? ', terminée' : !un ? ', verrouillée' : '') + (fading ? ', à raviver' : '') + '">' + ic(icon) + cnt + crack + '</button>';
          if (isCur) inner += '<div class="tip" style="left:' + cx + 'px;top:' + (cy - 46) + 'px">' + (m.l.defi ? 'Défi' : done ? 'Continuer' : 'Commencer') + '</div>';
        } else {
          const ready = u.lessonIds.every(isDone), open = !!S.chests[n.key];
          inner += '<button class="node chest' + (!ready ? ' locked' : '') + (open ? ' open' : '') + '" style="left:' + (cx - 34) + 'px;top:' + (cy - 34) + 'px" data-act="chest" data-key="' + n.key + '" aria-label="Coffre du camp' + (open ? ', ouvert' : ready ? ', à ouvrir' : ', verrouillé') + '">' + ic('chest') + '</button>';
        }
      });
      const H = top0 + nodes.length * rowH;
      const all = pts.map(p => p[0] + ',' + p[1]).join(' ');
      let lastDone = -1;
      pts.forEach((p, i) => { if (p[2].kind === 'lesson' && isDone(p[2].lid)) lastDone = i; });
      const donePts = lastDone >= 0 ? pts.slice(0, Math.min(pts.length, lastDone + 2)).map(p => p[0] + ',' + p[1]).join(' ') : '';
      h += '<div class="trail" style="height:' + H + 'px;--sc:' + s.color + '"><svg class="path" viewBox="0 0 280 ' + H + '" aria-hidden="true"><polyline points="' + all + '" fill="none" stroke="var(--line)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 14"/>' + (donePts ? '<polyline points="' + donePts + '" fill="none" stroke="' + s.color + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 14" opacity=".75"/>' : '') + '</svg>' + inner + '</div>';
    });
    if (done === tot) h += '<div class="card done-summit"><div class="h-display" style="font-size:20px">Sommet atteint</div><p class="muted small">Garde ta maîtrise au-dessus de 80 % avec les révisions, et passe à l\'entraînement illimité.</p><button class="btn" data-act="gen-open" data-s="' + s.id + '">' + ic('infinity') + 'Entraînement illimité</button></div>';
    return h;
  }

  function viewPractice() {
    const due = dueCount();
    const coach = !COACH_OFF;
    const card = (icn, col, title, desc, btn, act, extra, dis) => '<section class="card prac" style="--pc:' + col + '"><div class="prac-h"><span class="prac-ic">' + ic(icn) + '</span><div><h3>' + title + '</h3><p class="small muted">' + desc + '</p></div></div>' + (extra || '') + '<button class="btn block" style="--b:' + col + '" data-act="' + act + '"' + (dis ? ' disabled' : '') + '>' + btn + '</button></section>';
    let h = '<section class="card"><div class="eyebrow">Pratique</div><div class="h-display" style="font-size:21px;margin-top:4px">S\'entraîner au-delà des leçons</div><p class="small muted" style="margin:6px 0 0">Le parcours t\'apprend les principes. Ici, tu les mets à l\'épreuve, sur des cas qui ressemblent à ta semaine.</p></section>';
    h += '<h3 class="sec">Jeu de rôle</h3><p class="small muted" style="margin:-8px 0 0">Claude joue ton interlocuteur. À la fin, un coach débriefe ta conversation.</p>';
    h += '<div class="rp-list">' + ROLEPLAYS.map(r => {
      const s = SBYID[r.skill] || SUMMITS[0];
      const best = S.rpBest[r.id];
      return '<button class="card rp-card" style="--sc:' + s.color + '" data-act="rp-open" data-id="' + r.id + '"' + (coach ? '' : ' disabled') + '><span class="rp-tag">' + esc(s.short) + ' · ' + esc(r.level) + '</span><b>' + esc(r.title) + '</b><span class="small muted">' + (best != null ? 'Meilleur score : ' + best + '/100' : 'Jamais joué') + '</span></button>';
    }).join('') + '</div>';
    if (!coach) h += '<p class="small muted">' + (PLATFORM ? 'Le coach n\'est pas encore branché sur ce site : l\'administrateur doit ajouter une clé API Claude dans Supabase (voir le README). En attendant, les défis écrits se corrigent avec la grille.' : 'Le coach n\'est pas disponible sur cet affichage : les jeux de rôle, l\'atelier et l\'entraînement illimité ont besoin de lui.') + '</p>';
    h += card('wrench', 'var(--c-ecrire)', 'Atelier', 'Colle un vrai texte de ta semaine (e-mail à une marque, légende, message au club). Le coach l\'analyse avec les principes du jeu et te propose une version améliorée.', ic('wrench') + 'Ouvrir l\'atelier', 'atelier-open', '', !coach);
    h += card('infinity', 'var(--c-psycho)', 'Entraînement illimité', 'Des questions nouvelles, créées à partir des fiches d\'un sommet, avec des cas Les Traileurs. Fini les réponses apprises par cœur.', ic('infinity') + 'Générer une séance', 'gen-open', '', !coach);
    h += card('refresh', 'var(--good)', 'Révision', due ? plural(due, 'notion arrive', 'notions arrivent') + ' à échéance. Les réviser maintenant les ancre pour des semaines.' : 'Rien d\'urgent. Une révision consolide quand même tes notions les plus fragiles.', ic('refresh') + 'Réviser' + (due ? ' · ' + due : ''), 'review', '', seenItems().length < 3);
    h += card('timer', 'var(--flame)', 'Sprint 60 secondes', 'Un maximum de bonnes réponses en une minute, sur tout ce que tu as déjà vu. Record : ' + plural(S.sprintBest, 'bonne réponse', 'bonnes réponses') + '.', ic('timer') + 'Lancer le sprint', 'sprint', '', seenItems().length < 6);
    if (ttsOK()) h += card('headphones', 'var(--c-marketing)', 'Écoute', 'Les fiches lues à voix haute, camp par camp. Pour réviser en courant, en conduisant ou dans le train.', ic('headphones') + 'Choisir un camp', 'listen-open', '');
    return h;
  }

  function viewLeague() {
    const lg = S.league, tier = TIERS[lg.tier];
    const t = weekFrac();
    const list = standings(lg.week, lg.tier, lg.xp, t);
    const daysLeft = Math.max(1, Math.ceil((1 - t) * 7));
    let h = '<section class="card"><div class="league-h" style="--lc:' + tier.c + '"><div class="medal">' + ic('shield') + '</div><div><div class="eyebrow">Ligue de la semaine</div><div class="h-display" style="font-size:22px">Ligue ' + esc(tier.n) + '</div><div class="small muted">Fin dans ' + plural(daysLeft, 'jour', 'jours') + ' · les 5 premiers montent</div></div></div>' +
      '<div class="tiers" style="--lc:' + tier.c + '">' + TIERS.map((x, i) => '<i class="' + (i <= lg.tier ? 'on' : '') + '" title="' + esc(x.n) + '"></i>').join('') + '</div></section>';
    h += teamHTML();
    h += '<section class="card list" aria-label="Classement">';
    list.forEach((r, i) => {
      const rank = i + 1;
      if (rank === 6 && lg.tier < TIERS.length - 1) h += '<div class="zone up">' + ic('up') + ' Zone de promotion au-dessus</div>';
      if (rank === 11 && lg.tier > 0) h += '<div class="zone down">' + ic('down') + ' Zone de relégation en dessous</div>';
      const initials = r.me ? (NAME || 'A').charAt(0).toUpperCase() : r.nm.split(' ').map(x => x[0]).join('').slice(0, 2);
      h += '<div class="lrow' + (r.me ? ' me' : '') + '"><span class="rk num' + (rank <= 3 ? ' top' : '') + '">' + rank + '</span><span class="av" style="--avc:' + r.col + '">' + esc(initials) + '</span><span class="nm">' + esc(r.me ? 'Toi' : r.nm) + '</span><span class="xp num">' + fmt(r.xp) + ' m</span></div>';
    });
    h += '</section><p class="small muted center">Ligue d\'entraînement avec 14 coureurs virtuels qui progressent au fil de la semaine. Podium : 60, 40 et 25 gels.</p>';
    if (lg.hist && lg.hist.length) h += '<section class="card"><div class="eyebrow">Semaines précédentes</div><div class="list" style="margin-top:8px">' + lg.hist.slice().reverse().slice(0, 6).map(x => '<div class="row small"><span class="grow">Ligue ' + esc(TIERS[x.tier].n) + '</span><span class="num muted">' + fmt(x.xp) + ' m</span><b class="num">' + x.rank + '<sup>e</sup></b></div>').join('') + '</div></section>';
    return h;
  }

  function viewQuests() {
    const q = S.quests;
    const ms = activeMissions();
    let h = '';
    h += '<section class="card"><div class="row"><div class="grow"><div class="eyebrow">Missions terrain</div><div class="h-display" style="font-size:20px">Ce que tu appliques cette semaine</div></div><span class="mcount num">' + ms.length + '</span></div>' +
      (ms.length ? '<div class="list" style="margin-top:12px">' + ms.map(m => {
        const meta = LESSONS[m.lid];
        const late = m.due < dayKey();
        return '<article class="mission' + (late ? ' late' : '') + '" style="--sc:' + (meta ? meta.s.color : 'var(--accent)') + '"><div class="mission-top"><span class="rp-tag">' + esc(meta ? meta.s.short : '') + '</span><span class="small ' + (late ? 'bad' : 'muted') + '">' + ic('clock') + ' ' + dueLabel(m.due) + '</span></div><p>' + esc(m.text) + '</p><div class="row" style="gap:8px"><button class="btn claim" style="--b:var(--good)" data-act="mission-done" data-lid="' + m.lid + '">' + ic('check') + 'C\'est fait · +60 m</button><button class="link small muted" data-act="mission-drop" data-lid="' + m.lid + '">Abandonner</button></div></article>';
      }).join('') + '</div>'
        : '<p class="small muted" style="margin:10px 0 0">Après chaque leçon, le jeu te propose une action concrète à faire dans ton travail. C\'est là que les principes deviennent des réflexes : décider à l\'avance quand et quoi faire augmente nettement les chances de passer à l\'acte (Gollwitzer & Sheeran, 2006).</p>') + '</section>';
    h += '<section class="card"><div class="row"><div class="grow"><div class="eyebrow">Quêtes du jour</div><div class="h-display" style="font-size:20px">Trois objectifs, un coffre</div></div><div class="small muted row" style="gap:4px">' + ic('clock') + msToHM(untilMidnight()) + '</div></div></section>';
    h += '<section class="card list">';
    q.list.forEach((x, i) => {
      const d = questDone(x), p = Math.min(x.p, x.n);
      h += '<div class="quest"><div class="ic">' + ic(QICON[x.k] || 'target') + '</div><div><b>' + esc((QLABEL[x.k] || (() => x.k))(x.n)) + '</b><div class="pbar"><i style="width:' + (100 * p / x.n) + '%"></i></div><div class="pv num">' + fmt(p) + ' / ' + fmt(x.n) + '</div></div>' +
        (x.c ? '<span class="muted small">' + ic('check') + '</span>' : d ? '<button class="btn claim" data-act="claim" data-i="' + i + '">+10 ' + ic('gel') + '</button>' : '<span></span>') + '</div>';
    });
    const all = q.list.every(x => x.c);
    h += '<div class="sep"></div><div class="quest"><div class="ic" style="color:var(--gel);background:color-mix(in srgb,var(--gel) 14%,transparent)">' + ic('chest') + '</div><div><b>Coffre du jour</b><div class="small muted">20 gels et ton D+ doublé pendant 15 minutes</div></div>' +
      (q.chest ? '<span class="muted small">Ouvert</span>' : all ? '<button class="btn claim" style="--b:var(--gel)" data-act="daychest">Ouvrir</button>' : ic('lock')) + '</div></section>';
    h += '<h3 class="sec">Ravito</h3><section class="card list">' +
      shopItem('moon', 'var(--freeze)', 'Jour de repos', 'Protège ta série si tu manques un jour. ' + S.streak.freezes + ' / 2 équipés.', 'freeze', PRICES.freeze, S.streak.freezes >= 2) +
      '<div class="sep"></div>' + shopItem('flask', 'var(--water)', 'Remplir les gourdes', S.hearts >= MAX_HEARTS ? 'Tes gourdes sont pleines.' : S.hearts + ' / 5, la prochaine se remplit dans ' + msToHM(nextHeartIn()) + '.', 'refill', PRICES.refill, S.hearts >= MAX_HEARTS) +
      '<div class="sep"></div>' + shopItem('bolt', 'var(--flame)', 'Boost D+ ×2', 'Double le D+ gagné pendant 15 minutes.', 'boost', PRICES.boost, Date.now() < S.boostUntil) +
      '</section>';
    return h;
  }
  function shopItem(icn, col, name, desc, act, price, disabled) {
    return '<div class="shop-item"><div class="ic" style="color:' + col + '">' + ic(icn) + '</div><div><b>' + esc(name) + '</b><div class="small muted">' + esc(desc) + '</div></div><button class="btn claim ghost" data-act="buy" data-item="' + act + '"' + (disabled ? ' disabled' : '') + '><span class="price">' + ic('gel') + price + '</span></button></div>';
  }

  function viewCarnet() {
    let h = '<div class="seg big" role="tablist"><button class="' + (CARNET_TAB === 'ecrits' ? 'on' : '') + '" data-act="carnet-tab" data-v="ecrits" role="tab">Mes écrits</button><button class="' + (CARNET_TAB === 'biblio' ? 'on' : '') + '" data-act="carnet-tab" data-v="biblio" role="tab">Bibliothèque</button></div>';
    if (CARNET_TAB === 'biblio') return h + viewLibrary();
    const essays = Object.keys(S.essays).filter(k => S.essays[k].text && ITEMS[k]).map(k => Object.assign({ id: k }, S.essays[k])).sort((a, b) => (b.at || 0) - (a.at || 0));
    const at = S.carnet.atelier.slice().reverse();
    const rp = S.carnet.rp.slice().reverse();
    const done = Object.keys(S.missions).filter(k => S.missions[k].status === 'done').map(k => Object.assign({ lid: k }, S.missions[k])).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));
    if (!essays.length && !at.length && !rp.length && !done.length) {
      return h + '<section class="card center"><div class="h-display" style="font-size:19px">Ton carnet se remplira tout seul</div><p class="small muted">Tes défis écrits, les textes passés à l\'atelier, les débriefs de jeux de rôle et tes missions accomplies arrivent ici. Tu peux y revenir avant un rendez-vous ou pour réutiliser une bonne formulation.</p></section>';
    }
    if (rp.length) h += '<h3 class="sec">Jeux de rôle</h3>' + rp.map(r => { const sc = ROLEPLAYS.find(x => x.id === r.id) || { title: r.id }; return '<details class="card entry"><summary><span class="score-pill">' + r.score + '</span><span class="grow"><b>' + esc(sc.title) + '</b><span class="small muted">' + new Date(r.at).toLocaleDateString('fr-FR') + ' · ' + esc(r.resultat || '') + '</span></span></summary><p>' + esc(r.verdict) + '</p>' + (r.moment ? '<div class="ver">' + esc(r.moment) + '</div>' : '') + '</details>'; }).join('');
    if (at.length) h += '<h3 class="sec">Atelier</h3>' + at.map(a => '<details class="card entry"><summary><span class="score-pill">' + a.score + '</span><span class="grow"><b>' + esc(a.type) + '</b><span class="small muted">' + new Date(a.at).toLocaleDateString('fr-FR') + ' · ' + esc(a.lens) + '</span></span></summary><p class="small">' + esc(a.diagnostic) + '</p><h5>Ton texte</h5><div class="ver">' + esc(a.text) + '</div><h5>Version retravaillée</h5><div class="ver">' + esc(a.version) + '</div>' + (a.retenir ? '<p class="small"><b>À retenir :</b> ' + esc(a.retenir) + '</p>' : '') + '<button class="link small" data-act="copy-text" data-text="' + esc(a.version) + '">Copier la version retravaillée</button></details>').join('');
    if (essays.length) h += '<h3 class="sec">Défis écrits</h3>' + essays.map(e => { const m = LESSONS[ITEMS[e.id].lid]; return '<details class="card entry" style="--sc:' + m.s.color + '"><summary><span class="score-pill">' + e.best + '</span><span class="grow"><b>' + esc(m.l.title) + '</b><span class="small muted">' + esc(m.s.name) + (e.at ? ' · ' + new Date(e.at).toLocaleDateString('fr-FR') : '') + '</span></span></summary><h5>Ta réponse</h5><div class="ver">' + esc(e.text) + '</div>' + (e.coach ? '<h5>Version du coach</h5><div class="ver">' + esc(e.coach) + '</div>' : '') + '</details>'; }).join('');
    if (done.length) h += '<h3 class="sec">Missions accomplies</h3><section class="card list">' + done.map(m => '<div><div class="small muted">' + (m.doneAt ? new Date(m.doneAt).toLocaleDateString('fr-FR') : '') + '</div><div>' + esc(m.text) + '</div>' + (m.note ? '<div class="small" style="margin-top:4px"><b>Retour :</b> ' + esc(m.note) + '</div>' : '') + '</div>').join('<div class="sep"></div>') + '</section>';
    return h;
  }

  function viewLibrary() {
    let h = '<section class="card"><div class="eyebrow">La méthode derrière le jeu</div><div class="h-display" style="font-size:19px;margin:4px 0 8px">Pourquoi ça marche</div>' +
      '<p class="small" style="margin:0">Le jeu s\'appuie sur des principes parmi les mieux établis de la recherche sur l\'apprentissage, résumés dans <i>Make It Stick</i> (Brown, Roediger, McDaniel, 2014) : <b>se tester</b> plutôt que relire, <b>espacer</b> les révisions (1, 3, 7, 16 puis 35 jours) et <b>alterner</b> les sujets. Les missions terrain reposent sur les <b>intentions de mise en œuvre</b> : décider quand et quoi faire augmente nettement le passage à l\'acte, avec un effet moyen d = 0,65 dans la méta-analyse de Gollwitzer et Sheeran (2006). La série, la ligue et les quêtes utilisent l\'aversion à la perte et la preuve sociale du sommet « Comprendre ».</p></section>';
    SUMMITS.forEach(s => {
      h += '<div class="lib-h" style="--sc:' + s.color + '"><i class="dot"></i><h3>' + esc(s.name) + '</h3></div>';
      s.books.forEach((b, i) => {
        const key = s.id + '-' + i, read = !!S.books[key];
        h += '<article class="card book" style="--sc:' + s.color + '"><div class="spine num">' + b.y + '</div><div><h4>' + esc(b.t) + '</h4><div class="by">' + esc(b.a) + ', ' + b.y + '</div>' +
          '<div class="k">Pourquoi c\'est une référence</div><p>' + esc(b.proof) + '</p><div class="k">L\'idée à retenir</div><p>' + esc(b.idea) + '</p>' +
          '<button class="readbtn' + (read ? ' on' : '') + '" data-act="book" data-key="' + key + '" aria-pressed="' + read + '">' + ic('check') + (read ? 'Lu' : 'Marquer comme lu · +10 gels') + '</button></div></article>';
      });
    });
    return h;
  }

  function viewProfile() {
    const st = S.streak, acc = S.stats.answered ? Math.round(100 * S.stats.correct / S.stats.answered) : 0;
    const nextPeak = PEAKS.find(p => S.xp < p.h) || PEAKS[PEAKS.length - 1];
    const prevH = (PEAKS.filter(p => p.h <= S.xp).pop() || { h: 0 }).h;
    let h = '<section class="card"><div class="row"><span class="av" style="--avc:var(--accent);width:52px;height:52px;font-size:20px">' + esc((NAME || 'A').charAt(0).toUpperCase()) + '</span><div class="grow"><div class="h-display" style="font-size:21px">' + esc(NAME || 'Toi') + '</div><div class="small muted">Inscrit le ' + new Date(S.created).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + '</div></div></div>' +
      '<div class="sync ' + (remote.status === 'cloud' ? 'cloud' : '') + '" style="margin-top:12px"><i></i>' + (remote.status === 'cloud' ? (PLATFORM ? PLATFORM.syncLabel : 'Progression enregistrée dans ton compte Claude') : 'Progression enregistrée sur cet appareil') + '</div>' +
      (!PLATFORM && IS_OWNER ? '<div class="sync" style="margin-top:6px"><i style="background:var(--flame)"></i>Rappel du soir à 20 h 27 si la leçon du jour n\'est pas faite</div>' : '') + '</section>';
    if (PLATFORM && PLATFORM.profileHTML) h += PLATFORM.profileHTML(PCTX, 'top');
    h += '<div class="kpis">' +
      kpi('flame', 'var(--flame)', st.count, 'jours de série') + kpi('mountain', 'var(--accent)', fmt(S.xp) + ' m', 'D+ cumulé') +
      kpi('trophy', 'var(--gel)', 'Ligue ' + TIERS[S.league.tier].n, 'ligue actuelle') + kpi('check', 'var(--good)', acc + ' %', 'de bonnes réponses') +
      kpi('chat', 'var(--c-vente)', S.stats.rp, 'jeux de rôle') + kpi('flag', 'var(--c-marketing)', S.stats.missions, 'missions accomplies') + '</div>';
    h += '<section class="card"><div class="eyebrow">Bilan par sommet</div><div class="list" style="margin-top:10px">' + SUMMITS.map(s => {
      const m = Math.round(100 * summitMastery(s)), a = summitAccuracy(s);
      return '<div class="bilan" style="--sc:' + s.color + '"><div class="row small"><b class="grow">' + esc(s.name) + '</b><span class="muted num">' + (a == null ? '—' : Math.round(a * 100) + ' % justes') + '</span></div><div class="pbar" style="--b:' + s.color + '"><i style="width:' + m + '%"></i></div><div class="small muted num">Maîtrise ' + m + ' %</div></div>';
    }).join('') + '</div><p class="small muted" style="margin:10px 0 0">La maîtrise baisse quand des notions arrivent à échéance sans être révisées.</p></section>';
    const frag = fragileItems(5);
    if (frag.length) h += '<section class="card"><div class="eyebrow">Notions fragiles</div><div class="list" style="margin-top:8px">' + frag.map(id => { const it = ITEMS[id]; return '<div class="row small" style="align-items:flex-start"><i class="dot" style="background:' + it.s.color + ';width:10px;height:10px;border-radius:50%;margin-top:5px;flex:none"></i><span class="grow">' + esc(it.e.q.length > 110 ? it.e.q.slice(0, 107) + '…' : it.e.q) + '</span><span class="muted num">' + S.items[id].w + ' ✕</span></div>'; }).join('') + '</div><button class="btn block" style="margin-top:12px;--b:var(--good)" data-act="review-fragile">' + ic('refresh') + 'Revoir ces notions</button></section>';
    h += '<section class="card"><div class="eyebrow">Ton ascension</div><div class="h-display" style="font-size:18px;margin-top:4px">Prochain sommet : ' + esc(nextPeak.n) + '</div>' +
      '<div class="pbar" style="margin-top:12px;--b:var(--accent)"><i style="width:' + Math.min(100, 100 * (S.xp - prevH) / (nextPeak.h - prevH)) + '%"></i></div><div class="peak num"><span>' + fmt(S.xp) + ' m</span><span>' + fmt(nextPeak.h) + ' m</span></div></section>';
    h += '<section class="card"><div class="eyebrow">12 dernières semaines</div><div class="small muted">Record : ' + plural(st.best, 'jour', 'jours') + ' · ' + plural(st.freezes, 'jour de repos équipé', 'jours de repos équipés') + '</div><div class="cal" style="margin-top:10px">' + calendar() + '</div><div class="cal-leg"><span><i style="background:var(--flame)"></i>Jour actif</span><span><i style="background:var(--freeze)"></i>Jour de repos</span></div></section>';
    h += '<h3 class="sec">Badges · ' + Object.keys(S.badges).filter(k => BADGES.some(b => b.id === k)).length + ' / ' + BADGES.length + '</h3><div class="badges">' + BADGES.map(b => '<div class="bdg' + (S.badges[b.id] ? '' : ' off') + '"><div class="ic">' + ic(b.i) + '</div><b>' + esc(b.n) + '</b><span>' + esc(b.d) + '</span></div>').join('') + '</div>';
    if (PLATFORM && PLATFORM.profileHTML) { h += PLATFORM.profileHTML(PCTX, 'bottom'); if (PLATFORM.onProfile) PLATFORM.onProfile(PCTX); }
    h += '<h3 class="sec">Réglages</h3><section class="card list"><div><div class="eyebrow" style="margin-bottom:8px">Objectif quotidien</div><div class="seg">' + GOALS.map(g => '<button class="' + (S.goal === g.v ? 'on' : '') + '" data-act="goal" data-v="' + g.v + '">' + esc(g.n) + ' · ' + g.v + ' m</button>').join('') + '</div></div>' +
      '<div class="sep"></div><div class="switch"><span>Effets sonores</span><button class="tog' + (S.sound ? ' on' : '') + '" data-act="sound" role="switch" aria-checked="' + S.sound + '" aria-label="Effets sonores"></button></div>' +
      '<div class="sep"></div><button class="link small" style="align-self:flex-start;color:var(--bad)" data-act="reset">Remettre ma progression à zéro</button></section>';
    return h;
  }
  function kpi(i, col, v, l) { return '<div class="kpi"><span style="color:' + col + '">' + ic(i) + '</span><div style="min-width:0"><b class="num">' + esc(v) + '</b><span>' + esc(l) + '</span></div></div>'; }
  function calendar() {
    const today = dayKey();
    const start = dayKey(weekStart(parseDay(addDays(today, -77))));
    let h = ['L', '', 'M', '', 'V', '', 'D'].map(d => '<span class="hd">' + d + '</span>').join('');
    const fz = new Set(S.streak.frozen || []);
    for (let i = 0; i < 84; i++) {
      const d = addDays(start, i);
      if (daysBetween(d, today) < 0) { h += '<span></span>'; continue; }
      const on = (S.days[d] || 0) > 0;
      h += '<span class="d' + (on ? ' on' : fz.has(d) ? ' fz' : '') + (d === today ? ' today' : '') + '" title="' + d + '"></span>';
    }
    return h;
  }
