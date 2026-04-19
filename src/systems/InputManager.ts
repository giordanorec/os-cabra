import * as Phaser from 'phaser';

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

  isPressed(action: Action): boolean {
    return this.keys[action].isDown;
  }

  justPressed(action: Action): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys[action]);
  }
}
