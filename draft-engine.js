/* Motor local de selección: historial personal + reglas de estilo, nunca winrates globales inventados. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LOL_DRAFT_ENGINE = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
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

  function tierList(games, role, catalog) {
    if (!ROLES.includes(role)) return [];
    const lane = games.filter(g => g.role === role);
    const candidates = new Set(POOLS[role]);
    lane.forEach(g => candidates.add(g.champ));
    const rows = [...candidates].filter(name => catalog[name]).map(name => {
      const personal = stats(lane.filter(g => g.champ === name));
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
    const reasons = [], warnings = [];
    const add = (points, text) => { value += points; reasons.push(text); };
    const warn = (points, text) => { value -= points; warnings.push(text); };
    if (has('dash', enemy) && name === 'Poppy') add(23, 'Tu W puede cortar desplazamientos cercanos. Guárdala para la entrada rival; no detiene teletransportes.');
    if (has('dash', enemy) && name === 'Vex') add(17, 'Tu pasiva castiga los desplazamientos: conserva el miedo para frenar su entrada.');
    if (has('auto', enemy) && has('antiAuto', name)) add(17, 'Tu kit tiene herramientas contra ataques básicos. Reserva la defensa para sus intercambios, en lugar de gastarla al acercarte.');
    if (has('magic', enemy) && name === 'Galio') add(16, 'El escudo mágico de tu W ayuda a absorber daño mágico. Juega alrededor de su disponibilidad.');
    if (has('engage', enemy) && name === 'Morgana') add(20, 'El escudo negro puede evitar el control mientras aguanta. Resérvalo para la iniciación rival.');
    if (has('engage', enemy) && has('peel', name)) add(14, 'Tienes herramientas para separar al iniciador de tu carry. Contra su entrada, prioriza proteger antes que perseguir.');
    if (has('engage', enemy) && has('safe', name)) add(12, 'Tienes una herramienta de reposicionamiento o defensa para responder a su iniciación. Consérvala hasta que se comprometa.');
    if (foe.tags.includes('Assassin') && has('lockdown', name)) add(15, 'Tu control fiable puede limitar a un asesino cuando entra. Evita gastarlo antes de que se exponga.');
    if (foe.tags.includes('Tank') && has('antiTank', name)) add(16, 'Tu kit incluye daño porcentual, verdadero o reducción de resistencias útil contra objetivos resistentes.');
    if (has('poke', enemy) && has('sustain', name)) add(10, 'Tu curación o escudos ayudan a sostener el desgaste. Gestiona el maná y evita regalar intercambios.');
    if (has('immobile', enemy) && has('engage', name)) add(12, 'El rival tiene poca movilidad propia: amenaza la entrada cuando su herramienta defensiva esté en enfriamiento.');
    if (has('immobile', enemy) && has('poke', name)) add(8, 'Puedes buscar desgaste contra un rival con pocas salidas propias. Mantén visión para no exponerte al avanzar.');
    if (role !== 'Jungla' && you.range >= 500 && foe.range < 250 && !has('dash', enemy)) add(7, 'Tu alcance de ataque permite castigar a un rival cuerpo a cuerpo sin desplazamiento habitual. No rompas la distancia por una baja.');
    if (has('poke', enemy) && you.range < 250 && !has('engage', name) && !has('dash', name)) warn(10, 'Puede desgastarte antes de que llegues. Cede recursos peligrosos y busca entradas con ayuda.');
    if (has('engage', enemy) && has('immobile', name)) warn(9, 'Tu movilidad es limitada frente a su iniciación. Necesitas buena posición y una ruta de salida.');
    if (has('antiTank', enemy) && you.tags.includes('Tank')) warn(12, 'El rival tiene herramientas contra tanques. Tu resistencia por sí sola no garantiza intercambios favorables.');
    if (foe.tags.includes('Tank') && name === 'Jhin') warn(12, 'Tu recarga puede limitar el daño continuo contra un tanque. Coordina el foco con tu equipo y evita alargar un duelo a solas.');
    if (has('antiAuto', enemy) && has('auto', name)) warn(14, 'El rival puede mitigar tus ataques básicos. Espera a que gaste su defensa antes de comprometer todo tu daño.');
    if (!reasons.length) reasons.push('No hay una ventaja de kit específica identificada por estas reglas. La recomendación se apoya principalmente en tu comodidad y tus partidas.');
    return { score: clamp(value, 0, 100), reasons, warnings };
  }

  function recommend(games, role, enemy, catalog) {
    if (!catalog[enemy] || !ROLES.includes(role)) return [];
    return tierList(games, role, catalog).filter(c => c.name !== enemy).map(c => {
      const kit = mechanics(c.name, enemy, role, catalog);
      // Para jungla: rival de jungla, no un duelo de línea. Support: se valora el support rival.
      const direct = games.filter(g => g.role === role && g.champ === c.name && g.opp === enemy);
      const head = stats(direct);
      const historyScore = 50 + ((head.w + 5) / (head.n + 10) - 0.5) * 100;
      const score = clamp(c.base * 0.4 + kit.score * 0.5 + historyScore * 0.1, 0, 100);
      return { ...c, kit, head, score };
    }).sort((a, b) => b.score - a.score || b.personal.n - a.personal.n || a.name.localeCompare(b.name));
  }
  return { ROLES, POOLS, stats, normalize, resolveChampion, tierList, recommend, mechanics };
});
