import * as Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config';

// Joystick virtual + botão de tiro para controle touch em iPad/telefone.
// Expõe um TouchState mutável que o InputManager consulta.
// UI renderizada dentro do canvas 800×600 — o CSS já garante safe-area padding
// fora do canvas, então podemos usar coordenadas lógicas sem medo de clipping.

export interface TouchState {
  left: boolean;
  right: boolean;
  fire: boolean;
  pauseJustPressed: boolean;
}

const UI_DEPTH = 10_000;

// Posições dos controles em coord lógica (canvas 800×600)
const JOY_CX = 110;
const JOY_CY = GAME_HEIGHT - 100;
const JOY_RADIUS = 64;
const JOY_KNOB = 28;
const JOY_DEADZONE = 8;
const JOY_HIT_SLACK = 1.4; // tolerância extra para "pegar" o joystick

const FIRE_CX = GAME_WIDTH - 110;
const FIRE_CY = GAME_HEIGHT - 100;
const FIRE_RADIUS = 64;

const AUTO_CHIP_X = GAME_WIDTH - 110;
const AUTO_CHIP_Y = GAME_HEIGHT - 100 - 90;
const AUTO_CHIP_RADIUS = 26;

const DOUBLE_TAP_MS = 380;
const DOUBLE_TAP_MAX_DIST = 80;

const AUTOFIRE_STORAGE_KEY = 'os_cabra_autofire';

export class TouchInput {
  readonly state: TouchState = { left: false, right: false, fire: false, pauseJustPressed: false };

  private scene: Phaser.Scene;
  private joyBase!: Phaser.GameObjects.Arc;
  private joyKnob!: Phaser.GameObjects.Arc;
  private fireBtn!: Phaser.GameObjects.Arc;
  private fireGlyph!: Phaser.GameObjects.Triangle;
  private autoChip!: Phaser.GameObjects.Arc;
  private autoLabel!: Phaser.GameObjects.Text;
  private container: Phaser.GameObjects.GameObject[] = [];

  private joyPointerId: number | null = null;
  private firePointerId: number | null = null;
  private autoFire: boolean;
  private lastTapAt = 0;
  private lastTapX = 0;
  private lastTapY = 0;
  private mounted = false;
  private visible = true;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.autoFire = TouchInput.loadAutoFire();
  }

  static loadAutoFire(): boolean {
    try {
      const v = localStorage.getItem(AUTOFIRE_STORAGE_KEY);
      if (v === null) return true; // default iPad-friendly
      return v === '1';
    } catch {
      return true;
    }
  }

  private saveAutoFire() {
    try {
      localStorage.setItem(AUTOFIRE_STORAGE_KEY, this.autoFire ? '1' : '0');
    } catch {
      /* ignore */
    }
  }

  mount() {
    if (this.mounted) return;
    this.mounted = true;
    const s = this.scene;

    // Joystick
    this.joyBase = s.add.circle(JOY_CX, JOY_CY, JOY_RADIUS, 0xfff2cc, 0.18)
      .setStrokeStyle(3, 0xfff2cc, 0.7)
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);
    this.joyKnob = s.add.circle(JOY_CX, JOY_CY, JOY_KNOB, 0xf0c840, 0.85)
      .setStrokeStyle(2, 0xfff2cc, 0.9)
      .setDepth(UI_DEPTH + 1)
      .setScrollFactor(0);

    // Fire button
    this.fireBtn = s.add.circle(FIRE_CX, FIRE_CY, FIRE_RADIUS, 0xe84a4a, 0.38)
      .setStrokeStyle(3, 0xfff2cc, 0.9)
      .setDepth(UI_DEPTH)
      .setScrollFactor(0);
    // Triângulo apontando pra cima (direção do tiro) — evita emoji
    this.fireGlyph = s.add.triangle(
      FIRE_CX, FIRE_CY,
      0, 24,
      24, -20,
      -24, -20,
      0xfff2cc, 0.95
    ).setDepth(UI_DEPTH + 1).setScrollFactor(0);

    // Auto-fire toggle chip
    this.autoChip = s.add.circle(AUTO_CHIP_X, AUTO_CHIP_Y, AUTO_CHIP_RADIUS, 0x2a2540, 0.7)
      .setStrokeStyle(2, 0xfff2cc, 0.8)
      .setDepth(UI_DEPTH)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });
    this.autoLabel = s.add.text(AUTO_CHIP_X, AUTO_CHIP_Y, this.autoFireLabel(), {
      fontSize: '11px',
      fontFamily: 'monospace',
      color: this.autoFire ? '#f0c840' : '#7a6850'
    }).setOrigin(0.5).setDepth(UI_DEPTH + 1).setScrollFactor(0);
    this.autoChip.on('pointerdown', (_pointer: Phaser.Input.Pointer, _lx: number, _ly: number, ev?: Phaser.Types.Input.EventData) => {
      this.toggleAutoFire();
      ev?.stopPropagation();
    });

    this.container = [this.joyBase, this.joyKnob, this.fireBtn, this.fireGlyph, this.autoChip, this.autoLabel];

    s.input.on('pointerdown', this.onPointerDown, this);
    s.input.on('pointermove', this.onPointerMove, this);
    s.input.on('pointerup', this.onPointerUp, this);
    s.input.on('pointerupoutside', this.onPointerUp, this);
    s.input.on('pointercancel', this.onPointerUp, this);

    s.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
    s.events.once(Phaser.Scenes.Events.DESTROY, () => this.destroy());
  }

  private autoFireLabel(): string {
    return this.autoFire ? 'AUTO ON' : 'AUTO OFF';
  }

  private toggleAutoFire() {
    this.autoFire = !this.autoFire;
    this.saveAutoFire();
    this.autoLabel.setText(this.autoFireLabel());
    this.autoLabel.setColor(this.autoFire ? '#f0c840' : '#7a6850');
  }

  setVisible(v: boolean) {
    this.visible = v;
    for (const obj of this.container) {
      const visible = obj as unknown as Phaser.GameObjects.Components.Visible;
      visible.setVisible?.(v);
    }
  }

  // Chamado toda frame pra:
  //  1) atualizar o "fire" derivado (auto-fire = disparando enquanto se move)
  //  2) limpar o pauseJustPressed após 1 frame (comportamento "JustDown")
  update(_time: number) {
    if (!this.mounted) return;
    this.state.pauseJustPressed = false; // sempre zera no começo do frame seguinte
    if (this.autoFire) {
      const moving = this.state.left || this.state.right;
      this.state.fire = moving || this.firePointerId !== null;
    } else {
      this.state.fire = this.firePointerId !== null;
    }
  }

  // "Pulse" — usado pelo InputManager pra detectar o pauseJustPressed em `justPressed(PAUSE)`
  consumePauseJustPressed(): boolean {
    if (this.state.pauseJustPressed) {
      this.state.pauseJustPressed = false;
      return true;
    }
    return false;
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    if (!this.visible) return;
    const { x, y } = pointer;

    // Auto chip: tratado por listener interativo direto (ver mount)
    if (this.inAutoChip(x, y)) return;

    if (this.joyPointerId === null && this.inJoystick(x, y)) {
      this.joyPointerId = pointer.id;
      this.updateJoyFromPointer(x, y);
      return;
    }
    if (this.firePointerId === null && this.inFire(x, y)) {
      this.firePointerId = pointer.id;
      this.state.fire = true;
      this.fireBtn.setFillStyle(0xe84a4a, 0.75);
      return;
    }

    // Double-tap fora dos controles → pausa
    this.handleDoubleTap(x, y);
  }

  private handleDoubleTap(x: number, y: number) {
    const now = this.scene.time.now;
    const dt = now - this.lastTapAt;
    const dx = x - this.lastTapX;
    const dy = y - this.lastTapY;
    const dist = Math.hypot(dx, dy);
    if (this.lastTapAt > 0 && dt < DOUBLE_TAP_MS && dist < DOUBLE_TAP_MAX_DIST) {
      this.state.pauseJustPressed = true;
      this.lastTapAt = 0; // consumiu
      return;
    }
    this.lastTapAt = now;
    this.lastTapX = x;
    this.lastTapY = y;
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (pointer.id === this.joyPointerId && pointer.isDown) {
      this.updateJoyFromPointer(pointer.x, pointer.y);
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer) {
    if (pointer.id === this.joyPointerId) {
      this.joyPointerId = null;
      this.state.left = false;
      this.state.right = false;
      this.joyKnob.setPosition(JOY_CX, JOY_CY);
    }
    if (pointer.id === this.firePointerId) {
      this.firePointerId = null;
      if (!this.autoFire) this.state.fire = false;
      this.fireBtn.setFillStyle(0xe84a4a, 0.38);
    }
  }

  private updateJoyFromPointer(px: number, py: number) {
    const dx = px - JOY_CX;
    const dy = py - JOY_CY;
    const dist = Math.hypot(dx, dy);
    const max = JOY_RADIUS;
    const clamped = Math.min(dist, max);
    const ang = Math.atan2(dy, dx);
    const kx = JOY_CX + Math.cos(ang) * clamped;
    const ky = JOY_CY + Math.sin(ang) * clamped;
    this.joyKnob.setPosition(kx, ky);

    if (Math.abs(dx) < JOY_DEADZONE) {
      this.state.left = false;
      this.state.right = false;
    } else {
      this.state.left = dx < 0;
      this.state.right = dx > 0;
    }
  }

  private inJoystick(x: number, y: number): boolean {
    const dx = x - JOY_CX;
    const dy = y - JOY_CY;
    return Math.hypot(dx, dy) <= JOY_RADIUS * JOY_HIT_SLACK;
  }

  private inFire(x: number, y: number): boolean {
    const dx = x - FIRE_CX;
    const dy = y - FIRE_CY;
    return Math.hypot(dx, dy) <= FIRE_RADIUS * JOY_HIT_SLACK;
  }

  private inAutoChip(x: number, y: number): boolean {
    const dx = x - AUTO_CHIP_X;
    const dy = y - AUTO_CHIP_Y;
    return Math.hypot(dx, dy) <= AUTO_CHIP_RADIUS;
  }

  destroy() {
    if (!this.mounted) return;
    this.mounted = false;
    this.scene.input.off('pointerdown', this.onPointerDown, this);
    this.scene.input.off('pointermove', this.onPointerMove, this);
    this.scene.input.off('pointerup', this.onPointerUp, this);
    this.scene.input.off('pointerupoutside', this.onPointerUp, this);
    this.scene.input.off('pointercancel', this.onPointerUp, this);
    for (const obj of this.container) obj.destroy();
    this.container = [];
  }
}
