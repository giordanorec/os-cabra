# Sprites — pipeline e integração Phaser

Assets gerados por `npm run sprites` a partir dos SVGs em `scripts/art/svg/`.

## Arquivos

| Key Phaser | PNG | Atlas JSON | Frames | Tamanho |
|---|---|---|---|---|
| `player` | `player.png` | `player.json` | 3 (voo idle) | 32×32 |
| `enemy-passista` | `enemy-passista.png` | `enemy-passista.json` | 2 (sway) | 32×32 |
| `enemy-caboclinho` | `enemy-caboclinho.png` | `enemy-caboclinho.json` | 2 (idle / arco esticado) | 28×28 |
| `enemy-mosca` | `enemy-mosca.png` | `enemy-mosca.json` | 2 (asas cima/baixo) | 14×14 |
| `boss-maracatu` | `boss-maracatu.png` | `boss-maracatu.json` | 1 (hero) | 256×256 |

`@2x/*.png` têm versão HiDPI (dobro do lado) caso precisem de crispness em mobile/Retina futuro.

## Carregamento no Phaser

Formato é **JSON Hash** — use `load.atlas`:

```ts
// PreloadScene.ts
this.load.atlas('player',           'assets/sprites/player.png',           'assets/sprites/player.json')
this.load.atlas('enemy-passista',   'assets/sprites/enemy-passista.png',   'assets/sprites/enemy-passista.json')
this.load.atlas('enemy-caboclinho', 'assets/sprites/enemy-caboclinho.png', 'assets/sprites/enemy-caboclinho.json')
this.load.atlas('enemy-mosca',      'assets/sprites/enemy-mosca.png',      'assets/sprites/enemy-mosca.json')
this.load.atlas('boss-maracatu',    'assets/sprites/boss-maracatu.png',    'assets/sprites/boss-maracatu.json')
```

## Animações sugeridas

```ts
// GameScene.create() ou cena equivalente
this.anims.create({
  key: 'player-fly',
  frames: this.anims.generateFrameNames('player', { prefix: 'player-', start: 0, end: 2 }),
  frameRate: 8,
  repeat: -1
})

this.anims.create({
  key: 'passista-sway',
  frames: this.anims.generateFrameNames('enemy-passista', { prefix: 'enemy-passista-', start: 0, end: 1 }),
  frameRate: 4,
  repeat: -1
})

this.anims.create({
  key: 'caboclinho-idle',
  frames: this.anims.generateFrameNames('enemy-caboclinho', { prefix: 'enemy-caboclinho-', start: 0, end: 1 }),
  frameRate: 3,
  repeat: -1
})

// Mosca: duas opções
// 1) anim looping (mais barato em grupo)
this.anims.create({
  key: 'mosca-flap',
  frames: this.anims.generateFrameNames('enemy-mosca', { prefix: 'enemy-mosca-', start: 0, end: 1 }),
  frameRate: 14,
  repeat: -1
})
```

Boss ainda é frame único — futuros M3+ entregarão variações de HP e ataques.

## Frame names

Os atlases usam o padrão `<key>-<index>`:
- `player-0`, `player-1`, `player-2`
- `enemy-passista-0`, `enemy-passista-1`
- etc.

Use `sprite.setFrame('player-0')` pra forçar um frame específico (útil em boot/pause).

## Substituir placeholders em PreloadScene

Comparado ao placeholder atual:

```ts
// ANTES (PreloadScene.ts)
const PLACEHOLDERS = [
  { key: 'player', w: 32, h: 32, color: 0xd4a04c }, // rect ocre
  ...
]

// DEPOIS — remover PLACEHOLDERS e usar:
preload() {
  this.load.atlas('player',           'assets/sprites/player.png',           'assets/sprites/player.json')
  this.load.atlas('enemy-passista',   'assets/sprites/enemy-passista.png',   'assets/sprites/enemy-passista.json')
  this.load.atlas('enemy-caboclinho', 'assets/sprites/enemy-caboclinho.png', 'assets/sprites/enemy-caboclinho.json')
  this.load.atlas('enemy-mosca',      'assets/sprites/enemy-mosca.png',      'assets/sprites/enemy-mosca.json')
  this.load.atlas('boss-maracatu',    'assets/sprites/boss-maracatu.png',    'assets/sprites/boss-maracatu.json')
  // bullet-player, enemy-bullet-flecha, enemy-bullet-bombinha continuam placeholder por enquanto
}
```

Tamanho dos sprites bate exatamente com os placeholders atuais — hitboxes e scales em `src/config.ts` não precisam mudar.

## Regenerar

Editar SVG em `scripts/art/svg/<key>.svg`, rodar:

```bash
npm run sprites
```

Todos os PNGs + JSONs + variantes @2x são regerados.
