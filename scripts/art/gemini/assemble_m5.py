"""
Assembla os 15 raws M5 em camadas parallax verticais e gera simulações.

- Back: 3 secções aéreas 1024×1024 empilhadas verticalmente → 800×2400
- Mid: 1 overlay com alpha → 800×1600
- Fore: 1 overlay com alpha forte → 800×1200
- Simulação: screenshots 800×600 com back+mid+fore compostos em 3 scroll positions

Uso: .venv-art/bin/python scripts/art/gemini/assemble_m5.py
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image
import sys

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from postprocess import flood_white_to_alpha  # noqa: E402

ROOT = HERE.parent.parent.parent
RAW = HERE / "out" / "raw"
ASSETS = ROOT / "public" / "assets"
SIM_DIR = ROOT / "docs" / "milestone-reports" / "visual-m5"


def stitch_back(phase: str, sections: list[str], out_path: Path):
    """Empilha N secções de 1024×1024 verticalmente, cada uma cropped e downscaled pra 800×800,
    com feather blend de 40px entre elas pra reduzir seams.
    Resultado: 800 × (800 * N) opaco."""
    n = len(sections)
    target_w = 800
    section_h = 800
    feather = 40

    final_h = section_h * n
    canvas = Image.new("RGB", (target_w, final_h), (255, 255, 255))

    for i, section_name in enumerate(sections):
        img = Image.open(RAW / section_name).convert("RGB")
        # crop square center-width e resize pra 800×800
        w, h = img.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        img = img.crop((left, top, left + side, top + side))
        img = img.resize((target_w, section_h), Image.LANCZOS)

        y_start = i * section_h
        # feather blend se não for a primeira secção
        if i > 0 and feather > 0:
            mask = Image.new("L", (target_w, section_h), 255)
            from PIL import ImageDraw
            draw = ImageDraw.Draw(mask)
            for f in range(feather):
                alpha = int(f / feather * 255)
                draw.line([(0, f), (target_w, f)], fill=alpha)
            canvas.paste(img, (0, y_start), mask)
        else:
            canvas.paste(img, (0, y_start))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path)
    print(f"back: {out_path.relative_to(ROOT)} ({canvas.size})")


def build_overlay(raw_name: str, out_path: Path, size: tuple[int, int]):
    """Aplica flood-fill white → alpha e redimensiona cobrindo size."""
    img = Image.open(RAW / raw_name).convert("RGB")
    img = flood_white_to_alpha(img)
    # resize to cover; preserva aspect, tamanho alvo é tall vertical
    iw, ih = img.size
    tw, th = size
    ratio = max(tw / iw, th / ih)
    nw, nh = int(iw * ratio), int(ih * ratio)
    img = img.resize((nw, nh), Image.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    img = img.crop((left, top, left + tw, top + th))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path)
    print(f"overlay: {out_path.relative_to(ROOT)} ({img.size})")


def _dim_alpha(img: Image.Image, factor: float) -> Image.Image:
    """Multiplica o canal alpha por factor (0..1)."""
    r, g, b, a = img.split()
    a = a.point(lambda p: int(p * factor))
    return Image.merge("RGBA", (r, g, b, a))


def build_parallax_sim(phase: str, back_path: Path, mid_path: Path, fore_path: Path):
    """Gera 3 screenshots 800×600 simulando o parallax em 0%, 50%, 100%.
    PNGs permanecem 100% alpha; a simulação aplica alphas realistas
    (mid 0.65, fore 0.40) refletindo o uso típico em Phaser parallax."""
    back = Image.open(back_path).convert("RGBA")
    mid = Image.open(mid_path).convert("RGBA")
    fore = Image.open(fore_path).convert("RGBA")

    SCREEN_W, SCREEN_H = 800, 600
    BACK_H, MID_H, FORE_H = back.size[1], mid.size[1], fore.size[1]

    for i, progress in enumerate([0.0, 0.5, 1.0]):
        y_back = int(progress * (BACK_H - SCREEN_H))
        y_mid  = int(progress * (MID_H - SCREEN_H))
        y_fore = int(progress * (FORE_H - SCREEN_H))

        screen = back.crop((0, y_back, SCREEN_W, y_back + SCREEN_H)).copy()
        mid_slice = _dim_alpha(mid.crop((0, y_mid, SCREEN_W, y_mid + SCREEN_H)), 0.65)
        fore_slice = _dim_alpha(fore.crop((0, y_fore, SCREEN_W, y_fore + SCREEN_H)), 0.40)

        screen.alpha_composite(mid_slice)
        screen.alpha_composite(fore_slice)

        SIM_DIR.mkdir(parents=True, exist_ok=True)
        sim_name = SIM_DIR / f"sim-{phase}-scroll-{i}.png"
        screen.convert("RGB").save(sim_name)
        print(f"sim: {sim_name.relative_to(ROOT)} (progress={progress:.0%})")


# --------- config por fase ---------
PHASES = {
    "fase1": {
        "back_sections": ["fase1-aerial-north.png", "fase1-aerial-mid.png", "fase1-aerial-south.png"],
        "mid": "fase1-mid-layer.png",
        "fore": "fase1-fore-layer.png",
    },
    "fase2": {
        "back_sections": ["fase2-aerial-north.png", "fase2-aerial-mid.png", "fase2-aerial-south.png"],
        "mid": "fase2-mid-layer.png",
        "fore": "fase2-fore-layer.png",
    },
    "fase4": {
        "back_sections": ["fase4-aerial-north.png", "fase4-aerial-mid.png", "fase4-aerial-south.png"],
        "mid": "fase4-mid-layer.png",
        "fore": "fase4-fore-layer.png",
    },
}


def main():
    for phase, cfg in PHASES.items():
        print(f"\n=== {phase} ===")
        back_path = ASSETS / "backgrounds" / phase / "back.png"
        mid_path  = ASSETS / "backgrounds" / phase / "mid.png"
        fore_path = ASSETS / "backgrounds" / phase / "fore.png"

        stitch_back(phase, cfg["back_sections"], back_path)
        build_overlay(cfg["mid"],  mid_path,  (800, 1600))
        build_overlay(cfg["fore"], fore_path, (800, 1200))
        build_parallax_sim(phase, back_path, mid_path, fore_path)

    print("\n✓ M5 assemble + sim done.")


if __name__ == "__main__":
    main()
