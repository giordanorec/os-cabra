import * as Phaser from 'phaser';
import { Enemy } from '../Enemy';

const CENTER_SPEED_Y = 100;
const ORBIT_AMPLITUDE = 40;
const ORBIT_PERIOD_MS = 1200;

export interface MoscaParams {
  orbitOffsetRad?: number;
}

export class MoscaManga extends Enemy {
  private readonly centerX: number;
  private readonly centerStartY: number;
  private readonly orbitOffset: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    params: MoscaParams,
    onDeath: (enemy: Enemy) => void
  ) {
    // Mosca é 14×14 — scale 3x → 42px (~7% altura, suficiente pro swarm ainda parecer nuvem)
    super(scene, x, y, { hp: 1, points: 10, texture: 'enemy-mosca', scale: 3, onDeath });
    this.centerX = x;
    this.centerStartY = y;
    this.orbitOffset = params.orbitOffsetRad ?? 0;
    this.setVelocity(0, CENTER_SPEED_Y);
  }

  protected override onTick(time: number, _delta: number) {
    const t = (time - this.spawnedAt) / ORBIT_PERIOD_MS;
    const phase = t * Math.PI * 2 + this.orbitOffset;
    const cy = this.centerStartY + ((time - this.spawnedAt) / 1000) * CENTER_SPEED_Y;
    this.x = this.centerX + Math.cos(phase) * ORBIT_AMPLITUDE;
    this.y = cy + Math.sin(phase) * ORBIT_AMPLITUDE;
    this.setVelocity(0, 0);
  }
}
