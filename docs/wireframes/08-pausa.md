---
name: wireframe-08-pausa
description: Overlay de pausa sobre gameplay congelado, com 3 opções
---

# 08 — Pausa

**Propósito**: parar o jogo e dar opções. Gameplay fica visível atrás (congelado + blur).

**Input**: ↑/↓ navega, Enter confirma, ESC retoma imediatamente.

## Layout (800×600)

```
┌────────────────────────────────────────────────────────────┐
│ ░░░░░░ (gameplay congelado + blur 8px + dimmer 50%) ░░░░░ │
│                                                            │
│                                                            │
│                                                            │
│                                                            │
│                  [[PAREI]]                                 │   y≈180  display 80px
│                                                            │
│                                                            │
│         ┌──────────────────────────┐                       │
│         │       [BORA]   ◀         │                       │   y≈290
│         └──────────────────────────┘                       │
│         ┌──────────────────────────┐                       │
│         │    [RECOMEÇA A FASE]     │                       │   y≈350
│         └──────────────────────────┘                       │
│         ┌──────────────────────────┐                       │
│         │    [VOLTAR PRO MENU]     │                       │   y≈410
│         └──────────────────────────┘                       │
│                                                            │
│                                                            │
│        ESC retoma · ↑↓ escolhe · ENTER confirma            │   y≈530  micro 12px @ 60%
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Hierarquia

1. Título "PAREI" — domina a tela
2. "BORA" (continuar) — sempre opção padrão, destacada
3. Outras opções
4. Legenda de controles (discreta)

## Elementos

| Elemento | x,y,w,h | Fonte | Cor |
|---|---|---|---|
| Overlay dimmer | 0,0,800,600 | — | `#1a0f08` @ 50% |
| Blur (CanvasTexture) | idem | — | Gaussian 8px em snapshot do gameplay |
| "PAREI" | 400,215 | Display 80px | `#f4e4c1` + sombra `#1a0f08` 4px offset |
| Botão ativo | 270,275,260,45 | Display 24px | texto `#1a0f08` / bg `#d4a04c` |
| Botão idle | 270,335..395,260,45 | Display 22px | texto `#f4e4c1` / borda 2px `#f4e4c1` |
| Legenda | 400,530 | Micro 12px | `#f4e4c1` @ 60% |

## Transições

- **Entrada** (ESC durante gameplay): overlay fade 150ms + "PAREI" entra com scale 1.3→1.0 + Back.easeOut em 250ms + botões em cascata 80ms
- **Resume** (ESC ou "BORA"): reversão de entrada em 180ms; gameplay retoma sem contagem
- **Recomeça a fase**: fade pra preto rápido 300ms → reinicia fase do começo (sem recarregar assets)
- **Vazar pro menu**: pede confirmação ("PERDE TUDO? [S/N]") antes de sair

## Notas

- Pausa **congela** toda a simulação (physics.pause, tweens.pauseAll, anims.pauseAll); resume restaura tudo
- Input de gameplay (setas, espaço) é **ignorado** durante pausa — só ESC/↑/↓/Enter valem
- Música abaixa volume 30% enquanto pausa (ducking) em vez de cortar — menos brusco
- SFX tocam normais (menu select tem som)
