# AI Setup — geração de arte por IA

> **Responsável**: Visual Designer. **Quando executar**: antes de iniciar Fase C de `docs/prompts/03-visual-designer.md`.
> **Segurança**: chaves vão em `.env` (já está no `.gitignore`). Não commitar.

## Modelo primário — Google Gemini 2.5 Flash Image ("Nano Banana")

Modelo state-of-the-art de geração/edição de imagens lançado em fev/2026. Força principal para este projeto: **consistência de personagem** — pode manter o mesmo "passista de frevo" reconhecível em múltiplas poses, o que é essencial para spritesheet.

- **Preço**: ~$0.039 por imagem (1290 output tokens @ $30/M tokens)
- **Slug do modelo**: `gemini-2.5-flash-image`
- **SDK**: `google-genai` (Python) ou cliente REST direto

### Passos

1. Criar projeto e obter chave em https://aistudio.google.com/apikey
2. Salvar em `.env`:
   ```
   GEMINI_API_KEY=AIza...
   ```
3. Instalar SDK (em ambiente Python dedicado ao Visual Designer, não no repo do jogo):
   ```bash
   python -m venv .venv-art
   source .venv-art/bin/activate
   pip install --upgrade google-genai pillow python-dotenv
   ```
4. Script mínimo de teste (`scripts/art/test_gemini.py` — **não commitar** se vazar prompts internos):
   ```python
   import os, sys
   from dotenv import load_dotenv
   from google import genai
   from google.genai import types

   load_dotenv()
   client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

   result = client.models.generate_content(
       model="gemini-2.5-flash-image",
       contents=[sys.argv[1]],
       config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
   )
   # salvar o bytes da primeira imagem retornada
   for part in result.candidates[0].content.parts:
       if part.inline_data:
           open("out.png", "wb").write(part.inline_data.data)
           print("saved out.png")
   ```

5. Testar com prompt simples:
   ```bash
   python scripts/art/test_gemini.py "woodcut xilogravura print of a Brazilian rooster, heavy black outline, cream paper background, ochre and brick red palette"
   ```

### Consistência de personagem

A chave do Gemini é: aprovar 1 imagem "hero" e reusá-la como *input multimodal* nas gerações seguintes. O SDK aceita imagem + texto no mesmo `contents`:

```python
from PIL import Image
hero = Image.open("player_hero_approved.png")
result = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[hero, "same character, facing right, mid-flight pose, same woodcut style, transparent background"],
    ...
)
```

Isso é o que permite gerar 3-4 frames consistentes de uma animação a partir de 1 design aprovado.

## Fallback — Flux via fal.ai ou Replicate

Se o Gemini não render xilogravura com qualidade suficiente, trocar para **Flux 1.1 Pro** (ou Flux Dev open-weights):

- **fal.ai**: https://fal.ai/models/fal-ai/flux-pro — API REST, ~$0.05/imagem
- **Replicate**: https://replicate.com/black-forest-labs/flux-1.1-pro — similar

Config análoga: chave em `.env` como `FAL_KEY` ou `REPLICATE_API_TOKEN`.

Flux tende a ter **estética mais forte** (detalhe pictórico) mas **consistência de personagem inferior** ao Gemini. Workflow: gerar várias variações, escolher manualmente.

## Ferramentas de pós-processamento

Não exigem API. Todas têm versão gratuita suficiente para este projeto.

| Ferramenta | Função | URL |
|---|---|---|
| Photopea | Edição raster em browser (Photoshop-like) | https://www.photopea.com |
| remove.bg | Remoção automática de fundo | https://remove.bg |
| TinyPNG | Compressão PNG | https://tinypng.com |
| Aseprite | Pixel editing + spritesheet export | https://www.aseprite.org (paid, mas one-time $20) |
| TexturePacker Free | Spritesheet + JSON para Phaser | https://www.codeandweb.com/texturepacker |

## Orçamento estimado

Por milestone de asset (assumindo 4-6 tentativas por sprite antes de aprovar):

- Player (1 hero + 3 frames + dano) → ~20 gerações → $0.80
- Inimigo (hero + 2 frames + morte 4 frames) → ~28 gerações → $1.10
- 9 inimigos → ~$10
- 3 bosses (hero + 6-10 frames cada, mais tentativas) → ~$6
- 5 fundos parallax (2-3 camadas) → ~$4
- Power-ups, ícones, logo → ~$3

**Total estimado para arte 100% em IA: ~$25-35**. Flux como fallback aumenta ~30%.

## Troubleshooting

| Sintoma | Causa comum | Solução |
|---|---|---|
| Traço vetorial perfeito, sem textura | Prompt insuficiente | Adicionar "rough carved lines, visible wood grain texture" explícito |
| Cores fora da paleta | IA ignora restrição textual de cor | Reduzir em Photopea via "Indexed Color" com paleta manual |
| Personagem inconsistente entre frames | Gerando sem style reference | Passar imagem do hero como input multimodal |
| Fundo não transparente | Gemini devolve PNG com fundo | `remove.bg` ou Photopea "Magic Wand + Delete" |
| Tempo de geração alto | Rate limit do tier gratuito | Upgrade para tier pago no AI Studio |

## Referências

- Gemini 2.5 Flash Image docs: https://ai.google.dev/gemini-api/docs/image-generation
- Intro oficial: https://developers.googleblog.com/en/introducing-gemini-2-5-flash-image/
- Cookbook GCP: https://github.com/GoogleCloudPlatform/generative-ai/blob/main/gemini/getting-started/intro_gemini_2_5_image_gen.ipynb
