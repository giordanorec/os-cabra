---
name: wireframe-11-boss-defeated
description: Celebração de 2.5s ao derrotar boss + bônus de score
---

# 11 — Boss Derrotado

**Propósito**: celebrar. Boss explode, letreiro "SE FOI" aparece, bônus por vidas entra incrementando.

**Duração**: 2.5s (0.5 explode / 1.5 letreiro+score / 0.5 out).

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐
│ ░ HUD TOP ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                            │
│          {{ explosão em xilogravura }}                     │   y≈80..280
│          {{ partículas voando }}                           │
│                                                            │
│                    [[SE FOI]]                              │   y≈300  display 96px
│                                                            │
│                                                            │
│           ────────────────────────                         │
│                                                            │
│             BONUS DE BOSS:   +5.000                        │   y≈390  mono 28px
│             VIDAS RESTANTES: 3 × 1.000 = +3.000            │   y≈425  mono 22px
│             ─────────────────                              │
│             TOTAL:           +8.000                        │   y≈470  mono bold 28px, `#d4a04c`
│                                                            │
│           ────────────────────────                         │
│                                                            │
│                                                            │
│                    {{ PLAYER }}                            │   y≈500
└────────────────────────────────────────────────────────────┘
```

## Hierarquia

1. "SE FOI" — celebração
2. Explosão / VFX no lugar do boss
3. Recap numérico com crescendo
4. Score total somado

## Elementos

| Elemento | x,y | Fonte | Cor |
|---|---|---|---|
| Explosão (anim) | onde o boss estava | 12 frames 40ms | `#b84a2e` + `#d4a04c` + `#f4e4c1` |
| "SE FOI" | 400,340 | Display 96px | `#5a7a3a` sombra preta, scale bounce |
| Recap linhas | 250..550, 390..470 | Mono 22-28px | `#f4e4c1` / destaque `#d4a04c` |
| Divisórias | — | — | `#d4a04c` thin |

## Transições

- **t=0**: boss explode — 12 frames, screen shake forte 500ms, flash branco 150ms
- **t=0.5s**: "SE FOI" entra em scale 0→1.3→1.0 (bounce) em 350ms
- **t=0.9s**: primeira linha de bônus aparece, número conta de 0 até 5.000 em 400ms (`Quad.easeOut`)
- **t=1.3s**: segunda linha aparece, números contam
- **t=1.7s**: total aparece com flash `#d4a04c` 150ms
- **t=2.0s**: score do HUD incrementa de uma vez em animação paralela
- **t=2.5s**: saída — dissolve + move up 20px em 400ms → Fim de Fase

## Notas

- Vidas restantes contam as vidas no momento da derrota (não dropa nenhuma na luta)
- Se boss é o final (Fase 5), pula pra Vitória Final em vez de Fim de Fase
- A cada 2º boss (Fase 2, 4), dropa "Tapioca Dobrada" (+1 vida) visível antes do letreiro — pega automático
- Input do player bloqueado aqui (ele já acabou a fase)
