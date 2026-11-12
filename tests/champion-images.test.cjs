const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const ctx = vm.createContext({ window: {}, document: { addEventListener() {} } });
for (const file of ['draft-catalog.js', 'champion-images.js', 'app.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
const catalog = ctx.window.LOL_DRAFT_CATALOG.champions;
const images = ctx.window.LOL_CHAMPION_IMAGES;
const api = ctx.window.LOL_STATS;

test('every champion has a unique local face and portrait in the shared index', () => {
  assert.equal(images.count, Object.keys(catalog).length);
  assert.equal(Object.keys(images.champions).length, images.count);
  const checksums = new Set();
  for (const [name, champion] of Object.entries(catalog)) {
    const image = images.champions[name];
    assert.equal(image.id, champion.id);
    for (const kind of ['face', 'portrait']) {
      assert.match(image[kind], /^assets\/champions\/(faces|portraits)\/[A-Za-z0-9]+\.svg$/);
      const svg = fs.readFileSync(path.join(root, image[kind]), 'utf8');
      assert(!svg.includes('https:') && !svg.includes('<script'));
      const payload = svg.match(/href="data:image\/webp;base64,([A-Za-z0-9+/=]+)"/);
      assert(payload);
      const bytes = Buffer.from(payload[1], 'base64');
      assert(bytes.length > 1000);
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
      checksums.add(crypto.createHash('sha256').update(bytes).digest('hex'));
      assert.equal(api.imageFor(name, kind), image[kind]);
    }
  }
  assert.equal(checksums.size, images.count * 2);
  assert.equal(api.imageFor('Future Champion'), 'assets/champions/unknown.svg');
});

test('featured portrait follows updated game data instead of a fixed player illustration', () => {
  const game = (champ, win) => ({ champ, win, k: 5, d: 2, a: 4, cs: 100, dur: 1800, kp: 50, rank: 4, lan: 50 });
  const jinx = Array.from({ length: 5 }, () => game('Jinx', true));
  const jhin = Array.from({ length: 8 }, () => game('Jhin', true));
  assert.equal(api.featuredChampion(jinx).key, 'Jinx');
  assert.equal(api.featuredChampion(jinx.concat(jhin)).key, 'Jhin');
  assert.notEqual(api.imageFor(api.featuredChampion(jinx).key, 'portrait'), api.imageFor(api.featuredChampion(jinx.concat(jhin)).key, 'portrait'));
  assert.equal(api.featuredChampion([]), null);
});

test('all stats entry pages load the image collection before rendering', () => {
  for (const file of ['index.html', 'j3pi-euw.html', 'josiso.html', 'rustu.html', 'joe.html', 'nachete.html', 'preparando.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.equal((html.match(/src="champion-images\.js/g) || []).length, 1);
    assert(html.indexOf('src="champion-images.js') < html.indexOf('src="app.js'));
  }
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert(!app.includes('squad-portraits.png'));
  // Las caras South Park solo se usan en la portada; el resto usa el icono oficial vía iconFor.
  assert(/southParkIcons = true/.test(app.slice(app.indexOf('function renderIndex'))));
  assert.match(api.iconFor("Kai'Sa"), /^https:\/\/ddragon\.leagueoflegends\.com\/cdn\/[\d.]+\/img\/champion\/Kaisa\.png$/);
  assert(fs.readFileSync(path.join(root, 'preparando.js'), 'utf8').includes('api.iconFor(name)'));
});

test('champions from the stored match histories all resolve to a real illustration', () => {
  for (const file of fs.readdirSync(path.join(root, 'data'))) vm.runInContext(fs.readFileSync(path.join(root, 'data', file), 'utf8'), ctx);
  const games = api.prepare(Object.values(ctx.window.LOL_DATA)).games;
  for (const game of games) {
    for (const name of [game.champ, ...game.allies.map(p => p.c), ...game.enemies.map(p => p.c)]) {
      if (name) assert(images.champions[name], `Missing illustration for ${name}`);
    }
  }
});
