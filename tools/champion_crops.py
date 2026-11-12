"""Locate the large cartoon eyes and frame a complete face without a CV dependency."""
from PIL import Image


def face_crop(original, champion_id=None):
    original = original.convert('RGB')
    w, h = original.size
    small = original.resize((192, round(h * 192 / w)), Image.Resampling.LANCZOS)
    sw, sh = small.size
    pixels = list(small.getdata())
    mask = bytearray(sw * sh)
    for y in range(round(sh * .05), round(sh * .65)):
        for x in range(round(sw * .08), round(sw * .92)):
            r, g, b = pixels[y * sw + x]
            if min(r, g, b) >= 230 and max(r, g, b) - min(r, g, b) < 20:
                mask[y * sw + x] = 1
    components = []
    for start in range(len(mask)):
        if not mask[start]:
            continue
        mask[start] = 0
        stack, pts = [start], []
        while stack:
            at = stack.pop()
            pts.append(at)
            x, y = at % sw, at // sw
            for near in ([at - 1] if x else []) + ([at + 1] if x + 1 < sw else []) + ([at - sw] if y else []) + ([at + sw] if y + 1 < sh else []):
                if mask[near]:
                    mask[near] = 0
                    stack.append(near)
        if not 25 <= len(pts) <= 1800:
            continue
        xs, ys = [p % sw for p in pts], [p // sw for p in pts]
        width, height = max(xs) - min(xs) + 1, max(ys) - min(ys) + 1
        if width >= 6 and height >= 7 and .4 < width / height < 2.5:
            components.append((len(pts), sum(xs) / len(xs), sum(ys) / len(ys)))
    pairs = []
    for left in components:
        for right in components:
            if not 28 < left[1] < 100 or not 92 < right[1] < 164:
                continue
            if not 15 < right[1] - left[1] < 105 or abs(left[2] - right[2]) > 13:
                continue
            ratio = min(left[0], right[0]) / max(left[0], right[0])
            if ratio < .3:
                continue
            score = (left[0] + right[0]) * ratio / (1 + abs((left[1] + right[1]) / 2 - sw / 2) * .025 + abs(left[2] - right[2]) * .07)
            pairs.append((score, (left[1] + right[1]) / 2, (left[2] + right[2]) / 2))
    if pairs:
        _, eye_x, eye_y = max(pairs)
        center_x = eye_x * w / sw
        center_y = eye_y * h / sh + w * .09
        detector = 'eyes-v1'
    else:
        center_x, center_y = w * .5, h * .34
        detector = 'framing-fallback'
    width_fraction = .68
    # Reviewed exceptions: halo, enormous hair and long monster jaw distort the eye heuristic.
    overrides = {'Zilean': (.5, .55, .8), 'Zoe': (.5, .50, .7), 'RekSai': (.5, .53, .8)}
    if champion_id in overrides:
        cx, cy, width_fraction = overrides[champion_id]
        center_x, center_y = w * cx, h * cy
        detector = 'reviewed-framing'
    side = min(w * width_fraction, h * .6)
    left = max(0, min(w - side, center_x - side / 2))
    top = max(0, min(h - side, center_y - side / 2))
    crop = original.crop((round(left), round(top), round(left + side), round(top + side))).resize((192, 192), Image.Resampling.LANCZOS)
    return crop, {'detector': detector, 'centerX': round(center_x / w, 4), 'centerY': round(center_y / h, 4), 'widthFraction': width_fraction}
