# Paleta — Os Cabra

> **Responsável**: Visual Designer. **Status**: M1 — paleta definitiva aprovada (ajuste menor sobre `ART_BIBLE.md §3`).
> **Regra de ouro**: máximo **5-7 cores por tela**. Nunca usar uma cor fora desta paleta sem decisão deliberada (e então adicioná-la aqui).

## Base — 7 cores canônicas

| Slot | Nome | Hex | RGB | Função primária |
|---|---|---|---|---|
| 01 | Preto pergaminho | `#1a0f08` | 26, 15, 8 | Outlines, sombras, background de tela de gameplay |
| 02 | Papel antigo | `#f4e4c1` | 244, 228, 193 | "Canvas" de fundo, áreas claras dentro dos sprites |
| 03 | Vermelho tijolo | `#b84a2e` | 184, 74, 46 | Sangue, fogo, feedback de dano, acento quente |
| 04 | Ocre | `#d4a04c` | 212, 160, 76 | Madeira, pele tostada, pickups dourados |
| 05 | Índigo | `#2a4a6e` | 42, 74, 110 | Noite, Capibaribe, sombra fria |
| 06 | Verde folha | `#5a7a3a` | 90, 122, 58 | Vegetação, Comadre Fulozinha, mangue |
| 07 | Rosa fosco | `#d66b7a` | 214, 107, 122 | Frevo, carnaval, power-up feedback |

## Variantes (uso restrito)

Para não estourar a paleta mas permitir shading/UI, usamos **shades** derivados por lerp com preto pergaminho (escurecer) ou papel antigo (clarear). Nunca criar uma shade nova se puder reutilizar uma cor base.

| Nome | Hex | Derivação | Uso |
|---|---|---|---|
| Preto puro | `#000000` | — | **Só** outline fino em UI, nunca em arte |
| Papel queimado | `#e0cfa3` | Papel antigo × 0.92 preto | Bordas de painéis de UI |
| Vermelho seco | `#7d2f1d` | Tijolo × 0.65 preto | Sombra de sangue, perigo grave |
| Ocre tostado | `#9a7030` | Ocre × 0.72 preto | Madeira entalhada, contorno quente |
| Índigo profundo | `#172f4d` | Índigo × 0.65 preto | Sombra de água, céu noturno distante |

## Paletas por fase

Cada fase filtra a paleta base — **não são cores novas**, é uma restrição. O que estiver fora de "Ativa" só aparece em sprites de inimigos (manter inimigo identificável).

### Fase 1 — Marco Zero (manhã, cais)
- **Ativa**: 01 preto, 02 papel, 05 índigo, 04 ocre
- **Acento**: 03 tijolo (só em tiros e dano)
- Sensação: amanhecer sépia com reflexos do Capibaribe

### Fase 2 — Ladeiras de Olinda (tarde, carnaval)
- **Ativa**: 01 preto, 02 papel, 07 rosa, 04 ocre
- **Acento**: 03 tijolo
- Sensação: festa saturada, quente, confete

### Fase 3 — Recife Antigo / Carnaval (noite)
- **Ativa**: 01 preto, 05 índigo, 07 rosa, 04 ocre
- **Acento**: 02 papel (luzes de poste)
- Sensação: noite elétrica, luzes pontuais

### Fase 4 — Capibaribe (rio, mangue)
- **Ativa**: 01 preto, 05 índigo, 06 verde, 02 papel
- **Acento**: 03 tijolo (poluição bio-orgânica)
- Sensação: fria, verde-azul, orgânica

### Fase 5 — Sertão / Fazenda (sol pino)
- **Ativa**: 01 preto, 02 papel, 04 ocre, 03 tijolo
- **Acento**: 06 verde (cactos pontuais)
- Sensação: calor duro, sol vertical

## Regras de aplicação

1. **Outline sempre em 01 (preto pergaminho)**, nunca em preto puro `#000`
2. **Papel antigo é base de canvas**, não de personagem — personagens têm preenchimento próprio
3. **Vermelho tijolo é reservado para sangue/fogo/dano** — não usar como cor decorativa de sprite neutro (evita falso positivo visual)
4. **Power-ups piscam** com a cor temática + papel antigo (contraste)
5. **HUD usa só papel antigo + preto pergaminho** (ver `UX_SPEC.md §5`) — cor aparece pontualmente
6. **Nunca gradiente**. Xilogravura é chapado. Se precisar volume, hatching (linhas) em preto.

## Exportações

- `.ase` (Aseprite): gerar após approvar Fase 2 final. Pendente.
- Swatch PNG (grid 7×1 de 64px): pendente — gerar junto com o primeiro spritesheet.

## Referência cruzada

- `docs/ART_BIBLE.md §3` — versão anterior (agora consolidada aqui)
- `docs/UX_SPEC.md §5` — tipografia usa cores deste documento
- `docs/STYLE_GUIDE.md` — regras de traço que se apóiam nesta paleta
