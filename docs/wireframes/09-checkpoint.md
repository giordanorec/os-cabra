---
name: wireframe-09-checkpoint
description: Feedback de 2s ao cruzar meio da fase — não pausa o jogo
---

# 09 — Checkpoint

**Propósito**: informar que salvou o progresso da fase. **Não pausa** — overlay leve que passa.

**Duração**: 2.0s total (0.3 in / 1.4 hold / 0.3 out).

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐
│ ░ HUD TOP ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   y=0..40  HUD continua ativo
│                                                            │
│                   (gameplay continua)                      │
│                                                            │
│          ════════════════════════════════════              │   y≈220  linha
│                                                            │
│               [[ONDE EU TAVA]]                             │   y≈260  display 44px
│                                                            │
│           (salvou na metade da fase)                       │   y≈320  corpo 16px
│                                                            │
│          ════════════════════════════════════              │   y≈350  linha
│                                                            │
│                   (gameplay continua)                      │
│                                                            │
│                    {{ PLAYER }}                            │
│                                                            │
│ ░ HUD BOTTOM (se powerup) ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└────────────────────────────────────────────────────────────┘
```

## Hierarquia

1. Texto "ONDE EU TAVA" — suficiente por si
2. Subtexto explicativo
3. Linhas decorativas

## Elementos

| Elemento | x,y | Fonte | Cor |
|---|---|---|---|
| Linha sup | 200,220 | — | `#5a7a3a` (verde — cor de "ok", confirmação) |
| Texto principal | 400,280 | Display 44px | `#f4e4c1` sobre sombra |
| Subtexto | 400,328 | Corpo italic 16px | `#d4a04c` |
| Linha inf | 200,350 | — | `#5a7a3a` |

## Transições

- **Entrada**: linhas deslizam do lado (esq/dir) em 250ms + texto fade-in com escala 1.15→1.0 em 300ms, delay 120ms
- **Saída**: tudo fade + scale 1.0→1.05 + move-up 20px em 300ms
- **Nunca bloqueia input** — player continua jogando; o overlay está em depth alto mas é *através*

## Comportamento

- Trigger: ao cruzar 50% das ondas da fase (ver GDD §8)
- Posição salva: onda atual + número de vidas no momento + score
- Se morrer na segunda metade, reaparece no ponto de checkpoint com vidas salvas
- Se Game Over total (zerou vidas), checkpoint **não** é usado — volta ao começo total

## Notas

- Cor verde `#5a7a3a` dá pista semântica: é uma coisa *boa* que aconteceu
- Som: pequeno chime (ver `SOUND_SPEC.md` — `sfx_checkpoint`)
- Se player já tá em um momento intenso (boss iminente, muitos inimigos), checkpoint não atrapalha porque é transparente
