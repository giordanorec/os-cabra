# Relatório — UI/UX Designer

> Branch: `feat/ux-v1` · Data: 2026-04-19

## Entregáveis

### Concluídos

- **Wireframes das 14 telas** → [`docs/wireframes/`](wireframes/) + [`README.md`](wireframes/README.md) índice
  - 01 Splash, 02 Menu, 03 Códigos, 04 Preload, 05 Intro Fase, 06 Gameplay, 07 HUD (detalhado), 08 Pausa, 09 Checkpoint, 10 Boss Intro, 11 Boss Defeated, 12 Fim de Fase, 13 Game Over, 14 Vitória
  - Cada arquivo traz layout ASCII anotado com coordenadas 800×600, hierarquia, elementos com fonte/cor/tamanho, transições e notas de implementação
- **Glossário PT-BR pernambucano** → [`docs/GLOSSARY_PT_BR.md`](GLOSSARY_PT_BR.md)
  - ~120 strings organizadas em 18 seções (menu, HUD, feedback, bosses, dicas de loading, créditos, erros…)
  - Chaves hierárquicas prontas pra `Strings.ts`
  - Variações (ex: 7 mensagens de Game Over, 6 de pickup) pra dar vida
- **UI Style Guide** → [`docs/UI_STYLE_GUIDE.md`](UI_STYLE_GUIDE.md)
  - Tipografia final: Rye + Inter + JetBrains Mono
  - Escala tipográfica (14 tokens de tamanho), paleta semântica (10 tokens), espaçamentos (6 tokens), animação (5 durações + easings), depth Phaser
  - Snippet `src/ui/theme.ts` pronto pra colar
- **HUD spec pixel-perfect** → [`docs/wireframes/07-hud.md`](wireframes/07-hud.md) + `UX_SPEC.md` §3 expandido
  - Coordenadas exatas em 800×600 de cada elemento (vidas, score, multiplicador, bombs, barra de powerup)
  - Estados, animações de transição e comportamento por evento
- **Tabela de transições e feedback** → `UX_SPEC.md` §6 e §8 expandidos
  - §6: 18 feedbacks com trigger, duração, easing, descrição, SFX
  - §8: 20 transições entre cenas com trigger, duração, easing, descrição
- **UX_SPEC.md atualizado**: entregáveis marcados, open questions em §10 respondidas ou reclassificadas

## Decisões de direção

1. **Wireframes em ASCII/Markdown em vez de PNG/Figma** — entrega via Claude Code não tem saída de imagem nativa; ASCII preserva coordenadas exatas de um jeito que o Gameplay Dev pode ler direto, funciona como briefing pra qualquer ferramenta se a equipe quiser PNGs depois. Evita custo alto pra ganho baixo no estágio atual (pré-implementação).
2. **Fonte display: Rye** (e não Bungee/Modak) — letterforms "carvadas" casam com xilogravura; Bungee é clean demais, Modak é bolhosa. Rye tem só 1 peso, compensamos com stroke/outline quando precisar de ênfase. **Pendente validação com Visual Designer** caso ele queira fonte customizada.
3. **Caixa alta só em display/botões**; corpo longo (poema, créditos, dicas) em caixa mista — uppercase em parágrafo cansa, viola restrição de legibilidade.
4. **Cores de UI = subset semântico da paleta de arte** — `ART_BIBLE.md` §3 define a paleta física; este doc mapeia pra tokens funcionais (`ui.accent`, `ui.danger`, `ui.success`, etc). Garante coerência e dá contraste acessível (tudo ≥ 4.5:1).
5. **~120 strings no glossário (vs ~100 pedidas)** — cobrir 7 variações de Game Over, 6 de pickup, 12 dicas de loading, 18 categorias, ainda sobra respiro pro Game Designer adicionar. Absurdo e referências internas preservadas onde fazem sentido (créditos são a vitrine disso).
6. **HUD depth em Phaser ≥ 100; overlay ≥ 200; modal ≥ 300** — layers explícitas no style guide para o Gameplay Dev seguir.
7. **Feedbacks sempre em visual + sonoro** (redundância sensorial) — acessibilidade básica sem depender de toggle.
8. **Score em 6 dígitos com padding zero** (`012.340`) — sempre mesma largura, evita que número "dance" no HUD ao variar.

## Conflitos / sincronizar com Visual Designer

**Levantar antes da produção de assets**:

1. **Fonte display** — Rye é default. Se o Visual Designer gerar/especificar um lettering custom de cordel (via IA ou manual), substituir Rye. Travar antes dele exportar título do jogo com fonte errada.
2. **Ícones de UI em xilogravura** — UI precisa de set completo (vida, bomb, 5 powerups, seta, check, X). Traço precisa bater com sprites de inimigos (mesmo stroke weight). Responsabilidade do Visual Designer desenhar; UI/UX valida consistência.
3. **Logo "OS CABRA"** — UI espera 240×80 (header de menu) e versão maior 320×120 (splash). Confirmar que Visual Designer entrega em escalas consistentes.
4. **Barra de HP do boss** — UI usa gradient `#b84a2e → #d4a04c`. Xilogravura é chapada; gradient é uma das **únicas** exceções permitidas (junto com barra de loading). Alinhar que isso não fere a direção.
5. **Paleta funcional vs arte** — adicionei `ui.success = #5a7a3a` como semântica de "ok" (checkpoint, confirmação). Já existe no ART_BIBLE como "verde folha", mas o uso em UI é novo — confirmar se combina com direção.
6. **Dimensões de sprite** — wireframes assumem player 64×64, inimigo pequeno 64×64, médio 96×96, grande 128×128, boss 256+. Alinhar com tabela de asset sizes do `ART_BIBLE.md` §6.

## Questões abertas pro orquestrador

1. **Plan de escrita final dos textos** — glossário está pronto mas alguns trechos (créditos, poema da vitória) são placeholders. Orquestrador quer liberar o Visual Designer pra ler antes de fechar ou deixar texto "bom o bastante" pra implementar já?
2. **Tutorial vs microtexto no preload** — decidi cortar tutorial completo (restrição diz "nada de tutorial longo"). Mas preciso que o Gameplay Dev confirme se microtexto de controles no Preload de fase 1 (12px no rodapé) é suficiente ou se fase 1 pede overlay fantasma demonstrando movimento.
3. **Near-miss feedback** (passar raspando por projétil) — listei como "opcional v2" no feedback §6. Vale investir? Requer hitbox estendida + detecção + slow-mo de 150ms. Alto retorno de game feel mas custo não-trivial.
4. **Legibilidade dos regionalismos pra quem não é PE** — o jogo é pessoal, ok. Mas algumas strings ("ARROCHA AÍ" no botão primário) podem deixar o não-pernambucano travado. Orquestrador tem apetite pra fazer um teste rápido com 2-3 pessoas não-PE antes de implementar, ou só segue?
5. **Storage desativado (navegador bloqueou)** — glossário prevê mensagem, mas o fluxo não está totalmente desenhado (Game Over sem highscore, sem código — só Score local?). Pedir Game Designer / Gameplay Dev pra confirmar graceful degradation.
6. **Boss defeated recap timing** — 2.5s pode ser muito pra quem joga a segunda vez. Considerar adicionar skip com tecla após 500ms? (similar ao que já fazem boss intro, intro fase).

## Validações recomendadas

- Testar wireframes numa janela real 800×600 antes de implementar — alguns botões estão no limite de tamanho pra texto ("CÓDIGOS DOS CABRA" em display.xs cabe? medir)
- Ler textos em voz alta — "ARROCHA AÍ" tem cadência? "QUEM FEZ ESSE TRAÇADO" cabe em uma linha?
- Checar contraste em monitor real (Photopea ou browser devtools com tela de baixo brilho)
- Confirmar com Sound Designer que há um SFX por cada evento listado em §6 do UX_SPEC (ou marcar quais podem compartilhar)

## Arquivos tocados nesta branch

```
docs/GLOSSARY_PT_BR.md          NEW
docs/UI_STYLE_GUIDE.md          NEW
docs/REPORT_UX_DESIGNER.md      NEW (este)
docs/UX_SPEC.md                 MODIFIED (§3, §4, §5, §6, §8, §9, §10)
docs/wireframes/README.md       NEW
docs/wireframes/01-splash.md    NEW
docs/wireframes/02-menu-principal.md   NEW
docs/wireframes/03-codigos.md   NEW
docs/wireframes/04-preload.md   NEW
docs/wireframes/05-intro-fase.md   NEW
docs/wireframes/06-gameplay.md  NEW
docs/wireframes/07-hud.md       NEW
docs/wireframes/08-pausa.md     NEW
docs/wireframes/09-checkpoint.md   NEW
docs/wireframes/10-boss-intro.md   NEW
docs/wireframes/11-boss-defeated.md   NEW
docs/wireframes/12-fim-de-fase.md   NEW
docs/wireframes/13-game-over.md NEW
docs/wireframes/14-vitoria-final.md   NEW
```

**Não toquei**: `docs/GDD.md` (está com alterações WIP do Game Designer na branch paralela; stash + switch preservou).
