import * as Phaser from 'phaser';
import { Enemy } from '../Enemy';
import { EnemyBulletGroup } from '../EnemyBullet';

export type ZigzagStartDir = 'left' | 'right';

export interface PassistaParams {
  zigzagStartDir?: ZigzagStartDir;
}

const SPEED_Y = 95;
const AMPLITUDE = 150;
const PERIOD_MS = 2200;
const BOMB_INTERVAL_MS = 2500;
const BOMB_VX = 0;
const BOMB_VY = 160;
const BOMB_GRAVITY = 400;

export class PassistaFrevo extends Enemy {
  private readonly baseX: number;
  private readonly phaseOffset: number;
  private lastBombAt = 0;
  private readonly enemyBullets: EnemyBulletGroup;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemyBullets: EnemyBulletGroup,
    params: PassistaParams,
    onDeath: (enemy: Enemy) => void
  ) {
    super(scene, x, y, { hp: 1, points: 100, texture: 'enemy-passista', onDeath });
    this.baseX = x;
    this.phaseOffset = params.zigzagStartDir === 'left' ? Math.PI : 0;
    this.enemyBullets = enemyBullets;
    this.setVelocity(0, SPEED_Y);
  }

  protected override onTick(time: number, _delta: number) {
    const t = (time - this.spawnedAt) / PERIOD_MS;
    const offsetX = Math.sin(t * Math.PI * 2 + this.phaseOffset) * AMPLITUDE;
    this.x = this.baseX + offsetX;

    if (time - this.lastBombAt >= BOMB_INTERVAL_MS && this.lastBombAt > 0) {
      this.enemyBullets.fireParabolic(this.x, this.y + 16, BOMB_VX, BOMB_VY, BOMB_GRAVITY);
      this.lastBombAt = time;
    } else if (this.lastBombAt === 0) {
      this.lastBombAt = time;
    }
  }
}
