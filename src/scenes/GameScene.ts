import * as Phaser from 'phaser';
import { ENDLESS, GAME_HEIGHT, GAME_WIDTH, LOCALSTORAGE_ENDLESS_HIGHSCORE_KEY } from '../config';
import { Player } from '../entities/Player';
import { BulletGroup } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { EnemyBullet, EnemyBulletGroup } from '../entities/EnemyBullet';
import { HomingEnemyBullet, HomingEnemyBulletGroup } from '../entities/HomingEnemyBullet';
import { PowerUp, PowerUpType } from '../entities/PowerUp';
import { Action, InputManager } from '../systems/InputManager';
import { EnemySpawner } from '../systems/EnemySpawner';
import { ScoreManager } from '../systems/ScoreManager';
import { AudioManager } from '../systems/AudioManager';
import { BiomeTransition } from '../systems/BiomeTransition';
import { EndlessDirector } from '../systems/EndlessDirector';
import { Effects } from '../systems/Effects';
import { attachFullscreenToggle } from '../systems/Fullscreen';
import { TouchInput } from '../systems/TouchInput';
import { shouldUseTouchControls } from '../systems/Platform';
import { getString } from '../strings';

// Modo endless: sem fim de fase, sem boss obrigatório. Survival puro até
// morrer. O EndlessDirector coordena tempo, biomas e spawns procedurais; a
// cena só plumba colisões, HUD events e lifecycle do player.
//
// Compatibilidade: o ScoreManager original + ChainMultiplier continuam — kills
// somam pontos normalmente. Sobrevivência soma score extra via timer.
// Highscore agora persiste em LOCALSTORAGE_ENDLESS_HIGHSCORE_KEY (separado do
// highscore de story mode antigo).
export class GameScene extends Phaser.Scene {
  private player!: Player;
  private playerBullets!: BulletGroup;
  private enemyBullets!: EnemyBulletGroup;
  private homingEnemyBullets!: HomingEnemyBulletGroup;
  private powerUps!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.GameObjects.Group;
  private inputManager!: InputManager;
  private spawner!: EnemySpawner;
  private scoreManager!: ScoreManager;
  private audio!: AudioManager;
  private biome!: BiomeTransition;
  private director!: EndlessDirector;
  private fx!: Effects;
  private ended = false;
  private touchInput?: TouchInput;
  private killCount = 0;
  private survivalAccumMs = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.ended = false;
    this.survivalAccumMs = 0;

    this.biome = new BiomeTransition(this, 'fase1');
    this.biome.attachToScene();

    this.inputManager = new InputManager(this);
    if (shouldUseTouchControls()) {
      this.touchInput = new TouchInput(this);
      this.touchInput.mount();
      this.inputManager.attachTouch(this.touchInput);
    }
    this.scoreManager = new ScoreManager();
    this.scoreManager.highscoreKey = LOCALSTORAGE_ENDLESS_HIGHSCORE_KEY;
    this.audio = new AudioManager(this);
    this.fx = new Effects(this);
    attachFullscreenToggle(this);

    this.audio.playMusic('music_phase1', 800);

    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 100);
    this.player.onFire = (x, y) => {
      this.audio.play('player_fire');
      this.fx.muzzleFlash(x, y - 10);
    };
    this.playerBullets = new BulletGroup(this, 'bullet-player', 32);
    this.enemyBullets = new EnemyBulletGroup(this, 'enemy-bullet-flecha', 64);
    this.homingEnemyBullets = new HomingEnemyBulletGroup(this, 'enemy-bullet-cabeca', 16);
    this.powerUps = this.physics.add.group({ classType: PowerUp, runChildUpdate: true });
    this.enemies = this.add.group({ runChildUpdate: false });

    this.player.onDamage = (lives) => {
      this.audio.play('player_hit');
      this.fx.playerHit();
      this.scoreManager.resetChain();
      this.events.emit('hud-lives', lives);
    };
    this.player.onDeath = () => {
      this.audio.play('player_die');
      this.endGame();
    };
    this.player.onShieldBreak = (x, y) => {
      this.audio.play('shield_break');
      this.fx.shieldShatter(x, y);
    };
    this.player.onPowerUpCollected = (type) => {
      this.audio.play('pickup_sombrinha');
      this.fx.pickup(this.player.x, this.player.y);
      this.events.emit('hud-pickup-text', type);
    };

    this.scoreManager.onChange = (score, mult) => {
      this.events.emit('hud-score', score, mult);
    };
    this.scoreManager.onChainStart = () => this.audio.play('chain_multiplier');
    this.scoreManager.onChainChange = (multiplier, active) => {
      this.events.emit('hud-chain', multiplier, active);
    };
    this.scoreManager.onMilestone = (ms) => {
      this.audio.play('score_milestone');
      this.events.emit('hud-milestone', ms);
    };

    this.spawner = new EnemySpawner(
      this,
      this.enemyBullets,
      this.homingEnemyBullets,
      this.player,
      {
        onEnemySpawned: (e) => this.onEnemySpawned(e),
        onEnemyKilled: (e) => this.onEnemyKilled(e)
      },
      0,
      'procedural'
    );
    this.spawner.start();

    this.director = new EndlessDirector(this, this.spawner);

    this.registerPlayerVsEnemyBullets();

    this.scene.launch('HUDScene');
    this.time.delayedCall(50, () => {
      this.events.emit('hud-lives', this.player.lives);
      this.events.emit('hud-score', this.scoreManager.value, this.scoreManager.multiplierActive);
      this.events.emit('hud-kills', this.killCount);
      this.director.announceInitialBiome();
      // Mostra o intro do primeiro biome (overlay "Fase 1" reaproveitado)
      this.events.emit('hud-phase-intro', getString('stage.1.name'), getString('stage.1.subtitle'), 1);
      this.audio.play('phase_intro');
    });

    // Escuta as trocas de bioma pra feedback HUD (intro de novo biome).
    this.events.on(
      'endless-biome-change',
      (
        _sceneId: string,
        _shortLabel: string,
        nameKey: string,
        subtitleKey: string,
        biomeIndex: number,
        loopIndex: number,
        initial: boolean
      ) => {
        if (initial) return;
        const displayNum = (biomeIndex % 3) + 1 + loopIndex * 3;
        this.events.emit('hud-phase-intro', getString(nameKey), getString(subtitleKey), displayNum);
        this.audio.play('phase_intro');
      }
    );
  }

  override update(time: number, delta: number) {
    this.biome.tick(delta);
    this.touchInput?.update(time);
    if (this.ended) return;
    if (this.inputManager.justPressed(Action.PAUSE)) {
      this.pauseGame();
      return;
    }
    this.player.tick(time, this.inputManager, this.playerBullets);
    this.scoreManager.tick(time);
    this.director.tick(time, delta);

    // Survival score: +ENDLESS.SURVIVAL_POINTS_PER_SEC a cada 1000ms decorridos
    this.survivalAccumMs += delta;
    if (this.survivalAccumMs >= 1000) {
      const seconds = Math.floor(this.survivalAccumMs / 1000);
      this.survivalAccumMs -= seconds * 1000;
      this.scoreManager.addSurvivalPoints(seconds * ENDLESS.SURVIVAL_POINTS_PER_SEC);
    }
  }

  private pauseGame() {
    this.scene.pause();
    this.scene.pause('HUDScene');
    this.scene.launch('PauseScene');
  }

  private registerPlayerVsEnemyBullets() {
    this.physics.add.overlap(this.player, this.enemyBullets, (_p, bulletObj) => {
      const bullet = bulletObj as EnemyBullet;
      if (!bullet.active) return;
      if (this.player.takeDamage(this.time.now)) {
        bullet.disableBody(true, true);
      }
    });
    this.physics.add.overlap(this.player, this.homingEnemyBullets, (_p, bulletObj) => {
      const bullet = bulletObj as HomingEnemyBullet;
      if (!bullet.active) return;
      if (this.player.takeDamage(this.time.now)) {
        bullet.disableBody(true, true);
      }
    });
    this.physics.add.overlap(this.player, this.powerUps, (_p, puObj) => {
      const pu = puObj as PowerUp;
      if (!pu.active) return;
      pu.collect();
      this.player.applyPowerUp(pu.type);
    });
  }

  private onEnemySpawned(enemy: Enemy) {
    this.enemies.add(enemy);
    this.physics.add.overlap(enemy, this.playerBullets, (enemyObj, bulletObj) => {
      const bullet = bulletObj as Phaser.Physics.Arcade.Sprite;
      const e = enemyObj as Enemy;
      if (!bullet.active || !e.active) return;
      bullet.disableBody(true, true);
      this.audio.play('enemy_hit');
      e.takeHit(1);
    });
    this.physics.add.overlap(this.player, enemy, (_p, enemyObj) => {
      const e = enemyObj as Enemy;
      if (!e.active) return;
      if (this.player.takeDamage(this.time.now)) {
        e.takeHit(99);
      }
    });
  }

  private onEnemyKilled(enemy: Enemy) {
    this.audio.play('enemy_explode_small');
    // Pivot juice 2026-04-21: enemyDeath recebe points pra score popup.
    this.fx.enemyDeath(enemy.x, enemy.y, enemy.points);
    this.killCount += 1;
    this.events.emit('hud-kills', this.killCount);
    this.scoreManager.registerKill(enemy.points, this.time.now);
    this.maybeDropPowerUp(enemy.x, enemy.y);
  }

  private maybeDropPowerUp(x: number, y: number) {
    const dropRate = (window as unknown as { __DEBUG_POWERUP_RATE?: number }).__DEBUG_POWERUP_RATE ?? 0.15;
    if (Math.random() >= dropRate) return;
    const type: PowerUpType = 'sombrinha';
    const pu = new PowerUp(this, x, y, type);
    this.powerUps.add(pu);
  }

  private endGame() {
    if (this.ended) return;
    this.ended = true;
    this.director.stop();
    this.scoreManager.saveHighscore();
    this.audio.stopMusic(400);
    this.scene.stop('HUDScene');
    this.time.delayedCall(600, () => {
      this.scene.start('GameOverScene', { score: this.scoreManager.value, victory: false });
    });
  }
}
