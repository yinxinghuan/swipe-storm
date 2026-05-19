#!/usr/bin/env python3
"""
Swipe Storm — 1024×1024 poster.

A stack of 2-3 dating profile cards tilted at various angles, with
LIKE / NOPE stamps stuck on. Title sits at top.
"""
import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

random.seed(31)

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(ROOT, "public/poster.png")
RYE_FONT = os.path.join(ROOT, "fonts/Rye-Regular.ttf")
PLAYFAIR_ITAL = os.path.join(ROOT, "fonts/PlayfairDisplay-BlackItalic.ttf")
PLAYFAIR_BOLD = os.path.join(ROOT, "fonts/PlayfairDisplay-Black.ttf")
os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
W, H = 1024, 1024

FONT_TAG = [
    "/System/Library/Fonts/Supplemental/Avenir Next Condensed.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
]

CREAM = (245, 232, 200)
GOLD  = (255, 210, 74)
BLOOD = (184, 24, 24)
BLOOD_DK = (74, 14, 8)
INK   = (26, 10, 5)
GREEN = (58, 168, 74)


def find_font(paths, size):
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                continue
    return ImageFont.load_default()


def rye(size):
    if os.path.exists(RYE_FONT):
        return ImageFont.truetype(RYE_FONT, size)
    return find_font([], size)


def playfair(size, italic=True):
    p = PLAYFAIR_ITAL if italic else PLAYFAIR_BOLD
    if os.path.exists(p):
        return ImageFont.truetype(p, size)
    return find_font([], size)


def bg_image():
    img = Image.new("RGB", (W, H), (26, 10, 14))
    d = ImageDraw.Draw(img)
    # Pink radial glow at top
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    radial_glow(layer, W * 0.5, H * 0.30, max(W, H) * 0.75, (255, 180, 200), 70)
    img = img.convert("RGBA")
    img.alpha_composite(layer)
    # Dot grid (faint)
    for y in range(0, H, 18):
        for x in range(0, W, 18):
            d2 = ImageDraw.Draw(img)
            d2.ellipse([x, y, x + 2, y + 2], fill=(255, 220, 180, 8))
    return img


def radial_glow(img, cx, cy, radius, color, alpha):
    px = img.load()
    r2 = radius * radius
    w, h = img.size
    for y in range(h):
        for x in range(w):
            d = (x - cx) ** 2 + (y - cy) ** 2
            if d >= r2:
                continue
            k = 1 - (d / r2)
            a = int(alpha * (k ** 2))
            if a <= 0:
                continue
            px[x, y] = (color[0], color[1], color[2], a)


def draw_simple_avatar(d, cx, cy, w, h, palette):
    """A simplified version of the in-game avatar (compact)."""
    skin = palette["skin"]
    bg = palette["bg"]
    hair = palette["hair"]
    # bg
    d.rectangle([cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2], fill=bg)
    # neck
    d.rectangle([cx - 18, cy + h // 4, cx + 18, cy + h // 2], fill=tuple(int(c * 0.85) for c in skin))
    # head
    d.ellipse([cx - 60, cy - 50, cx + 60, cy + 70], fill=skin, outline=(int(skin[0] * 0.7), int(skin[1] * 0.7), int(skin[2] * 0.7)), width=2)
    # hair front
    d.pieslice([cx - 65, cy - 95, cx + 65, cy - 5], 180, 360, fill=hair)
    # eyes
    d.ellipse([cx - 28, cy + 0, cx - 20, cy + 8], fill=(26, 10, 5))
    d.ellipse([cx + 20, cy + 0, cx + 28, cy + 8], fill=(26, 10, 5))
    # mouth
    d.line([(cx - 16, cy + 38), (cx + 16, cy + 38)], fill=(58, 26, 26), width=3)


def draw_card(img, cx, cy, rot_deg, name, age, bio, kind, stamp_text=None, stamp_color=None):
    """Render a single Tinder-style profile card and paste at (cx, cy) with rotation."""
    cw, chh = 360, 480
    card = Image.new("RGBA", (cw + 60, chh + 60), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    # Body
    bx, by = 30, 30
    cd.rounded_rectangle([bx, by, bx + cw, by + chh], radius=22, fill=CREAM, outline=(60, 30, 30), width=2)

    # Photo zone (upper 62%)
    photo_h = int(chh * 0.62)
    photo_rect = [bx + 1, by + 1, bx + cw - 1, by + photo_h]
    palette = {
        "skin": [(255, 220, 180), (220, 178, 130), (165, 110, 70), (110, 70, 40)][hash(name) % 4],
        "bg":   [(220, 230, 255), (255, 220, 230), (220, 245, 220), (255, 240, 200)][hash(name + "bg") % 4],
        "hair": [(40, 24, 16), (170, 120, 70), (220, 50, 50), (40, 40, 40)][hash(name + "h") % 4],
    }
    cd.rounded_rectangle(photo_rect, radius=20, fill=palette["bg"])
    # Draw avatar inside photo area
    avatar_cx, avatar_cy = bx + cw // 2, by + photo_h // 2 + 10
    draw_simple_avatar(cd, avatar_cx, avatar_cy, cw - 20, photo_h - 20, palette)

    # Photo overlay (gradient at bottom of photo)
    grad_layer = Image.new("RGBA", (cw, photo_h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad_layer)
    for y in range(photo_h):
        if y < photo_h * 0.55:
            continue
        k = (y - photo_h * 0.55) / (photo_h * 0.45)
        a = int(160 * k)
        gd.line([(0, y), (cw, y)], fill=(0, 0, 0, a))
    card.paste(grad_layer, (bx + 1, by + 1), grad_layer)

    # Name + age in photo
    cd2 = ImageDraw.Draw(card)
    name_font = playfair(34, italic=False)
    age_font = find_font(FONT_TAG, 24)
    cd2.text((bx + 18, by + photo_h - 50), name, font=name_font, fill=(255, 255, 255))
    name_w = cd2.textbbox((0, 0), name, font=name_font)[2]
    cd2.text((bx + 18 + name_w + 10, by + photo_h - 42), str(age), font=age_font, fill=(255, 255, 255, 230))

    # Bio area (lower 38%)
    bio_top = by + photo_h + 6
    bio_font = find_font(FONT_TAG, 18)
    # Word-wrap bio
    words = bio.split()
    lines, line = [], ""
    for w in words:
        test = (line + " " + w).strip() if line else w
        tw = cd2.textbbox((0, 0), test, font=bio_font)[2]
        if tw > cw - 32:
            lines.append(line); line = w
        else:
            line = test
    if line: lines.append(line)
    for i, ln in enumerate(lines[:3]):
        cd2.text((bx + 18, bio_top + 10 + i * 24), ln, font=bio_font, fill=INK)

    # Stamp
    if stamp_text:
        sfont = rye(46)
        sw_bbox = cd2.textbbox((0, 0), stamp_text, font=sfont)
        sw = sw_bbox[2] - sw_bbox[0]
        sh = sw_bbox[3] - sw_bbox[1]
        pad = 14
        stamp_layer = Image.new("RGBA", (sw + pad * 2 + 30, sh + pad * 2 + 20), (0, 0, 0, 0))
        sld = ImageDraw.Draw(stamp_layer)
        sld.rounded_rectangle([0, 0, sw + pad * 2, sh + pad * 2], radius=8, outline=stamp_color, width=6)
        sld.text((pad, pad - 6), stamp_text, font=sfont, fill=stamp_color)
        stamp_layer = stamp_layer.rotate(-12 if stamp_text == "LIKE" else 12, resample=Image.BICUBIC, expand=True)
        sx = bx + (cw // 2 - stamp_layer.width // 2) + (40 if stamp_text == "LIKE" else -40)
        sy = by + 60
        card.alpha_composite(stamp_layer, (sx, sy))

    card = card.rotate(rot_deg, resample=Image.BICUBIC, expand=True)
    img.alpha_composite(card, (cx - card.width // 2, cy - card.height // 2))


def stroked_text(d, text, x, y, font, fill, stroke=INK, stroke_w=3):
    for dx in range(-stroke_w, stroke_w + 1):
        for dy in range(-stroke_w, stroke_w + 1):
            if dx == 0 and dy == 0:
                continue
            d.text((x + dx, y + dy), text, font=font, fill=stroke)
    d.text((x, y), text, font=font, fill=fill)


def main():
    img = bg_image()

    # Layered cards (back to front)
    draw_card(img, 540, 660, rot_deg=8, name="Chad", age=32,
              bio='Looking for someone to fund my startup idea.',
              kind='red', stamp_text="NOPE", stamp_color=BLOOD)
    draw_card(img, 460, 640, rot_deg=-12, name="Brittany", age=28,
              bio='CEO of my own life. Also Etsy store.',
              kind='red', stamp_text="NOPE", stamp_color=BLOOD)
    draw_card(img, 500, 620, rot_deg=2, name="Skylar", age=27,
              bio='Loves dogs, has a 9-5, owns furniture.',
              kind='green', stamp_text="LIKE", stamp_color=GREEN)

    d = ImageDraw.Draw(img, "RGBA")

    # Title
    tag_font = playfair(36)
    sub_text = "— SWIPE LEFT FOR —"
    bbox = d.textbbox((0, 0), sub_text, font=tag_font)
    tw = bbox[2] - bbox[0]
    stroked_text(d, sub_text, (W - tw) // 2, 100, tag_font, fill=CREAM, stroke=BLOOD_DK, stroke_w=2)

    title_font = rye(132)
    title = "RED FLAGS"
    bbox = d.textbbox((0, 0), title, font=title_font)
    tw = bbox[2] - bbox[0]
    stroked_text(d, title, (W - tw) // 2, 150, title_font, fill=CREAM, stroke=BLOOD_DK, stroke_w=4)

    sub2_text = "swipe right for love."
    sub2_font = playfair(36)
    bbox = d.textbbox((0, 0), sub2_text, font=sub2_font)
    sub2w = bbox[2] - bbox[0]
    stroked_text(d, sub2_text, (W - sub2w) // 2, 312, sub2_font, fill=CREAM, stroke=BLOOD_DK, stroke_w=2)

    # Watermark
    wm_font = find_font(FONT_TAG, 26)
    wm = "AlterU"
    bbox = d.textbbox((0, 0), wm, font=wm_font)
    ww = bbox[2] - bbox[0]
    d.text((W - ww - 36, H - 56), wm, font=wm_font, fill=(255, 255, 255, 200))

    img.convert("RGB").save(OUT_PATH, "PNG", optimize=True)
    print(f"wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
