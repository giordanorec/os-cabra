import * as Phaser from 'phaser';
import {
  DEPTH,
  GAME_HEIGHT,
  GAME_WIDTH,
  PALETTE,
  PARALLAX_CROSSFADE_MS,
  PARALLAX_MODE,
  PARALLAX_POSTAL_INTERVAL_MS
} from '../config';

// Parallax de 3 camadas em velocidades relativas 0.2x / 0.5x / 1.0x.
//
// Modo SCROLL (default): espera imagens ALTAS (tipicamente 800×2400) por camada.
//   - Imagem alta (h > GAME_HEIGHT * 1.5): renderiza como Image única ancorada no
//     topo, desliza verticalmente em PING-PONG (start y=0 → end y=-(h-600) → volta).
//   - Imagem ~800×600 (fallback de emergência): tile SEAMLESS VERTICAL (loop em y).
//     Nunca tila horizontalmente — o movimento em x é só do player.
//
// Modo POSTAL: carrega `bg-<scene>-postal-{0..n}` pré-registrados em POSTAL_SETS,
//   troca com crossfade de PARALLAX_CROSSFADE_MS a cada PARALLAX_POSTAL_INTERVAL_MS.
//
// Fallback procedural (textura ausente): pontinhos coloridos sobre a cor chapada
// da fase (setada via cameras.main.setBackgroundColor).

type SceneId = 'menu' | 'fase1' | 'fase2' | 'fase3' | 'fase4' | 'fase5' | 'boss' | 'generic';

type LayerSuffix = 'back' | 'mid' | 'fore';

// PARALLAX_BASE_SPEED (px/s) é a velocidade do fore (1.0x).
// Calibrado: back (0.2x) = 60 px/s → percorre 2400px em 40s (ritmo de fase de exemplo).
const PARALLAX_BASE_SPEED = 300;

// Proteção: ao atingir o fim da imagem alta, inverte a direção (ping-pong).
// Alternativa seria "clamp" (imagem para), mas ping-pong mantém o movimento
// visual da parallax e é aceitável enquanto o designer não entregar uma imagem
// que case exatamente com a duração da fase.

interface ScrollSingleLayer {
  kind: 'scroll-single';
  image: Phaser.GameObjects.Image;
  speed: number; // px/s
  minY: number;  // -(textureHeight - GAME_HEIGHT) — posição final antes de reverter
  direction: 1 | -1; // 1 = imagem descendo na tela (mostrando parte mais alta), -1 = subindo
}

interface ScrollTiledLayer {
  kind: 'scroll-tiled';
  tile: Phaser.GameObjects.TileSprite;
  speed: number; // px/s
}

interface ProceduralLayer {
  kind: 'procedural';
  graphics: Phaser.GameObjects.Graphics;
  dots: Array<{ x: number; y: number; size: number; color: number }>;
  speed: number; // px/s
}

interface PostalLayer {
  kind: 'postal';
  current: Phaser.GameObjects.Image;
  keys: string[];
  index: number;
  lastSwapMs: number;
  depth: number;
}

type Layer = ScrollSingleLayer | ScrollTiledLayer | ProceduralLayer | PostalLayer;

const LAYER_CONFIGS: Array<{ suffix: LayerSuffix; factor: number; depth: number }> = [
  { suffix: 'back', factor: 0.2, depth: DEPTH.PARALLAX_BACK },
  { suffix: 'mid',  factor: 0.5, depth: DEPTH.PARALLAX_MID },
  { suffix: 'fore', factor: 1.0, depth: DEPTH.PARALLAX_FORE }
];

const PROCEDURAL_COLORS: Record<LayerSuffix, number[]> = {
  back: [PALETTE.CREAM, PALETTE.GOLD],
  mid:  [PALETTE.PINK, PALETTE.GOLD, PALETTE.CREAM],
  fore: [PALETTE.RED, PALETTE.GREEN, PALETTE.CREAM]
};

// Visual Designer popula quando optar por postais. Mantido vazio até então —
// o modo POSTAL cai em procedural se a lista vier vazia ou as texturas não
// forem encontradas no cache do Phaser.
const POSTAL_SETS: Record<SceneId, string[]> = {
  menu:    [],
  fase1:   [],
  fase2:   [],
  fase3:   [],
  fase4:   [],
  fase5:   [],
  boss:    [],
  generic: []
};

export class Parallax {
  private readonly layers: Layer[] = [];
  private readonly scene: Phaser.Scene;
  private readonly sceneId: SceneId;
  private elapsed = 0;

  constructor(scene: Phaser.Scene, sceneId: SceneId = 'generic') {
    this.scene = scene;
    this.sceneId = sceneId;

    if (PARALLAX_MODE === 'postal') {
      this.buildPostalLayers();
    } else {
      this.buildScrollLayers();
    }
  }

  tick(deltaMs: number) {
    this.elapsed += deltaMs;
    for (const layer of this.layers) {
      this.tickLayer(layer, deltaMs);
    }
  }

  private tickLayer(layer: Layer, deltaMs: number) {
    if (layer.kind === 'scroll-single') {
      const dy = (layer.speed * deltaMs) / 1000;
      const next = layer.image.y - dy * layer.direction;
      if (next <= layer.minY) {
        layer.image.y = layer.minY;
        layer.direction = -1;
      } else if (next >= 0) {
        layer.image.y = 0;
        layer.direction = 1;
      } else {
        layer.image.y = next;
      }
    } else if (layer.kind === 'scroll-tiled') {
      // tilePositionY positivo: textura desliza pra baixo visualmente
      // (equivalente a câmera subindo, terreno passando atrás). Seamless
      // porque TileSprite tile-repete automaticamente.
      const dy = (layer.speed * deltaMs) / 1000;
      layer.tile.tilePositionY += dy;
    } else if (layer.kind === 'procedural') {
      const offset = (this.elapsed * layer.speed) / 1000;
      this.drawDots(layer.graphics, layer.dots, offset);
    } else if (layer.kind === 'postal') {
      this.tickPostal(layer);
    }
  }

  private buildScrollLayers() {
    for (const cfg of LAYER_CONFIGS) {
      const key = `bg-${this.sceneId}-${cfg.suffix}`;
      const speed = PARALLAX_BASE_SPEED * cfg.factor;
      if (this.scene.textures.exists(key)) {
        const tex = this.scene.textures.get(key);
        const h = tex.source?.[0]?.height ?? GAME_HEIGHT;
        const isTall = h > GAME_HEIGHT * 1.5;
        if (isTall) {
          // Largura forçada a 800; altura natural pra preservar aspect ratio.
          const img = this.scene.add.image(0, 0, key)
            .setOrigin(0, 0)
            .setDepth(cfg.depth)
            .setDisplaySize(GAME_WIDTH, h);
          this.layers.push({
            kind: 'scroll-single',
            image: img,
            speed,
            minY: -(h - GAME_HEIGHT),
            direction: 1
          });
        } else {
          const tile = this.scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, key)
            .setOrigin(0, 0)
            .setDepth(cfg.depth);
          this.layers.push({ kind: 'scroll-tiled', tile, speed });
        }
      } else {
        this.layers.push(this.makeProcedural(cfg.suffix, speed, cfg.depth));
      }
    }
  }

  private buildPostalLayers() {
    // Postal se aplica só à camada back (contexto visual da fase);
    // mid/fore seguem scroll ou procedural normalmente.
    const availablePostals = POSTAL_SETS[this.sceneId].filter((k) => this.scene.textures.exists(k));
    for (const cfg of LAYER_CONFIGS) {
      const speed = PARALLAX_BASE_SPEED * cfg.factor;
      if (cfg.suffix === 'back' && availablePostals.length >= 1) {
        const current = this.scene.add.image(0, 0, availablePostals[0])
          .setOrigin(0, 0)
          .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
          .setDepth(cfg.depth);
        this.layers.push({
          kind: 'postal',
          current,
          keys: availablePostals,
          index: 0,
          lastSwapMs: 0,
          depth: cfg.depth
        });
      } else {
        // Fallback: tenta scroll normal; se também faltar textura, cai em procedural.
        const key = `bg-${this.sceneId}-${cfg.suffix}`;
        if (this.scene.textures.exists(key)) {
          const tile = this.scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, key)
            .setOrigin(0, 0)
            .setDepth(cfg.depth);
          this.layers.push({ kind: 'scroll-tiled', tile, speed });
        } else {
          this.layers.push(this.makeProcedural(cfg.suffix, speed, cfg.depth));
        }
      }
    }
  }

  private tickPostal(layer: PostalLayer) {
    if (this.elapsed - layer.lastSwapMs < PARALLAX_POSTAL_INTERVAL_MS) return;
    if (layer.keys.length < 2) return;
    const nextIndex = (layer.index + 1) % layer.keys.length;
    const nextKey = layer.keys[nextIndex];
    const next = this.scene.add.image(0, 0, nextKey)
      .setOrigin(0, 0)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(layer.depth)
      .setAlpha(0);
    const previous = layer.current;
    this.scene.tweens.add({
      targets: next,
      alpha: 1,
      duration: PARALLAX_CROSSFADE_MS,
      ease: 'Sine.easeInOut'
    });
    this.scene.tweens.add({
      targets: previous,
      alpha: 0,
      duration: PARALLAX_CROSSFADE_MS,
      ease: 'Sine.easeInOut',
      onComplete: () => previous.destroy()
    });
    layer.current = next;
    layer.index = nextIndex;
    layer.lastSwapMs = this.elapsed;
  }

  private makeProcedural(suffix: LayerSuffix, speed: number, depth: number): ProceduralLayer {
    const dots = this.buildDots(suffix);
    const g = this.scene.add.graphics().setDepth(depth);
    this.drawDots(g, dots, 0);
    return { kind: 'procedural', graphics: g, dots, speed };
  }

  private buildDots(suffix: LayerSuffix) {
    const count = suffix === 'back' ? 50 : suffix === 'mid' ? 30 : 18;
    const maxSize = suffix === 'back' ? 2 : suffix === 'mid' ? 3 : 4;
    const colors = PROCEDURAL_COLORS[suffix];
    const result: Array<{ x: number; y: number; size: number; color: number }> = [];
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
    dots: Array<{ x: number; y: number; size: number; color: number }>,
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
