// Extrae partidas nuevas de un perfil de op.gg ya abierto en el navegador.
// Uso: pegar este archivo entero en la consola/javascript_tool de la pestaña de op.gg,
// cambiando antes ME (slug del invocador en minúsculas, como en la URL) y SINCE
// (minutosEpoch de la partida más reciente ya guardada en data/<id>.js; 0 = todas).
// Devuelve un JSON {count, newest, lines}: cada línea va tal cual al principio de `raw`.
// Formato literal (separador ';'):
// cola|minutosEpoch|resultado|duraciónSeg|campeón|nivel|K|D|A|KP%|CS|laning|puestoOP|insignia|miPosición|campeones(10)|jugadores(10)
const ME = 'j3pi-euw', SINCE = 0;

const QQ = { 'Normal': 'N', 'ARAM': 'A', 'Ranked Flex': 'F', 'Ranked Solo/Duo': 'S' };
const clean = s => String(s || '').replace(/[|;`\\\n]/g, ' ').trim();
function readGames() {
  const seen = new Set(), games = [];
  for (const btn of document.querySelectorAll('button')) {
    if (!/Show More Detail Games/i.test(btn.textContent)) continue;
    let row = btn;
    while (row && !(row.querySelectorAll('a[href*="/lol/summoners/"]').length >= 2 && row.querySelector('a[href*="/lol/champions/"]'))) row = row.parentElement;
    if (!row) continue;
    const date = row.querySelector('span[data-tooltip-content]')?.getAttribute('data-tooltip-content');
    const kdaEl = [...row.querySelectorAll('div[data-tooltip-content]')].find(d => /^\(K /.test(d.getAttribute('data-tooltip-content')));
    const m = kdaEl?.getAttribute('data-tooltip-content').match(/K (\d+) \+ A (\d+)\) \/ D (\d+)/);
    const ca = row.querySelector('a[href*="/lol/champions/"]');
    if (!date || !m || !ca) continue;
    const t = Math.round(new Date(date).getTime() / 60000);
    const champ = ca.querySelector('img')?.alt;
    const key = t + champ + m[0];
    if (seen.has(key)) continue; seen.add(key);
    const spans = [...row.querySelectorAll('span')].map(s => s.textContent.trim());
    const txt = row.textContent;
    const dm = (spans.find(s => /^\d+m \d+s$/.test(s)) || '0m 0s').match(/(\d+)m (\d+)s/);
    const cs = txt.match(/CS (\d+) \(([\d.]+)\)/), pk = txt.match(/P\/Kill (\d+)%/), lan = txt.match(/Laning (\d+)\s*:\s*(\d+)/);
    const rank = spans.find(s => /^\d+(st|nd|rd|th)$/.test(s));
    const badge = row.querySelector('div[data-tooltip-id^="op-keyword"] button')?.textContent.trim() || '';
    const parts = [...row.querySelectorAll('a[href*="/lol/summoners/"]')].map(a => ({
      c: a.querySelector('img')?.alt,
      n: a.querySelector('span[data-tooltip-content]')?.getAttribute('data-tooltip-content') || a.textContent,
      h: decodeURIComponent(a.getAttribute('href').split('/').pop()).toLowerCase()
    }));
    const mi = parts.findIndex(p => p.h === ME);
    const res = row.querySelector('strong')?.textContent.trim() || '';
    const queue = spans[0];
    if (parts.length !== 10 || mi < 0 || !QQ[queue]) continue; // otras colas (Arena, etc.) se ignoran
    games.push({ t, line: [QQ[queue], t, res[0] === 'V' ? 'W' : res[0], (+dm[1]) * 60 + (+dm[2]), clean(champ), +ca.querySelector('span')?.textContent || 0,
      m[1], m[3], m[2], pk ? pk[1] : '', cs ? cs[1] : '', lan ? lan[1] : '', rank ? parseInt(rank) : 0, clean(badge), mi,
      parts.map(p => clean(p.c)).join(';'), parts.map((p, i) => i === mi ? '' : clean(p.n)).join(';')].join('|') });
  }
  return games;
}
let games = readGames(), guard = 0;
while (guard++ < 30 && games.length && Math.min(...games.map(g => g.t)) > SINCE) {
  // El "Show more" de la lista de partidas es el que va después de la última fila
  const imgs = document.querySelectorAll('a[href*="/lol/champions/"][href$="/build"] img[width="48"]'), lastRow = imgs[imgs.length - 1];
  const b = lastRow && [...document.querySelectorAll('button')].find(x => /^show more$/i.test(x.textContent.trim()) && (lastRow.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING));
  if (!b) break;
  const before = games.length;
  b.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 250)); b.click();
  for (let i = 0; i < 20 && readGames().length === before; i++) await new Promise(r => setTimeout(r, 400));
  games = readGames();
  if (games.length === before) break;
}
const fresh = games.filter(g => g.t > SINCE).sort((a, b) => b.t - a.t);
JSON.stringify({ count: fresh.length, loaded: games.length, newest: fresh.length ? fresh[0].t : SINCE, lines: fresh.map(g => g.line) });
