# DevOps Setup — Runbook

Comandos executados pra configurar a infra do repo. Mantém isso atualizado a cada mudança operacional — é a fonte de verdade pra quem precisar refazer o setup do zero.

## Fase 1 — Fundação (2026-04-19)

### CI (GitHub Actions)

Arquivo: `.github/workflows/ci.yml`. Roda em cada `push` na `main` e em cada `pull_request` contra `main`. Valida `npm ci` + `npm run typecheck` + `npm run build` em Node 22.

Job name: `build` — é esse o status check exigido pela branch protection.

### Branch protection na `main`

**Status: ATIVA desde 2026-04-19.** O repo foi tornado público (`gh repo edit giordanorec/os-cabra --visibility public`) e a proteção foi aplicada logo em seguida.

Regras:

- Exige PR (sem pushes diretos)
- Exige 1 review aprovada antes do merge
- Exige o status check `build` (CI) verde
- Dismiss stale reviews quando novos commits chegam
- Aplica a admins também (enforce_admins)

**Comando aplicado** — nota: `gh api` com flags `-F` não envia `null` corretamente (retorna 422). Usar `--input -` com JSON body pra mandar `restrictions: null`:

```bash
cat <<'EOF' | gh api -X PUT repos/giordanorec/os-cabra/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  --input -
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null
}
EOF
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

## Fase 2 — Deploy Vercel (2026-04-19)

### `vercel.json`

Na raiz do repo. Detectado automaticamente pela Vercel no import.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "installCommand": "npm ci",
  "cleanUrls": true
}
```

### Importar o repo na Vercel (passo manual do usuário — crítico)

Não dá pra automatizar: o Vercel CLI requer `vercel login` interativo e o MCP `deploy_to_vercel` só dá instruções. Também nenhuma das API calls disponíveis pelo MCP cria projeto.

Passos (uma vez só, ~2 minutos):

1. Ir em https://vercel.com/new
2. Escolher o team `giordanorecs-projects`
3. Selecionar o repo `giordanorec/os-cabra` da lista (repo é público desde Fase 1, aparece)
4. Clicar **Import**
5. Confirmar: Framework = `Other`, Build Command = `npm run build`, Output Directory = `dist`, Install Command = `npm ci` (o `vercel.json` já preenche)
6. Clicar **Deploy**
7. Após finalizar, copiar a URL de produção e colar no `README.md` (badge e seção "Jogar online")

A partir desse ponto:

- **Push em `main` → deploy de produção** automático.
- **PR aberto → preview URL** automática como comentário no PR (cada commit no PR re-deploya a preview).

### Env vars na Vercel

Nenhuma exigida agora (jogo é 100% estático, sem backend, sem API key em runtime). Se algum dia precisar, ir em Project → Settings → Environment Variables. **Nunca commitar segredo no código.**

### Rollback

Na dashboard do projeto → Deployments → escolher um deploy anterior → "Promote to Production". Ou via Git: `git revert` do commit problemático + push em `main`.

## Fase 3 — Polish (pendente)

## Fase 3 — Polish (pendente)

itch.io + release tags. Ver `docs/DEVOPS.md` seção 4.1 e `docs/prompts/07-devops.md` Fase 3.
