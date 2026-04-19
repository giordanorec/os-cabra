# Report — Game Designer (iteração 1)

> Branch: `feat/game-design-v1` · Data: 2026-04-19

## 1. Decisões tomadas (com justificativa resumida)

| # | Decisão | Justificativa |
|---|---|---|
| 1 | HP dos inimigos mantidos (tabela §5) | A progressão 1/2/3/4/5 HP já desenha uma hierarquia de ameaça legível; nenhum playtest ainda justifica mexer |
| 2 | **1 vida de dano por hit, regra universal** (§5.1) | Shoot'em up clássico vive de legibilidade — dano fracionário confunde. Dificuldade fica no *tipo de trajetória*, não no número |
| 3 | Tabela de trajetórias/velocidades de projéteis inimigos adicionada (§5.1) | Dá ao Gameplay Dev um contrato mensurável; cada projétil tem hitbox + comportamento definido |
| 4 | **Drop rate 15%** em inimigos 2+ HP; **inimigos 1 HP não dropam** (§7) | Evita piñata em ondas de enxame e dá peso aos inimigos "gordos" |
| 5 | Drop ponderado 35/30/20/12/3 por tipo de power-up (§7) | Fogo Triplo e Sombrinha frequentes (ofensa/defesa básicos); Tapioca raro (+1 vida não pode ser comum); Tapioca **garantida** em bosses 2 e 4 como backstop de RNG |
| 6 | Fogo Triplo é **leque fixo ±18°**, sem homing (§7) | Homing quebraria o skill ceiling arcade; ângulo estreito permite mira + clear de onda |
| 7 | Invulnerabilidade pós-dano: **1.2s** (↓ de 1.5s) + pisca 8Hz (§8) | 1.5s em testes mentais "apaga" a sensação de perigo em fases densas; 1.2s mantém tensão. Sobe para 1.35s se playtest acusar punitividade |
| 8 | **Bosses com HP e padrões numéricos nos 3 terços**, timings definidos (§6.1–6.5) | Gameplay Dev não deveria "inventar" o ritmo do boss. Cada padrão tem cadência (s), velocidade (px/s), telegrafe |
| 9 | **Projétil teleguiado de Calunga é destrutível** (3 tiros) (§6.1 Fase B) | Dá agência ao player em vez de apenas dodge — recompensa quem entende a mecânica |
| 10 | **Corpo do Homem da Meia-Noite é invulnerável enquanto ambos os braços existem** (§6.2) | Cria decisão tática (matar braço certo vs. continuar evadindo); justifica o boss ter 3 HP bars |
| 11 | **Boss final continua O Coronel** (§6.5) | O anti-clímax satírico é a graça; trocar perderia a identidade cultural. Figura secreta pode entrar em v2 NG+ |
| 12 | **Uma música por fase + remix do mesmo tema no boss** (§11.1) | Trilha evolutiva é caro de compor; remix mantém coesão com custo baixo |
| 13 | Curva de dificuldade ganha coluna de **intervalo entre ondas** e **duração alvo** (§10) | Dá ao Gameplay Dev e QA um alvo verificável além de "ficar legal" |
| 14 | **Wave 4 da Fase 1 sem drop** (intencional) | Primeiro power-up só aparece na Fase 2 (onde surge Mamulengo 2 HP). Força Fase 1 a ser "seca" e ensinar o core loop antes dos amplifiers |
| 15 | Checkpoint **depois de uma wave fácil** (regra geral §10) | Se checkpoint vier antes de pico de dificuldade, sensação vira "cheating" |

## 2. Arquivos alterados/criados

- **Modificado**: `docs/GDD.md`
  - §5 complementada com §5.1 (dano e trajetórias de projéteis)
  - §6 reescrita: cada boss com 3 fases numéricas (HP, cadência, velocidade, telegrafes); subseção §6.6 com regras gerais
  - §7 com drop rate ponderado e regras de coleta detalhadas
  - §8 com invulnerabilidade ajustada e semântica de checkpoint detalhada
  - §10 com nova tabela de curva + regras de pacing
  - §11.1 nova (diretriz musical)
  - §12 reescrita: agora "Decisões fechadas" + questões remanescentes

- **Criado**: `docs/waves/fase1.md`
  - 5 waves detalhadas (nome, objetivo didático, composição, coordenadas, overrides)
  - Breather pré-boss, contrato de tipos sugerido, contingências (anti-turtle, Game Over no checkpoint)
  - Constantes sugeridas para `src/config.ts` (prefixo `FASE1`)

- **Criado**: `docs/REPORT_GAME_DESIGNER.md` (este arquivo)

## 3. Questões em aberto para o arquiteto

- [ ] **Tecla do smart bomb (Cachaça Boa)**: escolhi `X` como placeholder — se o UX/arquiteto preferir outra (ex: `Z`, `Shift`), revisar em `UX_SPEC.md` e `InputManager`
- [ ] **Chain multiplier decay**: §9 diz "×1.5 temporário" mas não quanto dura. Sugiro **reset após 4s sem matar**; precisa confirmação com QA
- [ ] **Ordem de spawn do boss**: boss sobe ao limpar wave final + 3s de breather. Implementação em `EnemySpawner` precisa desse hook — arquiteto decide se é estado interno do spawner ou evento global
- [ ] **Anti-turtle**: spec sugeriu timeout de 30s sem spawn → força mini-onda. É regra de Fase 1 ou global? Fechar com Gameplay Dev
- [ ] **Tapioca garantida em bosses 2 e 4**: se as fases 4-5 ficarem fora do escopo v1, Fase 2 fica com drop único e Fase 3 não tem drop de boss — ok, ou promover Fase 3 também?
- [ ] **Playtest milestones**: eu recomendo dois balance passes (após Milestone 2 e Milestone 6 do `TECH_SPEC` §11). Arquiteto/PM decide cadência real

## 4. Sugestões fora de escopo (v2+)

- **New Game Plus** com "Fase Secreta" antes/depois do Coronel — substituiria ou complementaria o boss final com figura alternativa (sugestões: Velho do Saco corrompido, ou o próprio Galo da Madrugada *benigno* como twist)
- **Score attack mode**: fases em loop com modificadores (ex: sem power-up, velocidade ×1.5, 1 vida só) — reaproveita 100% do conteúdo
- **Cosméticos de player**: skins do galo (galo-de-briga, galo-d'angola, galo-pintado) desbloqueados por milestone de score — sem mudar gameplay, só charme
- **"Modo Arrocha"**: dificuldade insana para speedrunners, inimigos +2 HP, tiros 1.5× mais rápidos
- **Vídeo-intro em xilogravura animada** (5-10s) antes do menu, conta a "lenda" da corrupção bio-orgânica
- **Leaderboard assíncrono** via códigos (já previsto no GDD §9) — evolução: um pequeno hub estático (GitHub Pages) que aceita códigos e mostra ranking semanal. Zero backend, zero custo
- **Modo daltônico plugado**: já previsto no `UX_SPEC` §7; se entrar no v2, afeta design de inimigo (silhueta + padrão de tinting precisa compensar cor)

---

**Próximo passo sugerido (arquiteto)**: revisar o PR de `feat/game-design-v1`, consolidar com QA para gerar casos de teste a partir das novas tabelas numéricas (§5.1, §6, §7), e instruir Gameplay Dev para que Milestone 2 (Fase 1 jogável) implemente `docs/waves/fase1.md` literalmente, sem "melhorias" silenciosas — se precisar ajustar, que volte para cá.
