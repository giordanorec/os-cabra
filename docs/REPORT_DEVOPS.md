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

### Blocker passado pro Gameplay Dev

`npm run build` falha no scaffold atual por causa de `import Phaser from "phaser"` em `src/scenes/BootScene.ts` — Phaser 4 removeu o default export. Nota completa com fix sugerido em `docs/NOTES_FROM_DEVOPS.md`. O CI vai barrar o merge do PR do Gameplay Dev até isso ser consertado, que é exatamente o papel da branch protection.

`npm run typecheck` passa limpo.

### Decisões pendentes

- Quando ativar o Vercel (Fase 2) — esperar M2 conforme `docs/prompts/07-devops.md`.
- Domínio custom ou vercel.app? — aberto no `docs/DEVOPS.md` seção 9.
- itch.io em paralelo ao Vercel ou só no release público? — aberto no `docs/DEVOPS.md` seção 9.

### Próximos passos (Fase 2, quando M2 chegar)

1. Conectar o repo no Vercel (GUI é mais simples que CLI pra setup inicial).
2. Adicionar `vercel.json` na raiz (template em `docs/DEVOPS.md` seção 4.2).
3. Documentar URL de produção no `README.md`.
4. Atualizar este report com Fase 2.
