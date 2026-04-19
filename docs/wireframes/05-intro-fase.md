---
name: wireframe-05-intro-fase
description: Letreiro de 2s anunciando nome da fase antes do gameplay
---

# 05 — Intro de Fase

**Propósito**: letreiro de cordel anunciando a fase. Dá respiro dramático + contexto.

**Duração**: 2.0s total (0.4 in / 1.2 hold / 0.4 out). Skippable com qualquer tecla após 500ms.

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐
│ · · · · · · (fundo da fase já carregado, blur) · · · · · ·│
│                                                            │
│                                                            │
│                                                            │
│          ═══════════════════════════════════════           │   y≈200  linha decorativa
│                                                            │
│                                                            │
│                    [[FASE 1]]                              │   y≈250  display 40px
│                                                            │
│                                                            │
│              [[MARCO ZERO]]                                │   y≈310  display 64px
│                                                            │
│          (ONDE TUDO COMEÇA)                                │   y≈380  itálico 24px
│                                                            │
│                                                            │
│          ═══════════════════════════════════════           │   y≈440  linha decorativa
│                                                            │
│                                                            │
│                                                            │
│             (qualquer tecla pula)                          │   y≈560  micro 12px @ 40%, aparece após 500ms
└────────────────────────────────────────────────────────────┘
```

## Hierarquia

1. Nome da fase (maior)
2. Subtítulo poético
3. Número da fase
4. Linhas decorativas (moldura de cordel)

## Elementos

| Elemento | x,y | Tamanho | Cor |
|---|---|---|---|
| Linha decorativa | 150,200 & 150,440 | 500×2 (com serifas) | `#d4a04c` |
| "FASE N" | 400,260 | Display 40px | `#b84a2e` |
| Nome | 400,325 | Display 64px | `#f4e4c1` sobre sombra `#1a0f08` |
| Subtítulo | 400,395 | Display itálico 24px | `#d4a04c` |
| Skip hint | 400,570 | Micro 12px | `#f4e4c1` @ 40% |

## Variações por fase

| Fase | Nome | Subtítulo |
|---|---|---|
| 1 | MARCO ZERO | ONDE TUDO COMEÇA |
| 2 | LADEIRAS DE OLINDA | DESCE QUEM PODE |
| 3 | RECIFE ANTIGO | DENTRO DA FESTA |
| 4 | CAPIBARIBE | A MARÉ VIROU |
| 5 | SERTÃO | A HORA É AGORA |

## Transições

- **Entrada**: linhas decorativas escorregam do lado (esq e dir), 400ms `Cubic.easeOut`
- **Texto**: aparece com escala de 1.2 → 1.0 + fade, 300ms, delay 200ms após linhas
- **Saída**: texto some em escala 1.0 → 0.8 + fade, 400ms `Cubic.easeIn`, depois dissolve tela pro Gameplay
- **Música**: beat de boss/fase começa aqui, não no gameplay (dá continuidade)

## Notas

- Fundo é a cena da fase já carregada em blur (Gaussian 8px) — transição sem corte
- Se jogador pular, acelera saída (timeline salta pro frame de saída, não corta abrupto)
