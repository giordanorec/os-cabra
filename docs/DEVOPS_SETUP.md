# DevOps Setup — Runbook

Comandos executados pra configurar a infra do repo. Mantém isso atualizado a cada mudança operacional — é a fonte de verdade pra quem precisar refazer o setup do zero.

## Fase 1 — Fundação (2026-04-19)

### CI (GitHub Actions)

Arquivo: `.github/workflows/ci.yml`. Roda em cada `push` na `main` e em cada `pull_request` contra `main`. Valida `npm ci` + `npm run typecheck` + `npm run build` em Node 22.

Job name: `build` — é esse o status check exigido pela branch protection.

### Branch protection na `main`

Configurada via `gh api`. Regras:

- Exige PR (sem pushes diretos)
- Exige 1 review aprovada antes do merge
- Exige o status check `build` (CI) verde
- Dismiss stale reviews quando novos commits chegam
- Aplica a admins também (include_admins)

**Comando usado** (rodar da raiz do repo, autenticado como owner ou admin):

```bash
gh api -X PUT repos/giordanorec/os-cabra/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -F required_status_checks[strict]=true \
  -F required_status_checks[contexts][]=build \
  -F enforce_admins=true \
  -F required_pull_request_reviews[required_approving_review_count]=1 \
  -F required_pull_request_reviews[dismiss_stale_reviews]=true \
  -F restrictions=
```

**Para desativar temporariamente** (ex: emergência, hotfix sem review):

```bash
gh api -X DELETE repos/giordanorec/os-cabra/branches/main/protection
```

Reativar rodando o comando de cima de novo. Não esquecer de reativar.

**Inspecionar estado atual**:

```bash
gh api repos/giordanorec/os-cabra/branches/main/protection | jq
```

### Templates

- `.github/ISSUE_TEMPLATE/bug.md` — reportar bugs
- `.github/ISSUE_TEMPLATE/feature.md` — propor features
- `.github/pull_request_template.md` — checklist padrão de PR

GitHub pega esses arquivos automaticamente — não precisa ativar nada.

## Fase 2 — Deploy (pendente)

Acionada após o Gameplay Dev entregar M2 (primeiro milestone jogável). Ver `docs/DEVOPS.md` seção 4.2 pra Vercel.

## Fase 3 — Polish (pendente)

itch.io + release tags. Ver `docs/DEVOPS.md` seção 4.1 e `docs/prompts/07-devops.md` Fase 3.
