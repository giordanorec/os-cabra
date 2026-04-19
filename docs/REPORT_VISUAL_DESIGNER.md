# Report — Visual Designer

> Relato de milestones do Visual Designer do projeto *Os Cabra*. Atualizado a cada entrega.

## Milestone 1 — Mood board, paleta, style guide (2026-04-19)

### Entregáveis

| Arquivo | Conteúdo |
|---|---|
| `docs/refs/REFS.md` | 30 referências curadas (J. Borges, Samico, cordel, carnaval PE) com URLs institucionais |
| `docs/refs/xilogravura/README.md` | Convenção de nome + regra de licenças para imagens futuras |
| `docs/palette.md` | Paleta definitiva de 7 cores + variantes + paletas por fase |
| `docs/STYLE_GUIDE.md` | 1 página de regras: traço, preenchimento, textura, silhueta, animação, checklist |
| `docs/VISUAL_LICENSES.md` | Template de tracking (assets finais, referências, fontes, prompts IA) |
| `docs/AI_SETUP.md` | Setup Gemini 2.5 Flash Image + Flux fallback + ferramentas de pós |

### Decisões de direção

1. **Paleta**: mantida a proposta do `ART_BIBLE.md §3` (7 cores), **adicionada camada de shades derivados** (não novas cores, lerps com preto/papel) para permitir contorno fino e shading sem estourar a restrição. Decidido também **paletas por fase** filtrando a base — inimigos mantêm suas cores (legibilidade), fundo/UI respeita o filtro.
2. **Traço**: espessura de outline proporcional ao tamanho do sprite (3px para pequenos, até 6px para bosses). Traço *irregular*, não vetorial — critério de rejeição explícito.
3. **Textura de madeira**: só em áreas médias/grandes, com moderação em sprites pequenos. Evita ruído visual em 32×32.
4. **Silhueta**: obrigatório ser legível a 32×32, elementos distintivos fora da silhueta central.
5. **Fallback documentado**: cartoon hand-drawn (*O Menino e o Mundo*) se xilogravura falhar após 3 tentativas por personagem — aplicado a **todo** o jogo se acionado, nunca misturar.

### O que ainda não foi feito (e por quê)

**Fase C (geração por IA) e D (pós-processamento) ficaram fora do M1** por decisão de escopo:

- Execução exige chave `GEMINI_API_KEY` que o usuário ainda não configurou. `docs/AI_SETUP.md` documenta o passo-a-passo para quando o usuário criar a chave.
- Pós-processamento (Photopea, remove.bg, Aseprite) é majoritariamente manual. Um agente sem browser interativo não fecha bem esse loop; vale acionar um fluxo dedicado (ver `docs/TOOLS.md` — Playwright MCP para automação) ou execução humana.
- **Imagens de referência**: `REFS.md` lista 30 URLs institucionais mas o diretório `docs/refs/xilogravura/` está **vazio** — o download físico de cada imagem precisa ser feito com um navegador real (ou sessão com Playwright) para avaliar licença caso-a-caso antes de commitar. Só URLs estão seguros neste momento.

### Questões abertas para o orquestrador

- [ ] **Quem executa o download das refs?** Opções: (a) humano, (b) sessão com Playwright MCP, (c) adiar para quando a Fase C começar e gerar arte direto sem style-ref literal
- [ ] **API key do Gemini**: configurar agora ou só quando for rodar Fase C? Custo estimado: ~$25-35 para o jogo completo (ver `docs/AI_SETUP.md`)
- [ ] **Contato com família J. Borges?** Se quisermos usar obras dele como style-ref literal (não só inspiração), o respeitoso é avisar o Memorial J. Borges. Alternativa: usar só o *estilo* genérico "xilogravura de cordel" nos prompts
- [ ] **Tipografia**: escolher entre Rye / Bungee / Modak (Google Fonts) agora ou testar durante M2?

### Próximo milestone sugerido (M2)

**Concept art + hero frame do player + 3 inimigos da Fase 1** (Passista de Frevo, Caboclinho, Mosca-da-Manga), usando Gemini. Entregar:
- 1 imagem "hero" aprovada de cada → base para geração de frames
- Sprite `player_idle.png` 128×128 PNG alpha final
- 3 sprites `enemy_<nome>_idle.png` 96×96 PNG alpha final
- Spritesheet preliminar `player.atlas.json` (ainda que com só idle)

Pré-requisitos: chave Gemini configurada + pelo menos 5-10 imagens de referência baixadas e licenciadas em `docs/refs/xilogravura/`.

---

## Milestone 2 — Concept art + sprites Fase 1 + boss Fase 1 (2026-04-19)

### Entregáveis

| Asset | Formato | Frames | Caminho |
|---|---|---|---|
| Player (Galo da Madrugada) | atlas PNG + JSON | 3 (voo idle) | `public/assets/sprites/player.{png,json}` |
| Inimigo: Passista de Frevo | atlas | 2 (sway) | `public/assets/sprites/enemy-passista.{png,json}` |
| Inimigo: Caboclinho | atlas | 2 (idle / arco esticado) | `public/assets/sprites/enemy-caboclinho.{png,json}` |
| Inimigo: Mosca-da-Manga | atlas | 2 (asas) | `public/assets/sprites/enemy-mosca.{png,json}` |
| Boss: Maracatu Nação | atlas | 1 (hero, trio Calunga+Rei+Rainha) | `public/assets/sprites/boss-maracatu.{png,json}` |
| Variantes HiDPI @2× | PNG | todos | `public/assets/sprites/@2x/*.png` |
| SVG fonte | SVG | 1 por personagem | `scripts/art/svg/*.svg` |
| Pipeline | Node/sharp | — | `scripts/art/generate-sprites.mjs` (`npm run sprites`) |
| Guia de integração | MD | — | `public/assets/sprites/README.md` |

### Pipeline escolhido — SVG hand-drawn, não IA

Gemini API ainda não configurada. Ao invés de bloquear M2, produzi os sprites via **SVG hand-drawn com disciplina de paleta**, renderizados por `sharp` em PNG + atlas JSON Phaser-compat.

**Prós:**
- Determinístico, regenerável (`npm run sprites` refaz tudo)
- Paleta estritamente respeitada (sem pós-processamento manual)
- Fonte versionada em git (SVG é diff-friendly)
- Zero custo de API
- Tamanhos batem exatamente com os placeholders do Gameplay Dev — swap 1:1 em M8

**Contras:**
- Estilo é **xilogravura-inspired** mais do que xilogravura autêntica — faltam as imperfeições de entalhe que só IA ou hand-drawn real produzem
- Boss Maracatu tem só hero frame (sem estados de HP ou frames de ataque ainda)
- Textura de madeira ausente — sprites têm áreas chapadas sem grain

Se o orquestrador avaliar que o look "não é xilogravura suficiente", o caminho é configurar Gemini API e rerodar M2 com IA. Os SVGs entregues funcionam como **baseline jogável** enquanto isso.

### Decisões de direção tomadas

1. **Tamanho = placeholder atual** (32/32/28/14 px). Gameplay Dev não precisa ajustar nada em `src/config.ts` — hitbox, scale, colisão permanecem.
2. **Atlas JSON Hash format** (não spritesheet uniforme) — permite futuro trim e variação por frame sem quebrar o API.
3. **Frame naming `<key>-<index>`** — compatível com `this.anims.generateFrameNames()` nativo.
4. **Variantes @2×** geradas mas não usadas ainda. Guardadas em `@2x/` para o caso de mobile/Retina v2.
5. **Player top-down** (jogador olhando a nave por cima) — coerente com shoot 'em up vertical. Asas visíveis nos lados, bico/crista apontando pra cima.
6. **Boss trio com hierarquia visual**: Rei central maior com coroa mais alta e manto vermelho, Rainha à direita com manto rosa, Calunga menor à esquerda — legível mesmo em 128×128.

### Pendências (M3+)

- [ ] **Boss Maracatu: variações de HP e ataques** — atualmente só hero. Solicitar ao Gameplay Dev se vão precisar de 3 estados (100%/66%/33%) ou se o efeito vai vir via tint
- [ ] **Frames de morte/dano** — todos os inimigos ganham tint branco 80ms via `EffectsManager`. Se quiser frame dedicado de morte (dissolução em fragmentos xilográficos), é M7 (polish pass)
- [ ] **Tiros e projéteis** — `bullet-player`, `enemy-bullet-flecha`, `enemy-bullet-bombinha` ainda placeholders. Pequeno escopo, cai em M3
- [ ] **Power-ups** — 5 ícones (sombrinha, cachaça, tapioca, fogo de artifício, calunga). Requisito quando Gameplay Dev ativar sistema de drop
- [ ] **Parallax backgrounds** — 2-3 camadas da Fase 1 (Marco Zero). Não incluídos em M2 por escopo

### Para o orquestrador

Gameplay Dev (em `feat/milestone-3-boss-maracatu`) pode começar a integrar **agora** via:

```ts
this.load.atlas('boss-maracatu', 'assets/sprites/boss-maracatu.png', 'assets/sprites/boss-maracatu.json')
```

Instruções completas em `public/assets/sprites/README.md`. Não precisam esperar M8 — os 5 assets de Fase 1 já estão prontos pra consumo, e a troca de placeholder é 1:1.

---

_Próximas entradas abaixo conforme milestones avançam._
