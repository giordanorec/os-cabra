import * as Phaser from 'phaser';
import { BossMember } from './BossMember';
import { EnemyBulletGroup } from '../entities/EnemyBullet';
import { Player } from '../entities/Player';
import { GAME_WIDTH } from '../config';

type Phase = 'A' | 'B' | 'C';

const BOSS_HP_MAX = 80;
const FORM_Y = 120;
const FORM_REI_X = 320;
const FORM_RAINHA_X = 480;
const FORM_CALUNGA_X = GAME_WIDTH / 2;
const FAN_SPEED = 200;
const BURST_SPEED = 300;
const HOMING_SPEED = 160;
const CALUNGA_HOMING_HP = 3;
const CALUNGA_RESPAWN_MS = 1500;
const THRESHOLD_B = Math.round(BOSS_HP_MAX * (2 / 3));
const THRESHOLD_C = Math.round(BOSS_HP_MAX / 3);

export interface BossEvents {
  onPhaseChange: (phase: Phase, hp: number, hpMax: number) => void;
  onDefeated: () => void;
  onHPChange: (hp: number, hpMax: number) => void;
}

export class MaracatuNacao {
  readonly rei: BossMember;
  readonly rainha: BossMember;
  readonly calunga: BossMember;
  hp = BOSS_HP_MAX;
  private phase: Phase = 'A';
  private nextFanAt = 0;
  private nextBurstAt = 0;
  private nextHomingAt = 0;
  private calungaMode: 'idle' | 'homing' | 'dead' = 'idle';
  private calungaHomingHP = CALUNGA_HOMING_HP;
  private calungaRespawnAt = 0;
  private swayT0 = 0;
  private defeated = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly enemyBullets: EnemyBulletGroup,
    private readonly getPlayer: () => Player,
    private readonly events: BossEvents
  ) {
    this.rei = new BossMember(scene, FORM_REI_X, -50, 'boss-rei');
    this.rainha = new BossMember(scene, FORM_RAINHA_X, -50, 'boss-rainha');
    this.calunga = new BossMember(scene, FORM_CALUNGA_X, -50, 'boss-calunga');
    for (const m of this.members()) {
      m.onHit = () => this.registerMemberHit(m);
    }
  }

  members(): BossMember[] {
    return [this.rei, this.rainha, this.calunga];
  }

  playIntro(onDone: () => void) {
    const targets = [
      { obj: this.rei, y: FORM_Y },
      { obj: this.rainha, y: FORM_Y },
      { obj: this.calunga, y: FORM_Y }
    ];
    this.scene.tweens.add({
      targets: targets.map((t) => t.obj),
      y: FORM_Y,
      duration: 600,
      ease: 'Cubic.easeOut',
      onComplete: onDone
    });
  }

  registerMemberHit(member: BossMember) {
    if (this.defeated) return;
    if (member === this.calunga) {
      this.registerCalungaHit();
      return;
    }
    member.flash();
    this.takeHit();
  }

  private takeHit() {
    if (this.defeated) return;
    this.hp = Math.max(0, this.hp - 1);
    this.events.onHPChange(this.hp, BOSS_HP_MAX);
    if (this.hp <= 0) {
      this.finishDefeated();
      return;
    }
    if (this.phase === 'A' && this.hp <= THRESHOLD_B) {
      this.transitionTo('B');
    } else if (this.phase === 'B' && this.hp <= THRESHOLD_C) {
      this.transitionTo('C');
    }
  }

  private transitionTo(phase: Phase) {
    this.phase = phase;
    this.events.onPhaseChange(phase, this.hp, BOSS_HP_MAX);
    if (phase === 'C') {
      this.scene.tweens.add({ targets: this.rei, x: 150, y: FORM_Y, duration: 400, ease: 'Cubic.easeOut' });
      this.scene.tweens.add({ targets: this.rainha, x: 650, y: FORM_Y, duration: 400, ease: 'Cubic.easeOut' });
      this.scene.tweens.add({ targets: this.calunga, x: FORM_CALUNGA_X, y: 140, duration: 400, ease: 'Cubic.easeOut' });
    }
  }

  private finishDefeated() {
    this.defeated = true;
    this.members().forEach((m) => {
      m.disableBody(true, true);
    });
    this.events.onDefeated();
  }

  tick(time: number) {
    if (this.defeated || this.hp <= 0) return;
    if (this.swayT0 === 0) this.swayT0 = time;
    const elapsed = time - this.swayT0;

    if (this.phase === 'A') {
      this.runPhaseA(time, elapsed);
    } else if (this.phase === 'B') {
      this.runPhaseB(time, elapsed);
    } else {
      this.runPhaseC(time, elapsed);
    }
  }

  private runPhaseA(time: number, elapsed: number) {
    this.sway(elapsed, 40, 1500);
    if (time >= this.nextFanAt) {
      this.fireFan(5, 40, FAN_SPEED);
      this.nextFanAt = time + 2500;
    }
  }

  private runPhaseB(time: number, elapsed: number) {
    this.sway(elapsed, 40, 1500);
    if (time >= this.nextFanAt) {
      this.fireFan(5, 40, FAN_SPEED);
      this.nextFanAt = time + 2000;
    }
    if (this.calungaMode === 'idle' && time >= this.nextHomingAt) {
      this.calungaMode = 'homing';
      this.calungaHomingHP = CALUNGA_HOMING_HP;
      this.nextHomingAt = time + 4000;
    }
    if (this.calungaMode === 'homing') {
      this.homeCalunga();
    }
    if (this.calungaMode === 'dead' && time >= this.calungaRespawnAt) {
      this.resetCalunga();
    }
  }

  private runPhaseC(time: number, elapsed: number) {
    this.calunga.x = FORM_CALUNGA_X + Math.sin(elapsed / 800) * 120;
    if (time >= this.nextBurstAt) {
      const player = this.getPlayer();
      const angle = Phaser.Math.Angle.Between(this.calunga.x, this.calunga.y, player.x, player.y);
      for (let i = 0; i < 3; i++) {
        this.scene.time.delayedCall(i * 80, () => {
          if (this.defeated) return;
          this.enemyBullets.fireLinear(
            this.calunga.x,
            this.calunga.y + 16,
            Math.cos(angle) * BURST_SPEED,
            Math.sin(angle) * BURST_SPEED
          );
        });
      }
      this.nextBurstAt = time + 1500;
    }
    if (time >= this.nextFanAt) {
      const center = { x: GAME_WIDTH / 2, y: 300 };
      const reiAngle = Phaser.Math.Angle.Between(this.rei.x, this.rei.y, center.x, center.y);
      const rainhaAngle = Phaser.Math.Angle.Between(this.rainha.x, this.rainha.y, center.x, center.y);
      this.fireFanFrom(this.rei.x, this.rei.y, reiAngle, 3, 30, FAN_SPEED);
      this.fireFanFrom(this.rainha.x, this.rainha.y, rainhaAngle, 3, 30, FAN_SPEED);
      this.nextFanAt = time + 1800;
    }
  }

  private sway(elapsed: number, amp: number, period: number) {
    const t = (elapsed / period) * Math.PI * 2;
    this.rei.x = FORM_REI_X + Math.sin(t) * amp;
    this.rainha.x = FORM_RAINHA_X + Math.sin(t + Math.PI) * amp;
  }

  private fireFan(count: number, spreadDeg: number, speed: number) {
    this.fireFanFrom(this.calunga.x, this.calunga.y + 16, Math.PI / 2, count, spreadDeg, speed);
  }

  private fireFanFrom(x: number, y: number, centerAngle: number, count: number, spreadDeg: number, speed: number) {
    const spread = Phaser.Math.DegToRad(spreadDeg);
    const step = count > 1 ? spread / (count - 1) : 0;
    const start = centerAngle - spread / 2;
    for (let i = 0; i < count; i++) {
      const a = start + step * i;
      this.enemyBullets.fireLinear(x, y, Math.cos(a) * speed, Math.sin(a) * speed);
    }
  }

  private homeCalunga() {
    const player = this.getPlayer();
    const angle = Phaser.Math.Angle.Between(this.calunga.x, this.calunga.y, player.x, player.y);
    this.calunga.x += Math.cos(angle) * HOMING_SPEED * (1 / 60);
    this.calunga.y += Math.sin(angle) * HOMING_SPEED * (1 / 60);
  }

  private resetCalunga() {
    this.calunga.x = FORM_CALUNGA_X;
    this.calunga.y = FORM_Y;
    this.calunga.setActive(true);
    this.calunga.setVisible(true);
    (this.calunga.body as Phaser.Physics.Arcade.Body).enable = true;
    this.calungaMode = 'idle';
  }

  registerCalungaHit() {
    if (this.phase !== 'B' || this.calungaMode !== 'homing') {
      this.takeHit();
      return;
    }
    this.calunga.flash();
    this.calungaHomingHP -= 1;
    if (this.calungaHomingHP <= 0) {
      this.calungaMode = 'dead';
      this.calungaRespawnAt = this.scene.time.now + CALUNGA_RESPAWN_MS;
      this.calunga.setActive(false);
      this.calunga.setVisible(false);
      (this.calunga.body as Phaser.Physics.Arcade.Body).enable = false;
    }
  }

  destroyAll() {
    this.members().forEach((m) => m.destroy());
  }

  get currentPhase(): Phase {
    return this.phase;
  }

  get hpMax(): number {
    return BOSS_HP_MAX;
  }
}
