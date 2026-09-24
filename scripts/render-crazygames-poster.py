"""Render the Crazy Games poster (1024²) from the Swipe Storm guest palette."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'crazygames' / 'poster.png'
SCALE = 2
SIZE = 1024 * SCALE

INK = (29, 24, 64)
TEAL = (14, 151, 181)
CYAN = (58, 214, 224)
ORANGE = (255, 77, 46)
CREAM = (246, 243, 234)
WHITE = (255, 255, 255)
MUTED = (92, 86, 120)

FONT = '/usr/share/fonts/truetype/macos/Inter-Bold.ttf'
FONT_MED = '/usr/share/fonts/truetype/macos/Inter-SemiBold.ttf'
FONT_REG = '/usr/share/fonts/truetype/macos/Inter-Medium.ttf'


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size * SCALE)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vertical_gradient(size, stops):
    img = Image.new('RGB', (1, size))
    px = img.load()
    for y in range(size):
        t = y / (size - 1)
        for i in range(len(stops) - 1):
            t0, c0 = stops[i]
            t1, c1 = stops[i + 1]
            if t0 <= t <= t1:
                u = 0 if t1 == t0 else (t - t0) / (t1 - t0)
                px[0, y] = lerp(c0, c1, u)
                break
    return img.resize((size, size), Image.Resampling.NEAREST)


def rounded_mask(w, h, r):
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius=r, fill=255)
    return mask


def paste_shape(base, shape, xy):
    base.paste(shape, xy, shape)


def storm_badge(px):
    badge = Image.new('RGBA', (px, px), (0, 0, 0, 0))
    d = ImageDraw.Draw(badge)
    d.rounded_rectangle((0, 0, px - 1, px - 1), radius=int(px * 0.29), fill=INK)
    # Cloud
    d.ellipse((int(px * 0.16), int(px * 0.34), int(px * 0.58), int(px * 0.72)), fill=(244, 247, 255))
    d.ellipse((int(px * 0.34), int(px * 0.22), int(px * 0.78), int(px * 0.64)), fill=(244, 247, 255))
    d.ellipse((int(px * 0.52), int(px * 0.34), int(px * 0.88), int(px * 0.70)), fill=(244, 247, 255))
    d.rounded_rectangle((int(px * 0.22), int(px * 0.46), int(px * 0.82), int(px * 0.72)), radius=int(px * 0.08), fill=(244, 247, 255))
    # Bolt
    bolt = [
        (int(px * 0.58), int(px * 0.30)),
        (int(px * 0.40), int(px * 0.58)),
        (int(px * 0.52), int(px * 0.58)),
        (int(px * 0.42), int(px * 0.82)),
        (int(px * 0.70), int(px * 0.48)),
        (int(px * 0.56), int(px * 0.48)),
    ]
    d.polygon(bolt, fill=CYAN)
    return badge


def main():
    img = vertical_gradient(SIZE, [
        (0.0, (18, 16, 42)),
        (0.42, (36, 48, 112)),
        (0.72, (214, 224, 246)),
        (1.0, CREAM),
    ]).convert('RGBA')
    draw = ImageDraw.Draw(img)

    # Soft glow behind the card
    glow = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((180 * SCALE, 280 * SCALE, 860 * SCALE, 980 * SCALE), fill=(58, 214, 224, 50))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    badge = storm_badge(92 * SCALE)
    paste_shape(img, badge, (72 * SCALE, 64 * SCALE))

    title_font = font(FONT, 78)
    sub_font = font(FONT_MED, 26)
    draw.text((184 * SCALE, 58 * SCALE), 'Swipe', font=title_font, fill=CYAN)
    swipe_w = draw.textlength('Swipe ', font=title_font)
    draw.text((184 * SCALE + swipe_w, 58 * SCALE), 'Storm', font=title_font, fill=WHITE)
    draw.text((184 * SCALE, 148 * SCALE), 'Flag the fakes. Keep the real ones.', font=sub_font, fill=(214, 224, 255))

    # Card
    card_x, card_y = 212 * SCALE, 250 * SCALE
    card_w, card_h = 600 * SCALE, 560 * SCALE
    card = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((0, 0, card_w - 1, card_h - 1), radius=36 * SCALE, fill=WHITE)

    photo_h = int(card_h * 0.72)
    photo = Image.new('RGBA', (card_w, photo_h), (0, 0, 0, 0))
    pd = ImageDraw.Draw(photo)
    pd.rectangle((0, 0, card_w, photo_h), fill=(196, 176, 232))
    # Sky inside the portrait
    for y in range(photo_h):
        t = y / photo_h
        col = lerp((168, 196, 236), (244, 214, 196), t)
        pd.line((0, y, card_w, y), fill=col)
    # Simple original portrait: head, hair, glasses-free face
    cx, cy = card_w // 2, int(photo_h * 0.58)
    pd.ellipse((cx - 150 * SCALE, cy - 190 * SCALE, cx + 150 * SCALE, cy + 170 * SCALE), fill=(224, 176, 138))
    pd.pieslice((cx - 168 * SCALE, cy - 230 * SCALE, cx + 168 * SCALE, cy + 20 * SCALE), 200, 340, fill=(74, 52, 40))
    pd.ellipse((cx - 46 * SCALE, cy - 36 * SCALE, cx - 8 * SCALE, cy + 2 * SCALE), fill=(48, 36, 32))
    pd.ellipse((cx + 8 * SCALE, cy - 36 * SCALE, cx + 46 * SCALE, cy + 2 * SCALE), fill=(48, 36, 32))
    pd.arc((cx - 36 * SCALE, cy + 28 * SCALE, cx + 36 * SCALE, cy + 78 * SCALE), 20, 160, fill=(166, 92, 86), width=6 * SCALE)
    photo.putalpha(rounded_mask(card_w, photo_h, 36 * SCALE))
    # Square off the bottom of the photo so only the card's top corners are round
    cover = Image.new('L', (card_w, photo_h), 255)
    ImageDraw.Draw(cover).rectangle((0, photo_h - 40 * SCALE, card_w, photo_h), fill=255)
    # Rebuild photo alpha: rounded top, square bottom
    alpha = Image.new('L', (card_w, photo_h), 0)
    ad = ImageDraw.Draw(alpha)
    ad.rounded_rectangle((0, 0, card_w - 1, photo_h + 40 * SCALE), radius=36 * SCALE, fill=255)
    photo.putalpha(alpha)
    card.paste(photo, (0, 0), photo)

    # Nameplate
    nd = ImageDraw.Draw(card)
    nd.text((36 * SCALE, photo_h - 78 * SCALE), 'Avery', font=font(FONT, 40), fill=WHITE)
    # Bio
    nd.text((36 * SCALE, photo_h + 28 * SCALE), 'Brings soup. Dodges red flags.', font=font(FONT_REG, 22), fill=(40, 36, 58))
    chip_y = photo_h + 78 * SCALE
    for label, x in (('night owl', 36), ('honest', 196)):
        box = (x * SCALE, chip_y, (x + 140) * SCALE, chip_y + 40 * SCALE)
        nd.rounded_rectangle(box, radius=20 * SCALE, fill=(236, 236, 242))
        nd.text((box[0] + 18 * SCALE, box[1] + 8 * SCALE), label, font=font(FONT_MED, 16), fill=MUTED)

    shadow = Image.new('RGBA', (card_w + 40 * SCALE, card_h + 40 * SCALE), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        (16 * SCALE, 20 * SCALE, card_w + 8 * SCALE, card_h + 16 * SCALE),
        radius=40 * SCALE,
        fill=(18, 16, 42, 70),
    )
    paste_shape(img, shadow, (card_x - 12 * SCALE, card_y - 8 * SCALE))
    paste_shape(img, card, (card_x, card_y))

    # Action dock
    dock = Image.new('RGBA', (SIZE, 150 * SCALE), (0, 0, 0, 0))
    dd = ImageDraw.Draw(dock)
    dd.rounded_rectangle((48 * SCALE, 8 * SCALE, SIZE - 48 * SCALE, 132 * SCALE), radius=28 * SCALE, fill=INK)
    btn_w = 430 * SCALE
    btn_h = 92 * SCALE
    btn_y = 28 * SCALE
    left = 68 * SCALE
    right = SIZE - 68 * SCALE - btn_w
    dd.rounded_rectangle((left, btn_y, left + btn_w, btn_y + btn_h), radius=18 * SCALE, fill=ORANGE)
    dd.rounded_rectangle((right, btn_y, right + btn_w, btn_y + btn_h), radius=18 * SCALE, fill=TEAL)
    label_font = font(FONT, 32)
    dd.text((left + 150 * SCALE, btn_y + 24 * SCALE), 'FLAG', font=label_font, fill=WHITE)
    dd.text((right + 150 * SCALE, btn_y + 24 * SCALE), 'KEEP', font=label_font, fill=WHITE)
    img.paste(dock, (0, 850 * SCALE), dock)

    final = img.convert('RGB').resize((1024, 1024), Image.Resampling.LANCZOS)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    final.save(OUT, 'PNG', optimize=True)
    print(OUT, final.size)


if __name__ == '__main__':
    main()
