# QA Plan — Os Cabra

> **Responsável**: QA/Tester. **Lê também**: Gameplay Developer, Game Designer.
> **Depende de**: `GDD.md` (comportamento esperado), `TECH_SPEC.md` (stack).

## 1. Escopo

Jogo roda em browser desktop. Testamos 4 navegadores, 2 resoluções de janela, 1 fluxo principal de jogo, edge cases comuns.

**Testes automatizados via Playwright MCP** — ver [`TOOLS.md`](TOOLS.md). O QA usa Playwright pra automatizar smoke tests repetitivos (navegar menu, iniciar jogo, atirar, screenshots) e liberar tempo humano pra playtest de fun factor. Vitest pros sistemas puros (ScoreManager etc.) fica pra v2 se o projeto crescer.

## 2. Ambiente de teste

| Dimensão | Alvos |
|---|---|
| Browsers | Chrome/Chromium estável, Firefox estável, Safari 17+, Edge estável |
| OS | Linux (Ubuntu), macOS, Windows 11 |
| Resoluções de janela | 1366×768 (notebook comum), 1920×1080 (desktop) |
| Hardware | Notebook mediano (Chromebook-like), desktop com GPU |
| Rede | N/A (jogo offline, sem backend) |

## 3. Categorias de teste

### 3.1 Smoke (a cada build)
Checklist rápido (~5 min) pra garantir que nada óbvio quebrou. **Automatizar via Playwright MCP** sempre que possível:

- [ ] `npm run dev` abre e carrega sem erros no console (Playwright verifica `page.on('pageerror')`)
- [ ] Menu aparece corretamente (screenshot + inspeção visual)
- [ ] Enter inicia jogo (Playwright `page.keyboard.press('Enter')` + screenshot)
- [ ] Player se move nas 2 direções (arrows via Playwright + screenshots)
- [ ] Tiro sai e destrói pelo menos 1 inimigo
- [ ] ESC pausa e retoma
- [ ] Game Over funciona
- [ ] `npm run build` produz `dist/` sem erro

Salvar screenshots em `docs/qa_screenshots/milestone_N/` pra comparação visual entre milestones.

### 3.2 Regression (a cada milestone)
Checklist completa, ~45 min. Percorre todo o jogo fim a fim:

- Todos os 8 inimigos spawnam e atacam corretamente
- Todos os 3-5 bosses: padrões de ataque, transição de HP, derrota
- Todos os 5 power-ups: pegar, efeito ativo, término
- Checkpoints: morrer depois do checkpoint volta pra ele, não pro início da fase
- Game Over: código é gerado, tela de "SE LASCOU" aparece, Enter volta ao menu
- Highscore: persiste após reload, é atualizado se bater
- Audio: música toca, SFX tocam, pause silencia
- Pausa: jogo congela completamente, resume retoma estado exato

### 3.3 Playtest (fun factor)
Além de "funciona", avaliar:

- Uma fase inteira é divertida do início ao fim?
- A dificuldade aumenta de forma justa ou trava inesperadamente?
- Os power-ups fazem diferença perceptível?
- O boss é memorável?
- O humor dos textos funciona ou é só "engraçadinho"?
- Você quis jogar de novo?

Ideal: **3-5 playtesters diferentes** por milestone.

### 3.4 Perf
- FPS deve se manter >= 55 na maior parte do tempo em hardware-alvo
- Pico de inimigos em tela (~20 + 20 bullets) não pode cair abaixo de 45 FPS
- Sem memory leak: jogar 30 min seguidos e verificar via DevTools memory panel

## 4. Casos de teste chave

### TC-001 — Player move e atira
- **Dado**: estou na GameScene
- **Quando**: pressiono ← / →
- **Então**: nave move suavemente, respeita limites da tela
- **E quando**: pressiono Espaço
- **Então**: tiro sai em intervalos de ~220ms, destrói inimigo que atingir

### TC-002 — Colisão com inimigo
- **Dado**: estou jogando com 3 vidas
- **Quando**: um inimigo toca no player
- **Então**: perdo 1 vida, fico invulnerável por 1.5s (piscando), HUD atualiza
- **Edge**: se levar hit enquanto invulnerável, não perde vida

### TC-003 — Power-up pickup
- **Dado**: destruí um inimigo que dropou Fogo de Artifício Triplo
- **Quando**: passo em cima do drop
- **Então**: HUD mostra "FOGO DE ARTIFÍCIO TRIPLO", meus tiros viram leque de 3
- **E**: ao levar dano, power-up volta ao tiro normal

### TC-004 — Checkpoint
- **Dado**: passei do ponto médio da Fase 2
- **Quando**: morro (perco 1 vida) depois do checkpoint
- **Então**: volto pro ponto do checkpoint com as vidas que tinha quando passei nele
- **E**: se morro TODAS as vidas, vai pra Game Over (não reaproveita checkpoint)

### TC-005 — Highscore persiste
- **Dado**: joguei e fiz score 15.000, recorde anterior era 10.000
- **Quando**: recarrego o navegador
- **Então**: menu mostra recorde = 15.000
- **E**: localStorage tem chave `os_cabra_highscore` atualizada

### TC-006 — Código de partilha
- **Dado**: terminei jogo com score X
- **Quando**: vejo tela de Game Over
- **Então**: um código de 6 caracteres alfanuméricos é exibido
- **E**: posso copiar com um clique/botão
- **E**: na tela de Códigos, colar esse código mostra o score X

### TC-007 — Pausa congela
- **Dado**: estou no meio de uma onda
- **Quando**: pressiono ESC
- **Então**: tudo congela (inimigos, projéteis, animações)
- **E**: tocar ESC de novo OU Enter retoma do mesmo frame

### TC-008 — Boss com 3 fases
- **Dado**: cheguei no boss da Fase 1
- **Quando**: reduzo HP do boss a 2/3
- **Então**: muda pro padrão Fase 2 do boss
- **E**: ao reduzir pra 1/3, muda pro padrão Fase 3
- **E**: ao matar, tela "SE FOI" + bônus de score

## 5. Bugs conhecidos — prever

- Phaser 4 é recente — possíveis APIs que mudaram do 3. Verificar docs na primeira implementação
- Safari tem quirks com áudio (requer interação do usuário pra iniciar AudioContext). **Testar especificamente**
- Canvas pixel rendering em displays HiDPI pode ficar borrado — `image-rendering: pixelated` cuida, mas conferir no Mac

## 6. Bug report template

```markdown
### [Tipo: Bug/UX/Perf] Título curto

**Severidade**: P0 / P1 / P2 / P3
**Ambiente**: Chrome 120 / Ubuntu / 1920x1080
**Build/commit**: abc1234

**Passos**
1. ...
2. ...
3. ...

**Esperado**: ...
**Observado**: ...

**Console errors**: (colar)
**Screenshot/gif**: (anexar)
**Frequência**: sempre / às vezes / 1x apenas
```

Severidades:
- **P0**: jogo não inicia / crash frequente / perda de progresso
- **P1**: feature principal quebrada (não mata inimigo, boss não aparece)
- **P2**: feature secundária quebrada ou UX ruim
- **P3**: cosmético, polish

## 7. Entregáveis do QA

1. **Matriz de compatibilidade** preenchida (browsers × OS × resoluções, pass/fail)
2. **Log de playtest** — notas de cada sessão, especialmente sobre fun factor
3. **Bug tracker** — issues no GitHub do repo
4. **Relatório de performance** — FPS mínimos observados

## 8. Open questions

- [ ] Vale a pena investir em testes automatizados (Vitest) pros sistemas puros?
- [ ] Quantos playtesters externos vamos conseguir realisticamente?
