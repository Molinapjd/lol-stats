const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const E = require('../draft-engine.js');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({ window: {}, document: { addEventListener() {} } });
for (const file of fs.readdirSync(path.join(root, 'data'))) vm.runInContext(fs.readFileSync(path.join(root, 'data', file), 'utf8'), ctx);
for (const file of ['pages.js', 'app.js', 'draft-catalog.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
const C = ctx.window.LOL_DRAFT_CATALOG.champions;
const profiles = ctx.window.LOL_PAGES.map(p => ({ id: p.page, games: ctx.window.LOL_STATS.prepare(p.ids.map(id => ctx.window.LOL_DATA[id])).valid }));

test('every summoner has eight unique, catalog-backed options in all five roles', () => {
  for (const p of profiles) for (const role of E.ROLES) {
    const tier = E.tierList(p.games, role, C);
    assert.equal(tier.length, 8);
    assert.equal(new Set(tier.map(c => c.name)).size, 8);
    for (const c of tier) {
      assert(C[c.name]); assert(Number.isFinite(c.base));
      assert.equal(c.personal.n, p.games.filter(g => g.champ === c.name && g.role === role).length);
      if (c.tier === 'S') { assert(c.personal.n >= 5); assert(c.adjusted >= 0.5); }
    }
  }
});

test('recommendations stay inside the player role tier, exclude mirrors and use only direct personal duels', () => {
  for (const p of profiles) for (const role of E.ROLES) {
    const pool = E.tierList(p.games, role, C).map(c => c.name);
    for (const enemy of ['Yasuo', 'Lux', 'Jinx', 'Malphite', pool[0]]) {
      const result = E.recommend(p.games, role, enemy, C);
      assert(result.length >= 7);
      for (const [i, c] of result.entries()) {
        assert(pool.includes(c.name)); assert.notEqual(c.name, enemy);
        assert(Number.isFinite(c.score) && c.score >= 0 && c.score <= 100);
        assert.equal(c.head.n, p.games.filter(g => g.role === role && g.champ === c.name && g.opp === enemy).length);
        if (i) assert(result[i - 1].score >= c.score);
      }
    }
  }
});

test('rankings react to rival kit and familiarity without inventing observed wins', () => {
  const jax = E.recommend([], 'Top', 'Jax', C);
  const mordekaiser = E.recommend([], 'Top', 'Mordekaiser', C);
  assert.notDeepEqual(jax.map(c => [c.name, c.score]), mordekaiser.map(c => [c.name, c.score]));
  assert.equal(jax[0].name, 'Malphite');
  assert(jax.every(c => c.head.n === 0 && c.personal.n === 0 && c.tier === 'B'));
  const strong = Array.from({ length: 20 }, (_, i) => ({ role: 'ADC', champ: 'Jhin', opp: 'Jinx', win: i < 15 }));
  assert.equal(E.tierList(strong, 'ADC', C)[0].name, 'Jhin');
  assert.equal(E.recommend(strong, 'ADC', 'Jinx', C)[0].head.n, 20);
  const game = [{ role: 'Mid', champ: 'Annie', opp: 'Zed', win: true }];
  assert(E.tierList(game, 'Mid', C).find(c => c.name === 'Annie').adjusted < 0.55);
});

test('catalog normalization and invalid inputs are deterministic and safe', () => {
  assert.equal(E.resolveChampion('kaisa', C), "Kai'Sa");
  assert.equal(E.resolveChampion('monkeyking', C), 'Wukong');
  assert.equal(E.resolveChampion('  velkoz ', C), "Vel'Koz");
  assert.equal(E.resolveChampion('<script>', C), null);
  assert.deepEqual(E.recommend([], 'Mid', 'unknown', C), []);
  assert.deepEqual(E.tierList([], 'unknown', C), []);
});

test('champions only enter a role they are played in, never from one misordered game', () => {
  const rustu = profiles.find(p => p.id === 'rustu.html');
  const top = E.tierList(rustu.games, 'Top', C).map(c => c.name);
  assert(!top.includes('Senna'), 'Senna (support/ADC) no puede salir en Top por una partida suelta');
  // Off-meta real: 3 o más partidas en la posición sí cuentan.
  const offMeta = Array.from({ length: 3 }, () => ({ role: 'Top', champ: 'Senna', opp: 'Garen', win: true }));
  assert(E.tierList(offMeta, 'Top', C).some(c => c.name === 'Senna'));
  assert(!E.tierList(offMeta.slice(0, 2), 'Top', C).some(c => c.name === 'Senna'));
});

test('matchup plan picks from the real pool and adds a theoretical counter when needed', () => {
  const rustu = profiles.find(p => p.id === 'rustu.html');
  const garen = E.matchupPlan(rustu.games, 'Top', 'Garen', C);
  assert.notEqual(garen.pick.name, 'Senna');
  assert(garen.pick.personal.n > 0 || garen.pick.overall.n > 0, 'el pick debe ser un campeón que el invocador ya juega');
  assert(E.isCounter('Teemo', 'Garen'));
  // Sin counter en el repertorio: pick del repertorio + counter teórico del rol.
  const pool = Array.from({ length: 6 }, () => ({ role: 'Top', champ: 'Malphite', opp: 'Ornn', win: true }));
  const plan = E.matchupPlan(pool, 'Top', 'Garen', C);
  assert.equal(plan.pick.name, 'Malphite');
  assert.equal(plan.counter, false);
  assert(plan.theory.length >= 1 && plan.theory.every(t => t.known && t.why));
  // Sin partidas en el rol: no hay repertorio, se muestran counters para practicar.
  assert.equal(E.matchupPlan([], 'Top', 'Garen', C).fromPool, false);
});

test('tier lists differ between summoners in their familiar positions', () => {
  const josiso = profiles.find(p => p.id === 'josiso.html');
  const nachete = profiles.find(p => p.id === 'nachete.html');
  assert.equal(E.tierList(josiso.games, 'Jungla', C)[0].name, 'Wukong');
  assert.equal(E.tierList(nachete.games, 'ADC', C)[0].name, 'Jhin');
});
