"""Refresh factual ability names/tags from Riot. No win rates or counter claims are imported."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
import json
from pathlib import Path
import re
import tempfile
import time
from urllib.request import urlopen
from zoneinfo import ZoneInfo

root = Path(__file__).resolve().parents[1]
catalog = json.loads((root / 'draft-catalog.js').read_text().split(' = ', 1)[1].rstrip(';\n'))
version = catalog['version']
parser = argparse.ArgumentParser()
parser.add_argument('--cache', type=Path, default=Path(tempfile.gettempdir()) / 'lol-matchup-abilities' / version)
args = parser.parse_args()
args.cache.mkdir(parents=True, exist_ok=True)
base = f'https://ddragon.leagueoflegends.com/cdn/{version}/data/'
patterns = {
    'control': r'\bstun|\broot|\bsnare|\bcharm|\bfear|\btaunt|\bsuppress|knock.*(?:up|back)|\bsilence',
    'movement': r'\bdash|\bleap|\bjump|\blunge|\bblink|\bteleport',
    'shield': r'\bshields\b|\bshielded\b|(?:gain|grant|create|protect|barrier).{0,35}\bshield',
    'heal': r'\bheal',
    'untargetable': r'\buntargetable',
    'invulnerable': r'\binvulnerable|\binvincible',
    'stealth': r'\binvisib|\bstealth|\bcamouflag',
}

def fetch(job):
    name, champion = job
    key = champion['id']
    if not key.isalnum():
        raise ValueError('Invalid champion ID')
    locales = {}
    for locale in ['en_US', 'es_ES']:
        path = args.cache / f'{locale}-{key}.json'
        cached = json.loads(path.read_text()) if path.exists() else None
        if not cached or cached.get('version') != version:
            for attempt in range(3):
                try:
                    with urlopen(base + f'{locale}/champion/{key}.json', timeout=25) as response:
                        cached = json.loads(response.read())
                    path.write_text(json.dumps(cached, ensure_ascii=False))
                    break
                except Exception:
                    if attempt == 2:
                        raise
                    time.sleep(1 + attempt)
        locales[locale] = cached['data'][key]
    spells = []
    for slot, en, es in zip('QWER', locales['en_US']['spells'], locales['es_ES']['spells']):
        text = re.sub('<[^>]+>', ' ', en['description']).lower()
        types = [tag for tag, pattern in patterns.items() if re.search(pattern, text)]
        spells.append({'key': slot, 'name': es['name'], 'types': types})
    return name, {'id': key, 'spells': spells, 'source': base + f'es_ES/champion/{key}.json'}

champions = dict(ThreadPoolExecutor(max_workers=8).map(fetch, catalog['champions'].items()))
data = {'version': version, 'checked': datetime.now(ZoneInfo('Europe/Madrid')).date().isoformat(), 'champions': champions}
prefix = '/* Factual ability names and mechanical tags extracted from official Riot Data Dragon. */\n(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else root.LOL_MATCHUP_ABILITIES=factory();})(typeof window!=="undefined"?window:globalThis,function(){return '
(root / 'matchup-abilities.js').write_text(prefix + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';});\n')
print(f'{len(champions)} champions, {sum(len(c["spells"]) for c in champions.values())} ability names')
