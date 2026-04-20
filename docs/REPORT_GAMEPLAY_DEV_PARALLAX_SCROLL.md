# Report — Gameplay Dev — Parallax scroll correto

> Branch: `fix/parallax-scroll-correto`. Data: 2026-04-20.

## Objetivo

Conserto do parallax após feedback: backgrounds em vista FRONTAL (casas em linha de Marco Zero) não batem com câmera subindo de shoot'em up aéreo. Ajustar o sistema pra aceitar imagens altas (800×2400) com scroll vertical correto, modo postal alternativo, e tirar os PNGs frontais atuais do caminho enquanto Visual Designer entrega a vista aérea em `art/milestone-5-backgrounds-aerea`.

## O que foi feito

### 1. `src/systems/Parallax.ts` reescrito

Quatro tipos de camada:

- **`scroll-single`** — imagem alta (h > 1.5 × 600). Renderizada como `Image` única ancorada em (0,0), desliza verticalmente em **ping-pong** entre `y=0` e `y = -(h - 600)`. Ping-pong mantém o feedback visual mesmo se a imagem não bater exatamente com a duração da fase.
- **`scroll-tiled`** — imagem 800×600 (emergência). `TileSprite` com `tilePositionY += dy` — tile **SEAMLESS VERTICAL** apenas; largura fixa em 800 (nunca tila em x — x é só do player).
- **`procedural`** — fallback quando textura não existe: pontinhos coloridos da nova paleta (pink/gold/cream/red/green) sobre `setBackgroundColor` da cena.
- **`postal`** — consome `POSTAL_SETS[sceneId]` (lista de keys pré-registradas). Troca com crossfade de 600ms a cada 8000ms. Vazio hoje — Visual Designer popula se optar por esse formato.

Velocidades:
- `PARALLAX_BASE_SPEED = 300 px/s` é o fore (factor 1.0x)
- mid = 0.5 × 300 = 150 px/s
- back = 0.2 × 300 = 60 px/s (percorre 2400px em 40s — calibrado pras waves da Fase 1)

### 2. Novas constantes em `src/config.ts`

```ts
export const PARALLAX_MODE: 'scroll' | 'postal' = 'scroll';
export const PARALLAX_POSTAL_INTERVAL_MS = 8_000;
export const PARALLAX_CROSSFADE_MS = 600;
export const FASE1 = { ..., DURATION_MS: 140_000 };
```

Alternar entre scroll/postal é uma linha. Outras fases reusam `FASE1.DURATION_MS` como fallback (expandir quando as outras entrarem).

### 3. `PreloadScene.ts` — `bg-fase1-back` desativado

Comentei `{ key: 'bg-fase1-back', file: 'assets/backgrounds/fase1/back.png' }` com nota explicativa. A textura `bg-fase1-back` fica ausente; Parallax detecta via `textures.exists === false` e cai em `procedural` pra essa camada. Mid/fore continuam ativos (têm alpha, decorativos, não bloqueiam gameplay).

## Validação Playwright (1920×1080)

- [`parallax-02-clean-turquesa.png`](milestone-reports/parallax-scroll/parallax-02-clean-turquesa.png) — gameplay Fase 1: **fundo turquesa chapado** (`SCENE_BG.FASE1 = #6fc5ea`) + pontinhos coloridos confete da camada procedural, player galo visível embaixo-centro, HUD topo intacto, zero casas/farol frontais atrapalhando.
- Inspeção via `g.textures.exists('bg-fase1-back')` → `false` (correto).
- `npm run typecheck` + `npm run build` limpos.
- Console sem errors (só AudioContext warning pré-gesture).

## Arquivos alterados

```
src/config.ts                          # + PARALLAX_MODE + PARALLAX_*_MS + FASE1.DURATION_MS
src/systems/Parallax.ts                # reescrito: scroll-single / scroll-tiled / procedural / postal
src/scenes/PreloadScene.ts             # bg-fase1-back comentado; mid/fore mantidos
docs/REPORT_GAMEPLAY_DEV_PARALLAX_SCROLL.md
docs/milestone-reports/parallax-scroll/*.png
```

## Integração com art/milestone-5-backgrounds-aerea (hand-off)

Três caminhos, todos dentro do mesmo pipeline:

1. **Imagens altas 800×2400** em `public/assets/backgrounds/fase1/{back,mid,fore}.png`
   - Descomentar a linha `bg-fase1-back` em `PreloadScene.BACKGROUND_IMAGES`.
   - Parallax detecta `height > 900` → usa `scroll-single` ping-pong. Zero mudança no código.
2. **Imagens 800×600 (emergência)**
   - Descomentar a linha. Parallax cai em `scroll-tiled` seamless vertical. Funciona mas menos imersivo.
3. **Modo postal**
   - Trocar `PARALLAX_MODE = 'postal'` em `config.ts`.
   - Popular `POSTAL_SETS.fase1` com as keys dos postais.
   - Adicionar os loads no Preload (`bg-fase1-postal-0`, `-1`, `-2`…).

## Próximo passo

- Merge deste PR.
- Reativar o load quando `art/milestone-5-backgrounds-aerea` entrar em main.
