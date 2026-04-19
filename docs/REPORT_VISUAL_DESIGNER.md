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

_Próximas entradas abaixo conforme milestones avançam._
