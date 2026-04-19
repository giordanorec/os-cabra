import * as Phaser from 'phaser';
import { Enemy } from '../Enemy';
import { EnemyBulletGroup } from '../EnemyBullet';

export interface CaboclinhoParams {
  canFire?: boolean;
  diagonalInward?: boolean;
  speedY?: number;
}

const DEFAULT_SPEED_Y = 150;
const FLECHA_SPEED = 260;
const FIRE_AT_Y = 200;

export class Caboclinho extends Enemy {
  private readonly params: Required<CaboclinhoParams>;
  private hasFired = false;
  private readonly enemyBullets: EnemyBulletGroup;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemyBullets: EnemyBulletGroup,
    params: CaboclinhoParams,
    onDeath: (enemy: Enemy) => void
  ) {
    super(scene, x, y, { hp: 1, points: 120, texture: 'enemy-caboclinho', onDeath });
    this.params = {
      canFire: params.canFire ?? true,
      diagonalInward: params.diagonalInward ?? false,
      speedY: params.speedY ?? DEFAULT_SPEED_Y
    };
    this.enemyBullets = enemyBullets;
    this.startMovement();
  }

  private startMovement() {
    if (this.params.diagonalInward) {
      const cx = (this.scene.scale.width ?? 800) / 2;
      const angleSign = this.x < cx ? 1 : -1;
      const angleDeg = 30;
      const rad = Phaser.Math.DegToRad(angleDeg);
      this.setVelocity(Math.sin(rad) * this.params.speedY * angleSign, Math.cos(rad) * this.params.speedY);
    } else {
      this.setVelocity(0, this.params.speedY);
    }
  }

  protected override onTick(_time: number, _delta: number) {
    if (!this.hasFired && this.params.canFire && this.y >= FIRE_AT_Y) {
      this.enemyBullets.fireLinear(this.x, this.y + 14, 0, FLECHA_SPEED);
      this.hasFired = true;
    }
  }
}
