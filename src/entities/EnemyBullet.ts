import * as Phaser from 'phaser';
import { DEPTH, GAME_HEIGHT, GAME_WIDTH } from '../config';

export class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.setDepth(DEPTH.ENEMY_BULLET);
  }

  fire(x: number, y: number, vx: number, vy: number, gravityY = 0) {
    this.enableBody(true, x, y, true, true);
    this.setVelocity(vx, vy);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(gravityY !== 0);
    body.setGravityY(gravityY);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (this.x < -40 || this.x > GAME_WIDTH + 40 || this.y > GAME_HEIGHT + 40 || this.y < -40) {
      this.disableBody(true, true);
    }
  }
}

export class EnemyBulletGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene, texture: string, max = 48) {
    super(scene.physics.world, scene, {
      classType: EnemyBullet,
      defaultKey: texture,
      maxSize: max,
      runChildUpdate: true
    });
  }

  fireLinear(x: number, y: number, vx: number, vy: number): EnemyBullet | null {
    const b = this.get(x, y) as EnemyBullet | null;
    if (!b) return null;
    b.fire(x, y, vx, vy, 0);
    return b;
  }

  fireParabolic(x: number, y: number, vx: number, vy: number, gravityY: number): EnemyBullet | null {
    const b = this.get(x, y) as EnemyBullet | null;
    if (!b) return null;
    b.fire(x, y, vx, vy, gravityY);
    return b;
  }
}
