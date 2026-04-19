import * as Phaser from 'phaser';

export class BossMember extends Phaser.Physics.Arcade.Sprite {
  onHit?: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
  }

  flash() {
    this.setTint(0xf4e4c1);
    this.scene.time.delayedCall(80, () => {
      if (this.active) this.clearTint();
    });
  }

  takeHit() {
    this.flash();
    this.onHit?.();
  }
}
