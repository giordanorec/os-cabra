---
name: wireframe-10-boss-intro
description: Cena dramática de 1.5s quando boss aparece
---

# 10 — Boss Intro

**Propósito**: letreiro "OXE!" + apresentação do boss. Momento dramático — todo mundo para pra ver.

**Duração**: 1.5s total de freeze (conforme GDD §6 para Fase 1).

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐
│ ░ HUD TOP ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                            │
│                                                            │
│              {{ BOSS entra do topo }}                      │   y≈60..200
│                                                            │
│                                                            │
│                    [[OXE!]]                                │   y≈240  display 120px!
│                                                            │
│                                                            │
│           ════════════════════════════════                 │
│                                                            │
│             [[MARACATU NAÇÃO]]                             │   y≈370  display 44px
│                                                            │
│           (REI · RAINHA · CALUNGA)                         │   y≈420  italic 20px
│                                                            │
│           ════════════════════════════════                 │
│                                                            │
│                                                            │
│              ███████████████████████████                   │   y≈510  barra HP do boss (NOVA)
│              ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                   │
│                                                            │
│                    {{ PLAYER }}                            │
└────────────────────────────────────────────────────────────┘
```

## Hierarquia

1. **OXE!** — dominante, impossível de perder
2. Boss visível acima (silhueta se ainda entrando)
3. Nome do boss
4. Barra de HP entrando de baixo

## Elementos

| Elemento | x,y | Fonte | Cor |
|---|---|---|---|
| "OXE!" | 400,280 | Display ultra 120px | `#b84a2e` + outline 4px `#1a0f08` + shake 2px |
| Linha sup | 200,340 | — | `#b84a2e` |
| Nome boss | 400,380 | Display 44px | `#f4e4c1` |
| Epíteto | 400,425 | Display italic 20px | `#d4a04c` |
| Linha inf | 200,450 | — | `#b84a2e` |
| HP bar bg | 100,508,600,24 | — | `#1a0f08` + borda 2px `#f4e4c1` |
| HP bar fill | 102,510,596,20 | — | `#b84a2e` gradient pra `#d4a04c` |

## Variações de nome

| Fase | Nome | Epíteto |
|---|---|---|
| 1 | MARACATU NAÇÃO | REI · RAINHA · CALUNGA |
| 2 | HOMEM DA MEIA-NOITE | O GIGANTE DE OLINDA |
| 3 | GALO DA MADRUGADA MALIGNO | O BICHO NO CARNAVAL |
| 4 | IARA DO CAPIBARIBE | A ÁGUA MÓRBIDA |
| 5 | O CORONEL | DONO DE TUDO |

## Transições

- **Entrada**:
  - Freeze de gameplay (0ms — imediato)
  - Fade dimmer 0→40% em 200ms
  - Boss desliza do topo (y=-200 → y=120) em 600ms (`Cubic.easeOut`)
  - "OXE!" aparece em scale 2.0→1.0 + outline pulse, 300ms, delay 400ms — acompanhado de screen shake 400ms
  - Linhas deslizam em 250ms, delay 700ms
  - Nome aparece fade+scale 1.1→1.0, 350ms, delay 800ms
  - Barra HP sobe do y=600 para y=508 em 300ms, delay 1.1s
- **Saída**: "OXE!" e linhas dissolvem (fade out 300ms); HP bar **permanece** — vira parte do HUD do fight
- **Som**: trovão/estampido no OXE!, som característico do boss depois

## Notas

- "OXE!" tem shake contínuo 2px durante hold — mantém peso dramático
- Input do player fica desabilitado durante os 1.5s
- Se player skipa (Enter/Espaço), fast-forward pra saída (não corta — termina cinemática em 300ms)
- Pra Homem da Meia-Noite, boss cresce de baixo pra cima em vez de descer (adapta-se à animação específica)
