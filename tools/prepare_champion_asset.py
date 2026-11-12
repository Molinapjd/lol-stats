"""Export generated portraits and face crops for the self-hosted champion collection."""
import argparse
import json
from pathlib import Path
from PIL import Image
from champion_crops import face_crop

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--source', required=True)
parser.add_argument('--id', required=True)
parser.add_argument('--name', required=True)
args = parser.parse_args()
if not args.id.isalnum():
    raise SystemExit('Invalid champion ID')
base = ROOT / 'assets' / 'champions'
for folder in ['portraits', 'faces', 'metadata']:
    (base / folder).mkdir(parents=True, exist_ok=True)
im = Image.open(args.source).convert('RGB')
w, h = im.size
if w < 512 or h < 512:
    raise SystemExit('Source too small')
im.thumbnail((768, 1152), Image.Resampling.LANCZOS)
im.save(base / 'portraits' / (args.id + '.webp'), 'WEBP', quality=88, method=6)
original = Image.open(args.source).convert('RGB')
face, crop = face_crop(original, args.id)
face.save(base / 'faces' / (args.id + '.webp'), 'WEBP', quality=90, method=6)
(base / 'metadata' / (args.id + '.json')).write_text(json.dumps({
    'id': args.id, 'name': args.name, 'style': 'south-park-paper-cutout',
    'generated': '2026-11-12', 'portrait': 'portraits/' + args.id + '.webp',
    'face': 'faces/' + args.id + '.webp',
    'faceCrop': crop,
}, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'id': args.id, 'portrait': str(base / 'portraits' / (args.id + '.webp')), 'face': str(base / 'faces' / (args.id + '.webp'))}))
