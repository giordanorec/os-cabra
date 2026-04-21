import * as Phaser from 'phaser';
import {
  ENDLESS,
  ENDLESS_BIOMES,
  ENDLESS_UNLOCK_TABLE,
  GAME_WIDTH
} from '../config';
import { EnemySpawner } from './EnemySpawner';
import { EnemyType } from './waves/fase1';

// EndlessDirector: controla o fluxo do modo endless.
//
// Responsabilidades:
//  - Mede tempo decorrido (elapsedMs) e biome atual (biomeIndex).
//  - Ordena o EnemySpawner em modo procedural: a cada N ms, spawna K inimigos
//    escolhidos do pool liberado. N e K escalam com biomeIndex/loopIndex.
//  - Dispara eventos para a cena/HUD:
//      'endless-biome-change' (newSceneId, shortLabel, nameKey, subtitleKey, biomeIndex, loopIndex)
//      'endless-tick' (elapsedMs, distanceMeters, biomeShortLabel, loopIndex)
//
// Não renderiza nada — só coordena. Parallax/BiomeTransition reagem a
// 'endless-biome-change' e fazem o crossfade visual.
export class EndlessDirector {
  private readonly scene: Phaser.Scene;
  private readonly spawner: EnemySpawner;
  private elapsedMs = 0;
  private biomeIndex = 0;
  private nextBiomeSwapAtMs: number;
  private nextSpawnAtMs: number;
  private running = true;

  constructor(scene: Phaser.Scene, spawner: EnemySpawner, startOffsetMs = 0) {
    this.scene = scene;
    this.spawner = spawner;
    this.elapsedMs = startOffsetMs;
    this.nextBiomeSwapAtMs = ENDLESS.BIOME_DURATION_MS;
    this.nextSpawnAtMs = 1_500; // primeira leva começa após 1.5s (telegraph)
  }

  stop() {
    this.running = false;
  }

  get elapsedSeconds(): number {
    return this.elapsedMs / 1000;
  }

  get distanceMeters(): number {
    return Math.floor((this.elapsedMs / 1000) * ENDLESS.METERS_PER_SECOND);
  }

  get biomeLoop(): { loop: number; indexInLoop: number } {
    const loop = Math.floor(this.biomeIndex / ENDLESS_BIOMES.length);
    const indexInLoop = this.biomeIndex % ENDLESS_BIOMES.length;
    return { loop, indexInLoop };
  }

  get currentBiomeShortLabel(): string {
    return ENDLESS_BIOMES[this.biomeLoop.indexInLoop].shortLabel;
  }

  /**
   * Chamado pela GameScene logo após instanciar.
   * Emite o primeiro biome-change pra o HUD/Parallax reagirem.
   */
  announceInitialBiome() {
    this.emitBiomeChange(true);
  }

  tick(_time: number, deltaMs: number) {
    if (!this.running) return;
    this.elapsedMs += deltaMs;

    // ── Swap de bioma ──
    if (this.elapsedMs >= this.nextBiomeSwapAtMs) {
      this.biomeIndex += 1;
      this.nextBiomeSwapAtMs += ENDLESS.BIOME_DURATION_MS;
      this.emitBiomeChange(false);
    }

    // ── Spawns procedurais ──
    if (this.elapsedMs >= this.nextSpawnAtMs) {
      this.doSpawnGroup();
      this.nextSpawnAtMs += this.currentSpawnIntervalMs();
    }

    // ── Tick do HUD (baixa frequência seria ideal, mas 60fps text setText é barato) ──
    this.scene.events.emit(
      'endless-tick',
      this.elapsedMs,
      this.distanceMeters,
      this.currentBiomeShortLabel,
      this.biomeLoop.loop
    );
  }

  private currentSpawnIntervalMs(): number {
    const base = ENDLESS.BASE_SPAWN_INTERVAL_MS * Math.pow(ENDLESS.CADENCE_DECAY, this.biomeIndex);
    const loopMult = Math.pow(ENDLESS.LOOP_SPAWN_MULT, this.biomeLoop.loop);
    return Math.max(ENDLESS.FLOOR_SPAWN_INTERVAL_MS, Math.floor(base * loopMult));
  }

  private currentGroupSize(): number {
    let size = 1;
    for (const step of ENDLESS.GROUP_SIZE_STEPS) {
      if (this.biomeIndex >= step.afterBiome) size = step.size;
    }
    return size;
  }

  private unlockedTypes(): EnemyType[] {
    const unlocked = new Set<EnemyType>();
    for (const row of ENDLESS_UNLOCK_TABLE) {
      if (this.biomeIndex >= row.afterBiome) unlocked.add(row.type as EnemyType);
    }
    if (unlocked.size === 0) unlocked.add('caboclinho');
    return Array.from(unlocked);
  }

  private doSpawnGroup() {
    const pool = this.unlockedTypes();
    const size = this.currentGroupSize();
    // Distribui os spawns horizontalmente em faixas pra não empilharem.
    const band = GAME_WIDTH / (size + 1);
    for (let i = 0; i < size; i++) {
      const type = pool[Math.floor(Math.random() * pool.length)];
      const xBase = band * (i + 1);
      const jitter = Phaser.Math.Between(-40, 40);
      const x = Phaser.Math.Clamp(xBase + jitter, 60, GAME_WIDTH - 60);
      // Pequeno escalonamento temporal (0..180ms) pra formação natural.
      const stagger = i * 140;
      this.scene.time.delayedCall(stagger, () => this.spawner.spawnType(type, x));
    }
  }

  private emitBiomeChange(initial: boolean) {
    const { loop, indexInLoop } = this.biomeLoop;
    const biome = ENDLESS_BIOMES[indexInLoop];
    this.scene.events.emit(
      'endless-biome-change',
      biome.sceneId,
      biome.shortLabel,
      biome.nameKey,
      biome.subtitleKey,
      this.biomeIndex,
      loop,
      initial
    );
  }
}
