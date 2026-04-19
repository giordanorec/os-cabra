import Phaser from 'phaser';

/**
 * Scaffold placeholder. O Gameplay Developer vai substituir este arquivo
 * por uma BootScene real que carrega o mínimo e transfere para a PreloadScene.
 * Ver docs/TECH_SPEC.md seção "Fluxo de cenas".
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2 - 40, 'OS CABRA', {
      fontFamily: 'sans-serif',
      fontSize: '56px',
      color: '#ffd27a',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20,
      'Scaffold rodando — Gameplay Developer assume daqui.',
      {
        fontFamily: 'sans-serif',
        fontSize: '16px',
        color: '#cccccc'
      }
    ).setOrigin(0.5);

    this.add.text(width / 2, height - 24, 'v0.0.1', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#666666'
    }).setOrigin(0.5);
  }
}
