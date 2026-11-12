"""Rebuild the complete facial set from the retained full portraits."""
import json
from pathlib import Path
from PIL import Image
from champion_crops import face_crop
base = Path(__file__).resolve().parents[1] / 'assets/champions'
count = 0
for path in sorted((base / 'portraits').glob('*.webp')):
    with Image.open(path) as original:
        face, crop = face_crop(original, path.stem)
    face.save(base / 'faces' / path.name, 'WEBP', quality=90, method=6)
    meta_path = base / 'metadata' / (path.stem + '.json')
    meta = json.loads(meta_path.read_text())
    meta['faceCrop'] = crop
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + '\n')
    count += 1
print(f'{count} facial crops refreshed')
