import * as Phaser from 'phaser';
import { TouchInput, TouchState } from './TouchInput';

export enum Action {
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  FIRE = 'FIRE',
  PAUSE = 'PAUSE',
  CONFIRM = 'CONFIRM'
}

type KeyMap = Record<Action, Phaser.Input.Keyboard.Key>;

export class InputManager {
  private readonly keys: KeyMap;
  private touch?: TouchInput;
  private touchState?: TouchState;
  private confirmJustPressed = false;

  constructor(scene: Phaser.Scene) {
    const kb = scene.input.keyboard;
    if (!kb) {
      throw new Error('Keyboard plugin not available on scene');
    }
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = {
      [Action.MOVE_LEFT]: kb.addKey(K.LEFT),
      [Action.MOVE_RIGHT]: kb.addKey(K.RIGHT),
      [Action.FIRE]: kb.addKey(K.SPACE),
      [Action.PAUSE]: kb.addKey(K.ESC),
      [Action.CONFIRM]: kb.addKey(K.ENTER)
    };
  }

  attachTouch(touch: TouchInput) {
    this.touch = touch;
    this.touchState = touch.state;
  }

  // Para MenuScene/PauseScene/GameOverScene: "qualquer toque = CONFIRM".
  registerAnyTapAsConfirm(scene: Phaser.Scene) {
    const handler = () => {
      this.confirmJustPressed = true;
    };
    scene.input.on(Phaser.Input.Events.POINTER_DOWN, handler);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.input.off(Phaser.Input.Events.POINTER_DOWN, handler);
    });
  }

  isPressed(action: Action): boolean {
    if (this.keys[action].isDown) return true;
    if (this.touchState) {
      if (action === Action.MOVE_LEFT && this.touchState.left) return true;
      if (action === Action.MOVE_RIGHT && this.touchState.right) return true;
      if (action === Action.FIRE && this.touchState.fire) return true;
    }
    return false;
  }

  justPressed(action: Action): boolean {
    if (Phaser.Input.Keyboard.JustDown(this.keys[action])) return true;
    if (action === Action.PAUSE && this.touch?.consumePauseJustPressed()) return true;
    if (action === Action.CONFIRM && this.confirmJustPressed) {
      this.confirmJustPressed = false;
      return true;
    }
    return false;
  }
}
