"""
Post-processa as imagens raw do Gemini para public/assets/.

- Backgrounds: resize pra 800x600 (layers back mantêm cream; mid/fore com alpha)
- Sprites/UI/VFX: flood-fill do creme nos cantos → alpha, resize pra target size
- Sheets: corta em células segundo layout, processa cada uma como sprite

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


def flood_cream_to_alpha(img: Image.Image, tol: int = 35) -> Image.Image:
    """Flood-fill a partir das 4 bordas; pixels cream-like viram alpha=0."""
    img = img.convert("RGBA")
    w, h = img.size
    pixels = img.load()

    # cor alvo média dos 4 cantos
    sample = [pixels[0, 0], pixels[w-1, 0], pixels[0, h-1], pixels[w-1, h-1]]
    tr = sum(p[0] for p in sample) // 4
    tg = sum(p[1] for p in sample) // 4
    tb = sum(p[2] for p in sample) // 4

    def is_cream(p):
        return abs(p[0] - tr) <= tol and abs(p[1] - tg) <= tol and abs(p[2] - tb) <= tol

    seeds = [(x, 0) for x in range(w)] + [(x, h-1) for x in range(w)]
    seeds += [(0, y) for y in range(h)] + [(w-1, y) for y in range(h)]

    visited = [[False] * h for _ in range(w)]
    q: deque = deque()
    for x, y in seeds:
        if not visited[x][y] and is_cream(pixels[x, y]):
            visited[x][y] = True
            q.append((x, y))

    while q:
        x, y = q.popleft()
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                if is_cream(pixels[nx, ny]):
                    visited[nx][ny] = True
                    q.append((nx, ny))
    return img


def trim_alpha(img: Image.Image) -> Image.Image:
    if img.mode != "RGBA":
        return img
    bbox = img.split()[-1].getbbox()
    return img.crop(bbox) if bbox else img


def fit_into(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Redimensiona preservando proporção e centraliza em canvas transparente."""
    target = Image.new("RGBA", size, (0, 0, 0, 0))
    iw, ih = img.size
    tw, th = size
    ratio = min(tw / iw, th / ih)
    new_w, new_h = max(1, int(iw * ratio)), max(1, int(ih * ratio))
    resized = img.resize((new_w, new_h), Image.LANCZOS)
    target.paste(resized, ((tw - new_w) // 2, (th - new_h) // 2), resized if resized.mode == "RGBA" else None)
    return target


BACKGROUNDS = [
    ("menu-bg-back.png", "backgrounds/menu-bg-back.png"),
    ("menu-bg-mid.png",  "backgrounds/menu-bg-mid.png"),
    ("menu-bg-fore.png", "backgrounds/menu-bg-fore.png"),
    ("fase1-bg-back.png", "backgrounds/fase1-bg-back.png"),
    ("fase1-bg-mid.png",  "backgrounds/fase1-bg-mid.png"),
    ("fase1-bg-fore.png", "backgrounds/fase1-bg-fore.png"),
    ("fase2-bg-back.png", "backgrounds/fase2-bg-back.png"),
    ("fase2-bg-mid.png",  "backgrounds/fase2-bg-mid.png"),
    ("fase2-bg-fore.png", "backgrounds/fase2-bg-fore.png"),
    ("fase3-bg-back.png", "backgrounds/fase3-bg-back.png"),
    ("fase3-bg-mid.png",  "backgrounds/fase3-bg-mid.png"),
    ("fase3-bg-fore.png", "backgrounds/fase3-bg-fore.png"),
    ("fase4-bg-back.png", "backgrounds/fase4-bg-back.png"),
    ("fase4-bg-mid.png",  "backgrounds/fase4-bg-mid.png"),
    ("fase4-bg-fore.png", "backgrounds/fase4-bg-fore.png"),
    ("fase5-bg-back.png", "backgrounds/fase5-bg-back.png"),
    ("fase5-bg-mid.png",  "backgrounds/fase5-bg-mid.png"),
    ("fase5-bg-fore.png", "backgrounds/fase5-bg-fore.png"),
]


def process_backgrounds():
    for src_name, dst_rel in BACKGROUNDS:
        src = RAW / src_name
        dst = ASSETS / dst_rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        img = Image.open(src)
        use_alpha = any(tok in src_name for tok in ("mid", "fore"))
        if use_alpha:
            img = flood_cream_to_alpha(img.convert("RGB"))
        else:
            img = img.convert("RGB")
        iw, ih = img.size
        tw, th = 800, 600
        ratio = max(tw / iw, th / ih)
        nw, nh = int(iw * ratio), int(ih * ratio)
        img = img.resize((nw, nh), Image.LANCZOS)
        left, top = (nw - tw) // 2, (nh - th) // 2
        img = img.crop((left, top, left + tw, top + th))
        img.save(dst)
        print(f"bg: {dst.relative_to(ROOT)}")


def process_ui_big():
    ui = ASSETS / "ui"
    ui.mkdir(parents=True, exist_ok=True)

    logo = Image.open(RAW / "logo-os-cabra.png").convert("RGBA")
    lw, lh = logo.size
    ratio = 700 / lw
    logo = logo.resize((700, int(lh * ratio)), Image.LANCZOS)
    logo.save(ui / "logo-os-cabra.png")
    print(f"ui: logo-os-cabra.png {logo.size}")

    moldura = Image.open(RAW / "ui-moldura.png").convert("RGB")
    moldura = flood_cream_to_alpha(moldura).resize((600, 450), Image.LANCZOS)
    moldura.save(ui / "moldura-cordel.png")
    print("ui: moldura-cordel.png")

    hpbar = Image.open(RAW / "ui-boss-hp-bar.png").convert("RGB")
    hpbar = fit_into(trim_alpha(flood_cream_to_alpha(hpbar)), (512, 64))
    hpbar.save(ui / "boss-hp-bar.png")
    print("ui: boss-hp-bar.png")

    for raw_name, out_name in (("ui-icon-vida.png", "icon-vida.png"), ("ui-icon-bomba.png", "icon-bomba.png")):
        img = Image.open(RAW / raw_name).convert("RGB")
        img = fit_into(trim_alpha(flood_cream_to_alpha(img)), (64, 64))
        img.save(ui / out_name)
        print(f"ui: {out_name}")


def process_boss_trio():
    out = ASSETS / "sprites"
    for raw, dst in (("boss-rei.png", "boss-rei.png"),
                     ("boss-rainha.png", "boss-rainha.png"),
                     ("boss-calunga.png", "boss-calunga.png")):
        img = Image.open(RAW / raw).convert("RGB")
        img = fit_into(trim_alpha(flood_cream_to_alpha(img)), (256, 256))
        img.save(out / dst)
        print(f"sprite: {dst}")


def split_grid(src: Path, cols: int, rows: int, names: list[str],
               out_dir: Path, size: tuple[int, int], crop_pct: float = 0.08):
    img = Image.open(src).convert("RGB")
    w, h = img.size
    cw, ch = w // cols, h // rows
    px, py = int(cw * crop_pct), int(ch * crop_pct)
    out_dir.mkdir(parents=True, exist_ok=True)
    for i, name in enumerate(names):
        col, row = i % cols, i // cols
        cell = img.crop((col * cw + px, row * ch + py,
                         (col + 1) * cw - px, (row + 1) * ch - py))
        cell = fit_into(trim_alpha(flood_cream_to_alpha(cell)), size)
        cell.save(out_dir / name)
        print(f"cell: {out_dir.name}/{name}")


def process_sheets():
    split_grid(RAW / "bullets-sheet.png", 3, 2,
        ["bullet-flecha.png", "bullet-bombinha.png", "bullet-player.png",
         "bullet-cipo.png", "bullet-figado.png", "bullet-bola-fogo.png"],
        ASSETS / "sprites", (48, 48))
    split_grid(RAW / "powerups-sheet.png", 5, 1,
        ["powerup-sombrinha.png", "powerup-cachaca.png", "powerup-tapioca.png",
         "powerup-calunga.png", "powerup-fogo-artificio.png"],
        ASSETS / "sprites", (64, 64), crop_pct=0.05)
    split_grid(RAW / "vfx-sheet.png", 5, 1,
        ["vfx-explosao.png", "vfx-muzzle-flash.png", "vfx-hit-flash.png",
         "vfx-pickup-flash.png", "vfx-fumaca-cachaca.png"],
        ASSETS / "vfx", (128, 128), crop_pct=0.04)
    split_grid(RAW / "ui-cursor-setas.png", 2, 2,
        ["cursor-mao.png", "seta-esquerda.png",
         "seta-direita.png", "selector-estrela.png"],
        ASSETS / "ui", (64, 64))


if __name__ == "__main__":
    process_backgrounds()
    process_ui_big()
    process_boss_trio()
    process_sheets()
    print("\n✓ post-process done.")
