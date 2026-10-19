"""Optional full-pixel asset audit: python3 scripts/verify-image-assets.py (Pillow)."""
import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
artwork = json.loads((ROOT / 'src/illustrations.json').read_text())
asset_dir = ROOT / 'public/illustrations'
expected = [v['file'] for a in artwork for v in a['variants']]
assert len(expected) == len(set(expected))
assert sorted(expected) == sorted(p.name for p in asset_dir.iterdir())
hashes = set()
for art in artwork:
    assert art['width'] <= art['sourceWidth']
    actual_ratio = art.get('generatedWidth', art['width']) / art.get('generatedHeight', art['height'])
    if art.get('framingEdit') == 'outpaint-top-and-clean-foreground':
        assert art['original'] == 'IMG_9082.jpeg' and art['id'] == 'samarkand-bibi-khanym-watercolor'
        assert actual_ratio < art['sourceWidth'] / art['sourceHeight']
    else:
        assert abs(actual_ratio / (art['sourceWidth'] / art['sourceHeight']) - 1) < .003, art['id']
    assert art['height'] <= art['sourceHeight']
    for variant in art['variants']:
        path = asset_dir / variant['file']
        raw = path.read_bytes()
        digest = hashlib.sha256(raw).hexdigest()
        assert digest not in hashes, path
        hashes.add(digest)
        with Image.open(path) as im:
            assert im.format == 'WEBP', path
            im.load()  # Actually decode the compressed pixels.
            assert im.size == (variant['width'], variant['height']), path
            assert not any(k in im.info for k in ('exif', 'xmp', 'icc_profile')), path
        assert len(raw) == variant['bytes'], path
        assert variant['width'] <= art['sourceWidth'], path
        assert variant['height'] <= art['sourceHeight'], path
        assert variant['width'] <= art.get('editInputWidth', art['sourceWidth']), path
        assert variant['height'] <= art.get('editInputHeight', art['sourceHeight']), path
        # Integer pixel rounding is meaningful for both narrow portraits and panoramas.
        assert abs(variant['height'] - round(variant['width'] / actual_ratio)) <= (0 if 'generatedWidth' in art else 1), path
        assert raw[:4] == b'RIFF' and raw[8:12] == b'WEBP', path
        assert int.from_bytes(raw[4:8], 'little') + 8 == len(raw), path
        offset = 12
        while offset < len(raw):
            chunk = raw[offset:offset + 4]
            assert chunk not in (b'EXIF', b'XMP ', b'ICCP'), path
            size = int.from_bytes(raw[offset + 4:offset + 8], 'little')
            offset += 8 + size + size % 2
        assert offset == len(raw), path
    standard = next((v for v in art['variants'] if v['width'] == 800), art['variants'][-1])
    assert standard['bytes'] <= art.get('standardByteBudget', 250_000), art['id']
print(json.dumps({'artworks': len(artwork), 'decodedVariants': len(expected),
                  'bytes': sum(v['bytes'] for a in artwork for v in a['variants']),
                  'metadataFree': True, 'uniqueHashes': len(hashes)}))
