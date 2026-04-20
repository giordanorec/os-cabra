import * as Phaser from 'phaser';
import { DEPTH, GAME_HEIGHT, GAME_WIDTH } from '../config';

export interface EnemyConfig {
  hp: number;
  points: number;
  texture: string;
  scale?: number;
  onDeath?: (enemy: Enemy) => void;
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  hp: number;
  readonly points: number;
  private readonly onDeath?: (enemy: Enemy) => void;
  protected spawnedAt = 0;

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
    this.setDepth(DEPTH.ENEMY);
    // Sprites de origem 14-32px são pequenos pra visibilidade desejada
    // (enemies ~7-10% da altura = 42-60px). Escala via opção, até sprites
    // finais do Visual Designer já virem em 80-96px.
    const scale = cfg.scale ?? 2;
    if (scale !== 1) this.setScale(scale);
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
    this.onDeath?.(this);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (!this.active) return;
    if (this.spawnedAt === 0) this.spawnedAt = time;
    this.onTick(time, delta);
    if (this.isOffscreen()) {
      this.disableBody(true, true);
    }
  }

  protected onTick(_time: number, _delta: number) {
    // override em subclasses
  }

  private isOffscreen(): boolean {
    return this.y > GAME_HEIGHT + 60 || this.x < -60 || this.x > GAME_WIDTH + 60;
  }
}
