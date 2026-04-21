import * as Phaser from 'phaser';
import { DEPTH } from '../config';
import { FONTS } from '../fonts';

// Wrapper de efeitos visuais conforme UX_SPEC §6 (tabela de feedback).
// Pivot juice 2026-04-21: usuário reclamou "sem impacto, sem explosão" — o
// enemyDeath e muzzleFlash foram beefados aqui com mais partículas, shake
// mais forte e score pop-up flutuante.

export class Effects {
  constructor(private readonly scene: Phaser.Scene) {}

  // Inimigo atingido: tint branco 80ms + SFX handled via event
  tintHit(sprite: Phaser.GameObjects.Sprite) {
    sprite.setTint(0xf4e4c1);
    this.scene.time.delayedCall(80, () => {
      if (sprite.active) sprite.clearTint();
    });
  }

  // Player toma dano: red flash + shake forte 8px 300ms.
  playerHit() {
    this.scene.cameras.main.flash(160, 232, 74, 74);
    this.scene.cameras.main.shake(300, 0.013);
  }

  // Inimigo morre: burst grande de partículas em 360° + shake + score popup.
  // Pivot juice: passou de 6 para 14 partículas, shake de 0.003 → 0.008,
  // lifespan 120 → 380 pra plumagem visível.
  enemyDeath(x: number, y: number, points = 0) {
    this.scene.cameras.main.shake(180, 0.008);
    this.spawnBurst(x, y, 'vfx-spark', 10, 380, { min: 180, max: 300 });
    this.spawnBurst(x, y, 'vfx-ember', 6, 460, { min: 120, max: 220 });
    if (points > 0) this.scorePopup(x, y, points);
  }

  // Texto flutuante "+100" subindo e fadeando — feedback de kill.
  scorePopup(x: number, y: number, points: number) {
    const txt = this.scene.add.text(x, y, `+${points}`, {
      fontFamily: FONTS.MONO,
      fontSize: '22px',
      color: '#f0c840',
      stroke: '#1a0f08',
      strokeThickness: 4,
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5).setDepth(DEPTH.VFX).setScale(0.6);
    this.scene.tweens.add({
      targets: txt,
      scale: 1.1,
      duration: 120,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: txt,
          y: y - 50,
          alpha: 0,
          duration: 520,
          ease: 'Sine.easeOut',
          onComplete: () => txt.destroy()
        });
      }
    });
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

  // Player atira: muzzle flash maior (de 3 para 8 faíscas) + shake mínimo.
  muzzleFlash(x: number, y: number) {
    this.spawnBurst(x, y, 'vfx-spark', 8, 180, { min: 80, max: 180 });
    this.scene.cameras.main.shake(60, 0.002);
  }

  // Power-up pego: flash + partículas douradas
  pickup(x: number, y: number) {
    this.scene.cameras.main.flash(120, 212, 160, 76);
    this.spawnBurst(x, y, 'vfx-ember', 14, 500, { min: 100, max: 240 });
  }

  // Sombrinha absorve hit: shatter de fragmentos dourados em todas direções
  shieldShatter(x: number, y: number) {
    this.scene.cameras.main.flash(100, 240, 200, 76);
    this.spawnBurst(x, y, 'vfx-shield-shatter', 14, 500);
  }

  private spawnBurst(
    x: number,
    y: number,
    key: string,
    count: number,
    lifespan: number,
    speed: { min: number; max: number } = { min: 60, max: 180 }
  ) {
    if (!this.scene.textures.exists(key)) return;
    const emitter = this.scene.add.particles(x, y, key, {
      speed,
      angle: { min: 0, max: 360 },
      lifespan,
      quantity: count,
      scale: { start: 1.4, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD'
    });
    emitter.setDepth(DEPTH.VFX);
    this.scene.time.delayedCall(lifespan + 50, () => emitter.destroy());
  }
}
