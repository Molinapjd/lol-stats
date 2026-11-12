/* Motor local de selección: historial personal + reglas de estilo, nunca winrates globales inventados. */
(function (root, factory) {
  const node = typeof module === 'object' && module.exports;
  const coach = node ? require('./matchup-coach.js') : root.LOL_MATCHUP_COACH;
  const roles = node ? require('./matchup-roles.js') : root.LOL_MATCHUP_ROLES;
  const api = factory(coach, roles);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LOL_DRAFT_ENGINE = api;
})(typeof window !== 'undefined' ? window : globalThis, function (coach, roleData) {
  'use strict';
  const ROLES = ['Top', 'Jungla', 'Mid', 'ADC', 'Support'];
  const POOLS = {
    Top: ['Malphite', 'Garen', 'Mordekaiser', 'Ornn', 'Shen', 'Jax', 'Darius', 'Sett', 'Gwen', 'Teemo', 'Sion', 'Kayle', 'Volibear', 'Trundle', 'Pantheon', 'Wukong', 'Gragas', 'Poppy', "Cho'Gath", 'Fiora', 'Nasus', 'Urgot', 'Camille', 'Renekton'],
    Jungla: ['Amumu', 'Warwick', 'Vi', 'Nocturne', 'Wukong', 'Diana', 'Rammus', 'Sejuani', 'Xin Zhao', 'Jarvan IV', 'Zac', 'Master Yi', 'Viego', 'Lillia', 'Poppy', 'Briar', 'Shyvana', 'Nunu & Willump', 'Kha\'Zix', 'Kayn', 'Trundle'],
    Mid: ['Annie', 'Malzahar', 'Galio', 'Ahri', 'Vex', 'Veigar', 'Lux', 'Mel', "Vel'Koz", 'Orianna', 'Viktor', 'Syndra', 'Lissandra', 'Akali', 'Zed', 'Yasuo', 'Yone', 'Kassadin', 'Fizz', 'Ekko'],
    ADC: ['Ashe', 'Miss Fortune', 'Jinx', 'Jhin', 'Sivir', 'Caitlyn', 'Xayah', "Kai'Sa", 'Ezreal', 'Varus', 'Tristana', 'Vayne', "Kog'Maw", 'Smolder', 'Yunara', 'Nilah', 'Zeri', 'Lucian'],
    Support: ['Nautilus', 'Leona', 'Morgana', 'Janna', 'Braum', 'Lulu', 'Senna', 'Thresh', 'Zyra', 'Milio', 'Nami', 'Karma', 'Lux', 'Brand', 'Rakan', 'Soraka', 'Alistar', 'Seraphine', 'Renata Glasc']
  };
  const LISTS = {
    dash: 'Akali|Ahri|Aatrox|Camille|Diana|Ekko|Fiora|Fizz|Gragas|Gwen|Irelia|Jarvan IV|Jax|Kalista|Kayn|LeBlanc|Lee Sin|Lucian|Nilah|Qiyana|Rakan|Renekton|Riven|Samira|Sylas|Tristana|Vi|Wukong|Xin Zhao|Yasuo|Yone|Zac|Zeri',
    auto: 'Ashe|Caitlyn|Draven|Jax|Jhin|Jinx|Kalista|Kog\'Maw|Lucian|Master Yi|Miss Fortune|Tristana|Tryndamere|Twitch|Varus|Vayne|Xin Zhao|Yasuo|Yone|Yunara|Zeri',
    magic: 'Ahri|Akali|Anivia|Annie|Aurelion Sol|Azir|Brand|Diana|Ekko|Evelynn|Fizz|Galio|Gwen|Karthus|Kassadin|Katarina|Kennen|LeBlanc|Lillia|Lux|Malzahar|Mel|Mordekaiser|Neeko|Orianna|Rumble|Ryze|Swain|Syndra|Teemo|Veigar|Vel\'Koz|Vex|Viktor|Vladimir|Xerath|Ziggs|Zoe|Zyra',
    engage: 'Alistar|Amumu|Blitzcrank|Leona|Malphite|Maokai|Nautilus|Rakan|Rell|Sejuani|Thresh|Vi|Zac',
    poke: 'Brand|Caitlyn|Ezreal|Hwei|Jayce|Karma|Lux|Varus|Vel\'Koz|Xerath|Ziggs|Zoe|Zyra',
    antiTank: 'Brand|Fiora|Gwen|Kog\'Maw|Lillia|Trundle|Varus|Vayne|Vel\'Koz',
    antiAuto: 'Jax|Malphite|Rammus|Teemo',
    peel: 'Alistar|Braum|Janna|Lulu|Milio|Nami|Renata Glasc|Thresh',
    sustain: 'Karma|Milio|Nami|Senna|Seraphine|Sona|Soraka',
    safe: 'Ahri|Caitlyn|Ezreal|Sivir|Tristana|Xayah',
    lockdown: 'Annie|Lissandra|Malzahar|Nautilus|Vi',
    immobile: 'Aphelios|Ashe|Brand|Jhin|Jinx|Karthus|Kog\'Maw|Lux|Miss Fortune|Senna|Soraka|Swain|Varus|Veigar|Vel\'Koz|Viktor|Xerath|Ziggs|Zyra'
  };
  const has = (trait, name) => (LISTS[trait] || '').split('|').includes(name);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const stats = games => ({ n: games.length, w: games.filter(g => g.win).length });
  const normalize = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  function resolveChampion(value, catalog) {
    const key = normalize(value);
    return Object.keys(catalog).find(n => normalize(n) === key || normalize(catalog[n].id) === key) || null;
  }

  // Un campeón entra en un rol si es una posición habitual suya o si el invocador lo ha
  // jugado ahí 3 veces o más (pick propio fuera de lo común). Una partida suelta en otra
  // posición suele ser un error de orden del equipo en normales, no un pick real.
  const OFF_ROLE_MIN = 3;
  const standardRole = (name, role, catalog) => roleData.rolesOf(name, catalog).includes(role);
  function fitsRole(name, role, games, catalog) {
    if (standardRole(name, role, catalog)) return true;
    const mine = games.filter(g => g.champ === name), here = mine.filter(g => g.role === role).length;
    return here >= OFF_ROLE_MIN && here >= mine.length * 0.3; // y al menos el 30% de sus partidas con él
  }
  const isCounter = (name, enemy) => roleData.countersFor(enemy).some(c => c.name === name);

  function tierList(games, role, catalog) {
    if (!ROLES.includes(role)) return [];
    const candidates = new Set(POOLS[role]);
    games.forEach(g => candidates.add(g.champ));
    const rows = [...candidates].filter(name => catalog[name] && fitsRole(name, role, games, catalog)).map(name => {
      const personal = stats(games.filter(g => g.role === role && g.champ === name));
      const overall = stats(games.filter(g => g.champ === name));
      // 10 partidas virtuales al 50% moderan las muestras pequeñas.
      const adjusted = (personal.w + 5) / (personal.n + 10);
      const familiarity = 18 * (1 - Math.exp(-personal.n / 7)) + 9 * (1 - Math.exp(-overall.n / 12));
      const performance = (adjusted - 0.5) * 35;
      const ease = (10 - catalog[name].difficulty) * 0.45;
      const priority = Math.max(0, 3 - POOLS[role].indexOf(name) * 0.18);
      const base = clamp(48 + familiarity + performance + ease + priority, 0, 100);
      return { name, personal, overall, adjusted, base, tier: personal.n >= 5 && adjusted >= 0.5 && base >= 62 ? 'S' : personal.n >= 3 || overall.n >= 5 ? 'A' : 'B' };
    });
    return rows.sort((a, b) => b.base - a.base || b.personal.n - a.personal.n || a.name.localeCompare(b.name)).slice(0, 8);
  }

  function mechanics(name, enemy, role, catalog) {
    const you = catalog[name], foe = catalog[enemy];
    let value = 50;
    if (has('dash', enemy) && name === 'Poppy') value += 23;
    if (has('dash', enemy) && name === 'Vex') value += 17;
    if (has('auto', enemy) && has('antiAuto', name)) value += 17;
    if (has('magic', enemy) && name === 'Galio') value += 16;
    if (has('engage', enemy) && name === 'Morgana') value += 20;
    if (has('engage', enemy) && has('peel', name)) value += 14;
    if (has('engage', enemy) && has('safe', name)) value += 12;
    if (foe.tags.includes('Assassin') && has('lockdown', name)) value += 15;
    if (foe.tags.includes('Tank') && has('antiTank', name)) value += 16;
    if (has('poke', enemy) && has('sustain', name)) value += 10;
    if (has('immobile', enemy) && has('engage', name)) value += 12;
    if (has('immobile', enemy) && has('poke', name)) value += 8;
    if (role !== 'Jungla' && you.range >= 500 && foe.range < 250 && !has('dash', enemy)) value += 7;
    if (has('poke', enemy) && you.range < 250 && !has('engage', name) && !has('dash', name)) value -= 10;
    if (has('engage', enemy) && has('immobile', name)) value -= 9;
    if (has('antiTank', enemy) && you.tags.includes('Tank')) value -= 12;
    if (foe.tags.includes('Tank') && name === 'Jhin') value -= 12;
    if (has('antiAuto', enemy) && has('auto', name)) value -= 14;
    const feedback = coach.explain(name, enemy, role);
    const known = roleData.countersFor(enemy).find(c => c.name === name);
    if (known) {
      value += 20;
      feedback.reasons = [`Counter conocido de ${enemy}: ${known.why}`].concat(feedback.reasons);
    }
    return { score: clamp(value, 0, 100), counter: !!known, ...feedback };
  }

  function duelSummary(games) {
    const base = stats(games);
    const kdaGames = games.filter(g => [g.k,g.d,g.a].every(Number.isFinite));
    const sum = key => kdaGames.reduce((total,g) => total + g[key], 0);
    const kills = sum('k'), deaths = sum('d'), assists = sum('a');
    const kp = games.filter(g => Number.isFinite(g.kp));
    return { ...base, l: base.n - base.w, wr: base.n ? base.w / base.n * 100 : null,
      k: kdaGames.length ? kills / kdaGames.length : null,
      d: kdaGames.length ? deaths / kdaGames.length : null,
      a: kdaGames.length ? assists / kdaGames.length : null,
      kda: kdaGames.length ? (deaths ? (kills + assists) / deaths : kills + assists) : null,
      kp: kp.length ? kp.reduce((total,g) => total + g.kp,0) / kp.length : null,
      recent: games.slice().sort((a,b) => (b.t || 0) - (a.t || 0)).slice(0,5)
    };
  }
  function matchupHistory(games, role, name, enemy) {
    const versus = games.filter(g => g.role === role && g.opp === enemy);
    const selected = versus.filter(g => g.champ === name);
    const rest = games.filter(g => g.role === role && g.champ === name && g.opp !== enemy);
    const byChampion = [...new Set(versus.map(g => g.champ))].map(champ => ({ name: champ, ...duelSummary(versus.filter(g => g.champ === champ)) })).sort((a,b) => b.n-a.n || a.name.localeCompare(b.name));
    return { selected: duelSummary(selected), all: duelSummary(versus), rest: duelSummary(rest), byChampion };
  }

  function recommend(games, role, enemy, catalog) {
    if (!catalog[enemy] || !ROLES.includes(role)) return [];
    return tierList(games, role, catalog).filter(c => c.name !== enemy).map(c => {
      const kit = mechanics(c.name, enemy, role, catalog);
      // Para jungla: rival de jungla, no un duelo de línea. Support: se valora el support rival.
      const history = matchupHistory(games, role, c.name, enemy);
      const head = history.selected;
      const historyScore = 50 + ((head.w + 5) / (head.n + 10) - 0.5) * 100;
      const score = clamp(c.base * 0.4 + kit.score * 0.5 + historyScore * 0.1, 0, 100);
      return { ...c, kit, head, history, score };
    }).sort((a, b) => b.score - a.score || b.personal.n - a.personal.n || a.name.localeCompare(b.name));
  }

  // Counters teóricos del rival para ese rol: primero los conocidos y, si no hay, los de
  // mejor encaje por kit entre los campeones habituales del rol. No usa el historial.
  function theoreticalCounters(role, enemy, catalog, limit = 2) {
    if (!catalog[enemy] || !ROLES.includes(role)) return [];
    const known = roleData.countersFor(enemy).filter(c => c.name !== enemy && catalog[c.name] && standardRole(c.name, role, catalog))
      .map(c => ({ name: c.name, why: c.why, known: true, kit: mechanics(c.name, enemy, role, catalog) }));
    if (known.length) return known.slice(0, limit);
    return Object.keys(catalog).filter(n => n !== enemy && standardRole(n, role, catalog))
      .map(n => ({ name: n, known: false, kit: mechanics(n, enemy, role, catalog) }))
      .filter(c => c.kit.score >= 60)
      .sort((a, b) => b.kit.score - a.kit.score || a.name.localeCompare(b.name)).slice(0, limit)
      .map(c => ({ ...c, why: c.kit.reasons[0] }));
  }

  // Plan del emparejamiento: el pick sale SIEMPRE del repertorio real del invocador en ese
  // rol (campeones jugados). Si ninguno es counter directo, se añade el counter teórico.
  function matchupPlan(games, role, enemy, catalog) {
    const ranked = recommend(games, role, enemy, catalog);
    if (!ranked.length) return { ranked, pick: null, fromPool: false, counter: false, theory: [] };
    const pool = ranked.filter(c => c.personal.n > 0 || c.overall.n > 0);
    const pick = pool[0] || ranked[0];
    // Counter directo = counter conocido del rival que ya juega. Un buen encaje por habilidades no basta.
    const counter = pool.length > 0 && pick.kit.counter;
    const theory = counter ? [] : theoreticalCounters(role, enemy, catalog)
      .filter(c => c.name !== pick.name && (c.known || c.kit.score > pick.kit.score));
    return { ranked, pick, fromPool: pool.length > 0, counter, theory };
  }
  return { ROLES, POOLS, stats, normalize, resolveChampion, tierList, recommend, mechanics, duelSummary, matchupHistory, fitsRole, isCounter, theoreticalCounters, matchupPlan };
});
