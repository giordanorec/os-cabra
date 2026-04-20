# CLAUDE.md — Regras do projeto "Os Cabra"

Este repositório usa **topologia orquestrador + especialistas**. Há uma sessão raiz rodando o **Arquiteto/PM** (lê docs, coordena, abre PRs, integra); e sessões separadas por especialista (Game Designer, Gameplay Dev, Visual Designer, UI/UX, Sound, QA, DevOps) com prompts em [`docs/prompts/`](docs/prompts/).

O usuário (dono do projeto) **só conversa com o Arquiteto**. Especialistas entregam; Arquiteto integra; usuário revisa.

---

## Regras OBRIGATÓRIAS para toda sessão Claude Code neste repo

### 1. Nunca trabalhe direto na `main`
Antes de qualquer edit:

```bash
git checkout -b feat/<milestone>-<descricao>   # branch nova
# ou
git checkout feat/<branch-que-já-existe>       # continuar trabalho
```

`main` é protegida por branch rule (requer PR + CI + review). Commit direto falha; pior, WIP em main vira lixo no working tree quando alguém trocar de branch.

### 2. Use `git worktree` para trabalho em paralelo
Se sua sessão roda enquanto outro especialista também está trabalhando, **crie worktree em `~/oscabra-worktrees/<agente>-<milestone>/`**:

```bash
git worktree add ~/oscabra-worktrees/<agente>-<milestone> -b <branch>
cd ~/oscabra-worktrees/<agente>-<milestone>
```

- ⚠️ **NUNCA em `/tmp/`** — é limpo ao reiniciar o computador; trabalho inteiro some
- Ao terminar: `git worktree remove ~/oscabra-worktrees/<agente>-<milestone>` depois do merge

### 3. Commit cedo, commit muito
Antes de fechar sessão (ou de qualquer pausa longa), **não deixe WIP uncommitted**. Reboot = perda. Commits intermediários `wip:` são aceitos e podem ser squashados no PR final.

### 4. Atualize com `main` antes de começar
```bash
git fetch origin main
git rebase origin/main   # ou git merge, se preferir
```
Evita conflitos bobos em PR.

### 5. Report OBRIGATÓRIO ao fim de cada atividade
Antes de abrir PR, escreva `docs/REPORT_<AGENTE>[_M<N>].md` com:

- **Objetivo** da atividade (1-2 linhas)
- **O que foi feito** (bullet points dos entregáveis)
- **Arquivos alterados/criados** (lista)
- **Decisões técnicas** com justificativa breve (só as não-óbvias)
- **Blockers/dúvidas** pro Arquiteto (se houver)
- **Evidências visuais** — link pras screenshots em `docs/milestone-reports/m<N>/` ou `docs/qa_screenshots/` etc (se couber)
- **Próximo passo** que você imagina ou recomenda

O Arquiteto consome esse arquivo pra entender o que integrar e o que transmitir pro usuário. **Sem report, não dá pra integrar com contexto** — PRs sem report voltam sem merge.

### 6. Abra PR e pare
Use `gh pr create --base main --head <sua-branch>` com título e body informativos. **Não faça merge direto**. Arquiteto revisa e integra. Title/body do PR pode referenciar o report: "ver `docs/REPORT_<AGENTE>.md`".

### 7. Não edite domínio de outros especialistas
Se você é Visual Designer, não mexe em `src/`. Se é Gameplay Dev, não mexe em `docs/GLOSSARY_PT_BR.md`. Se você acha que precisa, **pare, escreva no report, e pergunte ao Arquiteto**.

### 8. Valide antes de entregar
Cada prompt em `docs/prompts/` tem a regra de validação específica do domínio. Em geral:

- **Gameplay Dev**: Playwright MCP rodando o jogo, screenshot, console sem erros — antes do PR
- **QA**: suíte Playwright rodada localmente — antes do PR
- **Visual Designer**: abre os PNGs gerados, confere contra paleta e mood board — antes do PR
- **Sound Designer**: reproduz os OGGs, confere licenças — antes do PR
- **DevOps**: `npm ci && npm run typecheck && npm run build` passa localmente — antes do PR

---

## Convenção de branches

| Prefixo | Uso |
|---|---|
| `feat/milestone-N-<descricao>` | Implementação do Gameplay Dev |
| `feat/<dominio>-v<N>` | Entregas amplas (ex: `feat/ux-v1`) |
| `art/milestone-N` | Visual Designer |
| `art/<sub>` | Micro-entregas de arte (ex: `art/favicon`) |
| `qa/milestone-N-report` | QA |
| `chore/<descricao>` | DevOps, tooling, config |
| `docs/<descricao>` | Apenas docs |

---

## Stack e comandos

- **Phaser 4 + Vite + TypeScript**, Node 22+
- `npm run dev` — dev server (http://localhost:5173)
- `npm run typecheck` — tsc --noEmit
- `npm run build` — dist/
- `npm run preview` — servir dist/ localmente
- `npx playwright test` — smoke tests (após QA ter setupado)

Ver [`docs/TECH_SPEC.md`](docs/TECH_SPEC.md) para arquitetura completa.

---

## Ferramentas de IA já configuradas

- **Plugin Claude Code `phaser4-gamedev`** — 4 agentes Phaser-específicos, 14 skills, hook anti-API-depreciada. Gameplay Dev use ativamente. Ver [`docs/TOOLS.md`](docs/TOOLS.md).
- **Playwright MCP** — dá "olhos" no browser pro agente testar o que implementou. Gameplay Dev e QA usam. Não-negociável antes de entregar milestone.
- **Pipeline Gemini Nano Banana** (`.venv-art/` + `scripts/art/gemini/`) — geração de imagens em xilogravura. Chave em `.env`. Visual Designer usa. Ver `scripts/art/gemini/README.md`.

---

## Em caso de dúvida

- **Escopo ambíguo?** Escreva no report como "open question" e pergunte ao Arquiteto.
- **Bug de terceiros?** Documente no report, proponha workaround, não faça hotfix em outro domínio sem autorização.
- **Shutdown/reboot interrompeu?** Resume sessão com `claude --resume`, rode `git status` imediatamente pra ver se há WIP a commitar ou branch trocada.
