# Ferramentas — Claude Code + Phaser 4

Este documento descreve as ferramentas **além** do Node/Vite/Phaser que usamos para acelerar o desenvolvimento.

## 1. `phaser4-gamedev` — plugin do Claude Code

**O que é**: plugin oficial para Claude Code que injeta conhecimento profundo de Phaser 4 na sessão. Não é um MCP e não é um gerador autônomo — é conhecimento empacotado.

**O que traz**:
- **4 agentes especialistas**:
  - `phaser-architect` — planejamento de cenas e arquitetura
  - `phaser-coder` — implementação idiomática em Phaser 4
  - `phaser-debugger` — diagnóstico de bugs (sprite invisível, física estranha, etc)
  - `phaser-asset-advisor` — decisões sobre assets e pipeline
- **14 skills** (slash commands) — ex: `/phaser-scene`, `/phaser-physics`, `/phaser-audio`, `/phaser-input`, etc.
- **4 comandos de projeto**: `/phaser-new`, `/phaser-run`, `/phaser-validate`, `/phaser-build`
- **2 hooks**, incluindo um guard que **bloqueia código usando APIs depreciadas do Phaser 3** antes do arquivo ser salvo — evita bugs sutis ao migrar conhecimento de v3 pra v4

**Instalação** (no próprio Claude Code):
```
/plugin marketplace add Yakoub-ai/phaser4-gamedev
/plugin install phaser4-gamedev@phaser4-gamedev
```

Escolha escopo **User** — vale pra todos os projetos. Verifique com `/plugin list`.

**Nota de maturidade**: plugin recente (poucas estrelas no GitHub). Funcional, mas não battle-tested. Se falhar em algum cenário, o Gameplay Dev pode trabalhar sem ele — é acelerador, não dependência.

**Quando usar**:
- Comece cada sessão de Gameplay Dev mencionando: "use os agentes `phaser-*` quando apropriado"
- Para implementar uma cena nova: `/phaser-scene` (ou equivalente — ver `/plugin list` pra ver skills instaladas)
- Para diagnosticar bug visual: peça ao `phaser-debugger` pra diagnosticar
- Para decisão de arte: `phaser-asset-advisor`

## 2. Playwright MCP — "olhos" no browser

**O que é**: MCP server oficial da Microsoft. Dá ao Claude Code ferramentas de automação de browser — abrir URL, clicar, digitar, tirar screenshot, ler console.

**Por que é importante pra este projeto**: fecha o loop de feedback visual. Sem Playwright:
```
Dev escreve código → usuário roda → usuário reclama → dev ajusta → ...
```
Com Playwright:
```
Dev escreve código → dev roda dev server → dev abre browser → dev vê resultado
                                                          → dev ajusta → dev testa de novo
                                                          → dev entrega quando funcionou
```

**Instalação** (via terminal):
```bash
claude mcp add playwright -- npx @playwright/mcp@latest
```

Na primeira execução, o Playwright baixa browsers (~200 MB, Chromium).

**Quando usar**:
- **Gameplay Developer**: antes de entregar qualquer milestone, valida visualmente usando Playwright (abre http://localhost:5173, joga, lê console)
- **QA/Tester**: automatiza smoke tests repetitivos — ex: navegar menu → começar jogo → atirar → tirar screenshot → comparar com referência

**Limitações**:
- Roda em Chromium por padrão (outros browsers exigem config extra)
- Audio não é testável via Playwright (usar teste manual pra áudio)

## 3. Outras ferramentas úteis já instaladas

- **`gh` (GitHub CLI)** — autenticado como `giordanorec`. Uso: criar repos, PRs, issues
- **`git` 2.43** — versionamento
- **Node 22** + **npm 10** — runtime
- **dev-browser skill** (Claude Code built-in) — alternativa leve ao Playwright pra browsing rápido

## 4. O que NÃO usamos (e por quê)

- **Godogen** (pra Godot) — nosso fluxo é conversacional/evolutivo, não batch
- **Unity MCPs** — Unity não está no stack
- **Minecraft MCP Server mod** — projeto diferente, não encaixa em "Os Cabra". Pode ser um projeto paralelo divertido pro usuário explorar depois

## 5. Ordem recomendada de instalação

Antes de acionar o Gameplay Developer (prompt 02), instale:

1. **Plugin `phaser4-gamedev`** — no Claude Code (comandos `/plugin`)
2. **Playwright MCP** — no terminal (`claude mcp add`)
3. Verifique: reinicie a sessão do Claude Code se necessário. Confirme com `/plugin list` e vendo as ferramentas do Playwright disponíveis

Antes de acionar o QA (prompt 06), Playwright MCP deve estar instalado. Plugin é opcional pro QA mas útil.
