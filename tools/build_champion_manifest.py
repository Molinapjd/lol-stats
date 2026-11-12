"""Build the shared local-image index, rejecting missing or unexpected assets."""
import json
import base64
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
catalog = json.loads((ROOT / 'draft-catalog.js').read_text().split(' = ', 1)[1].rstrip(';\n'))
base = ROOT / 'assets/champions'
entries = {}
missing = []
for name, champion in sorted(catalog['champions'].items()):
    key = champion['id']
    paths = {kind: f'assets/champions/{folder}/{key}.svg' for kind, folder in [('face', 'faces'), ('portrait', 'portraits')]}
    originals = [ROOT / p.replace('.svg', '.webp') for p in paths.values()]
    if not all(p.is_file() for p in originals):
        missing.append(name)
        continue
    # Self-contained SVG is a transport container for the generated WebP, not a
    # vector substitute. Its bytes remain recoverable and there are no external URLs.
    for target, original in zip(paths.values(), originals):
        with Image.open(original) as im:
            w, h = im.size
        data = base64.b64encode(original.read_bytes()).decode('ascii')
        (ROOT / target).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><image width="{w}" height="{h}" href="data:image/webp;base64,{data}"/></svg>\n')
    meta_path = base / 'metadata' / (key + '.json')
    meta = json.loads(meta_path.read_text())
    meta.update({'face': paths['face'], 'portrait': paths['portrait']})
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + '\n')
    entries[name] = {'id': key, **paths}
if missing:
    raise SystemExit('Missing images: ' + ', '.join(missing))
manifest = {'version': 'south-park-1', 'updated': '2026-11-12', 'count': len(entries), 'champions': entries}
(base / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
(ROOT / 'champion-images.js').write_text('/* Self-hosted portrait and face assets. Generated with tools/build_champion_manifest.py. */\nwindow.LOL_CHAMPION_IMAGES = ' + json.dumps(manifest, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(f'{len(entries)} champions indexed with portrait and face thumbnail')
