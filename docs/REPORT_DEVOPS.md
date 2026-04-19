# Report DevOps

## Fase 1 — Fundação (2026-04-19)

### O que foi configurado

- `.github/workflows/ci.yml` — CI em Node 22 rodando `typecheck` + `build` em cada PR e push na `main`. Job name: `build`.
- `.github/ISSUE_TEMPLATE/bug.md` e `feature.md` — templates de issue.
- `.github/pull_request_template.md` — template de PR com checklist.
- `docs/DEVOPS_SETUP.md` — runbook com comandos usados (branch protection, reset, inspeção).
- Branch protection em `main`: **NÃO aplicada ainda** — GitHub responde `403 Upgrade to GitHub Pro or make this repository public`. Comando está pronto em `DEVOPS_SETUP.md`; basta o usuário tornar o repo público ou habilitar Pro e re-rodar o `gh api ... PUT`.

### Comandos que o usuário precisa conhecer

- **Abrir PR**: push em branch `feat/*` ou `chore/*`, depois `gh pr create`. `main` está travada, direct push falha.
- **Inspecionar branch protection**: `gh api repos/giordanorec/os-cabra/branches/main/protection | jq`
- **Desativar branch protection temporariamente** (emergência): comando em `docs/DEVOPS_SETUP.md`. **Sempre reativar depois.**
- **Rodar CI localmente** antes de pushar: `npm run typecheck && npm run build`.

### Blocker atual — build quebrado

`npm run build` está falhando na `main`:

```
[MISSING_EXPORT] Error: "default" is not exported by "node_modules/phaser/dist/phaser.esm.js".
  src/scenes/BootScene.ts:1:8
  import Phaser from "phaser";
```

Causa: Phaser 4 não tem mais default export — é namespace import. Fix esperado: `import * as Phaser from "phaser";` ou importar símbolos específicos. **Isso é escopo do Gameplay Dev**, não do DevOps — mas significa que o próximo PR que entrar na `main` vai ser bloqueado pelo CI até isso ser consertado. O que é exatamente o comportamento desejado da branch protection.

`npm run typecheck` passa limpo.

### Decisões pendentes

- **Repo privado + branch protection**: GitHub Free não permite branch protection em repos privados. Opções: (a) tornar `os-cabra` público agora (menos atrito, combina com o "abrir pra público quando estiver apresentável" de `docs/DEVOPS.md` §1), (b) assinar GitHub Pro, (c) seguir sem proteção até um dos dois acontecer. Recomendo (a) ou (c) — o jogo não tem segredo no código.
- Quando ativar o Vercel (Fase 2) — esperar M2 conforme `docs/prompts/07-devops.md`.
- Domínio custom ou vercel.app? — aberto no `docs/DEVOPS.md` seção 9.
- itch.io em paralelo ao Vercel ou só no release público? — aberto no `docs/DEVOPS.md` seção 9.

### Próximos passos (Fase 2, quando M2 chegar)

1. Conectar o repo no Vercel (GUI é mais simples que CLI pra setup inicial).
2. Adicionar `vercel.json` na raiz (template em `docs/DEVOPS.md` seção 4.2).
3. Documentar URL de produção no `README.md`.
4. Atualizar este report com Fase 2.
