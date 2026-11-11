const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({ window: {}, document: {
  addEventListener() {},
  createElement(tag) { return { tag, children: [], innerHTML: '', appendChild(child) { this.children.push(child); return child; } }; }
} });
for (const file of fs.readdirSync(path.join(root, 'data'))) {
  vm.runInContext(fs.readFileSync(path.join(root, 'data', file), 'utf8'), context);
}
vm.runInContext(fs.readFileSync(path.join(root, 'app.js'), 'utf8').replace(
  '  document.addEventListener(',
  '  window.testAPI = { prepare, agg, selectedQueues, queueHash, toggleQueue, filterQueues, coaching, strengths, secMejorar, secTierList, META }; document.addEventListener('
), context);
const api = context.window.testAPI;
const data = Object.values(context.window.LOL_DATA);
const plain = value => JSON.parse(JSON.stringify(value));

test('multi-selection combines Solo/Duo with normals or flex without duplicates', () => {
  const games = api.prepare(data).valid;
  for (const [ids, codes] of [[['soloq', 'normales'], ['S', 'N']], [['soloq', 'flex'], ['S', 'F']]]) {
    const actual = api.filterQueues(games, ids);
    const expected = games.filter(g => codes.includes(g.q));
    assert.deepEqual(plain(actual), plain(expected));
    assert.equal(api.agg(actual).n, expected.length);
    assert.equal(api.agg(actual).w, expected.filter(g => g.win).length);
  }
});

test('chips toggle, reset and round-trip through shareable hashes', () => {
  let ids = api.selectedQueues('#all');
  ids = api.toggleQueue(ids, 'soloq');
  assert.deepEqual(plain(ids), ['soloq']);
  ids = api.toggleQueue(ids, 'flex');
  assert.equal(api.queueHash(ids), 'soloq+flex');
  assert.deepEqual(plain(api.selectedQueues('#soloq+flex')), plain(ids));
  ids = api.toggleQueue(ids, 'soloq');
  assert.deepEqual(plain(ids), ['flex']);
  assert.equal(api.queueHash(api.toggleQueue(ids, 'flex')), 'all');
  assert.equal(api.queueHash(api.toggleQueue(['soloq'], 'all')), 'all');
  assert.equal(api.queueHash(api.selectedQueues('#aram')), 'all');
  assert.equal(api.queueHash(api.selectedQueues('#soloq+soloq+unknown')), 'soloq');
});

test('each profile retains the newest 100 non-ARAM, non-remake games', () => {
  for (const ds of [...data.map(d => [d]), data]) {
    const p = api.prepare(ds);
    const expected = p.games.filter(g => !g.remake).slice(0, 100);
    assert.deepEqual(plain(p.valid), plain(expected));
    assert(p.valid.every(g => ['N', 'S', 'F'].includes(g.q)));
    assert(p.valid.length <= 100);
    assert(p.valid.every((g, i) => !i || p.valid[i - 1].t >= g.t));
  }
});

test('advice handles empty and small samples and reacts to the selected games', () => {
  assert.equal(api.coaching([]).actions.length, 0);
  const base = { role: 'ADC', champ: 'Jinx', win: true, k: 3, d: 9, a: 2, kp: 20, cs: 30, dur: 1800, rank: 5, lan: 40 };
  const low = api.coaching(Array.from({ length: 10 }, () => ({ ...base })));
  assert.equal(low.actions.length, 3);
  assert.match(low.comment, /10 partidas/);
  assert.match(low.actions[0].title, /muertes/);
  assert.match(low.actions[1].title, /farmeo/);
  assert.match(low.actions[2].title, /equipo/);
  const strong = api.coaching(Array.from({ length: 20 }, () => ({ ...base, d: 2, cs: 240, kp: 70 })));
  assert.match(strong.comment, /últimas 10/);
  assert(!strong.actions.some(a => a.title.startsWith('Prioridad:')));
  assert.match(strong.actions[0].title, /posición segura/);
  assert.match(api.coaching([base]).comment, /muestra es corta/);
});

test('dated meta snapshot contains five unique champions per role and its source', () => {
  assert.equal(api.META.checked, '2026-11-11');
  assert.equal(api.META.patch, '26.22');
  assert.equal(api.META.source, 'https://forfeit.gg/champions');
  assert.equal(Object.keys(api.META.roles).length, 5);
  for (const champions of Object.values(api.META.roles)) {
    assert.equal(champions.length, 5);
    assert.equal(new Set(champions.map(c => c[0])).size, 5);
    assert(champions.every(c => ['S+', 'S', 'A'].includes(c[1]) && c[2] > 0 && c[2] < 100));
  }
});

test('advice and tier sections render for real profiles and escape player data', () => {
  const collect = node => node.innerHTML + node.children.map(collect).join('');
  for (const d of data) {
    const section = api.secMejorar(api.prepare(d).valid, false);
    assert.match(collect(section), /Comentario de tu muestra/);
    assert.match(collect(section), /Tu plan para las próximas 5 partidas/);
    const html = collect(section);
    assert(html.indexOf('Tus puntos buenos') > html.indexOf('Patrones de tus partidas'));
  }
  const tier = api.secTierList();
  assert.equal((collect(tier).match(/class="meta-champion"/g) || []).length, 25);
  assert.match(collect(tier), /FORFEIT.GG/);
  assert.match(collect(tier), /no se actualiza sola/);
  const games = api.prepare(data[0]).valid.slice(0, 5).map(g => ({ ...g, champ: '<script>alert(1)</script>' }));
  assert(!collect(api.secMejorar(games, false)).includes('<script>'));
});

test('strengths use evidence from the selected games and remain encouraging with losses', () => {
  assert.equal(api.strengths([]).length, 0);
  const base = { role: 'ADC', champ: 'Jinx', win: false, k: 1, d: 10, a: 1, kp: 20, cs: 80, dur: 1800, rank: 10, lan: 30 };
  const losses = Array.from({ length: 10 }, () => ({ ...base }));
  const fallback = JSON.stringify(api.strengths(losses));
  assert.match(fallback, /no define tu capacidad/);
  assert(!fallback.includes('racha de'));
  assert(!fallback.includes('MVP/ACE'));
  const wins = Array.from({ length: 10 }, () => ({ ...base, win: true, champ: '<img onerror=bad>', rank: 1, d: 2, kp: 75 }));
  const positive = JSON.stringify(api.strengths(wins));
  assert.match(positive, /10 victorias en 10 partidas/);
  assert.match(positive, /MVP\/ACE/);
  assert.match(positive, /75%/);
  assert(!positive.includes('<img'));
  assert(api.strengths(wins).length <= 4);
  const trend = api.strengths(wins.concat(losses));
  assert.match(trend[0].text, /últimas 10 partidas/);
  assert.match(JSON.stringify(api.strengths([base])), /demasiado pronto/);
});
