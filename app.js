/* LoL Stats — lee window.LOL_DATA (un archivo por invocador en /data) y pinta la web. */
(function () {
  'use strict';

  const DD = 'https://ddragon.leagueoflegends.com/cdn/16.22.1/img/champion/';
  const KEYFIX = { 'Wukong': 'MonkeyKing', 'Nunu & Willump': 'Nunu', 'Renata Glasc': 'Renata', 'LeBlanc': 'Leblanc', "Cho'Gath": 'Chogath', "Kha'Zix": 'Khazix', "Vel'Koz": 'Velkoz', "Bel'Veth": 'Belveth', "Kai'Sa": 'Kaisa' };
  const QUEUES = [
    { id: 'all', q: null, label: 'Todas' },
    { id: 'normales', q: 'N', label: 'Normales' },
    { id: 'soloq', q: 'S', label: 'Ranked Solo/Duo' },
    { id: 'flex', q: 'F', label: 'Ranked Flex' }
  ];
  const QNAME = { N: 'Normal', S: 'Solo/Duo', F: 'Flex' };
  const ROLES = ['Top', 'Jungla', 'Mid', 'ADC', 'Support'];

  /* ---------- utilidades ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  const f1 = n => n.toFixed(1);
  const f2 = n => n.toFixed(2);
  const pct = n => Math.round(n) + '%';
  const durFmt = s => Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0');
  const dateFmt = t => new Date(t).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  const timeFmt = t => new Date(t).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const short = n => n.replace(/\s*#.*$/, '');
  const champKey = n => KEYFIX[n] || n.replace(/[^A-Za-z]/g, '');
  const icon = (n, cls) => `<img class="ci ${cls || ''}" src="${DD}${champKey(n)}.png" alt="" loading="lazy" onerror="this.style.visibility='hidden'">`;
  const champ = n => `<span class="champ">${icon(n)}<span>${esc(n)}</span></span>`;
  const wrClass = (wr, n) => (n != null && n < 3) ? 'mid' : wr >= 55 ? 'good' : wr <= 45 ? 'bad' : 'mid';
  const wrBar = (wr, n) => `<span class="wr ${wrClass(wr, n)}"><span class="wr-track"><span class="wr-fill" style="width:${Math.max(2, wr)}%"></span></span><b>${pct(wr)}</b></span>`;

  /* ---------- datos ---------- */
  const MATCH_LIMIT = 100;
  function prepare(Ds) {
    if (!Array.isArray(Ds)) Ds = [Ds];
    const ALIAS = window.LOL_ALIASES || {};
    const parse = D => D.raw.trim().split('\n').filter(l => l.trim()).map(line => {
      const f = line.trim().split('|');
      // Dos formatos: compacto (índices separados por '.') y literal (nombres separados por ';')
      const lit = f[15].indexOf(';') >= 0;
      const cs = lit ? f[15].split(';') : f[15].split('.').map(i => D.champs[+i]);
      const ns = (lit ? f[16].split(';').map(x => x || null) : f[16].split('.').map(x => x === '' ? null : D.names[+x]))
        .map(n => n && ALIAS[n] ? ALIAS[n] : n); // varias cuentas de un amigo cuentan como una persona
      const mi = +f[14], base = mi < 5 ? 0 : 5, eb = mi < 5 ? 5 : 0;
      const allies = [], enemies = [];
      for (let i = 0; i < 5; i++) {
        if (base + i !== mi) allies.push({ c: cs[base + i], n: ns[base + i] });
        enemies.push({ c: cs[eb + i], n: ns[eb + i] });
      }
      const q = f[0], res = f[2];
      return {
        q, t: +f[1] * 60000, res, win: res === 'W', remake: res === 'R', dur: +f[3],
        champ: lit ? f[4] : D.champs[+f[4]], lvl: +f[5], k: +f[6], d: +f[7], a: +f[8],
        kp: f[9] === '' ? null : +f[9], cs: f[10] === '' ? 0 : +f[10], lan: f[11] === '' ? null : +f[11],
        // op.gg no numera el 1.º (lo marca como MVP/ACE): puesto vacío = 1
        rank: res === 'R' ? null : (+f[12] || 1),
        badge: f[13] === '' ? null : lit ? f[13] : D.badges[+f[13]],
        role: q === 'A' ? null : ROLES[mi % 5], opp: q === 'A' ? null : cs[eb + mi % 5],
        acc: D.name, allies, enemies, friends: [], party: 1, sess: 1, prevWin: null
      };
    });
    // Excluir ARAM antes de calcular estadísticas, compañeros y sesiones.
    const games = [].concat.apply([], Ds.map(parse)).filter(g => g.q !== 'A').sort((a, b) => b.t - a.t);
    const valid = games.filter(g => !g.remake).slice(0, MATCH_LIMIT);
    // Amigos = compañeros de equipo que se repiten en 3 o más partidas
    const cnt = {};
    valid.forEach(g => g.allies.forEach(p => { if (p.n) cnt[p.n] = (cnt[p.n] || 0) + 1; }));
    const own = new Set(); // sus otras cuentas no son compañeros
    Ds.forEach(D => { const full = D.name + ' #' + D.tag; own.add(full.toLowerCase()); if (ALIAS[full]) own.add(ALIAS[full].toLowerCase()); });
    const friends = new Set(Object.keys(cnt).filter(n => cnt[n] >= 3 && !own.has(n.toLowerCase())));
    valid.forEach(g => { g.friends = g.allies.filter(p => p.n && friends.has(p.n)).map(p => p.n).sort(); g.party = g.friends.length + 1; });
    // Sesiones = partidas seguidas con menos de 90 min entre inicios
    const asc = valid.slice().sort((a, b) => a.t - b.t);
    let prev = null;
    asc.forEach(g => {
      if (prev && g.t - prev.t < 90 * 60000) { g.sess = prev.sess + 1; g.prevWin = prev.win; }
      prev = g;
    });
    const cutoff = valid.length ? valid[valid.length - 1].t : -Infinity;
    return { games, valid, remakes: games.filter(g => g.remake && g.t >= cutoff).length };
  }

  function agg(gs) {
    const n = gs.length;
    let w = 0, k = 0, d = 0, a = 0, kp = 0, kpn = 0, cs = 0, dur = 0, rk = 0, rkn = 0, lan = 0, lann = 0, mvp = 0;
    for (const g of gs) {
      if (g.win) w++; k += g.k; d += g.d; a += g.a; cs += g.cs; dur += g.dur;
      if (g.kp != null) { kp += g.kp; kpn++; }
      if (g.rank) { rk += g.rank; rkn++; if (g.rank === 1) mvp++; }
      if (g.lan != null) { lan += g.lan; lann++; }
    }
    return {
      n, w, l: n - w, wr: n ? w / n * 100 : 0, k: n ? k / n : 0, d: n ? d / n : 0, a: n ? a / n : 0,
      kda: d ? (k + a) / d : (k + a), kp: kpn ? kp / kpn : 0, csm: dur ? cs / (dur / 60) : 0,
      dur: n ? dur / n : 0, rank: rkn ? rk / rkn : 0, lan: lann ? lan / lann : 0, mvp
    };
  }

  // Agrupa por clave (keyFn puede devolver una clave, una lista o null)
  function groupStats(gs, keyFn) {
    const m = new Map();
    for (const g of gs) {
      let ks = keyFn(g);
      if (ks == null) continue;
      if (!Array.isArray(ks)) ks = [ks];
      for (const k of new Set(ks)) { if (!m.has(k)) m.set(k, []); m.get(k).push(g); }
    }
    return Array.from(m, ([key, games]) => Object.assign({ key, games }, agg(games)));
  }

  function streaks(gs) { // gs: más reciente primero
    let cur = 0, curWin = null, bestW = 0, bestL = 0, run = 0, runWin = null;
    for (let i = 0; i < gs.length; i++) {
      if (i === 0) { curWin = gs[0].win; }
      if (cur === i && gs[i].win === curWin) cur++;
      if (gs[i].win === runWin) run++; else { runWin = gs[i].win; run = 1; }
      if (runWin) bestW = Math.max(bestW, run); else bestL = Math.max(bestL, run);
    }
    return { cur, curWin, bestW, bestL };
  }

  /* ---------- tabla ordenable ---------- */
  const COL = {
    n: { l: 'Partidas', v: r => r.n, f: r => r.n },
    w: { l: 'Victorias', v: r => r.w, f: r => `<span class="tw">${r.w}</span>` },
    lo: { l: 'Derrotas', v: r => r.l, f: r => `<span class="tl">${r.l}</span>` },
    wr: { l: '% victorias', v: r => r.wr, f: r => wrBar(r.wr, r.n) },
    kda: { l: 'KDA', v: r => r.kda, f: r => f2(r.kda) },
    kdaF: { l: 'K / D / A', v: r => r.k, f: r => `${f1(r.k)} / <span class="tl">${f1(r.d)}</span> / ${f1(r.a)}` },
    kp: { l: 'Part. kills', v: r => r.kp, f: r => pct(r.kp) },
    csm: { l: 'CS/min', v: r => r.csm, f: r => f1(r.csm) },
    lan: { l: 'Línea', v: r => r.lan, f: r => r.lan ? Math.round(r.lan) : '–' },
    rank: { l: 'Puesto OP', v: r => -r.rank, f: r => r.rank ? f1(r.rank) + 'º' : '–' }
  };

  function table(cols, rows, opt) {
    opt = opt || {};
    const wrap = el('div', 'tablewrap');
    if (!rows.length) { wrap.appendChild(el('p', 'empty', opt.empty || 'Sin datos suficientes todavía.')); return wrap; }
    let sk = opt.sort == null ? 1 : opt.sort, dir = opt.dir || -1, limit = opt.limit || 0;
    const tbl = el('table'), thead = el('thead'), tbody = el('tbody');
    tbl.append(thead, tbody); wrap.appendChild(tbl);
    let more = null;
    function draw() {
      thead.innerHTML = '<tr>' + cols.map((c, i) =>
        `<th class="${i ? 'num' : ''}" aria-sort="${i === sk ? (dir < 0 ? 'descending' : 'ascending') : 'none'}"><button type="button" data-i="${i}">${c.l}${i === sk ? (dir < 0 ? ' ▾' : ' ▴') : ''}</button></th>`).join('') + '</tr>';
      const v = cols[sk].v;
      const sorted = rows.slice().sort((x, y) => { const a = v(x), b = v(y); return (a > b ? 1 : a < b ? -1 : 0) * dir || y.n - x.n; });
      const shown = limit ? sorted.slice(0, limit) : sorted;
      tbody.innerHTML = shown.map(r => '<tr>' + cols.map((c, i) => `<td class="${i ? 'num' : ''}">${c.f(r)}</td>`).join('') + '</tr>').join('');
      if (more) { more.remove(); more = null; }
      if (limit && rows.length > limit) {
        more = el('button', 'more', `Ver todos (${rows.length})`); more.type = 'button';
        more.onclick = () => { limit = 0; draw(); };
        wrap.appendChild(more);
      }
    }
    thead.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      const i = +b.dataset.i;
      if (i === sk) dir = -dir; else { sk = i; dir = i === 0 ? 1 : -1; }
      draw();
    });
    draw();
    return wrap;
  }

  function card(title, sub, cls) {
    const s = el('section', 'card ' + (cls || ''));
    s.appendChild(el('h2', null, esc(title)));
    if (sub) s.appendChild(el('p', 'sub', sub));
    return s;
  }
  const keyCol = (label, fmt) => ({ l: label, v: r => String(r.key).toLowerCase(), f: r => fmt ? fmt(r.key, r) : esc(r.key) });

  /* ---------- secciones ---------- */
  function secResumen(gs, aram) {
    const A = agg(gs), st = streaks(gs);
    const s = card('Resumen');
    const tiles = [
      ['Partidas', A.n, `<span class="tw">${A.w}V</span> · <span class="tl">${A.l}D</span>`],
      ['% victorias', `<span class="${wrClass(A.wr)}">${pct(A.wr)}</span>`, `<span class="wr-track big"><span class="wr-fill ${wrClass(A.wr)}" style="width:${A.wr}%"></span></span>`],
      ['KDA', f2(A.kda), `${f1(A.k)} / <span class="tl">${f1(A.d)}</span> / ${f1(A.a)}`],
      ['Participación en kills', pct(A.kp), 'de las kills de tu equipo'],
      aram ? null : ['CS por minuto', f1(agg(gs.filter(g => g.role && g.role !== 'Support')).csm), 'sin contar support'],
      ['Duración media', durFmt(A.dur), 'min:seg'],
      ['Puesto OP medio', f1(A.rank) + 'º', `de 10 · ${A.mvp} veces 1.º (MVP/ACE)`],
      ['Racha actual', st.cur + (st.curWin ? 'V' : 'D'), `mejor ${st.bestW}V · peor ${st.bestL}D`]
    ].filter(Boolean);
    s.appendChild(el('div', 'tiles', tiles.map(t => `<div class="tile"><div class="tl-label">${t[0]}</div><div class="tl-val">${t[1]}</div><div class="tl-sub">${t[2]}</div></div>`).join('')));
    const last = gs.slice(0, 30).reverse();
    s.appendChild(el('div', 'form', `<div class="form-label">Últimas ${last.length} partidas <span>(la más reciente a la derecha)</span></div><div class="form-strip">` +
      last.map(g => `<span class="dot ${g.win ? 'w' : 'l'}" title="${g.win ? 'Victoria' : 'Derrota'} · ${esc(g.champ)} ${g.k}/${g.d}/${g.a} · ${dateFmt(g.t)}">${icon(g.champ)}</span>`).join('') + '</div>'));
    return s;
  }

  function secMejorar(gs, aram) {
    const s = card('Para mejorar', 'Conclusiones automáticas a partir de tus partidas en esta cola.', 'wide');
    const list = insights(gs, aram);
    s.appendChild(el('div', 'insights', list.map(i => `<div class="insight ${i.kind}"><div class="in-title">${i.title}</div><div class="in-text">${i.text}</div></div>`).join('')));
    return s;
  }

  function secCampeones(gs, aram) {
    const s = card('Victorias por personaje', 'Pulsa en una columna para ordenar.', 'wide');
    const rows = groupStats(gs, g => g.champ);
    const cols = [keyCol('Campeón', champ), COL.n, COL.w, COL.lo, COL.wr, COL.kda, COL.kdaF, COL.kp];
    if (!aram) cols.push(COL.csm);
    cols.push(COL.rank);
    s.appendChild(table(cols, rows, { sort: 2, limit: 12 }));
    return s;
  }

  function secRoles(gs) {
    const s = card('Por rol', 'Rol deducido de tu posición en el equipo.');
    s.appendChild(table([keyCol('Rol'), COL.n, COL.wr, COL.kda, COL.csm, COL.lan], groupStats(gs, g => g.role), { sort: 1 }));
    return s;
  }

  function secPremade(gs) {
    const s = card('Premade o solo', 'Cuento como premade a los compañeros de equipo que se repiten en 3 o más partidas.', 'wide');
    const solo = agg(gs.filter(g => g.party === 1)), pre = agg(gs.filter(g => g.party > 1));
    const box = (t, A) => `<div class="vs-box"><div class="tl-label">${t}</div><div class="tl-val ${A.n ? wrClass(A.wr, A.n) : ''}">${A.n ? pct(A.wr) : '–'}</div><div class="tl-sub">${A.n} partidas · ${A.w}V ${A.l}D${A.n ? ' · KDA ' + f2(A.kda) : ''}</div></div>`;
    s.appendChild(el('div', 'vs', box('Solo', solo) + box('Con premade', pre)));

    const grid = el('div', 'cols2');
    const c1 = el('div');
    c1.appendChild(el('h3', null, 'Por tamaño del grupo'));
    c1.appendChild(table([keyCol('Grupo', k => k), COL.n, COL.wr, COL.kda],
      groupStats(gs, g => g.party === 1 ? '1 · solo' : g.party + ' jugadores'), { sort: 0, dir: 1 }));
    grid.appendChild(c1);

    const c2 = el('div');
    c2.appendChild(el('h3', null, 'Con cada compañero'));
    const all = agg(gs);
    const fr = groupStats(gs, g => g.friends).map(r => {
      const without = all.n - r.n, ww = all.w - r.w;
      r.wrSin = without ? ww / without * 100 : null; r.nSin = without; return r;
    });
    c2.appendChild(table([keyCol('Compañero', k => `<span title="${esc(k)}">${esc(short(k))}</span>`), COL.n, COL.wr,
      { l: '% sin él/ella', v: r => r.wrSin == null ? -1 : r.wrSin, f: r => r.wrSin == null ? '–' : `${pct(r.wrSin)} <small>(${r.nSin})</small>` }, COL.kda], fr, { sort: 1, limit: 8 }));
    grid.appendChild(c2);
    s.appendChild(grid);

    s.appendChild(el('h3', null, 'Mejores y peores alineaciones'));
    const lineups = groupStats(gs, g => g.party === 1 ? null : g.friends.map(short).join(' + ')).filter(r => r.n >= 3);
    s.appendChild(table([keyCol('Juegas con'), COL.n, COL.w, COL.lo, COL.wr, COL.kda], lineups, { sort: 4, limit: 8, empty: 'Hacen falta al menos 3 partidas con el mismo grupo.' }));
    return s;
  }

  function secSinergias(gs, aram) {
    const s = card('Sinergias de campeones', 'Cómo te va según quién haya en tu equipo y en el rival.', 'wide');
    const min = gs.length >= 60 ? 3 : 2;
    const grid = el('div', 'cols2');
    const c1 = el('div');
    c1.appendChild(el('h3', null, `Aliados con los que más ganas <small>mín. ${min} partidas</small>`));
    c1.appendChild(table([keyCol('Campeón aliado', champ), COL.n, COL.wr],
      groupStats(gs, g => g.allies.map(p => p.c)).filter(r => r.n >= min), { sort: 2, limit: 8 }));
    grid.appendChild(c1);
    const c2 = el('div');
    c2.appendChild(el('h3', null, `Rivales que más te cuestan <small>mín. ${min} partidas</small>`));
    c2.appendChild(table([keyCol('Campeón rival', champ), COL.n, COL.wr],
      groupStats(gs, g => g.enemies.map(p => p.c)).filter(r => r.n >= min), { sort: 2, dir: 1, limit: 8 }));
    grid.appendChild(c2);
    s.appendChild(grid);

    const combos = groupStats(gs, g => g.allies.map(p => g.champ + '|' + p.c)).filter(r => r.n >= min);
    if (combos.length) {
      s.appendChild(el('h3', null, `Tus mejores combos <small>tu campeón + aliado, mín. ${min} partidas</small>`));
      s.appendChild(table([keyCol('Combo', k => { const p = k.split('|'); return champ(p[0]) + ' <span class="plus">+</span> ' + champ(p[1]); }), COL.n, COL.w, COL.lo, COL.wr, COL.kda], combos, { sort: 4, limit: 8 }));
    }
    if (!aram) {
      const opp = groupStats(gs, g => g.opp).filter(r => r.n >= 2);
      if (opp.length) {
        s.appendChild(el('h3', null, 'Contra tu rival de línea <small>mín. 2 partidas</small>'));
        s.appendChild(table([keyCol('Rival de línea', champ), COL.n, COL.wr, COL.kda, COL.lan], opp, { sort: 2, dir: 1, limit: 8 }));
      }
    }
    return s;
  }

  function secHabitos(gs, aram) {
    const s = card('Hábitos de juego', 'Cuándo y cómo rindes mejor. Una sesión son partidas seguidas con menos de 90 min entre ellas.', 'wide');
    const grid = el('div', 'cols2');
    const block = (title, keyFn, order) => {
      const d = el('div'); d.appendChild(el('h3', null, title));
      const rows = groupStats(gs, keyFn); rows.forEach(r => r.ord = order.indexOf(r.key));
      d.appendChild(table([{ l: '', v: r => r.ord, f: r => esc(r.key) }, COL.n, COL.wr, COL.kda], rows, { sort: 0, dir: 1 }));
      return d;
    };
    const durB = aram ? ['Menos de 15 min', '15–20 min', 'Más de 20 min'] : ['Menos de 25 min', '25–32 min', 'Más de 32 min'];
    const durF = aram ? (g => g.dur < 900 ? durB[0] : g.dur < 1200 ? durB[1] : durB[2]) : (g => g.dur < 1500 ? durB[0] : g.dur < 1920 ? durB[1] : durB[2]);
    grid.appendChild(block('Según la duración', durF, durB));
    const sesB = ['1.ª partida', '2.ª–3.ª', '4.ª–6.ª', '7.ª o más'];
    grid.appendChild(block('Según la partida de la sesión', g => g.sess === 1 ? sesB[0] : g.sess <= 3 ? sesB[1] : g.sess <= 6 ? sesB[2] : sesB[3], sesB));
    const prevB = ['Tras una victoria', 'Tras una derrota'];
    grid.appendChild(block('Según la partida anterior', g => g.prevWin == null ? null : g.prevWin ? prevB[0] : prevB[1], prevB));
    const horaB = ['Mañana (6–14 h)', 'Tarde (14–20 h)', 'Noche (20–1 h)', 'Madrugada (1–6 h)'];
    grid.appendChild(block('Según la hora', g => { const h = new Date(g.t).getHours(); return h >= 6 && h < 14 ? horaB[0] : h >= 14 && h < 20 ? horaB[1] : (h >= 20 || h < 1) ? horaB[2] : horaB[3]; }, horaB));
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    grid.appendChild(block('Según el día', g => dias[(new Date(g.t).getDay() + 6) % 7], dias));
    // Semanas
    const wk = el('div'); wk.appendChild(el('h3', null, 'Evolución por semana'));
    const rows = groupStats(gs, g => { const d = new Date(g.t); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d.getTime(); });
    wk.appendChild(table([{ l: 'Semana del', v: r => r.key, f: r => dateFmt(r.key) }, COL.n, COL.wr, COL.kda], rows, { sort: 0, dir: -1, limit: 8 }));
    grid.appendChild(wk);
    s.appendChild(grid);
    return s;
  }

  function secVsDerrotas(gs, aram) {
    const s = card('Victorias frente a derrotas', 'Tus medias cuando ganas y cuando pierdes.');
    const W = agg(gs.filter(g => g.win)), L = agg(gs.filter(g => !g.win));
    const rows = [
      ['Kills', f1(W.k), f1(L.k)], ['Muertes', f1(W.d), f1(L.d)], ['Asistencias', f1(W.a), f1(L.a)],
      ['KDA', f2(W.kda), f2(L.kda)], ['Participación en kills', pct(W.kp), pct(L.kp)]
    ];
    if (!aram) rows.push(['CS/min', f1(W.csm), f1(L.csm)], ['Puntuación de línea', Math.round(W.lan), Math.round(L.lan)]);
    rows.push(['Puesto OP medio', f1(W.rank) + 'º', f1(L.rank) + 'º'], ['Duración', durFmt(W.dur), durFmt(L.dur)]);
    const w = el('div', 'tablewrap');
    w.innerHTML = `<table><thead><tr><th></th><th class="num"><span class="tw">Victorias (${W.n})</span></th><th class="num"><span class="tl">Derrotas (${L.n})</span></th></tr></thead><tbody>` +
      rows.map(r => `<tr><td>${r[0]}</td><td class="num">${r[1]}</td><td class="num">${r[2]}</td></tr>`).join('') + '</tbody></table>';
    s.appendChild(w);
    return s;
  }

  function secHistorial(gs, showQueue, showAcc) {
    const s = card('Historial', null, 'wide');
    const list = el('div', 'hist'); s.appendChild(list);
    let n = 0; const btn = el('button', 'more', ''); btn.type = 'button';
    function add() {
      const next = gs.slice(n, n + 25); n += next.length;
      list.insertAdjacentHTML('beforeend', next.map(g => `<div class="hrow ${g.win ? 'w' : 'l'}">
        <div class="h-res"><b>${g.win ? 'Victoria' : 'Derrota'}</b><span>${showQueue ? QNAME[g.q] + ' · ' : ''}${durFmt(g.dur)}</span></div>
        <div class="h-champ">${icon(g.champ, 'lg')}<div><b>${esc(g.champ)}</b><span>${g.role ? g.role + ' · ' : ''}nv. ${g.lvl}</span></div></div>
        <div class="h-kda"><b>${g.k} / <span class="tl">${g.d}</span> / ${g.a}</b><span>${g.d ? f2((g.k + g.a) / g.d) : 'Perfecto'} KDA · KP ${g.kp == null ? '–' : g.kp + '%'}</span></div>
        <div class="h-extra"><b>${g.rank === 1 ? (g.win ? 'MVP' : 'ACE') : g.rank + 'º'}${g.badge ? ' · ' + esc(g.badge) : ''}</b><span>${g.q === 'A' ? '' : g.cs + ' CS · '}${g.friends.length ? 'con ' + g.friends.map(short).map(esc).join(', ') : 'solo'}</span></div>
        <div class="h-date">${dateFmt(g.t)}<span>${timeFmt(g.t)}${showAcc ? ' · ' + esc(g.acc) : ''}</span></div></div>`).join(''));
      if (n >= gs.length) btn.remove(); else btn.textContent = `Ver más (${gs.length - n} restantes)`;
    }
    btn.onclick = add; s.appendChild(btn); add();
    return s;
  }

  /* ---------- conclusiones ---------- */
  function insights(gs, aram) {
    const out = [], A = agg(gs);
    const add = (kind, title, text) => out.push({ kind, title, text });
    if (gs.length < 10) add('tip', 'Muestra pequeña', `Solo hay ${gs.length} partidas en esta cola: toma estos números como orientación, no como conclusión.`);
    if (gs.length < 5) return out;
    const W = agg(gs.filter(g => g.win)), L = agg(gs.filter(g => !g.win));
    const diff = (a, b) => Math.round(Math.abs(a - b));

    const st = streaks(gs);
    if (!st.curWin && st.cur >= 3) add('bad', `Llevas ${st.cur} derrotas seguidas`, 'Buen momento para parar, cambiar de cola o jugar tu campeón más fiable.');
    if (st.curWin && st.cur >= 3) add('good', `Racha de ${st.cur} victorias`, 'Estás en buen momento: mantén el mismo pool de campeones.');

    const ch = groupStats(gs, g => g.champ).filter(r => r.n >= 4);
    const best = ch.filter(r => r.wr >= 58).sort((a, b) => b.wr - a.wr || b.n - a.n).slice(0, 3);
    const worst = ch.filter(r => r.wr <= 42).sort((a, b) => a.wr - b.wr || b.n - a.n).slice(0, 3);
    const lst = rs => rs.map(r => `<b>${esc(r.key)}</b> (${pct(r.wr)} en ${r.n})`).join(', ');
    if (best.length) add('good', 'Tus mejores campeones', `${lst(best)}. Priorízalos cuando quieras ganar.`);
    if (worst.length) add('bad', 'Campeones que te restan', `${lst(worst)}. Déjalos para practicar o revisa builds y matchups.`);

    if (W.n >= 3 && L.n >= 3 && L.d - W.d >= 2) add('bad', 'Las muertes deciden tus partidas', `Mueres <b>${f1(L.d)}</b> veces de media cuando pierdes y <b>${f1(W.d)}</b> cuando ganas. Jugar más seguro cuando vas por detrás es tu mejora más directa.`);
    const sr = gs.filter(g => g.q !== 'A'), S = agg(sr);
    if (S.n >= 5 && S.d >= 7) add('bad', 'Mueres mucho', `Media de ${f1(S.d)} muertes por partida en la Grieta (${S.n} partidas). Por debajo de 6 se nota enseguida en el % de victorias.`);

    const solo = agg(gs.filter(g => g.party === 1)), pre = agg(gs.filter(g => g.party > 1));
    if (solo.n >= 5 && pre.n >= 5 && diff(solo.wr, pre.wr) >= 8) {
      if (pre.wr > solo.wr) add('good', 'Rindes mejor en premade', `${pct(pre.wr)} con amigos frente a ${pct(solo.wr)} solo (${pre.n} y ${solo.n} partidas).`);
      else add('tip', 'Rindes mejor solo', `${pct(solo.wr)} solo frente a ${pct(pre.wr)} en premade (${solo.n} y ${pre.n} partidas).`);
    }
    const fr = groupStats(gs, g => g.friends).filter(r => r.n >= 8).map(r => { const o = A.n - r.n; r.sin = o >= 5 ? (A.w - r.w) / o * 100 : null; return r; }).filter(r => r.sin != null);
    const fb = fr.slice().sort((a, b) => (b.wr - b.sin) - (a.wr - a.sin));
    if (fb.length && fb[0].wr - fb[0].sin >= 8) add('good', `Mejor compañero: ${esc(short(fb[0].key))}`, `${pct(fb[0].wr)} de victorias con él/ella (${fb[0].n} partidas) frente a ${pct(fb[0].sin)} sin.`);
    const fw = fb[fb.length - 1];
    if (fb.length > 1 && fw.sin - fw.wr >= 8) add('tip', `Con ${esc(short(fw.key))} ganas menos`, `${pct(fw.wr)} con él/ella (${fw.n} partidas) frente a ${pct(fw.sin)} sin. Probad otros roles o composiciones juntos.`);

    const s1 = agg(gs.filter(g => g.sess === 1)), s4 = agg(gs.filter(g => g.sess >= 4));
    if (s1.n >= 6 && s4.n >= 6 && s1.wr - s4.wr >= 10) add('bad', 'Las sesiones largas te pasan factura', `Ganas el ${pct(s1.wr)} de las primeras partidas del día, pero solo el ${pct(s4.wr)} a partir de la 4.ª. Corta antes.`);
    if (s1.n >= 6 && s4.n >= 6 && s4.wr - s1.wr >= 10) add('tip', 'Te cuesta arrancar', `Ganas el ${pct(s1.wr)} de las primeras partidas de la sesión frente al ${pct(s4.wr)} a partir de la 4.ª. Calienta antes con una partida que no importe.`);
    const aw = agg(gs.filter(g => g.prevWin === true)), al = agg(gs.filter(g => g.prevWin === false));
    if (aw.n >= 6 && al.n >= 6 && aw.wr - al.wr >= 10) add('bad', 'Cuidado con el tilt', `Después de perder ganas el ${pct(al.wr)}; después de ganar, el ${pct(aw.wr)}. Tras una derrota, haz una pausa.`);

    if (!aram) {
      const roles = groupStats(gs, g => g.role).filter(r => r.n >= 5).sort((a, b) => b.wr - a.wr);
      if (roles.length >= 2 && roles[0].wr - roles[roles.length - 1].wr >= 10) {
        const b = roles[0], w = roles[roles.length - 1];
        add('tip', `Tu mejor rol es ${b.key}`, `${pct(b.wr)} en ${b.n} partidas. El que peor se te da es ${w.key} (${pct(w.wr)} en ${w.n}).`);
      }
      const farm = agg(gs.filter(g => g.role === 'Top' || g.role === 'Mid' || g.role === 'ADC'));
      if (farm.n >= 5 && farm.csm < 6.5) add('bad', 'Farmeo mejorable', `${f1(farm.csm)} CS/min en roles de línea (${farm.n} partidas). El objetivo razonable es 7 o más: son unos ${Math.round((7 - farm.csm) * 30 * 20)} de oro extra cada 30 minutos.`);
      const lane = agg(gs.filter(g => g.lan != null));
      if (lane.n >= 5 && lane.lan < 47) add('bad', 'Sales perdiendo de la fase de líneas', `Puntuación media de línea de ${Math.round(lane.lan)} sobre 100 (50 es empate). Revisa oleadas, tradeos y wards en los primeros 10 minutos.`);
      if (lane.n >= 5 && lane.lan >= 53) add('good', 'Buena fase de líneas', `Puntuación media de línea de ${Math.round(lane.lan)} sobre 100: sueles salir por delante.`);
      if (S.n >= 5 && S.kp < 45) add('tip', 'Participa más en las peleas', `Estás en el ${pct(S.kp)} de las kills de tu equipo en la Grieta. Rota antes a objetivos y peleas.`);
      const lng = agg(sr.filter(g => g.dur >= 1920)), sht = agg(sr.filter(g => g.dur < 1500));
      if (lng.n >= 6 && sht.n >= 6 && diff(lng.wr, sht.wr) >= 15) {
        if (lng.wr < sht.wr) add('tip', 'Las partidas largas se te escapan', `${pct(lng.wr)} en partidas de más de 32 min frente a ${pct(sht.wr)} en las cortas. Trabaja el cierre: objetivos, visión y no morir antes de Barón o Anciano.`);
        else add('tip', 'Mejoras cuando la partida se alarga', `${pct(lng.wr)} en partidas de más de 32 min frente a ${pct(sht.wr)} en las cortas. El early es tu punto débil.`);
      }
    }
    if (A.rank >= 6.2) add('tip', 'Impacto por debajo de la media', `Tu puesto OP medio es ${f1(A.rank)}º de 10. Céntrate en morir menos y estar en más kills.`);
    if (A.rank && A.rank <= 4.5) add('good', 'Sueles ser de los mejores de la partida', `Puesto OP medio de ${f1(A.rank)}º de 10, con ${A.mvp} partidas como el mejor.`);
    if (!out.length) add('tip', 'Sin patrones claros', 'Tus números están equilibrados en esta cola. Sigue jugando para tener más datos.');
    return out;
  }

  /* ---------- páginas ---------- */
  // Ds: una o varias cuentas de la misma persona (sus partidas se suman)
  function renderProfile(Ds, person) {
    const P = prepare(Ds), multi = Ds.length > 1;
    const title = person || (multi ? Ds.map(D => D.name).join(' + ') : Ds[0].name);
    const named = !multi && !!person && person !== Ds[0].name; // una sola cuenta con nick principal distinto
    document.title = `${title}${multi || named ? '' : ' #' + Ds[0].tag} · LoL Stats`;
    const app = $('#app');
    if (!P.valid.length) { app.appendChild(el('p', 'empty', 'Todavía no hay partidas guardadas.')); return; }
    const top = groupStats(P.valid, g => g.champ).sort((a, b) => b.n - a.n)[0].key;
    const accLine = multi
      ? Ds.map(D => `${esc(D.name)} #${esc(D.tag)}${D.rank && D.rank.solo ? ' (' + esc(D.rank.solo) + ')' : ''}`).join(' · ')
      : `${named ? esc(Ds[0].name) + ' #' + esc(Ds[0].tag) + ' · ' : ''}${esc(Ds[0].region)}${Ds[0].rank && Ds[0].rank.solo ? ' · Solo/Duo: ' + esc(Ds[0].rank.solo) : ''}`;
    const updated = Ds.map(D => D.updated).sort()[0];
    app.appendChild(el('header', 'hero', `
      <a class="back" href="index.html">← Invocadores</a>
      <div class="hero-main">${icon(top, 'hero-ci')}
        <div><h1>${esc(title)}${multi ? ` <span>${Ds.length} cuentas</span>` : named ? '' : ` <span>#${esc(Ds[0].tag)}</span>`}</h1>
        <p>${accLine}</p>
        <p>Últimas ${P.valid.length} partidas (máximo ${MATCH_LIMIT}) del ${dateFmt(P.valid[P.valid.length - 1].t)} al ${dateFmt(P.valid[0].t)}${P.remakes ? ' · ' + P.remakes + ' remakes sin contar' : ''}</p>
        <p class="src">Datos de ${Ds.map(D => `<a href="${esc(D.source)}" target="_blank" rel="noopener">op.gg${multi ? ' · ' + esc(D.name) : ''}</a>`).join(', ')} · actualizado el ${esc(updated)}
          <button type="button" class="refresh" title="Vuelve a leer los datos guardados. Las partidas nuevas las trae la tarea programada «Actualizar LoL Stats» de Claude.">↻ Recargar datos</button></p></div>
      </div>`));
    $('.refresh', app).onclick = () => location.reload();

    const bar = el('div', 'tabs');
    const nav = el('nav', 'chips'); nav.setAttribute('aria-label', 'Colas');
    QUEUES.forEach(q => { const b = el('button'); b.type = 'button'; b.dataset.id = q.id; nav.appendChild(b); });
    bar.appendChild(nav);
    let accNav = null;
    if (multi) {
      accNav = el('nav', 'chips acc'); accNav.setAttribute('aria-label', 'Cuentas');
      [{ id: '', label: 'Todas las cuentas' }].concat(Ds.map(D => ({ id: D.name, label: D.name }))).forEach(a => {
        const b = el('button', null, esc(a.label)); b.type = 'button'; b.dataset.acc = a.id; accNav.appendChild(b);
      });
      bar.appendChild(accNav);
    }
    app.appendChild(bar);
    const content = el('main', 'grid'); app.appendChild(content);

    let curAcc = '', curQ = 'all';
    function show(id) {
      const pool = curAcc ? P.valid.filter(g => g.acc === curAcc) : P.valid;
      const count = q => q.q ? pool.filter(g => g.q === q.q).length : pool.length;
      let q = QUEUES.find(x => x.id === id) || QUEUES[0];
      if (!count(q)) q = QUEUES[0];
      curQ = q.id;
      const gs = q.q ? pool.filter(g => g.q === q.q) : pool;
      const aram = q.q === 'A';
      nav.querySelectorAll('button').forEach(b => {
        const x = QUEUES.find(y => y.id === b.dataset.id), n = count(x);
        b.innerHTML = `${x.label} <span>${n}</span>`; b.disabled = !n;
        b.setAttribute('aria-current', x.id === q.id ? 'true' : 'false');
      });
      if (accNav) accNav.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', b.dataset.acc === curAcc ? 'true' : 'false'));
      const secs = [secResumen(gs, aram), secMejorar(gs, aram), secCampeones(gs, aram)];
      if (!aram) secs.push(secRoles(gs));
      secs.push(secVsDerrotas(gs, aram), secPremade(gs), secSinergias(gs, aram), secHabitos(gs, aram), secHistorial(gs, !q.q, multi && !curAcc));
      content.replaceChildren.apply(content, secs);
      if (location.hash.slice(1) !== q.id) history.replaceState(null, '', '#' + q.id);
    }
    nav.addEventListener('click', e => { const b = e.target.closest('button'); if (b && !b.disabled) show(b.dataset.id); });
    if (accNav) accNav.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { curAcc = b.dataset.acc; show(curQ); } });
    window.addEventListener('hashchange', () => show(location.hash.slice(1)));
    show(location.hash.slice(1));
  }

  // Páginas del índice: window.LOL_PAGES (pages.js) agrupa cuentas; sin él, una página por cuenta
  function pagesOf(all) {
    return window.LOL_PAGES || Object.keys(all).map(id => ({ page: id + '.html', ids: [id] }));
  }

  function renderIndex(all) {
    const app = $('#app');
    app.appendChild(el('header', 'hero', '<div class="hero-main"><div><h1>LoL Stats</h1><p>Estadísticas de partidas por invocador, separadas por cola.</p></div></div>'));
    const list = el('main', 'summoners');
    pagesOf(all).forEach(pg => {
      const Ds = pg.ids.map(id => all[id]).filter(Boolean);
      if (!Ds.length) return;
      const multi = Ds.length > 1, P = prepare(Ds), A = agg(P.valid);
      const top = groupStats(P.valid, g => g.champ).sort((a, b) => b.n - a.n).slice(0, 3);
      const qs = QUEUES.slice(1).map(q => { const a = agg(P.valid.filter(g => g.q === q.q)); return a.n ? `<div class="sq"><span>${q.label}</span>${wrBar(a.wr, a.n)}<small>${a.n} partidas</small></div>` : ''; }).join('');
      const name = pg.name || (multi ? Ds.map(D => D.name).join(' + ') : Ds[0].name);
      const named = !multi && !!pg.name && pg.name !== Ds[0].name;
      const sub = multi ? Ds.map(D => `${esc(D.name)} #${esc(D.tag)}`).join(' · ')
        : `${named ? esc(Ds[0].name) + ' #' + esc(Ds[0].tag) + ' · ' : ''}${esc(Ds[0].region)}${Ds[0].rank && Ds[0].rank.solo ? ' · ' + esc(Ds[0].rank.solo) : ''}`;
      list.appendChild(el('a', 'card summoner', `
        <div class="s-head">${top.map(t => icon(t.key, 'lg')).join('')}<div><h2>${esc(name)}${multi || named ? '' : ` <span>#${esc(Ds[0].tag)}</span>`}</h2>
        <p>${sub}</p></div></div>
        <div class="s-kpis"><div><b class="${wrClass(A.wr)}">${pct(A.wr)}</b><span>${A.w}V ${A.l}D</span></div><div><b>${f2(A.kda)}</b><span>KDA</span></div><div><b>${A.n}</b><span>partidas</span></div></div>
        <div class="s-queues">${qs}</div><p class="src">Actualizado el ${esc(Ds.map(D => D.updated).sort()[0])}</p>`)).href = pg.page;
    });
    app.appendChild(list);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const all = window.LOL_DATA || {};
    const attr = document.body.dataset.summoner;
    if (attr) {
      const Ds = attr.split(',').map(s => all[s.trim()]).filter(Boolean);
      if (Ds.length) renderProfile(Ds, document.body.dataset.person);
      else $('#app').appendChild(el('p', 'empty', 'No se han encontrado datos para este invocador.'));
    } else renderIndex(all);
  });
})();
