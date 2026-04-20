import * as Phaser from 'phaser';

// Attach a keyboard shortcut `[F]` to toggle browser fullscreen.
// Phaser.Scale exige user gesture — teclado conta, touch/click conta.
// Safe to call múltiplas vezes por scene; Phaser dedupe via addKey.

export function attachFullscreenToggle(scene: Phaser.Scene) {
  const kb = scene.input.keyboard;
  if (!kb) return;
  const fKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.F);
  fKey.on('down', () => {
    scene.scale.toggleFullscreen();
  });
}

// Elemento clicável (ícone de expansão) — retorna o GameObject pra quem quiser posicionar.
export function addFullscreenButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  size = 28
): Phaser.GameObjects.Container {
  const g = scene.add.graphics();
  const container = scene.add.container(x, y);
  redraw(g, size);
  container.add(g);
  container.setSize(size, size);
  container.setInteractive(new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size), Phaser.Geom.Rectangle.Contains);
  container.on('pointerover', () => {
    g.clear();
    redraw(g, size, 0xf0c840, 0xfff2cc);
  });
  container.on('pointerout', () => {
    g.clear();
    redraw(g, size);
  });
  container.on('pointerdown', () => scene.scale.toggleFullscreen());
  return container;
}

function redraw(g: Phaser.GameObjects.Graphics, size: number, stroke = 0xfff2cc, fill?: number) {
  const half = size / 2;
  const corner = size / 5;
  g.lineStyle(2, stroke, 1);
  if (fill !== undefined) {
    g.fillStyle(fill, 0.3);
    g.fillRect(-half, -half, size, size);
  }
  // 4 canto "[ ]"
  g.beginPath();
  g.moveTo(-half, -half + corner);
  g.lineTo(-half, -half);
  g.lineTo(-half + corner, -half);
  g.moveTo(half - corner, -half);
  g.lineTo(half, -half);
  g.lineTo(half, -half + corner);
  g.moveTo(half, half - corner);
  g.lineTo(half, half);
  g.lineTo(half - corner, half);
  g.moveTo(-half + corner, half);
  g.lineTo(-half, half);
  g.lineTo(-half, half - corner);
  g.strokePath();
}
