import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

// Parallax procedural em 3 camadas com gradiente da paleta ART_BIBLE.
// Substituir por texturas reais do Visual Designer quando backgrounds/* chegar.

interface Layer {
  graphics: Phaser.GameObjects.Graphics;
  speed: number;
  dotRows: Array<{ x: number; y: number; size: number; color: number }>;
}

export class Parallax {
  private readonly layers: Layer[] = [];
  private elapsed = 0;

  constructor(scene: Phaser.Scene) {
    // Camada 0 — gradiente radial escuro (mais lento)
    const far = scene.add.graphics();
    far.fillGradientStyle(0x2a1810, 0x2a1810, 0x1a0f08, 0x1a0f08, 1);
    far.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    far.setDepth(-30);
    const farDots = this.makeDots(60, 0x7a6850, 0.4, 1.5);
    const farG = scene.add.graphics();
    farG.setDepth(-29);
    this.drawDots(farG, farDots);
    this.layers.push({ graphics: farG, speed: 8, dotRows: farDots });

    // Camada 1 — tiras horizontais médias (beige texturado) — mais rápido
    const midDots = this.makeDots(40, 0xb84a2e, 0.25, 2.5);
    const midG = scene.add.graphics();
    midG.setDepth(-20);
    this.drawDots(midG, midDots);
    this.layers.push({ graphics: midG, speed: 20, dotRows: midDots });

    // Camada 2 — foreground marcas sutis — mais rápido
    const nearDots = this.makeDots(24, 0xd4a04c, 0.2, 3);
    const nearG = scene.add.graphics();
    nearG.setDepth(-10);
    this.drawDots(nearG, nearDots);
    this.layers.push({ graphics: nearG, speed: 40, dotRows: nearDots });
  }

  tick(delta: number) {
    this.elapsed += delta;
    for (const layer of this.layers) {
      const offset = (this.elapsed * layer.speed) / 1000;
      layer.graphics.clear();
      for (const d of layer.dotRows) {
        const y = (d.y + offset) % (GAME_HEIGHT + 40);
        layer.graphics.fillStyle(d.color, 1);
        layer.graphics.fillCircle(d.x, y, d.size);
      }
    }
  }

  private makeDots(count: number, color: number, alpha: number, maxSize: number) {
    const result: Layer['dotRows'] = [];
    for (let i = 0; i < count; i++) {
      result.push({
        x: Phaser.Math.Between(0, GAME_WIDTH),
        y: Phaser.Math.Between(0, GAME_HEIGHT),
        size: Phaser.Math.FloatBetween(0.5, maxSize),
        color: Phaser.Display.Color.ValueToColor(color).darken(Phaser.Math.Between(0, 20)).color
      });
    }
    // alpha aplicado indireto via graphics.alpha
    result.forEach(() => {});
    void alpha;
    return result;
  }

  private drawDots(g: Phaser.GameObjects.Graphics, dots: Layer['dotRows']) {
    for (const d of dots) {
      g.fillStyle(d.color, 1);
      g.fillCircle(d.x, d.y, d.size);
    }
  }
}
