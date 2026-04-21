# REPORT — Visual Hotfix 2 (Gameplay Dev)

## Objetivo

Desbloquear 2 bugs visuais críticos reportados no deploy:
1. Fundo aéreo de Recife (back.png milestone-5) não aparecia em gameplay — só céu chapado + decorativos do M4.
2. Player aparecia como "quadradinho bizarro" no lugar do Galo ilustrado 128×128.

## O que foi feito

- **Bug 1 — back aéreo**: reativado o carregamento de `bg-fase1-back` em `PreloadScene`. Estava comentado desde 2026-04-20 porque a versão anterior era vista frontal (parede de casas); milestone-5-aerea entregou nova versão em vista aérea (800×2400) que o modo scroll ping-pong do `Parallax` já sabe usar.
- **Bug 1b — fore bloqueando gameplay**: ao religar tudo, `fore.png` se revelou um postal frontal (galo gigante + pássaros cobrindo tela inteira) — mantido desativado até entregar variante aérea. Comentário atualizado com a razão.
- **Bug 2 — player**: `player.png` é uma ilustração única 128×128, mas estava sendo carregada como spritesheet `32×32`. Frame 10 exibia um recorte ininteligível. Migrado para `load.image` (sem frames) em um novo array `SINGLE_SPRITES`, e `Player` agora usa `setScale(0.75)` (≈96px na tela) com hitbox 72×72 offset (28,32) para fair-play.

## Arquivos alterados

- `src/scenes/PreloadScene.ts` — reativa `bg-fase1-back`; move `player` para `SINGLE_SPRITES`; fore permanece off com comentário explicativo.
- `src/entities/Player.ts` — remove frame-index do construtor, setScale 2 → 0.75, define hitbox menor do que o sprite para pesar menos nos i-frames.

## Decisões técnicas

- **fore.png desativado ao invés de reabilitado**: o asset milestone-5 é postal (galo + pássaros fullscreen). Religá-lo encobriria gameplay. Reativar só quando Visual Designer entregar variante aérea/silhueta leve.
- **Player como image, não spritesheet**: enquanto art/milestone-4 não padronizar poses múltiplas, manter 1 ilustração única evita fatiar em 16 frames-pedaço. Trocar pra `load.spritesheet(..., 128×128)` quando o atlas tiver ≥2 poses.
- **Hitbox 72×72 (56% do sprite)**: o Galo tem cauda ampla e gente perdoa bala que passa raspando pela pena. Offset (28,32) centra na massa corporal.
- **Densidade de céu não foi aumentada**: a partir do momento em que `back` (vista aérea) + `mid` (bandeirinhas/balões/nuvens) passam a aparecer simultaneamente, o céu ficou naturalmente rico. PNGs de `public/assets/sky/*` ainda não estão wired — ponto pra milestone futura se quiser spawners de elementos animados.

## Validação

- `npm run typecheck` ✅
- `npm run build` ✅
- Playwright MCP: `menu.png`, `gameplay-fixed-final.png` confirmam:
  - Menu carrega ilustração + título dourado
  - Gameplay mostra vista aérea do Recife (quarteirões coloridos, praça octogonal, Capibaribe ao norte), mid com balões e bandeirinhas, Galo colorido reconhecível no centro-inferior, HUD 3 vidas + score 000000.

## Blockers / open questions

- `fore.png` segue inutilizável — coordenar com Visual Designer na próxima rodada.
- Hitbox ajustada empiricamente; QA pode querer calibrar com testes de dificuldade real.

## Próximo passo

- Visual Designer: gerar `fore.png` variante silhueta/aérea (ex: quebrada de copas de palmeira passando rápido na base) para ativar.
- Gameplay Dev: se usuário pedir mais riqueza de céu, spawner procedural dos PNGs em `public/assets/sky/*` (balões/pipas/fogos/pássaros) com velocidade do mid (0.5x).
