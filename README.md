# Os Cabra

> Shoot 'em up vertical em Phaser 4 + TypeScript com tema das manifestações culturais do Recife.

**Status**: Milestone 2 jogável em `main`. Próximo: boss da Fase 1 (M3).

## Jogar online

Deploy automático na Vercel a cada push em `main`.

- **Produção**: _URL será preenchida após o primeiro import na Vercel — ver `docs/DEVOPS_SETUP.md` §Fase 2._
- **Preview por PR**: comentário automático do bot da Vercel em cada PR aberto.

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
npm run typecheck  # tsc --noEmit
```

## Documentação

A espinha do projeto está em [`docs/`](docs/README.md). Cada especialista (Game Designer, Gameplay Dev, Visual, UI/UX, Sound, QA, DevOps) tem seu spec próprio.

Prompts prontos para abrir uma sessão com cada especialista estão em [`docs/prompts/`](docs/prompts/).

## Stack

Phaser 4 · Vite · TypeScript · npm · Node 22+

## Licença

UNLICENSED — projeto pessoal.
