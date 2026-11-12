const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../draft-engine.js');
const Coach = require('../matchup-coach.js');
const A = require('../matchup-abilities.js');

test('direct history isolates the same champion, position and opposing champion', () => {
  const base = { role:'Support', champ:'Thresh', opp:'Leona', win:true, k:2,d:4,a:10,kp:60,t:1 };
  const games = [{...base,t:3},{...base,win:false,k:0,d:6,a:4,t:2},{...base,champ:'Senna',t:4},{...base,role:'ADC',t:5},{...base,opp:'Morgana',t:6}];
  const before = JSON.stringify(games);
  const h = E.matchupHistory(games,'Support','Thresh','Leona');
  assert.equal(h.selected.n,2); assert.equal(h.selected.w,1); assert.equal(h.selected.l,1);
  assert.equal(h.selected.wr,50); assert.equal(h.selected.kda,16/10);
  assert.equal(h.selected.d,5); assert.equal(h.selected.kp,60);
  assert.deepEqual(h.selected.recent.map(g=>g.t),[3,2]);
  assert.equal(h.all.n,3); assert.equal(h.rest.n,1);
  assert.equal(h.byChampion.find(c=>c.name==='Senna').n,1);
  assert.equal(JSON.stringify(games),before);
});

test('no history means no fabricated victory rate or metrics', () => {
  const h = E.matchupHistory([], 'Support','Thresh','Morgana');
  assert.equal(h.selected.n,0); assert.equal(h.selected.wr,null); assert.equal(h.selected.kda,null);
  assert.equal(h.selected.d,null); assert.deepEqual(h.selected.recent,[]);
  const partial = E.duelSummary([{win:false}]);
  assert.equal(partial.kda,null); assert.equal(partial.kp,null);
});

test('Thresh plans change for Leona, Morgana and Blitzcrank and name their actual mechanisms', () => {
  const leona = Coach.explain('Thresh','Leona','Support');
  const morgana = Coach.explain('Thresh','Morgana','Support');
  const blitz = Coach.explain('Thresh','Blitzcrank','Support');
  assert(leona.reviewed && morgana.reviewed && blitz.reviewed);
  assert.match(leona.reasons.join(' '),/E.*cortar.*E/);
  assert.match(morgana.warnings.join(' '),/escudado/);
  assert.match(blitz.plan.join(' '),/linterna|segunda Q/);
  assert.notDeepEqual(leona.reasons,morgana.reasons);
  assert.notDeepEqual(blitz.warnings,morgana.warnings);
});

test('important exceptions are explicit: Yi untargetability, Galio versus physical damage and Fiora parry', () => {
  assert.match(Coach.explain('Vi','Master Yi','Jungla').warnings.join(' '),/no se puede seleccionar.*Q.*ralentizaciones/);
  assert.match(Coach.explain('Galio','Zed','Mid').warnings.join(' '),/no absorbe.*físico/);
  assert.match(Coach.explain('Malphite','Fiora','Top').warnings.join(' '),/negar.*R.*W/);
});

test('every catalog champion has four sourced ability names and fallback plans stay honest', () => {
  assert.equal(Object.keys(A.champions).length,173);
  for (const [name,c] of Object.entries(A.champions)) {
    assert.deepEqual(c.spells.map(s=>s.key),['Q','W','E','R']);
    assert(c.spells.every(s=>s.name.length>0));
    assert.match(c.source,/^https:\/\/ddragon\.leagueoflegends\.com\/cdn\/16\.22\.1\/data\/es_ES\/champion\//);
    if (name === 'Thresh') continue;
    const plan = Coach.explain('Thresh',name,'Support');
    assert(plan.reasons.length && plan.warnings.length && plan.plan.length);
    assert.equal(plan.sources.length,2);
    assert(plan.skills.some(s=>s.champion===name));
    if (!plan.reviewed) assert.match(plan.reasons.join(' '),/Thresh|E \(/);
    assert(!JSON.stringify(plan).includes('Su experiencia y resultados cuentan más'));
  }
  assert.equal(Coach.explain('Thresh','Aurelion Sol','Support').reviewed,false);
});
