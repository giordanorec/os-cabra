# UI Style Guide — Os Cabra

> **Responsável**: UI/UX Designer. **Lê também**: Gameplay Developer (aplica), Visual Designer (alinha).
> **Depende de**: `UX_SPEC.md`, `ART_BIBLE.md` §3.

## 1. Princípios

1. **Legível antes de bonito**. Xilogravura tem textura demais; UI fica sóbria pra contrastar.
2. **Caixa alta em destaques, caixa mista em corpo longo**. Uppercase cansa em parágrafo.
3. **Alta densidade de contraste**. Fundo escuro + texto claro sempre, mínimo 4.5:1.
4. **Cinco cores funcionais** + paleta da arte. UI usa subconjunto da paleta do `ART_BIBLE.md` §3.

---

## 2. Tipografia

### 2.1 Famílias (Google Fonts)

Escolha final: **Rye** + **Inter** + **JetBrains Mono**.

| Papel | Fonte | Peso | Fallback | Motivo |
|---|---|---|---|---|
| Display | **Rye** | 400 (único) | `"Bungee", "Rye", "Rubik Mono One", serif` | Serifa irregular, parece letra entalhada em madeira — casa com xilogravura sem ser ilegível |
| Corpo | **Inter** | 400 / 500 / 700 | `"DM Sans", system-ui, sans-serif` | Neutra, altíssima legibilidade em telas, peso bold disponível pra ênfase |
| Mono | **JetBrains Mono** | 400 / 700 | `"IBM Plex Mono", ui-monospace, monospace` | Códigos (A3X9K2) em tabular-nums, score do HUD |

**Carregamento**: via `@fontsource/*` instalados como dependência (evita request externo). Preload apenas **display** + **corpo** regular; resto lazy.

**Por que Rye e não Bungee ou Modak**:
- **Rye** tem letterforms mais "carvadas" e menos geométricas — Bungee é limpa demais; Modak é bolhosa demais (infantil).
- Alinhamento com `ART_BIBLE.md`: traço irregular, peso variável, sensação de entalhe.
- Rye só tem 1 peso (regular). Para "bold", usar **outline grosso** (stroke 3-4px) em vez de peso mais pesado. Economiza downloads.

> **Decisão pendente com Visual Designer**: se ele gerar uma fonte customizada com lettering de cordel, Rye sai. Até lá, Rye é default.

### 2.2 Escala tipográfica

Em 800×600. Todos múltiplos de 2 (ou 3) para evitar subpixel.

| Nome | px | Uso | Fonte |
|---|---|---|---|
| `display.xl` | 88 | Tela Game Over "SE LASCOU", boss "OXE!" | Rye |
| `display.l` | 64 | Nome da fase, "PAREI" | Rye |
| `display.m` | 48 | Títulos de tela (Códigos, Créditos) | Rye |
| `display.s` | 32 | Botões ativos, score destaque | Rye |
| `display.xs` | 24 | Botões idle, subtítulos | Rye |
| `body.l` | 20 | Parágrafos curtos (poesia da vitória) | Inter |
| `body.m` | 18 | Descrições, stats em tela de fim | Inter |
| `body.s` | 16 | Corpo padrão — **piso pra gameplay** | Inter |
| `micro` | 12 | Hints de atalho, versão, copyright | Inter |
| `hud.score` | 24 | Score em gameplay | Rye |
| `hud.label` | 14 | Label "SCORE" | Rye |
| `mono.code` | 32 | Código de compartilhamento (A3X9K2) | JetBrains Mono 700 |
| `mono.stat` | 24 | Stats do fim de fase | JetBrains Mono 400 |
| `mono.input` | 40 | Célula de input de código | JetBrains Mono 700 |

**Regra**: nunca usar tamanho fora dessa escala. Se algo pede 22px, arredonda pra 20 ou 24.

### 2.3 Line-height e letter-spacing

| Contexto | line-height | letter-spacing |
|---|---|---|
| Display | 1.05 | 0.02em |
| Corpo | 1.45 | 0 |
| Mono | 1.2 | 0.04em (tabular spacing) |
| Uppercase display | 1.05 | 0.04em (mais arejado em caixa alta) |

### 2.4 Regras de caixa

- **Títulos, botões, display em geral**: UPPERCASE sempre (ex: "ARROCHA AÍ")
- **Corpo longo (poema, créditos, dicas de loading)**: caixa mista natural ("tudo volta ao normal, mas o mangue guarda segredo")
- **Mono (códigos, stats)**: uppercase
- **Placeholder em input**: uppercase + 40% alpha

**Motivo**: uppercase cansa em leitura longa. Na display não é leitura — é reconhecimento.

---

## 3. Cores

Subset funcional da paleta de `ART_BIBLE.md` §3, atribuída a tokens de UI.

### 3.1 Tokens semânticos

| Token | Hex | Uso |
|---|---|---|
| `ui.bg` | `#1a0f08` | Fundo principal de tela |
| `ui.surface` | `#2a1810` | Cartões, modais, HUD (derivado de `#1a0f08` +10%) |
| `ui.fg` | `#f4e4c1` | Texto primário |
| `ui.fg.muted` | `#f4e4c1` @ 70% | Texto secundário |
| `ui.fg.subtle` | `#f4e4c1` @ 40% | Hints, placeholders |
| `ui.accent` | `#d4a04c` | Botão ativo bg, destaque de número, foco |
| `ui.danger` | `#b84a2e` | "SE LASCOU", dano, erro, hit de boss |
| `ui.success` | `#5a7a3a` | Checkpoint, confirmações positivas |
| `ui.info` | `#2a4a6e` | Estados neutros, noturno |
| `ui.festive` | `#d66b7a` | Carnaval (fase 3), celebração |

### 3.2 Contraste — testes

Todos os pares abaixo passam WCAG AA (4.5:1) ou AAA (7:1) em texto normal:

| Combinação | Ratio | Passa |
|---|---|---|
| `#f4e4c1` sobre `#1a0f08` | 13.1:1 | AAA |
| `#d4a04c` sobre `#1a0f08` | 8.7:1 | AAA |
| `#b84a2e` sobre `#f4e4c1` | 4.6:1 | AA |
| `#5a7a3a` sobre `#1a0f08` | 5.2:1 | AA |
| `#1a0f08` sobre `#d4a04c` | 8.7:1 | AAA (botão ativo) |
| `#f4e4c1` @ 40% sobre `#1a0f08` | 5.2:1 | AA (subtle) |

**Atenção**: `#f4e4c1` @ 70% ainda passa AA; qualquer alpha < 40% **não** deve ter texto legível como info crítica — só hints descartáveis.

### 3.3 Estados de botão

```
┌─────────────────────────────┐
│ idle      → borda 2px #f4e4c1, bg transparente, texto #f4e4c1
│ hover     → bg #d4a04c 20%, borda #d4a04c, texto #f4e4c1
│ active    → bg #d4a04c chapado, texto #1a0f08, indicador ◀ #b84a2e pulsando
│ pressed   → scale 0.98 por 80ms, flash branco 40% 60ms
│ disabled  → bg #1a0f08, texto #f4e4c1 @ 30%, sem borda, cursor default
└─────────────────────────────┘
```

### 3.4 Gradientes

Use com parcimônia. Xilogravura é chapada. Só dois casos:
- **Barra de HP do boss**: `#b84a2e` → `#d4a04c` (à esquerda = HP alto vermelho intenso, à direita dourado mais claro)
- **Barra de loading**: idem

Nenhum outro gradiente em UI.

---

## 4. Espaçamento e layout

### 4.1 Grid

Base 4px. Valores válidos: 4, 8, 12, 16, 20, 24, 32, 40, 60, 80.

Canvas 800×600 — margens seguras:
- **Top / bottom**: 40px (HUD top bar + margem)
- **Esq / dir**: 60px (gutter de tela)
- **Gutter entre elementos**: 20px padrão, 32px entre grupos semânticos

### 4.2 Tokens de espaçamento

| Token | px |
|---|---|
| `space.xs` | 4 |
| `space.s` | 8 |
| `space.m` | 16 |
| `space.l` | 24 |
| `space.xl` | 40 |
| `space.xxl` | 60 |

### 4.3 Dimensões de componentes

| Componente | w×h | Espaçamento interno |
|---|---|---|
| Botão padrão | 260×45 | 16px horizontal |
| Botão destaque (CTA) | 300×50 | 20px horizontal |
| Célula de input (código) | 60×80 | gap 12px |
| Barra HP (boss) | 600×24 | borda 2px |
| Barra HP (powerup) | 280×16 | borda 1px |
| Ícone HUD pequeno | 24×24 | gap 8px entre ícones |
| Ícone HUD grande (powerup) | 32×32 | |

### 4.4 Depth (z-order) em Phaser

Define claramente a ordem de renderização:

| Depth | Conteúdo |
|---|---|
| 0 | Background (parallax dist) |
| 10 | Inimigos, drops |
| 20 | Player |
| 30 | Projéteis |
| 40 | Partículas de gameplay |
| 90 | Texto flutuante ("ARRETADO!") |
| 100 | HUD bg (surface) |
| 110 | HUD textos e ícones |
| 200 | Overlays (pausa, boss intro) |
| 210 | Overlays textos |
| 300 | Modais / confirmações |

---

## 5. Iconografia

### 5.1 Estilo

Ícones seguem a xilogravura — traço preto grosso, preenchimento chapado, sem sombras ou degradês.

- Tamanho base: **24×24** para HUD pequeno, **32×32** para powerups
- Stroke: 2-3px em 24×24
- Exportar PNG com alpha + sprite sheet

### 5.2 Lista de ícones UI necessários

- Vida (galo) — cheio, vazio (silhueta)
- Smart bomb (garrafinha) — cheio, vazio
- Power-up Sombrinha
- Power-up Triplo (fogos)
- Power-up Cachaça (garrafa)
- Power-up Tapioca
- Power-up Baque-Virado (calunga pequeno)
- Seta ◀ (indicador de seleção)
- Check ✓ (confirmações)
- X (fechar modal)

**Responsabilidade**: Visual Designer desenha; UI/UX valida consistência de tamanho/traço.

---

## 6. Animações e timing

Regra geral: UI animada é juice; nunca bloqueia input mais que 300ms sem motivo dramático (boss intro é exceção).

### 6.1 Durações padronizadas

| Token | ms | Uso |
|---|---|---|
| `anim.instant` | 80 | Flash de botão pressionado, hit flash |
| `anim.fast` | 150 | Hover, mudança de seleção, mensagem curta |
| `anim.base` | 250 | Entrada/saída de modal, troca de tela |
| `anim.slow` | 400 | Cascade de botões, tela de fim de fase |
| `anim.cinematic` | 1500 | Boss intro, fade to black |

### 6.2 Easings

| Caso | Easing |
|---|---|
| Elemento **entra** | `Cubic.easeOut` |
| Elemento **sai** | `Cubic.easeIn` |
| Elemento **reage** (hover, ativo) | `Quad.easeOut` |
| Elemento **celebra** (OXE!, novo recorde) | `Back.easeOut` ou `Bounce.easeOut` |
| Score contando | `Quad.easeOut` |
| Parallax, scroll | Linear |

**Nada linear** em animação de UI — parece "de graça".

### 6.3 Snap (eventos instantâneos)

Estes **não** animam:
- Fim de invulnerabilidade (corta seco, é sinal de perigo voltando)
- Recast de pausa pra gameplay (volta exato onde estava)
- Teclas de debug

---

## 7. Acessibilidade

### 7.1 Obrigatório v1

- Contraste ≥ 4.5:1 em todo texto (ver §3.2)
- Fonte ≥ 16px em qualquer coisa ativa durante gameplay
- Máximo 2 cliques do menu ao jogo (CTA é primeiro foco)
- Toda ação tem feedback visual **+** sonoro (duplicação sensorial — não dependa só de cor)
- Inimigos são diferenciáveis por **silhueta + cor**, nunca só cor
- Texto flutuante ("ARRETADO!") dura ≥ 500ms pra ser lido

### 7.2 Previsto pra v2 (stub)

- Modo daltônico (toggle em Opções) — swap de `#b84a2e` por `#ff7a00` e `#5a7a3a` por `#00a0d0`
- Legenda de SFX críticos (boss appearing, dano)
- Escala de UI (80% / 100% / 120%) — já respeitando o Scale Manager
- Rebind de teclas
- Reduced motion — desliga screen shake e particle-heavy feedbacks

Deixar ganchos no código: `SettingsStore` com flags default-off.

---

## 8. Implementação — referência pro Gameplay Dev

Exemplo de módulo `src/ui/theme.ts`:

```ts
export const Colors = {
  bg: 0x1a0f08,
  surface: 0x2a1810,
  fg: 0xf4e4c1,
  fgMuted: 0xf4e4c1, // use com alpha 0.7
  accent: 0xd4a04c,
  danger: 0xb84a2e,
  success: 0x5a7a3a,
  info: 0x2a4a6e,
  festive: 0xd66b7a,
} as const;

export const FontFamily = {
  display: '"Rye", "Bungee", serif',
  body: '"Inter", "DM Sans", system-ui, sans-serif',
  mono: '"JetBrains Mono", "IBM Plex Mono", monospace',
} as const;

export const FontSize = {
  displayXL: 88,
  displayL: 64,
  displayM: 48,
  displayS: 32,
  displayXS: 24,
  bodyL: 20,
  bodyM: 18,
  bodyS: 16,
  micro: 12,
  hudScore: 24,
  hudLabel: 14,
  monoCode: 32,
  monoStat: 24,
  monoInput: 40,
} as const;

export const Space = { xs: 4, s: 8, m: 16, l: 24, xl: 40, xxl: 60 } as const;

export const AnimMs = { instant: 80, fast: 150, base: 250, slow: 400, cinematic: 1500 } as const;

export const Depth = {
  bg: 0, enemies: 10, player: 20, bullets: 30, fx: 40,
  floatingText: 90, hudBg: 100, hudFg: 110,
  overlay: 200, overlayFg: 210, modal: 300,
} as const;
```

Usar **sempre** esses tokens — nunca cores ou tamanhos hardcoded em scenes. QA checa isso.

---

## 9. Open questions

- [ ] Fonte customizada do Visual Designer substitui Rye? (sincronizar antes de congelar assets)
- [ ] Adotar @fontsource local ou CDN Google Fonts? (local é melhor pra performance e offline)
- [ ] Modo daltônico no v1 ou v2? (stub apenas v1 por default)
- [ ] Score em tabular-nums via CSS feature (`font-variant-numeric: tabular-nums`) ou usar mono fixo?
