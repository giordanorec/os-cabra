import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, PALETTE } from '../config';

// Parallax de 3 camadas em velocidades 0.2x (back) / 0.5x (mid) / 1.0x (fore).
// Consome PNGs `bg-<scene>-{back,mid,fore}` se carregados no Preload.
// Senão, desenha placeholder vibrante com pontinhos flutuantes sobre a cor de cena
// (setada via cameras.main.setBackgroundColor antes deste construtor).
//
// Quando art/milestone-3+ entregar public/assets/backgrounds/fase1/{back,mid,fore}.png,
// PreloadScene vai carregar via `load.image('bg-fase1-back', ...)` e este módulo
// detecta a textura existente e usa TileSprite automaticamente.

type SceneId = 'menu' | 'fase1' | 'fase2' | 'fase3' | 'fase4' | 'fase5' | 'boss' | 'generic';

type LayerSuffix = 'back' | 'mid' | 'fore';

interface Layer {
  tile?: Phaser.GameObjects.TileSprite;
  proceduralGraphics?: Phaser.GameObjects.Graphics;
  proceduralDots?: Array<{ x: number; y: number; size: number; color: number }>;
  speed: number;
}

const LAYER_CONFIGS: Array<{ suffix: LayerSuffix; speed: number; depth: number }> = [
  { suffix: 'back', speed: 0.2, depth: -30 },
  { suffix: 'mid',  speed: 0.5, depth: -20 },
  { suffix: 'fore', speed: 1.0, depth: -10 }
];

const PROCEDURAL_COLORS: Record<LayerSuffix, number[]> = {
  back: [PALETTE.CREAM, PALETTE.GOLD],
  mid:  [PALETTE.PINK, PALETTE.GOLD, PALETTE.CREAM],
  fore: [PALETTE.RED, PALETTE.GREEN, PALETTE.CREAM]
};

const BASE_SCROLL_PX_PER_SEC = 80;

export class Parallax {
  private readonly layers: Layer[] = [];
  private elapsed = 0;

  constructor(scene: Phaser.Scene, sceneId: SceneId = 'generic') {
    for (const cfg of LAYER_CONFIGS) {
      const key = `bg-${sceneId}-${cfg.suffix}`;
      if (scene.textures.exists(key)) {
        const tile = scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, key)
          .setOrigin(0, 0)
          .setDepth(cfg.depth);
        this.layers.push({ tile, speed: cfg.speed });
      } else {
        const dots = this.makeDots(cfg.suffix);
        const g = scene.add.graphics().setDepth(cfg.depth);
        this.drawDots(g, dots, 0);
        this.layers.push({ proceduralGraphics: g, proceduralDots: dots, speed: cfg.speed });
      }
    }
  }

  tick(deltaMs: number) {
    this.elapsed += deltaMs;
    for (const layer of this.layers) {
      const offset = (this.elapsed * BASE_SCROLL_PX_PER_SEC * layer.speed) / 1000;
      if (layer.tile) {
        layer.tile.tilePositionY = -offset;
      } else if (layer.proceduralGraphics && layer.proceduralDots) {
        this.drawDots(layer.proceduralGraphics, layer.proceduralDots, offset);
      }
    }
  }

  private makeDots(suffix: LayerSuffix) {
    const count = suffix === 'back' ? 50 : suffix === 'mid' ? 30 : 18;
    const maxSize = suffix === 'back' ? 2 : suffix === 'mid' ? 3 : 4;
    const colors = PROCEDURAL_COLORS[suffix];
    const result: NonNullable<Layer['proceduralDots']> = [];
    for (let i = 0; i < count; i++) {
      result.push({
        x: Phaser.Math.Between(0, GAME_WIDTH),
        y: Phaser.Math.Between(0, GAME_HEIGHT),
        size: Phaser.Math.FloatBetween(0.8, maxSize),
        color: colors[i % colors.length]
      });
    }
    return result;
  }

  private drawDots(
    g: Phaser.GameObjects.Graphics,
    dots: NonNullable<Layer['proceduralDots']>,
    yOffset: number
  ) {
    g.clear();
    for (const d of dots) {
      const y = ((d.y + yOffset) % (GAME_HEIGHT + 20)) - 10;
      g.fillStyle(d.color, 0.85);
      g.fillCircle(d.x, y, d.size);
    }
  }
}
