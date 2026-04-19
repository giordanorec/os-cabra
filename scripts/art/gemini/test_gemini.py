"""
Teste mínimo da pipeline Gemini. Gera 1 imagem e salva em scripts/art/gemini/out/test.png.

Uso:
    ../../../.venv-art/bin/python test_gemini.py "passista de frevo em xilogravura de cordel"

Se a chave estiver faltando/inválida, levanta erro claro antes de chamar a API.
"""

from __future__ import annotations
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types


HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent.parent  # <repo root>
OUT_DIR = HERE / "out"


def main() -> int:
    # carrega .env da raiz do repo
    load_dotenv(ROOT / ".env")

    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        print("ERRO: GEMINI_API_KEY não definida. Preencha .env na raiz do repo.", file=sys.stderr)
        return 2
    if len(key) < 20:
        print(f"ERRO: GEMINI_API_KEY parece curta demais ({len(key)} chars). Verifique.", file=sys.stderr)
        return 2

    prompt = " ".join(sys.argv[1:]).strip() or "galo da madrugada pernambucano em xilogravura de cordel, traço preto forte"
    print(f"→ Prompt: {prompt[:120]}{'...' if len(prompt) > 120 else ''}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / "test.png"

    client = genai.Client(api_key=key)
    print("→ Chamando gemini-2.5-flash-image...")
    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[prompt],
        config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
    )

    saved = False
    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            out_path.write_bytes(part.inline_data.data)
            saved = True
            break

    if not saved:
        print("ERRO: resposta não trouxe imagem inline. Dump:", response, file=sys.stderr)
        return 3

    size = out_path.stat().st_size
    print(f"✓ Salvo em {out_path.relative_to(ROOT)} ({size} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
