import * as Phaser from 'phaser';
import { DEPTH } from '../config';

// Wrapper de efeitos visuais conforme UX_SPEC §6 (tabela de feedback).

export class Effects {
  constructor(private readonly scene: Phaser.Scene) {}

  // Inimigo atingido: tint branco 80ms + SFX handled via event
  tintHit(sprite: Phaser.GameObjects.Sprite) {
    sprite.setTint(0xf4e4c1);
    this.scene.time.delayedCall(80, () => {
      if (sprite.active) sprite.clearTint();
    });
  }

  // Player toma dano: red flash 120ms + shake medio 250ms
  playerHit() {
    this.scene.cameras.main.flash(120, 184, 74, 46);
    this.scene.cameras.main.shake(250, 0.006);
  }

  // Inimigo morre: shake leve 120ms + partículas (spark)
  enemyDeath(x: number, y: number) {
    this.scene.cameras.main.shake(120, 0.003);
    this.spawnBurst(x, y, 'vfx-spark', 6, 120);
  }

  // Boss hit: tint + flash freeze 80ms
  bossHit(sprite: Phaser.GameObjects.Sprite) {
    this.tintHit(sprite);
    this.scene.cameras.main.flash(60, 244, 228, 193);
  }

  // Boss phase change: freeze 400ms + flash branco
  bossPhaseChange() {
    this.scene.cameras.main.flash(150, 244, 228, 193);
    this.scene.cameras.main.shake(250, 0.008);
  }

  // Boss derrotado: shake forte 500ms + flash branco + partículas
  bossDefeated(x: number, y: number) {
    this.scene.cameras.main.flash(150, 255, 255, 255);
    this.scene.cameras.main.shake(500, 0.012);
    this.spawnBurst(x, y, 'vfx-ember', 20, 500);
  }

  // Player atira: muzzle flash pequeno
  muzzleFlash(x: number, y: number) {
    this.spawnBurst(x, y, 'vfx-spark', 3, 80);
  }

  // Power-up pego: flash + partículas douradas
  pickup(x: number, y: number) {
    this.scene.cameras.main.flash(120, 212, 160, 76);
    this.spawnBurst(x, y, 'vfx-ember', 10, 400);
  }

  private spawnBurst(x: number, y: number, key: string, count: number, lifespan: number) {
    if (!this.scene.textures.exists(key)) return;
    const emitter = this.scene.add.particles(x, y, key, {
      speed: { min: 60, max: 180 },
      angle: { min: 0, max: 360 },
      lifespan,
      quantity: count,
      scale: { start: 1.2, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD'
    });
    emitter.setDepth(DEPTH.VFX);
    this.scene.time.delayedCall(lifespan + 50, () => emitter.destroy());
  }
}
