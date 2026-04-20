"""
Post-processa raws do M4 para public/assets/.
Reutiliza helpers de postprocess.py (flood_white_to_alpha, trim_alpha, fit_into).

Uso: .venv-art/bin/python scripts/art/gemini/postprocess_m4.py
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image

# import helpers do postprocess existente
import sys
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from postprocess import flood_white_to_alpha, trim_alpha, fit_into  # noqa: E402

ROOT = HERE.parent.parent.parent
RAW = HERE / "out" / "raw"
ASSETS = ROOT / "public" / "assets"


def process_one(raw_name: str, out_path: Path, size: tuple[int, int]):
    img = Image.open(RAW / raw_name).convert("RGB")
    img = fit_into(trim_alpha(flood_white_to_alpha(img)), size)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path)
    print(f"  {out_path.relative_to(ROOT)} ({size[0]}×{size[1]})")


# -------- Projéteis player (sprites/) --------
PROJETEIS = [
    ("pena-player.png",  (32, 32)),
    ("milho-player.png", (32, 32)),
]

# -------- Inimigos extras (sprites/) --------
ENEMIES_EXTRA = [
    ("enemy-capivara.png",         (96, 96)),
    ("enemy-caranguejo-saci.png",  (96, 96)),
    ("enemy-tribalistas.png",      (128, 96)),   # trio em linha, levemente wider
    ("enemy-mestre-salu.png",      (128, 128)),  # mini-boss potencial
]

# -------- Power-up especial (sprites/) --------
POWERUPS = [
    ("powerup-chico-science.png",  (96, 128)),   # figura alta, portrait
]

# -------- Bonecos gigantes Olinda (sprites/) --------
BONECOS = [
    ("boneco-mulher-dia.png",      (128, 160)),  # boneco gigante, alto
    ("boneco-menino-tarde.png",    (128, 160)),
]

# -------- Céu decorativo (sky/) --------
SKY_REGULAR = [
    ("sky-balao-rosa.png",       (128, 128)),
    ("sky-balao-amarelo.png",    (128, 128)),
    ("sky-balao-turquesa.png",   (128, 128)),
    ("sky-balao-laranja.png",    (128, 128)),
    ("sky-pipa-losango.png",     (128, 128)),
    ("sky-pipa-arraia.png",      (128, 128)),
    ("sky-fogo-rosa.png",        (128, 128)),
    ("sky-fogo-amarelo.png",     (128, 128)),
    ("sky-fogo-dourado.png",     (128, 128)),
    ("sky-passaro-pequeno.png",  (64, 64)),
    ("sky-passaro-grande.png",   (128, 128)),
    ("sky-nuvem-galo.png",       (128, 96)),    # nuvem wider
    ("sky-nuvem-coracao.png",    (128, 96)),
    ("sky-nuvem-comum.png",      (128, 96)),
    ("sky-sol-sorrindo.png",     (128, 128)),
]

# Bandeirinha é uma string longa — 512×128
SKY_WIDE = [
    ("sky-bandeirinha.png",      (512, 128)),
]


def main():
    print("Projéteis player:")
    for raw, size in PROJETEIS:
        base = raw.replace("-player.png", "-player.png")
        out = ASSETS / "sprites" / base
        process_one(raw, out, size)
        # @2x
        process_one(raw, ASSETS / "sprites" / "@2x" / base, (size[0] * 2, size[1] * 2))

    print("\nInimigos extras:")
    for raw, size in ENEMIES_EXTRA:
        out = ASSETS / "sprites" / raw
        process_one(raw, out, size)
        process_one(raw, ASSETS / "sprites" / "@2x" / raw, (size[0] * 2, size[1] * 2))

    print("\nPower-ups:")
    for raw, size in POWERUPS:
        out = ASSETS / "sprites" / raw
        process_one(raw, out, size)
        process_one(raw, ASSETS / "sprites" / "@2x" / raw, (size[0] * 2, size[1] * 2))

    print("\nBonecos Olinda:")
    for raw, size in BONECOS:
        out = ASSETS / "sprites" / raw
        process_one(raw, out, size)
        process_one(raw, ASSETS / "sprites" / "@2x" / raw, (size[0] * 2, size[1] * 2))

    print("\nSky regular:")
    for raw, size in SKY_REGULAR:
        # rename: remove "sky-" prefix at destination, since pasta já é /sky/
        dst_name = raw[len("sky-"):] if raw.startswith("sky-") else raw
        out = ASSETS / "sky" / dst_name
        process_one(raw, out, size)

    print("\nSky wide:")
    for raw, size in SKY_WIDE:
        dst_name = raw[len("sky-"):] if raw.startswith("sky-") else raw
        out = ASSETS / "sky" / dst_name
        process_one(raw, out, size)

    print("\n✓ M4 post-process done.")


if __name__ == "__main__":
    main()
