# Pipeline de geração de arte — Gemini Nano Banana

Pipeline Python para gerar sprites e artes do "Os Cabra" via **Google Gemini 2.5 Flash Image** ("Nano Banana"), conforme `docs/ART_BIBLE.md §5` e `docs/AI_SETUP.md`.

## Pré-requisitos

1. **Chave Gemini** em `/.env` (raiz do repo). Obter em https://aistudio.google.com/apikey
   ```
   GEMINI_API_KEY=AIza...
   ```
2. **Venv Python** já criada em `/.venv-art/`. Se não existir:
   ```bash
   python3 -m venv .venv-art
   .venv-art/bin/pip install --upgrade google-genai pillow python-dotenv
   ```

## Scripts

### `test_gemini.py` — sanity check
Gera 1 imagem com prompt padrão, confirma que API está funcionando.
```bash
.venv-art/bin/python scripts/art/gemini/test_gemini.py
# ou com prompt customizado:
.venv-art/bin/python scripts/art/gemini/test_gemini.py "caboclinho atirando flecha"
```
Saída: `scripts/art/gemini/out/test.png`.

### `generate.py` — CLI principal
Gera 1 ou N imagens com style preamble automático de xilogravura.

```bash
# Um sprite simples:
.venv-art/bin/python scripts/art/gemini/generate.py \
  --prompt "passista de frevo com sombrinha amarela, pose arqueada dançando" \
  --out scripts/art/gemini/out/sprites/passista-01.png

# Mantendo consistência de personagem com imagem de referência:
.venv-art/bin/python scripts/art/gemini/generate.py \
  --prompt "mesmo passista de frevo, agora com sombrinha fechada pulando pra direita" \
  --reference scripts/art/gemini/out/sprites/passista-01.png \
  --out scripts/art/gemini/out/sprites/passista-02.png

# 4 variações do mesmo prompt:
.venv-art/bin/python scripts/art/gemini/generate.py \
  --prompt "boss Maracatu Nação trio: Rei, Rainha e Calunga, coroas e mantos vermelhos" \
  --count 4 \
  --out scripts/art/gemini/out/boss-maracatu/

# Desligar o preamble (se quiser estilo diferente):
.venv-art/bin/python scripts/art/gemini/generate.py --prompt "..." --no-style
```

Flags:
- `--prompt` (obrigatório) — texto da imagem
- `--reference` — PNG de referência pra consistência
- `--out` — arquivo PNG ou diretório se `--count > 1`
- `--count N` — número de variações (loop de chamadas, 1 imagem por call)
- `--no-style` — pula o preamble xilogravura
- `--no-composition` — pula o sufixo de composição
- `--model` — troca de modelo (default: `gemini-2.5-flash-image`)

## Fluxo recomendado (Visual Designer)

1. **Ficha do personagem**: gerar 1 "hero image" com prompt detalhado, aprovar visualmente
2. **Consistência**: para todas as outras poses/frames, passar a hero image via `--reference`
3. **Pós-processamento** (manual, fora deste script): remover fundo, redimensionar pra tile size do sprite (ver `ART_BIBLE.md §6`), reduzir pra paleta do projeto se necessário, montar spritesheet
4. **Commit**: PNGs finais vão em `public/assets/sprites/`, **não** em `scripts/art/gemini/out/` (essa é pasta de trabalho)

## Custos estimados

- ~$0.039 por imagem (1290 tokens × $30/M)
- Spritesheet de 6 frames ≈ $0.25
- Fase 1 completa (player + 3 inimigos + boss com animações) ≈ $5-15
- Tier gratuito do Gemini cobre experimentação confortavelmente

## Licenças

Conteúdo gerado pelo Gemini: sem restrição de uso conforme ToS atual, mas registre geração em `docs/VISUAL_LICENSES.md` com prompt usado (auditoria + repetibilidade).
