---
name: wireframe-12-fim-de-fase
description: Recap de score + CTA pra próxima fase
---

# 12 — Fim de Fase

**Propósito**: resumir a fase (score, acertos, mortes) e dar gancho pra próxima.

**Input**: Enter continua, ESC vai pro menu.

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│             [[FASE 1 — SE DANOU]]                          │   y≈60   display 48px
│                                                            │
│           ──────────────────────────                       │
│                                                            │
│             SCORE DA FASE:    12.340                       │   y≈160  mono 24px
│             INIMIGOS NO CHÃO:   47                         │   y≈200
│             VEZES QUE MORREU:    1                         │   y≈240
│             VIDAS RESTANTES:     2 🐓🐓                    │   y≈280
│                                                            │
│           ──────────────────────────                       │
│                                                            │
│             SCORE TOTAL:      12.340                       │   y≈350  mono bold 32px `#d4a04c`
│                                                            │
│                                                            │
│                                                            │
│              ┌──────────────────────────┐                  │
│              │   [BORA PRA PRÓXIMA]  ◀  │                  │   y≈450  CTA
│              └──────────────────────────┘                  │
│              ┌──────────────────────────┐                  │
│              │       [VAZAR]            │                  │   y≈510
│              └──────────────────────────┘                  │
│                                                            │
│                    (ENTER confirma)                        │   y≈575
└────────────────────────────────────────────────────────────┘
```

## Hierarquia

1. Título "SE DANOU" — celebração
2. Stats em mono pra sensação retro
3. SCORE TOTAL destacado
4. CTA de continuar

## Elementos

| Elemento | x,y | Fonte | Cor |
|---|---|---|---|
| Título | 400,80 | Display 48px | `#d4a04c` |
| Divisórias | 150/650,120 & 320 | — | `#d4a04c` thin |
| Stats | 180..620, 160..280 | Mono 24px | label `#f4e4c1` @ 70% / valor `#f4e4c1` |
| SCORE TOTAL | 180..620, 350 | Mono bold 32px | `#d4a04c` |
| Botão ativo | 270,440,260,45 | Display 24px | `#1a0f08` / bg `#d4a04c` |
| Botão idle | 270,500,260,45 | Display 22px | `#f4e4c1` |

## Variações de título

| Fase terminada | Título |
|---|---|
| 1 | FASE 1 — SE DANOU |
| 2 | FASE 2 — EITA |
| 3 | FASE 3 — MEU PAI DO CÉU |
| 4 | FASE 4 — QUASE |
| 5 | (vai pra Vitória Final, não passa por aqui) |

## Transições

- **Entrada**: stats aparecem em cascata linha por linha, 100ms stagger, números contam de 0 até valor
- **Total**: flash `#d4a04c` 200ms quando aparece
- **Confirma**: wipe pra Intro da próxima fase

## Notas

- Highscore não aparece aqui — só no Game Over / Vitória Final (menos ruído)
- Se "Tapioca" vai dropar como recompensa milestone, animar ícone +1 vida em y≈280 antes do contador final
- Stats salvam no `run` object pra relatório final na vitória
