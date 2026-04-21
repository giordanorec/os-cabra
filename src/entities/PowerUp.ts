import * as Phaser from 'phaser';
import { DEPTH, GAME_HEIGHT } from '../config';

export type PowerUpType = 'sombrinha' | 'fogo-triplo' | 'cachaca' | 'tapioca' | 'baque-virado';

export interface PowerUpSpec {
  texture: string;
  scale: number;
  tint?: number;
}

// Só sombrinha implementada por enquanto. Demais entram em iterações futuras.
const POWERUP_SPECS: Record<PowerUpType, PowerUpSpec> = {
  sombrinha:     { texture: 'powerup-sombrinha', scale: 1 },
  'fogo-triplo': { texture: 'powerup-sombrinha', scale: 1, tint: 0xe84a4a },
  cachaca:       { texture: 'powerup-sombrinha', scale: 1, tint: 0xf0c840 },
  tapioca:       { texture: 'powerup-sombrinha', scale: 1, tint: 0xfff2cc },
  'baque-virado':{ texture: 'powerup-sombrinha', scale: 1, tint: 0x8dc850 }
};

const FLOAT_AMPLITUDE = 4;
const FLOAT_PERIOD_MS = 1000;
const DRIFT_DOWN_SPEED = 40;
const AUTO_DESTROY_MS = 8000;

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  readonly type: PowerUpType;
  private readonly baseY: number;
  private spawnedAt = 0;
  private destroyTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType) {
    const spec = POWERUP_SPECS[type];
    super(scene, x, y, spec.texture);
    this.type = type;
    this.baseY = y;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    this.setDepth(DEPTH.ENEMY + 1);
    this.setScale(spec.scale);
    if (spec.tint) this.setTint(spec.tint);
    this.setVelocity(0, DRIFT_DOWN_SPEED);
    this.destroyTimer = scene.time.delayedCall(AUTO_DESTROY_MS, () => {
      if (this.active) this.disableBody(true, true);
    });
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (!this.active) return;
    if (this.spawnedAt === 0) this.spawnedAt = time;
    // Float y sine em torno da posição derivada do drift
    const driftedY = this.baseY + ((time - this.spawnedAt) / 1000) * DRIFT_DOWN_SPEED;
    const phase = ((time - this.spawnedAt) / FLOAT_PERIOD_MS) * Math.PI * 2;
    this.y = driftedY + Math.sin(phase) * FLOAT_AMPLITUDE;
    if (this.y > GAME_HEIGHT + 40) {
      this.disableBody(true, true);
    }
  }

  collect() {
    this.destroyTimer?.remove();
    this.disableBody(true, true);
  }
}
