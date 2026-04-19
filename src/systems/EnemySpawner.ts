import * as Phaser from 'phaser';
import { fase1Waves, Wave, Spawn, CaboclinhoOverride, PassistaOverride } from './waves/fase1';
import { Enemy } from '../entities/Enemy';
import { Caboclinho } from '../entities/enemies/Caboclinho';
import { PassistaFrevo } from '../entities/enemies/PassistaFrevo';
import { MoscaManga } from '../entities/enemies/MoscaManga';
import { EnemyBulletGroup } from '../entities/EnemyBullet';

export interface SpawnerEvents {
  onEnemySpawned: (enemy: Enemy) => void;
  onEnemyKilled: (enemy: Enemy) => void;
  onCheckpoint: (waveIndex: number) => void;
  onAllWavesCleared: () => void;
}

export class EnemySpawner {
  private readonly waves: Wave[];
  private currentWave = 0;
  private waveSpawning = false;
  private readonly aliveEnemies = new Set<Enemy>();

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly enemyBullets: EnemyBulletGroup,
    private readonly events: SpawnerEvents,
    startWaveIndex = 0
  ) {
    this.waves = fase1Waves;
    this.currentWave = startWaveIndex;
  }

  start() {
    this.scheduleNextWave();
  }

  private scheduleNextWave() {
    if (this.currentWave >= this.waves.length) {
      this.events.onAllWavesCleared();
      return;
    }
    this.waveSpawning = true;
    const wave = this.waves[this.currentWave];
    this.scene.time.delayedCall(wave.delayAfterPreviousMs, () => this.spawnWave(wave));
  }

  private spawnWave(wave: Wave) {
    this.waveSpawning = true;
    let lastDelay = 0;
    wave.spawns.forEach((spawn) => {
      this.scene.time.delayedCall(spawn.delayMs, () => this.spawnOne(spawn));
      if (spawn.delayMs > lastDelay) lastDelay = spawn.delayMs;
    });
    this.scene.time.delayedCall(lastDelay + 50, () => {
      this.waveSpawning = false;
    });
  }

  private spawnOne(spawn: Spawn) {
    let enemy: Enemy | null = null;
    const y = -30;
    const onDeath = (e: Enemy) => this.handleEnemyKilled(e);
    if (spawn.type === 'caboclinho') {
      const p = (spawn.paramOverride ?? {}) as CaboclinhoOverride;
      enemy = new Caboclinho(this.scene, spawn.x, y, this.enemyBullets, p, onDeath);
    } else if (spawn.type === 'passistaFrevo') {
      const p = (spawn.paramOverride ?? {}) as PassistaOverride;
      enemy = new PassistaFrevo(this.scene, spawn.x, y, this.enemyBullets, p, onDeath);
    } else if (spawn.type === 'moscaManga') {
      const offset = (spawn.x / 60) % (Math.PI * 2);
      enemy = new MoscaManga(this.scene, spawn.x, y, { orbitOffsetRad: offset }, onDeath);
    }
    if (enemy) {
      this.aliveEnemies.add(enemy);
      enemy.on('destroy', () => this.aliveEnemies.delete(enemy!));
      this.events.onEnemySpawned(enemy);
    }
  }

  private handleEnemyKilled(enemy: Enemy) {
    this.aliveEnemies.delete(enemy);
    this.events.onEnemyKilled(enemy);
  }

  tick() {
    if (this.waveSpawning) return;
    this.cleanupDeadRefs();
    if (this.aliveEnemies.size === 0) {
      const justCleared = this.waves[this.currentWave];
      if (justCleared?.checkpointOnClear) {
        this.events.onCheckpoint(this.currentWave);
      }
      this.currentWave += 1;
      this.scheduleNextWave();
    }
  }

  private cleanupDeadRefs() {
    for (const e of this.aliveEnemies) {
      if (!e.active) this.aliveEnemies.delete(e);
    }
  }

  get currentWaveIndex(): number {
    return this.currentWave;
  }

  isIdle(): boolean {
    return !this.waveSpawning && this.aliveEnemies.size === 0;
  }
}
