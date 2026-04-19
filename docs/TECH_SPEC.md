# Tech Spec — Os Cabra

> **Responsável**: Gameplay Developer. **Lê também**: DevOps, QA.
> **Depende de**: `GDD.md` (o que implementar), `ART_BIBLE.md` (onde estão os assets).

## 1. Stack

- **Phaser 4.0** — engine
- **Vite** — dev server e bundler
- **TypeScript** (strict) — tudo tipado, `noUnusedLocals` ligado
- **npm** — package manager
- **Node 22+** — runtime de dev

### Ferramentas de IA no loop de desenvolvimento

Ver [`TOOLS.md`](TOOLS.md) para instalação e uso detalhado.

- **Plugin `phaser4-gamedev`** (Claude Code) — 4 agentes (`phaser-architect`, `phaser-coder`, `phaser-debugger`, `phaser-asset-advisor`), 14 skills, hook anti-API-depreciada. **Use os agentes ativamente** durante a implementação — `phaser-debugger` é particularmente útil quando sprite aparece preto, física se comporta estranho, cena não transiciona
- **Playwright MCP** — permite que o agente abra o jogo no browser, teste a mecânica implementada e veja o resultado antes de devolver o controle. **Validar cada milestone no Playwright antes de abrir PR**

## 2. Estrutura de pastas

```
src/
├── main.ts              # entry — cria Phaser.Game com lista de cenas
├── config.ts            # constantes de game feel (velocidades, HP, cooldowns)
├── vite-env.d.ts
├── scenes/              # uma classe por cena, um arquivo cada
│   ├── BootScene.ts     # carrega splash mínimo, vai pra Preload
│   ├── PreloadScene.ts  # carrega todos os assets com loading bar
│   ├── MenuScene.ts     # tela inicial, Enter para jogar
│   ├── GameScene.ts     # gameplay (dispara HUDScene em paralelo)
│   ├── HUDScene.ts      # overlay de vidas/score/bombs
│   ├── PauseScene.ts    # overlay quando ESC é pressionado
│   └── GameOverScene.ts # "SE LASCOU", exibe score e código
├── entities/            # sprites com comportamento
│   ├── Player.ts
│   ├── Bullet.ts        # pool compartilhado player e enemy
│   ├── Enemy.ts         # classe base
│   └── enemies/         # subclasses por tipo
│       ├── PassistaFrevo.ts
│       ├── Caboclinho.ts
│       ├── Mamulengo.ts
│       ├── CabocloLanca.ts
│       ├── UrubuCapibaribe.ts
│       ├── PapaFigo.ts
│       ├── ComadreFulozinha.ts
│       ├── BestaFera.ts
│       └── MoscaManga.ts
├── bosses/
│   ├── BossBase.ts
│   ├── MaracatuNacao.ts
│   ├── HomemMeiaNoite.ts
│   └── ...
├── systems/
│   ├── EnemySpawner.ts  # define waves via JSON ou código
│   ├── ScoreManager.ts  # score, chain, localStorage
│   ├── InputManager.ts  # abstrai teclas em ações
│   └── EffectsManager.ts # screen shake, freeze frame, particle helpers
└── ui/
    ├── ShareCodeScene.ts # gera/decodifica código de score
    └── TextStyles.ts     # estilos centralizados (fonte, cores)
```

## 3. Fluxo de cenas

```
BootScene
  → PreloadScene (carrega tudo)
    → MenuScene
      → GameScene (+ HUDScene simultânea)
        ↔ PauseScene (overlay)
        → GameOverScene
          → MenuScene
```

- **BootScene** apenas registra fonte padrão e inicia Preload. Rapidíssima.
- **PreloadScene** mostra loading bar em xilogravura (ver `ART_BIBLE.md`). Carrega TUDO pra evitar hitch in-game.
- **GameScene** gerencia spawn, physics, colisão. Dispara `HUDScene` como cena paralela com `this.scene.launch('HUDScene')`.
- **PauseScene** é um overlay — `GameScene.scene.pause()` quando chamada.

## 4. Padrões de código

### 4.0 Import do Phaser

Phaser 4 **não tem default export**. Use namespace import:

```ts
import * as Phaser from 'phaser';

// depois use normal: Phaser.Scene, Phaser.AUTO, Phaser.Physics.Arcade.Sprite
```

Alternativa (menos usada, mais verboso): `import { Scene, Game, AUTO } from 'phaser';`. O scaffold padroniza o namespace import — siga ele.

### 4.1 Cena
```ts
export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }
  preload() { /* só se necessário */ }
  create() { /* setup */ }
  update(time: number, delta: number) { /* loop */ }
}
```

### 4.2 Entidade
Prefira herdar de `Phaser.Physics.Arcade.Sprite`:
```ts
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }
  // métodos públicos: move(direction), fire(), hit(), die()
}
```

### 4.3 Pool de projéteis
Usar `Phaser.Physics.Arcade.Group` com `createCallback` e `runChildUpdate: true`. Bullets não são destruídas — desativadas (`setActive(false); setVisible(false)`) e recicladas.

### 4.4 Dados de waves
Separar DADOS de LÓGICA. Waves em JSON/TS literal, spawner consome:
```ts
// src/systems/waves/fase1.ts
export const fase1Waves: Wave[] = [
  { delayMs: 0, enemies: [{ type: 'caboclinho', x: 100 }, ...] },
  ...
];
```

## 5. Física

- Arcade Physics (mais simples que Matter, suficiente aqui)
- Sem gravidade (`gravity: { x: 0, y: 0 }`)
- Colisões: grupo `playerBullets` × grupo `enemies`, grupo `enemyBullets` × `player`, grupo `enemies` × `player`

## 6. Input

Centralizar em `InputManager`:
```ts
export enum Action { MOVE_LEFT, MOVE_RIGHT, FIRE, PAUSE, CONFIRM }
inputManager.isPressed(Action.FIRE) // boolean
inputManager.justPressed(Action.PAUSE) // boolean, 1-frame
```

Facilita remapear depois (se mobile vier em v2).

## 7. Save/load

Highscore em `localStorage` com chave `os_cabra_highscore`. JSON simples:
```ts
{ best: 12345, lastCode: 'A3X9K2', updatedAt: '2026-04-19' }
```

## 8. Performance

- Todos os assets carregados uma vez na `PreloadScene`
- Pool de projéteis (máx 64 simultâneos OK)
- Pool de partículas via `Phaser.GameObjects.Particles.ParticleEmitter`
- Alvo: **60 FPS em Chromebook comum** (métrica de teste do QA)
- Atenção: não criar/destruir sprites a cada frame — reciclar

## 9. Coding standards

- 2 espaços, `single quotes`, sem `;` obrigatório via prettier (mas manter consistente)
- Sem `any`. Se precisar, `unknown` + narrow
- Nomes em inglês no código (`Player`, `enemySpawner`). Nomes dos personagens em português sem acento na chave (`passistaFrevo`, `caboclo_lanca`), mas com acento nos textos de UI
- Cada arquivo exporta uma classe principal
- Máx ~200 linhas por arquivo — se passar, decompor

## 10. Scripts npm

```bash
npm run dev        # http://localhost:5173, HMR
npm run build      # dist/
npm run preview    # serve dist/
npm run typecheck  # só tsc --noEmit
```

## 11. Entregas esperadas do Gameplay Dev (ordem sugerida)

1. **Milestone 1 — Player móvel atirando em inimigo estático** (spike técnico)
2. **Milestone 2 — Fase 1 jogável** (sem arte final, pode usar retângulos): spawn de ondas, colisão, morte, HUD, game over
3. **Milestone 3 — Boss Fase 1** (placeholder visual)
4. **Milestone 4 — Power-ups funcionando** (pelo menos 2)
5. **Milestone 5 — Fase 2 + boss 2**
6. **Milestone 6 — Fase 3 + boss 3** (MVP completo em 3 fases)
7. **Milestone 7 — Polish: game feel, partículas, screen shake**
8. **Milestone 8 — Integração arte final** (substituir placeholders pelos sprites do Visual Designer)
9. **Milestone 9 — Integração áudio** (SFX e música do Sound Designer)
10. **Milestones 10-11 — Fases 4 e 5** (se entrarem no escopo)

## 12. Open questions

- [ ] Definir exatamente o formato `Wave` — dataclass ou função geradora?
- [ ] Usar Phaser's event emitter ou um event bus simples próprio?
- [ ] Como testar? Jest/Vitest vale a pena ou confiamos em playtest?
