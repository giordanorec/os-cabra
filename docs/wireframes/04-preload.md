---
name: wireframe-04-preload
description: Loading de assets entre menu e gameplay, com dica pernambucana rotativa
---

# 04 — Preload

**Propósito**: cobrir download/decoding de assets da fase. Rotaciona dica pernambucana enquanto carrega.

**Input**: nenhum (auto-advance).

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│                                                            │
│                  {{ mini logo OS CABRA }}                  │   y≈140  (160×60)
│                                                            │
│                                                            │
│                                                            │
│         ╔════════════════════════════════════╗             │
│         ║████████████████░░░░░░░░░░░░░░░░░░░░║             │   y≈290  barra 440×32
│         ╚════════════════════════════════════╝             │
│                        47%                                 │   y≈340  Mono 18px
│                                                            │
│                                                            │
│                                                            │
│           ─────────────────────────────────                │
│                                                            │
│              "SEGURA O CABRA, QUE JÁ VAI."                 │   y≈440  dica 22px itálico
│           (dica · muda a cada 3s)                          │   y≈480  micro 12px @ 50%
│                                                            │
│                                                            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Hierarquia

1. Barra de progresso — função principal
2. Dica pernambucana — diversão enquanto espera
3. Logo — marca, mas discreto

## Elementos

| Elemento | x,y,w,h | Fonte | Cor |
|---|---|---|---|
| Mini logo | 320,140,160,60 | — | — |
| Barra (bg) | 180,290,440,32 | — | `#1a0f08` + borda 2px `#f4e4c1` |
| Barra (fill) | 180,290, 440*progress, 32 | — | `#b84a2e` → `#d4a04c` gradient |
| Percent | 400,340 | Mono 18px | `#f4e4c1` |
| Dica | 400,440 | Display 22px itálico | `#d4a04c` |
| Dica label | 400,480 | Micro 12px | `#f4e4c1` @ 50% |

## Dicas (rotação — ver GLOSSARY_PT_BR.md seção `loading_tips`)

- "SEGURA O CABRA, QUE JÁ VAI."
- "SE TOMAR TIRO, TU VÊ ESTRELA."
- "QUANDO VIER MUITO, CORRE PRO CANTO."
- "SOMBRINHA DE FREVO BLOQUEIA UM HIT SÓ."
- "PAPA-FIGO MIRA ONDE TU TÁ. ANDA."
- … (expandir em glossário)

## Transições

- **Entrada**: fade-in em 200ms
- **Barra cresce**: ease linear (reflete progress real do Phaser Loader)
- **Texto da dica troca** a cada 3s: crossfade 300ms
- **Saída**: ao bater 100% + asset pronto, aguarda 200ms e transiciona → Intro de Fase (wipe)

## Notas

- Se preload < 500ms, pular a tela (flash rápido é pior que nada). Thresold simples no BootScene.
- `imageSmoothingEnabled: false` aqui também — a barra deve parecer entalhada.
