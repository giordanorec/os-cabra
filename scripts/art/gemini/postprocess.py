"""
Post-processa raws do Gemini para public/assets/ — M3 (paleta frevo colorida).

- Backgrounds back: 800x600 cover-crop, sem alpha (scene completa, céu colorido é a base)
- Backgrounds mid/fore: flood-fill white nos cantos -> alpha, resize 800x600
- Sprites/UI/VFX: flood-fill white -> alpha + trim + center-fit em canvas alvo
- Gera variantes @2x para sprites onde é relevante (player, inimigos)

Uso: .venv-art/bin/python scripts/art/gemini/postprocess.py
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image
from collections import deque

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent.parent
RAW = HERE / "out" / "raw"
ASSETS = ROOT / "public" / "assets"


def flood_white_to_alpha(img: Image.Image, tol: int = 35) -> Image.Image:
    """Flood-fill a partir das 4 bordas; pixels brancos/claros viram alpha=0."""
    img = img.convert("RGBA")
    w, h = img.size
    pixels = img.load()

    sample = [pixels[0, 0], pixels[w-1, 0], pixels[0, h-1], pixels[w-1, h-1]]
    tr = sum(p[0] for p in sample) // 4
    tg = sum(p[1] for p in sample) // 4
    tb = sum(p[2] for p in sample) // 4

    def is_bg(p):
        return abs(p[0] - tr) <= tol and abs(p[1] - tg) <= tol and abs(p[2] - tb) <= tol

    seeds = [(x, 0) for x in range(w)] + [(x, h-1) for x in range(w)]
    seeds += [(0, y) for y in range(h)] + [(w-1, y) for y in range(h)]

    visited = [[False] * h for _ in range(w)]
    q: deque = deque()
    for x, y in seeds:
        if not visited[x][y] and is_bg(pixels[x, y]):
            visited[x][y] = True
            q.append((x, y))

    while q:
        x, y = q.popleft()
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                if is_bg(pixels[nx, ny]):
                    visited[nx][ny] = True
                    q.append((nx, ny))
    return img


def trim_alpha(img: Image.Image) -> Image.Image:
    if img.mode != "RGBA":
        return img
    bbox = img.split()[-1].getbbox()
    return img.crop(bbox) if bbox else img


def fit_into(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    target = Image.new("RGBA", size, (0, 0, 0, 0))
    iw, ih = img.size
    tw, th = size
    ratio = min(tw / iw, th / ih)
    new_w, new_h = max(1, int(iw * ratio)), max(1, int(ih * ratio))
    resized = img.resize((new_w, new_h), Image.LANCZOS)
    target.paste(resized, ((tw - new_w) // 2, (th - new_h) // 2), resized if resized.mode == "RGBA" else None)
    return target


def cover_resize(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Redimensiona para COVER a área alvo (corte central se necessário)."""
    tw, th = size
    iw, ih = img.size
    ratio = max(tw / iw, th / ih)
    new_w, new_h = int(iw * ratio), int(ih * ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left, top = (new_w - tw) // 2, (new_h - th) // 2
    return img.crop((left, top, left + tw, top + th))


# -----------------------------
# BACKGROUNDS
# -----------------------------
BG_BACKS = [
    ("fase1-back.png", "backgrounds/fase1/back.png"),
    ("fase2-back.png", "backgrounds/fase2/back.png"),
    ("fase4-back.png", "backgrounds/fase4/back.png"),
]

BG_OVERLAYS = [
    ("fase1-mid.png",  "backgrounds/fase1/mid.png"),
    ("fase1-fore.png", "backgrounds/fase1/fore.png"),
    ("fase2-mid.png",  "backgrounds/fase2/mid.png"),
    ("fase2-fore.png", "backgrounds/fase2/fore.png"),
    ("fase4-mid.png",  "backgrounds/fase4/mid.png"),
    ("fase4-fore.png", "backgrounds/fase4/fore.png"),
]


def process_backgrounds():
    for src_name, dst_rel in BG_BACKS:
        src = RAW / src_name
        dst = ASSETS / dst_rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        img = Image.open(src).convert("RGB")
        img = cover_resize(img, (800, 600))
        img.save(dst)
        print(f"bg-back: {dst.relative_to(ROOT)}")

    for src_name, dst_rel in BG_OVERLAYS:
        src = RAW / src_name
        dst = ASSETS / dst_rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        img = Image.open(src).convert("RGB")
        img = flood_white_to_alpha(img)
        img = cover_resize(img, (800, 600))
        img.save(dst)
        print(f"bg-overlay: {dst.relative_to(ROOT)}")

    # Menu bg — uma imagem única (não layered)
    menu = Image.open(RAW / "menu-bg.png").convert("RGB")
    menu = cover_resize(menu, (800, 600))
    menu_dst = ASSETS / "backgrounds" / "menu.png"
    menu_dst.parent.mkdir(parents=True, exist_ok=True)
    menu.save(menu_dst)
    print(f"bg-menu: {menu_dst.relative_to(ROOT)}")


# -----------------------------
# UI BIG
# -----------------------------

def process_ui():
    ui = ASSETS / "ui"
    ui.mkdir(parents=True, exist_ok=True)

    # Logo — mantém composição colorida, sem alpha agressivo
    logo = Image.open(RAW / "logo-os-cabra.png").convert("RGB")
    logo_a = flood_white_to_alpha(logo)
    logo_a = trim_alpha(logo_a)
    lw, lh = logo_a.size
    target_w = 700
    ratio = target_w / lw
    logo_a = logo_a.resize((target_w, int(lh * ratio)), Image.LANCZOS)
    logo_a.save(ui / "logo-os-cabra.png")
    print(f"ui: logo-os-cabra.png ({logo_a.size})")

    moldura = Image.open(RAW / "ui-moldura.png").convert("RGB")
    moldura = flood_white_to_alpha(moldura)
    moldura = moldura.resize((600, 450), Image.LANCZOS)
    moldura.save(ui / "moldura-cordel.png")
    print("ui: moldura-cordel.png")

    for raw_name, out_name in (("ui-icon-vida.png", "icon-vida.png"),
                               ("ui-icon-bomba.png", "icon-bomba.png")):
        img = Image.open(RAW / raw_name).convert("RGB")
        img = fit_into(trim_alpha(flood_white_to_alpha(img)), (64, 64))
        img.save(ui / out_name)
        print(f"ui: {out_name}")


# -----------------------------
# SPRITES
# -----------------------------
SPRITE_MAP = [
    # (raw_name, target_size 1x, dst_name, also_2x)
    # Tamanhos maiores a partir do M3.1 — sprites precisam ser identificáveis
    # em 60-80px na tela do jogador (800×600). @2x = dobro pra HiDPI.
    ("player-galo-hero.png",    (128, 128), "player.png",           True),
    ("enemy-passista-hero.png", (96, 96),   "enemy-passista.png",   True),
    ("enemy-caboclinho.png",    (96, 96),   "enemy-caboclinho.png", True),
    ("enemy-mamulengo.png",     (96, 96),   "enemy-mamulengo.png",  True),
    ("enemy-mosca.png",         (64, 64),   "enemy-mosca.png",      True),
    ("boss-rei.png",            (256, 256), "boss-rei.png",         True),
    ("boss-rainha.png",         (256, 256), "boss-rainha.png",      True),
    ("boss-calunga.png",        (256, 256), "boss-calunga.png",     True),
    ("bullet-player.png",       (32, 32),   "bullet-player.png",    True),
]


def process_sprites():
    sprites = ASSETS / "sprites"
    sprites_2x = sprites / "@2x"
    sprites.mkdir(parents=True, exist_ok=True)
    sprites_2x.mkdir(parents=True, exist_ok=True)

    for raw, size, dst, also_2x in SPRITE_MAP:
        img = Image.open(RAW / raw).convert("RGB")
        alpha = trim_alpha(flood_white_to_alpha(img))
        fit1 = fit_into(alpha, size)
        fit1.save(sprites / dst)
        print(f"sprite: {dst} {size}")
        if also_2x:
            fit2 = fit_into(alpha, (size[0] * 2, size[1] * 2))
            fit2.save(sprites_2x / dst)
            print(f"sprite @2x: @2x/{dst}")


# -----------------------------
# VFX
# -----------------------------
VFX = [
    ("vfx-explosao.png",     "vfx-explosao.png"),
    ("vfx-muzzle-penas.png", "vfx-muzzle-penas.png"),
    ("vfx-hit-flash.png",    "vfx-hit-flash.png"),
]


def process_vfx():
    out = ASSETS / "vfx"
    out.mkdir(parents=True, exist_ok=True)
    for raw, dst in VFX:
        img = Image.open(RAW / raw).convert("RGB")
        img = fit_into(trim_alpha(flood_white_to_alpha(img)), (128, 128))
        img.save(out / dst)
        print(f"vfx: {dst}")


if __name__ == "__main__":
    process_backgrounds()
    process_ui()
    process_sprites()
    process_vfx()
    print("\n✓ post-process done.")
