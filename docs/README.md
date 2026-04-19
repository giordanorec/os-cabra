# Os Cabra — Documentação

Shoot 'em up vertical em Phaser 4 + TypeScript, tematizado com manifestações culturais do Recife/Pernambuco. Estética xilogravura, tom cômico-absurdo, gameplay arcade clássico com polish de Angry Birds/Cuphead.

> **Status**: em Discovery/Setup concluído. Nenhuma fase implementada ainda. Scaffold compila limpo (`npm run dev` mostra tela placeholder).

## Como esta documentação funciona

O projeto usa **topologia orquestrador + especialistas**: uma sessão Claude raiz atua como PM/arquiteto, e cada especialista trabalha em sessão separada lendo **apenas os docs que lhe interessam**. Isso mantém cada especialista focado.

| Doc | Para quem | Sobre |
|---|---|---|
| [`TOOLS.md`](TOOLS.md) | **Todos** | Plugin Claude Code + Playwright MCP — **leia antes de acionar Gameplay Dev e QA** |
| [`GDD.md`](GDD.md) | Game Designer, Gameplay Dev, QA | Mecânicas, inimigos, bosses, dificuldade, loops |
| [`TECH_SPEC.md`](TECH_SPEC.md) | Gameplay Dev, DevOps | Stack, folder structure, cenas, padrões |
| [`ART_BIBLE.md`](ART_BIBLE.md) | Visual Designer, UI/UX | Estilo, paleta, lista de assets, pipeline de geração |
| [`UX_SPEC.md`](UX_SPEC.md) | UI/UX Designer, Gameplay Dev | Telas, HUD, feedback, textos PT-BR com regionalismo |
| [`SOUND_SPEC.md`](SOUND_SPEC.md) | Sound Designer, Gameplay Dev | SFX, música, mixagem, curadoria |
| [`QA_PLAN.md`](QA_PLAN.md) | QA/Tester | Estratégia de teste, casos, bug template |
| [`DEVOPS.md`](DEVOPS.md) | DevOps | Build, deploy, versionamento, CI |

Os [`prompts/`](prompts/) contêm um prompt pronto por especialista — você cola em uma sessão Claude nova, sem precisar explicar o projeto do zero.

## Time

- **Tech Lead/Arquiteto** (orquestrador) — produz specs e prompts, integra entregas
- **Game Designer** — mecânicas, balanço, level design
- **Gameplay Developer** — implementação Phaser/TS
- **Visual Designer** — arte em xilogravura (curadoria + geração IA)
- **UI/UX Designer** — telas, HUD, glossário pernambucano
- **Sound Designer** — curadoria de áudio livre
- **QA/Tester** — plano de teste e playtests
- **DevOps** — build, deploy, GitHub

## Decisões-chave já tomadas

- **Stack**: Phaser 4 + Vite + TypeScript + npm
- **Plataforma**: Desktop web v1 (mobile em v2+)
- **Controles**: Setas + Espaço, ESC pausa, Enter/Espaço confirmam
- **Vidas**: 3 sem continues, checkpoint no meio de cada fase
- **Score**: localStorage + compartilhamento por código (sem backend)
- **Idioma**: PT-BR com regionalismo pernambucano
- **Resolução**: 800×600 (padrão arcade clássico)
- **Ferramentas de IA**: plugin `phaser4-gamedev` (Claude Code) + Playwright MCP (loop visual fechado) — ver [`TOOLS.md`](TOOLS.md)

## Rodando localmente

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/
npm run typecheck # checa TS sem emitir
```

## Estrutura do repositório

```
Test_Phaser/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/assets/       # sprites, sons, fontes
├── src/
│   ├── main.ts
│   ├── config.ts
│   ├── scenes/
│   ├── entities/
│   └── systems/
└── docs/                # esta pasta
```
