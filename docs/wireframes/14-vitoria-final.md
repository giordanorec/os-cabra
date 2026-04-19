---
name: wireframe-14-vitoria-final
description: Tela final após derrotar último boss — créditos + highscore + compartilhamento
---

# 14 — Vitória Final

**Propósito**: coroar quem zerou. Texto poético + créditos + score final.

**Input**: Enter/Espaço avança texto; ao fim vai pro menu. ESC pula pros créditos.

## Layout (800×600)

### Parte 1 — Letreiro dramático (0..4s)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                                                            │
│                                                            │
│          [[OS CABRA VENCERAM]]                             │   y≈200 display 56px
│                                                            │
│                (ou não)                                    │   y≈260 italic 28px
│                                                            │
│                                                            │
│                                                            │
│     tudo volta ao normal,                                  │   y≈380 corpo 20px
│     mas o mangue guarda segredo.                           │   y≈410
│                                                            │
│                                                            │
│                                                            │
│              (ENTER continua)                              │   y≈560 micro 12px @ 50%
└────────────────────────────────────────────────────────────┘
```

### Parte 2 — Score + Créditos (após Enter)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│             [[SE AJEITOU DIREITO]]                         │   y≈60
│                                                            │
│          ──────────────────────                            │
│                                                            │
│             SCORE FINAL:   48.320                          │   y≈150  mono 30px
│             RECORDE:       48.320  ← NOVO RECORDE!         │   y≈190
│             SEU CÓDIGO:    Z9Q3M1                          │   y≈240  mono bold
│                                                            │
│          ──────────────────────                            │
│                                                            │
│             {{ CRÉDITOS }}                                 │   y≈310..510  scroll lento
│             Direção: CABRA DA PESTE                        │
│             Código: CABRA + OUTRO CABRA                    │
│             Arte: CABRA                                    │
│             Som: MUITA FREVOCA                             │
│             Bois pernambucanos virtuais agradecem.         │
│                                                            │
│          ──────────────────────                            │
│                                                            │
│              [ENTER menu] · [C copia código]               │   y≈560
└────────────────────────────────────────────────────────────┘
```

## Hierarquia

- **Parte 1**: 100% atenção no texto poético — sem distração
- **Parte 2**: SCORE + RECORDE no topo; créditos em scroll lento

## Elementos

### Parte 1
| Elemento | x,y | Fonte | Cor |
|---|---|---|---|
| Título | 400,225 | Display 56px | `#d4a04c` |
| "ou não" | 400,280 | Display italic 28px | `#f4e4c1` @ 70% |
| Poema L1 | 400,395 | Corpo 20px | `#f4e4c1` |
| Poema L2 | 400,425 | Corpo italic 20px | `#d4a04c` |

### Parte 2
| Elemento | x,y | Fonte | Cor |
|---|---|---|---|
| Título | 400,80 | Display 40px | `#d4a04c` |
| Stats | 200..600 | Mono 28-30px | `#f4e4c1` |
| Novo recorde badge | inline | Mono bold 20px | `#b84a2e` |
| Código | 400,245 | Mono bold 32px | `#d4a04c` |
| Créditos | 400,310..510 | Corpo 18px | `#f4e4c1`, scroll up 20 px/s |

## Transições

- Parte 1 entrada: título fade + scale 1.2→1.0 em 500ms, delay até aparecer texto; poema fade-in 800ms
- Parte 1 → Parte 2: crossfade 400ms
- Parte 2 saída (ENTER no fim dos créditos): fade → Menu

## Notas

- Música: versão ampliada da theme, triunfal
- Créditos podem ser editados diretamente em `GLOSSARY_PT_BR.md` seção `credits`
- Se recorde foi batido, SCORE FINAL tem sparkle vfx ao aparecer
- "SE AJEITOU DIREITO" é opcional; alternativa "ACABOU TUDO BEM" (default) — decidir em playtest
