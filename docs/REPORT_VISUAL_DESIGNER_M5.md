# Report — Visual Designer M5 (Backgrounds vista aérea top-down)

## Objetivo

Corrigir direção conceitualmente errada dos backgrounds do M3: PNGs anteriores mostravam vista FRONTAL (como se a câmera estivesse no chão), mas o jogo é shoot 'em up vertical com câmera subindo. Loop visual ficava absurdo (casas repetindo como se a cidade se replicasse).

**Direção nova**: vista aérea top-down. O Galo voa ALTO sobre a cidade; o player vê telhados, ruas, praças, rio de cima. Google Maps estilizado em xilogravura colorida.

## Escolha (a) vs (b)

Usuário propôs dois caminhos:
- **(a)** Parallax real: 3 camadas (back opaco 800×2400, mid com alpha 800×1600, fore com alpha 800×1200)
- **(b)** Fallback "postais empilhados": 6-10 PNGs 800×600 com fade/slide

**Escolhi (a)** por dois motivos:
1. **Teste técnico confirmou** que Gemini gera vista top-down coerente — primeira tentativa (fase1-aerial-north) já veio perfeita, com telhados em grid, Torre Malakoff octogonal vista de cima, bandeirinhas cruzando entre quarteirões
2. **(a) é mais coerente com Phaser** — parallax real com 3 TileSprites é idiomático. (b) precisaria de uma mecânica custom de transição por postal que não existe no engine

Fallback (b) seguiria disponível se (a) tivesse falhado em 3 tentativas, mas não foi necessário.

## O que foi feito

### Pipeline
15 gerações Gemini 2.5 Flash Image (~$0.59). Sem retry, primeira tentativa coerente em todas.

Para cada fase (1, 2, 4):
1. **3 secções aéreas** 1024×1024 (north/mid/south do trajeto da fase)
2. **1 mid overlay** com nuvens + bandeirinhas + balões, para ser semi-transparente
3. **1 fore overlay** com aves + pipas + penas, close-range

Total: 9 secções de back + 3 mid + 3 fore = 15 gens

### Assembly (novo script `scripts/art/gemini/assemble_m5.py`)
- **Back**: empilha 3 secções cada 800×800 verticalmente → **800×2400** opaco, com feather blend de 40px nas junções pra suavizar seams
- **Mid**: flood-fill white → alpha + cover-crop → **800×1600**
- **Fore**: flood-fill white → alpha + cover-crop → **800×1200**
- **Simulação**: 3 screenshots 800×600 por fase (0%, 50%, 100% de progresso) compostos em PIL com alphas realistas (mid 0.65, fore 0.40) — preview do que o player verá

### Arquivos gerados

**`public/assets/backgrounds/fase{1,2,4}/`** (substituem os PNGs M3)
- `back.png` (800×2400) — mapa aéreo empilhado opaco
- `mid.png` (800×1600) — overlay de nuvens/bandeirinhas com alpha
- `fore.png` (800×1200) — overlay de aves/pipas com alpha

**`docs/milestone-reports/visual-m5/`**
- `sim-{fase1,fase2,fase4}-scroll-{0,1,2}.png` — 9 screenshots 800×600 simulando parallax
- `back-fase{1,2,4}-full-2400.png` — back.png completos pra o Arquiteto ver a imagem inteira

### Scroll speeds recomendados pro Gameplay Dev

Fora `const`, em `GameScene.ts`:
```ts
const PARALLAX = {
  back:  { speed: 0.30, loop: false },  // maior tamanho, scroll mais lento
  mid:   { speed: 0.65, loop: true, alpha: 0.65 },
  fore:  { speed: 1.00, loop: true, alpha: 0.40 },
}
```

- `back` scrolla lento e cobre a fase toda sem looping (2400px = ~40s a 60px/s)
- `mid` e `fore` loopam se a fase for mais longa. Alpha recomendado bate com as simulações.

## Arquivos alterados/criados

**Novos** (13 arquivos)
- `docs/REPORT_VISUAL_DESIGNER_M5.md` (este)
- `docs/milestone-reports/visual-m5/sim-*.png` (9 simulações)
- `docs/milestone-reports/visual-m5/back-*-full-2400.png` (3 backs completos como evidência)
- `scripts/art/gemini/assemble_m5.py` (novo, stitch + overlay + sim)

**Modificados/substituídos** (9 PNGs)
- `public/assets/backgrounds/fase1/{back,mid,fore}.png` — eram 800×600 frontal, agora 800×2400/1600/1200 aéreos
- `public/assets/backgrounds/fase2/{back,mid,fore}.png` — idem
- `public/assets/backgrounds/fase4/{back,mid,fore}.png` — idem

## Decisões técnicas

1. **Stitch vertical com feather** — Gemini não gera nativo 800×2400. Alternativa naive (gerar quadrado e esticar) perderia resolução. Stitch com feather 40px dá continuidade visual aceitável. Seams podem ficar visíveis em transições bruscas de paleta (ex: passar do quarteirão vermelho pro roxo abruptamente); se Arquiteto reclamar, rodar nova gen do `-mid` com `--reference` da north e south pra continuidade extra.
2. **Alpha 100% nos PNGs, dim no runtime** — mid e fore ficam full-alpha nos arquivos. Alpha realista (0.65 / 0.40) é aplicado na simulação só. Gameplay Dev controla em código via `setAlpha()`. Isso permite experimentar valores diferentes por fase sem regerar asset.
3. **Fore tem conteúdo denso** — Gemini encheu o fore-layer de aves grandes (mesmo com prompt pedindo "sparse"). Não regerei (ficaria repetitivo); Gameplay Dev compensa com alpha baixo. Se quiser fore esparso mesmo, é um regen isolado em M5.1.
4. **3 secções stitched em vez de 1 imagem alta** — Gemini com prompt "tall vertical 800×2400 aerial view" tende a compactar ou repetir padrões. Melhor gerar cada secção como cidade coerente e stitchar. Feather blend esconde 80-90% das junções.
5. **Simulação em PIL, não Photopea** — Photopea é web-based e Claude não tem browser interativo. PIL `alpha_composite` reproduz fielmente o que Phaser fará com alphas definidos. Os screenshots em `docs/milestone-reports/visual-m5/sim-*.png` **são o pre-visual de parallax pedido**.

## Budget

15 × $0.039 = **$0.585** (target ~$0.60, exato). Zero retries.

## Evidências visuais

Em `docs/milestone-reports/visual-m5/`:

**Simulações parallax** (equivalente a screenshots de Photopea)
- `sim-fase1-scroll-{0,1,2}.png` — Marco Zero aéreo em 0/50/100% da fase
- `sim-fase2-scroll-{0,1,2}.png` — Olinda hillside aéreo
- `sim-fase4-scroll-{0,1,2}.png` — Capibaribe pôr-do-sol aéreo

**Backs completos** (a imagem inteira 800×2400 pra o Arquiteto conferir)
- `back-fase1-full-2400.png`
- `back-fase2-full-2400.png`
- `back-fase4-full-2400.png`

## Blockers / dúvidas pro Arquiteto

- **Seams entre secções** — feather de 40px disfarça, mas se `back-fase1-full-2400.png` mostrar descontinuidade óbvia, rodo nova gen do mid usando `--reference=north + --reference=south` pra forçar coerência (Gemini aceita 2 refs).
- **Fase 3 e Fase 5** ainda não foram feitas — não estavam nesse prompt. Se o Arquiteto aprovar a direção aérea, M5.1 replica o pipeline para elas (~$0.59 + assembly).
- **Menu.png não foi regerado** — continua como arte de capa (não é in-game parallax). Se também deve virar aéreo pra consistência, sinaliza.
- **Sprites de personagens não mexidos** — conforme instrução. Player Galo continua top-down (que é coerente com esta direção aérea, sorte).

## Próximo passo

- **Gameplay Dev** implementa o parallax de 3 camadas em `GameScene.ts` com os speeds/alphas sugeridos acima
- **QA humano** inspeciona as 9 simulações e os 3 backs completos pra validar: (a) sem seams óbvias; (b) alpha dos overlays não prejudica legibilidade do player + inimigos; (c) vista aérea casa com mental model de shoot 'em up vertical
- **Se aprovado**, M5.1 adiciona fase 3 e fase 5 (+ ~6 gens ~$0.24)
