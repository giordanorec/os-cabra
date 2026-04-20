# Report — Parallax Fix (scroll vertical correto + fallback temporário)

> **Branch**: `fix/parallax-scroll-correto`
> **Data**: 2026-04-20
> **Base**: `origin/main` @ `825a2d4`

## Objetivo

Follow-up de PR #29: o conceito de parallax estava errado — backgrounds em vista frontal (casas de Olinda em linha contínua) não fazem sentido com a câmera "subindo" de um shoot'em up aéreo. Visual Designer está regerando em vista aérea em `art/milestone-5-backgrounds-aerea`. Enquanto o asset novo não chega, ajustar o sistema pra:

1. Aceitar imagens **altas** (tipo 800×2400) com scroll vertical correto (uma passagem ou ping-pong).
2. Calibrar velocidades 0.2x / 0.5x / 1.0x (back/mid/fore) em relação ao ritmo da fase.
3. Se vier 800×600 de emergência, tile **seamless vertical** — nunca horizontal.
4. Suportar modo **postal** (crossfade entre quadros estáticos) como alternativa.
5. Desativar temporariamente os PNGs atuais que tapam gameplay com casas frontais erradas.

## O que foi feito

### 1. `src/systems/Parallax.ts` reescrito

Quatro estratégias por camada, escolhidas automaticamente em `constructor`:

- **`scroll-single`** — imagem alta (`height > GAME_HEIGHT * 1.5`). Renderizada como `Image` única ancorada em `(0, 0)` com largura forçada a 800, altura natural. Desliza verticalmente em **ping-pong** entre `y = 0` e `y = -(h - 600)`. Ping-pong mantém movimento visual mesmo se a imagem não tiver a altura "perfeita" para a duração da fase.
- **`scroll-tiled`** — imagem ~800×600 (fallback de emergência). `TileSprite 800×600` com `tilePositionY += dy`. Tile **SEAMLESS VERTICAL** apenas — largura fixa em 800, nunca tila em x (x é só do player).
- **`procedural`** — fallback quando a textura não existe. Pontinhos da paleta pivot (pink/gold/cream/red/green) sobre `cameras.main.setBackgroundColor` da cena. Foi o que viabilizou o workaround desta rodada.
- **`postal`** — consome `POSTAL_SETS[sceneId]` (lista pré-registrada de keys). Troca com crossfade de 600 ms a cada 8 s. `POSTAL_SETS` está vazio hoje; Visual Designer popula se optar por esse formato.

**Velocidades calibradas em `PARALLAX_BASE_SPEED = 300 px/s`** (a velocidade do fore, 1.0x):
- back  (0.2x) = 60 px/s  — percorre 2400 px em 40 s (ritmo de fase de exemplo do brief)
- mid   (0.5x) = 150 px/s
- fore  (1.0x) = 300 px/s

### 2. Novas constantes em `src/config.ts`

```ts
export const PARALLAX_MODE: 'scroll' | 'postal' = 'scroll';
export const PARALLAX_POSTAL_INTERVAL_MS = 8_000;
export const PARALLAX_CROSSFADE_MS = 600;
```

Alternar entre scroll/postal é uma linha.

### 3. `PreloadScene.ts` — `bg-fase1-back` e `bg-fase1-fore` desativados

**Descoberta durante validação**: o usuário pediu pra desativar `back.png`, mas uma screenshot Playwright revelou que o PNG que estava tapando o gameplay com casas frontais é o **`fore.png`** (uma faixa contínua de casarios de Olinda). `back.png` também é frontal, então foram desativados os dois. `mid.png` (balões + nuvens + pipas, com alpha) permanece ativo — é decorativo, não bloqueia.

Resultado visual: fundo turquesa `SCENE_BG.FASE1 = #6fc5ea` chapado + pontinhos procedurais (camada back) + balões/pipas translúcidos (camada mid) + procedural pra fore. Gameplay limpo.

## Arquivos alterados/criados

**Novos**
- `tests/smoke/parallax-fallback.spec.ts` — 3 smoke tests
- `playwright.parallax.config.ts` — porta 5180 dedicada
- `docs/milestone-reports/parallax-scroll/*.png` — screenshots de validação
- `docs/REPORT_GAMEPLAY_DEV_PARALLAX_SCROLL.md` — este report

**Modificados**
- `src/config.ts` — `PARALLAX_MODE`, `PARALLAX_POSTAL_INTERVAL_MS`, `PARALLAX_CROSSFADE_MS`
- `src/systems/Parallax.ts` — reescrita completa com 4 estratégias
- `src/scenes/PreloadScene.ts` — `bg-fase1-back` e `bg-fase1-fore` comentados

## Evidências visuais

- `docs/milestone-reports/parallax-fix/gameplay-without-back.png` — gameplay Fase 1 com fundo turquesa chapado + balões/pipas da mid.png + player galo visível + HUD topo intacto + intro "MARCO ZERO" — **sem casas frontais bloqueando**.
- `docs/milestone-reports/parallax-scroll/parallax-02-clean-turquesa.png` — screenshot complementar (auto-gerada) na resolução maior 1920×1080.

## Validação executada

- `npm run typecheck` — limpo
- `npm run build` — OK (warning de chunk size pré-existente do vendor)
- `npx playwright test --config=playwright.parallax.config.ts` — **3/3 verde**:
  1. `bg-fase1-back` e `fore` ausentes; `bg-fase1-mid` carregado; player ativo/alpha 1
  2. camada back cai em `procedural` (kind check)
  3. parallax.elapsed avança sem console.error

## Decisões técnicas

- **Ping-pong para imagem alta** — "scroll once" (user sugeriu como primeira opção) deixaria a back estática depois da primeira passagem. Ping-pong preserva movimento, com custo baixo de implementação.
- **`PARALLAX_BASE_SPEED` como único magic number** — todas as velocidades derivadas dele por fator. Calibragem futura é uma linha.
- **POSTAL_SETS vazio em vez de removido** — infra pronta, Visual Designer preenche as keys quando quiser. Evita refactor futuro.
- **Auto-detecção tall vs tiled** — baseada em `texture.source[0].height`. Threshold de 1.5× GAME_HEIGHT evita classificar 800×608 como tall por arredondamento.

## Handoff pro `art/milestone-5-backgrounds-aerea`

Três caminhos, todos dentro do mesmo pipeline, **sem mudar código**:

1. **Imagens altas 800×2400** em `public/assets/backgrounds/fase1/{back,mid,fore}.png`
   - Descomentar as linhas em `BACKGROUND_IMAGES` no `PreloadScene.ts`.
   - Parallax detecta `height > 900` → usa `scroll-single` ping-pong automaticamente.
2. **Imagens 800×600**
   - Descomentar. Parallax cai em `scroll-tiled` seamless vertical. Funciona, menos imersivo.
3. **Modo postal**
   - Trocar `PARALLAX_MODE = 'postal'` em `config.ts`.
   - Popular `POSTAL_SETS.fase1` em `Parallax.ts` com as keys dos postais.
   - Adicionar os loads no Preload (`bg-fase1-postal-0`, `-1`, ...).

## Blockers/dúvidas pro Arquiteto

- **Modo postal nunca rodou em produção** — só validei que infra compila e `tryMountPostal` não crasha quando vazio. Primeiro uso real vai precisar de asset-pack e smoke test dedicado.
- **Outras fases (fase2/fase3/...)** usam o mesmo sistema mas não testei. Quando entrarem em main, vale rodar o smoke com `sceneId` variável.
- **Speed calibration** é "fase de papel" — 300 px/s fore pode estar rápido/lento quando o Visual Designer entregar backgrounds reais. Ajustar em playtest.

## Próximos passos

- Merge deste PR.
- Quando `art/milestone-5-backgrounds-aerea` entrar em main: descomentar as linhas e conferir que a detecção `isTall` acerta o caminho automaticamente.
- Em playtest, calibrar `PARALLAX_BASE_SPEED` se o ritmo sentir errado.
