import * as Phaser from 'phaser';

export interface EnemyConfig {
  hp: number;
  points: number;
  texture: string;
  onDeath?: (points: number) => void;
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  hp: number;
  readonly points: number;
  private readonly onDeath?: (points: number) => void;

  constructor(scene: Phaser.Scene, x: number, y: number, cfg: EnemyConfig) {
    super(scene, x, y, cfg.texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    this.hp = cfg.hp;
    this.points = cfg.points;
    this.onDeath = cfg.onDeath;
  }

  takeHit(damage = 1): boolean {
    this.hp -= damage;
    this.flashTint();
    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  private flashTint() {
    this.setTint(0xf4e4c1);
    this.scene.time.delayedCall(80, () => this.clearTint());
  }

  private die() {
    this.disableBody(true, true);
    this.onDeath?.(this.points);
  }
}
