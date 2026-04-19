# Report DevOps

## Fase 1 — Fundação (2026-04-19)

### O que foi configurado

- `.github/workflows/ci.yml` — CI em Node 22 rodando `typecheck` + `build` em cada PR e push na `main`. Job name: `build`.
- `.github/ISSUE_TEMPLATE/bug.md` e `feature.md` — templates de issue.
- `.github/pull_request_template.md` — template de PR com checklist.
- `docs/DEVOPS_SETUP.md` — runbook com comandos usados (branch protection, reset, inspeção).
- Branch protection em `main`: **ATIVA** desde 2026-04-19. Regras: PR obrigatório, 1 review, CI `build` verde, dismiss stale reviews, enforce em admins. Aplicada após repo ser tornado público (`gh repo edit --visibility public`). Comando em `DEVOPS_SETUP.md`.
- `docs/NOTES_FROM_DEVOPS.md` — inbox para avisos a outros agentes (atualmente: blocker de build pro Gameplay Dev).

### Comandos que o usuário precisa conhecer

- **Abrir PR**: push em branch `feat/*` ou `chore/*`, depois `gh pr create`. `main` está travada, direct push falha.
- **Inspecionar branch protection**: `gh api repos/giordanorec/os-cabra/branches/main/protection | jq`
- **Desativar branch protection temporariamente** (emergência): comando em `docs/DEVOPS_SETUP.md`. **Sempre reativar depois.**
- **Rodar CI localmente** antes de pushar: `npm run typecheck && npm run build`.

### Blocker passado pro Gameplay Dev (resolvido em M2)

`npm run build` falhava no scaffold inicial por causa de `import Phaser from "phaser"` em `src/scenes/BootScene.ts`. **Resolvido** — com o merge do M2 (db97f38), o build passa limpo. Build gera `dist/index.html` (0.89 kB) + bundle JS ~1.37 MB. Warning de chunk size pode ser endereçado depois com code-splitting; não bloqueia deploy.

## Fase 2 — Deploy Vercel (2026-04-19)

### O que foi configurado

- `vercel.json` na raiz do repo — `buildCommand: npm run build`, `outputDirectory: dist`, `installCommand: npm ci`, `framework: null`, `cleanUrls: true`.
- Vercel MCP confirma que a conta `giordanorec` tem 1 team (`giordanorecs-projects`) e 2 projetos existentes (`mapaproteico`, `mang-ia`) — projeto `os-cabra` **ainda não existe** na Vercel.
- Build local validado: `npm run build` passa em ~2s e gera `dist/` com `index.html` + `assets/index-*.js`.

### Ação manual do usuário (crítico — não dá pra automatizar)

O Vercel CLI requer `vercel login` interativo (abre browser) e o MCP `deploy_to_vercel` só retorna instruções, não deploya. Pra finalizar:

1. Abrir https://vercel.com/new
2. Selecionar o repo `giordanorec/os-cabra` (público desde Fase 1, aparece na lista)
3. Clicar **Import**
4. Vercel detecta automaticamente o `vercel.json` — build command e output já vêm preenchidos
5. Framework Preset: deixar **Other** (`framework: null` no json)
6. Clicar **Deploy**
7. Após o primeiro deploy, copiar a URL de produção (ex: `os-cabra.vercel.app` ou `os-cabra-giordanorecs-projects.vercel.app`)
8. Rodar no repo: atualizar o badge no `README.md` e atualizar este report com a URL real

A partir daí, cada merge em `main` dispara um deploy de produção automaticamente. Cada PR ganha uma preview URL automática.

### URL de produção

**Pendente** — preencher após o Import na dashboard. Placeholder no `README.md` com instruções.

### Decisões pendentes

- Domínio custom (`oscabra.com`, `oscabra.pe`) ou ficar em `*.vercel.app`? — aberto.
- itch.io em paralelo ao Vercel ou só no release público? — aberto.
- Bundle de ~1.37 MB: endereçar com code-splitting em milestone de polish, não agora.
