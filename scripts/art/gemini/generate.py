"""
CLI de geração de arte para "Os Cabra" usando Gemini 2.5 Flash Image (Nano Banana).

Prepend automaticamente o style preamble de xilogravura nordestina (conforme ART_BIBLE §5.3)
a menos que --no-style seja passado. Salva em out/<slug>.png por padrão.

Uso:
    ../../../.venv-art/bin/python generate.py \\
        --prompt "passista de frevo com sombrinha colorida, pose arqueada, sprite de jogo 2D" \\
        --out out/sprites/passista-frevo-01.png

    # Com imagem de referência para manter consistência de personagem:
    ../../../.venv-art/bin/python generate.py \\
        --prompt "mesmo passista de frevo, agora pulando com sombrinha aberta" \\
        --reference out/sprites/passista-frevo-01.png \\
        --out out/sprites/passista-frevo-02.png

    # Gerar N variações do mesmo prompt:
    ../../../.venv-art/bin/python generate.py --prompt "..." --count 4 --out out/variations
"""

from __future__ import annotations
import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image
import io


HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent.parent
DEFAULT_OUT_DIR = HERE / "out"


STYLE_PREAMBLE = (
    "Style: traditional Northeastern Brazilian woodcut print (xilogravura de cordel), "
    "heavy black outlines, limited color palette of cream paper, brick red, ochre, "
    "indigo, visible wood grain texture in solid areas, expressive rough carved lines, "
    "sacred/folkloric composition inspired by J. Borges and Gilvan Samico. "
)

COMPOSITION_SUFFIX = (
    " Composition: character centered, facing camera, full body, game sprite orientation, "
    "transparent or plain cream background for easy extraction, no text, no signature."
)


def load_client() -> genai.Client:
    load_dotenv(ROOT / ".env")
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise SystemExit("GEMINI_API_KEY ausente em .env")
    return genai.Client(api_key=key)


def build_prompt(user_prompt: str, *, no_style: bool, no_composition: bool) -> str:
    parts: list[str] = []
    if not no_style:
        parts.append(STYLE_PREAMBLE)
    parts.append(user_prompt.strip())
    if not no_composition:
        parts.append(COMPOSITION_SUFFIX)
    return " ".join(p.strip() for p in parts if p.strip())


def build_contents(prompt: str, reference: Path | None):
    if reference is None:
        return [prompt]
    if not reference.exists():
        raise SystemExit(f"Referência não encontrada: {reference}")
    with Image.open(reference) as img:
        img.load()
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        ref_bytes = buf.getvalue()
    ref_part = types.Part.from_bytes(data=ref_bytes, mime_type="image/png")
    return [ref_part, prompt]


def save_images(response, out: Path, count: int) -> list[Path]:
    saved: list[Path] = []
    parts = response.candidates[0].content.parts
    image_parts = [p for p in parts if p.inline_data is not None]
    if not image_parts:
        raise SystemExit("Resposta da API não trouxe imagens.")

    # se out é diretório, escreve múltiplas; senão escreve uma
    if count > 1 or out.is_dir():
        out.mkdir(parents=True, exist_ok=True)
        for i, part in enumerate(image_parts, start=1):
            target = out / f"{i:02d}.png"
            target.write_bytes(part.inline_data.data)
            saved.append(target)
    else:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(image_parts[0].inline_data.data)
        saved.append(out)
    return saved


def parse_args():
    p = argparse.ArgumentParser(description="Gera imagens via Gemini 2.5 Flash Image.")
    p.add_argument("--prompt", required=True, help="Descrição da imagem (em inglês ou português).")
    p.add_argument("--reference", type=Path, default=None, help="PNG de referência para consistência de personagem.")
    p.add_argument("--out", type=Path, default=DEFAULT_OUT_DIR / "gen.png", help="Caminho do PNG de saída, ou diretório se --count>1.")
    p.add_argument("--count", type=int, default=1, help="Número de variações (Gemini retorna 1 por call; loop é feito aqui).")
    p.add_argument("--no-style", action="store_true", help="Não prepend do style preamble de xilogravura.")
    p.add_argument("--no-composition", action="store_true", help="Não acrescentar sufixo de composição.")
    p.add_argument("--model", default="gemini-2.5-flash-image", help="Slug do modelo (default nano banana).")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    client = load_client()
    full_prompt = build_prompt(args.prompt, no_style=args.no_style, no_composition=args.no_composition)

    print(f"→ Modelo: {args.model}")
    print(f"→ Prompt completo ({len(full_prompt)} chars): {full_prompt[:160]}{'...' if len(full_prompt) > 160 else ''}")
    if args.reference:
        print(f"→ Referência: {args.reference}")

    all_saved: list[Path] = []
    for i in range(args.count):
        contents = build_contents(full_prompt, args.reference)
        response = client.models.generate_content(
            model=args.model,
            contents=contents,
            config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
        )
        # quando count>1, forçar out como diretório
        target = args.out if args.count == 1 else args.out / f"v{i+1:02d}.png"
        if args.count > 1:
            args.out.mkdir(parents=True, exist_ok=True)
        saved = save_images(response, target, count=1)
        all_saved.extend(saved)

    for p in all_saved:
        try:
            rel = p.relative_to(ROOT)
        except ValueError:
            rel = p
        print(f"✓ {rel}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
