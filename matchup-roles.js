/* Posiciones habituales de cada campeón y counters de línea muy establecidos.
   Datos editoriales (conocimiento general del juego), no estadísticas en directo. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LOL_MATCHUP_ROLES = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const BY_ROLE = {
    Top: "Aatrox|Akali|Ambessa|Aurora|Camille|Cho'Gath|Darius|Dr. Mundo|Fiora|Gangplank|Garen|Gnar|Gragas|Gwen|Heimerdinger|Illaoi|Irelia|Jax|Jayce|K'Sante|Kayle|Kennen|Kled|Malphite|Mordekaiser|Nasus|Olaf|Ornn|Pantheon|Poppy|Quinn|Renekton|Riven|Rumble|Ryze|Sett|Shen|Singed|Sion|Skarner|Sylas|Tahm Kench|Teemo|Trundle|Tryndamere|Udyr|Urgot|Vayne|Vladimir|Volibear|Warwick|Wukong|Yasuo|Yone|Yorick",
    Jungla: "Amumu|Bel'Veth|Briar|Diana|Ekko|Elise|Evelynn|Fiddlesticks|Gragas|Graves|Hecarim|Ivern|Jarvan IV|Jax|Karthus|Kayn|Kha'Zix|Kindred|Lee Sin|Lillia|Master Yi|Naafiri|Nidalee|Nocturne|Nunu & Willump|Olaf|Pantheon|Poppy|Qiyana|Rammus|Rek'Sai|Rengar|Sejuani|Shaco|Shyvana|Skarner|Taliyah|Talon|Trundle|Udyr|Vi|Viego|Volibear|Warwick|Wukong|Xin Zhao|Zac|Zyra",
    Mid: "Ahri|Akali|Akshan|Anivia|Annie|Aurelion Sol|Aurora|Azir|Cassiopeia|Corki|Diana|Ekko|Fizz|Galio|Hwei|Irelia|Jayce|Kassadin|Katarina|LeBlanc|Lissandra|Lux|Malzahar|Mel|Naafiri|Neeko|Orianna|Qiyana|Ryze|Smolder|Swain|Sylas|Syndra|Taliyah|Talon|Twisted Fate|Veigar|Vel'Koz|Vex|Viktor|Vladimir|Xerath|Yasuo|Yone|Zed|Ziggs|Zoe",
    ADC: "Aphelios|Ashe|Caitlyn|Corki|Draven|Ezreal|Jhin|Jinx|Kai'Sa|Kalista|Kog'Maw|Lucian|Miss Fortune|Nilah|Samira|Senna|Sivir|Smolder|Tristana|Twitch|Varus|Vayne|Xayah|Yasuo|Yunara|Zeri|Ziggs",
    Support: "Alistar|Bard|Blitzcrank|Brand|Braum|Hwei|Janna|Karma|Leona|Lulu|Lux|Maokai|Milio|Morgana|Nami|Nautilus|Neeko|Pantheon|Poppy|Pyke|Rakan|Rell|Renata Glasc|Senna|Seraphine|Sona|Soraka|Swain|Tahm Kench|Taric|Thresh|Vel'Koz|Xerath|Yuumi|Zilean|Zyra"
  };
  const ROLES_OF = {};
  Object.keys(BY_ROLE).forEach(role => BY_ROLE[role].split('|').forEach(name => { (ROLES_OF[name] = ROLES_OF[name] || []).push(role); }));
  // Campeones que no están en la tabla (p. ej. lanzamientos nuevos): se deduce de su clase oficial.
  const BY_TAG = { Marksman: 'ADC', Support: 'Support', Mage: 'Mid', Assassin: 'Mid', Fighter: 'Top', Tank: 'Top' };
  function rolesOf(name, catalog) {
    if (ROLES_OF[name]) return ROLES_OF[name];
    const tag = catalog && catalog[name] && catalog[name].tags[0];
    return BY_TAG[tag] ? [BY_TAG[tag]] : [];
  }

  // rival -> [[counter, explicación]]. Solo enfrentamientos ampliamente aceptados.
  const tank = [
    ['Vayne', 'Su W (Proyectiles de plata) hace daño verdadero según la vida máxima: cuanto más resistente es el rival, más daño recibe.'],
    ['Fiora', 'Sus puntos vitales hacen daño verdadero según la vida máxima y su W (Estocada) devuelve el control del rival.'],
    ['Gwen', 'Su daño mágico escala con la vida del rival y su W (Niebla santificada) la protege de quien no esté dentro.'],
    ['Trundle', 'Su R (Someter) le roba vida, armadura y resistencia mágica al tanque y se las queda.']
  ];
  const ranged = why => [
    ['Teemo', `Le hostiga desde lejos y su Q (Dardo cegador) hace fallar sus ataques básicos. ${why}`],
    ['Vayne', `Le mantiene a distancia con su alcance y su E (Condenar) corta la entrada. ${why}`],
    ['Quinn', `Ataca desde lejos y su E (Salto) la aparta en cuanto el rival se acerca. ${why}`],
    ['Kennen', `Le castiga desde lejos con su Q y su pasiva aturde al acumular marcas. ${why}`]
  ];
  const COUNTERS = {
    Garen: ranged('Garen no tiene herramientas para alcanzar a un rival a distancia y su Q falla si está cegado.'),
    Darius: ranged('Sin quedarse cerca, Darius no acumula las cinco marcas de Hemorragia.'),
    Nasus: ranged('Castiga cada intento de acumular su Q (Golpe sifón) antes de que escale.'),
    Sett: ranged('Sett necesita llegar al cuerpo a cuerpo para intercambiar.'),
    Tryndamere: [
      ['Teemo', 'Su Q (Dardo cegador) anula los ataques críticos de los que vive Tryndamere.'],
      ['Malphite', 'Su E (Golpe atronador) reduce su velocidad de ataque y su armadura castiga el daño físico.'],
      ['Quinn', 'Le golpea desde lejos y su E (Salto) la saca de su alcance.']
    ],
    Malphite: [['Mordekaiser', 'Su R (Reino de la muerte) le aísla y su daño mágico ignora la armadura que Malphite acumula.']].concat(tank.slice(1)),
    Ornn: tank, Sion: tank, "Cho'Gath": tank, 'Dr. Mundo': tank, "K'Sante": tank,
    Yasuo: [
      ['Malzahar', 'Su R (Agarre del Abismo) es de objetivo y su pasiva reduce mucho el daño del primer golpe de Yasuo.'],
      ['Lissandra', 'Su W la congela al acercarse y su R detiene la entrada de Yasuo.'],
      ['Annie', 'Su W y su R no son proyectiles: el Muro de viento no los bloquea, y su pasiva aturde.'],
      ['Renekton', 'Fuerza intercambios cortos y su W (Depredador implacable) le aturde antes de que acumule su escudo.']
    ],
    Yone: [
      ['Malzahar', 'Su R (Agarre del Abismo) le detiene aunque vuelva con su E, y su pasiva absorbe la ráfaga inicial.'],
      ['Lissandra', 'Su W y su R lo inmovilizan al entrar.'],
      ['Renekton', 'Gana los intercambios cortos y le aturde con su W.']
    ],
    Zed: [
      ['Malzahar', 'Su pasiva absorbe el primer golpe de la combinación y su R suprime a Zed aunque cambie de sombra.'],
      ['Lissandra', 'Puede usar su R sobre sí misma para aguantar la marca de la muerte.']
    ],
    Katarina: [
      ['Galio', 'Su W (Escudo de Durand) la provoca e interrumpe su R (Loto mortífero).'],
      ['Lissandra', 'Su W y su R la inmovilizan en cuanto entra a la pelea.'],
      ['Annie', 'Un aturdimiento instantáneo con su pasiva corta su R.']
    ],
    Akali: [
      ['Galio', 'Su resistencia mágica frena su daño y su W la provoca aunque esté en su humo.'],
      ['Lissandra', 'Su W y su R la detienen cuando sale de su humo.']
    ],
    'Master Yi': [
      ['Rammus', 'Su W (Rizo defensivo) le devuelve daño por cada ataque básico y su E (Burla frenética) le inmoviliza.'],
      ['Jax', 'Su E (Contraataque) esquiva sus ataques básicos y le aturde.']
    ],
    Blitzcrank: [['Morgana', 'Su E (Escudo negro) bloquea el gancho y el resto de su control.']],
    Nautilus: [['Morgana', 'Su E (Escudo negro) anula su ancla y sus aturdimientos.']],
    Thresh: [['Morgana', 'Su E (Escudo negro) bloquea la Sentencia y su empuje.']],
    Leona: [['Morgana', 'Su E (Escudo negro) anula la cadena de aturdimientos de Leona.']],
    Pyke: [['Morgana', 'Su E (Escudo negro) bloquea el arpón de Pyke.']]
  };
  function countersFor(enemy) { return (COUNTERS[enemy] || []).map(([name, why]) => ({ name, why })); }
  return { rolesOf, countersFor, BY_ROLE };
});
