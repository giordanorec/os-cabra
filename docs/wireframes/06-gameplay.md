---
name: wireframe-06-gameplay
description: Cena principal de jogo — gameplay area + HUD overlay
---

# 06 — Gameplay

**Propósito**: O jogo em si. Player na base, inimigos descem do topo, HUD na borda superior e inferior.

**Input**: ← → move, ESPAÇO atira, X bomb, ESC pausa.

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐   y=0
│ ░ HUD TOP BAR ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   y=0..40   (HUD detalhado em 07-hud.md)
│ 🐓🐓🐓           SCORE  012.340     ×1.5        💣 💣      │
│                                                            │   y=40      divisória sutil
│                                                            │
│     {{ parallax bg camada 3 — fundo distante }}            │   y=40..560 área jogável
│   {{ parallax bg camada 2 — meio }}                        │   (gameplay)
│  {{ parallax bg camada 1 — frente, confete/pó }}           │
│                                                            │
│              · inimigo ·     · inimigo ·                   │
│                                                            │
│                                                            │
│                      · inimigo ·                           │
│                                                            │
│                                                            │
│                                                            │
│                        │ tiro                              │
│                        │                                   │
│                                                            │
│                     {{ PLAYER }}                           │   y≈500 faixa do player (20% inferior)
│                                                            │
│                                                            │
│ ░ HUD BOTTOM STRIP ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   y=560..600  só visível se power-up ativo
│ [SOMBRINHA DE FREVO] ████████░░░░  10s                     │
└────────────────────────────────────────────────────────────┘   y=600
```

## Faixas / bandas

| Banda | y | Conteúdo |
|---|---|---|
| HUD top | 0..40 | vidas, score, multiplicador, bombs |
| Área livre | 40..500 | inimigos descem, tiros, drops |
| Player lane | 500..560 | player se move aqui (confinado ~y=520 ± 10) |
| HUD bottom | 560..600 | barra de power-up ativo (condicional) |

## Elementos

Ver `07-hud.md` para coordenadas exatas do HUD. Abaixo, elementos da área de gameplay:

| Elemento | Tamanho | Notas |
|---|---|---|
| Player sprite | 64×64 | hitbox 40×40 centrada, colisão justa |
| Tiro player | 6×18 | white-hot `#f4e4c1`, speed 560 px/s |
| Inimigo pequeno | 64×64 | frevo, caboclinho, urubu |
| Inimigo médio | 96×96 | mamulengo, caboclo, papa-figo |
| Inimigo grande | 128×128 | besta-fera |
| Power-up | 32×32 | bob 8px em 1s loop |
| Texto flutuante | 18px | "ARRETADO!" sobe 40px em 600ms, fade out |

## Feedback visual (ver `UX_SPEC.md` §6)

Key moments que acontecem na área de jogo, não no HUD:
- Muzzle flash no disparo do player
- Tint branco em inimigo atingido
- Partícula de explosão ao matar
- Shake da câmera em dano do player
- Red flash tela inteira em dano (~120ms, alpha 30%)
- Invulnerabilidade: sprite pisca a 15Hz por 1.5s

## Transições

- **Entrada** (de Intro Fase): dissolve 400ms
- **Saída pra Pausa**: freeze do gameplay + overlay zoom-out + blur (ver 08)
- **Saída pra Boss Intro**: slow zoom-in no player (ver 10)
- **Saída pra Game Over**: slow fade to black 2s
- **Saída pra Fim de Fase**: slow fade + travelling pra cima da arena

## Notas

- Player sempre visível — camera trava em (400, 300), gameplay é "tiro na cabeça" arcade
- Parallax roda mais devagar que os spawns — sensação de avanço
- HUD nunca é tapado por inimigos (inimigos spawnam em y≥60 pra não colidir com ícones)
- `imageSmoothingEnabled: false` em todo sprite
