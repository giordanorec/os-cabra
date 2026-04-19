import * as Phaser from 'phaser';
import { PLAYER_SPEED, PLAYER_FIRE_COOLDOWN_MS } from '../config';
import { Action, InputManager } from '../systems/InputManager';
import { BulletGroup } from './Bullet';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private lastFireMs = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  tick(time: number, input: InputManager, bullets: BulletGroup) {
    const left = input.isPressed(Action.MOVE_LEFT);
    const right = input.isPressed(Action.MOVE_RIGHT);
    let vx = 0;
    if (left) vx -= PLAYER_SPEED;
    if (right) vx += PLAYER_SPEED;
    this.setVelocityX(vx);

    if (input.isPressed(Action.FIRE) && time - this.lastFireMs >= PLAYER_FIRE_COOLDOWN_MS) {
      bullets.fireFrom(this.x, this.y - this.height / 2, -1);
      this.lastFireMs = time;
    }
  }
}
