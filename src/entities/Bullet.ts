import * as Phaser from 'phaser';
import { BULLET_SPEED } from '../config';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
  }

  fire(x: number, y: number, directionY: number) {
    this.enableBody(true, x, y, true, true);
    this.setVelocity(0, BULLET_SPEED * directionY);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (this.y < -20 || this.y > (this.scene.scale.height + 20)) {
      this.disableBody(true, true);
    }
  }
}

export class BulletGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene, texture: string, max = 32) {
    super(scene.physics.world, scene, {
      classType: Bullet,
      defaultKey: texture,
      maxSize: max,
      runChildUpdate: true,
      createCallback: (go) => {
        (go as Bullet).setName(`bullet-${Phaser.Math.RND.uuid()}`);
      }
    });
  }

  fireFrom(x: number, y: number, directionY = -1): Bullet | null {
    const bullet = this.get(x, y) as Bullet | null;
    if (!bullet) return null;
    bullet.fire(x, y, directionY);
    return bullet;
  }
}
