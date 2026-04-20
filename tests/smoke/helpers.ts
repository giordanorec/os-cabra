import type { Page } from '@playwright/test';

// `window.__osCabra` é exposto em src/main.ts só em import.meta.env.DEV.
// Representa a instância do Phaser.Game do runtime — usamos para ler
// estado determinístico da cena durante os testes.
declare global {
  interface Window {
    __osCabra?: {
      scene: {
        getScene: (key: string) => any;
        getScenes: (isActive?: boolean) => any[];
      };
      loop: { actualFps: number };
    };
  }
}

export const MENU_SCENE_KEY = 'MenuScene';
export const GAME_SCENE_KEY = 'GameScene';
export const HUD_SCENE_KEY = 'HUDScene';
export const GAMEOVER_SCENE_KEY = 'GameOverScene';

/** Espera o game bootar até a MenuScene ficar ativa. */
export async function waitForMenu(page: Page) {
  await page.goto('/');
  await page.waitForFunction(() => {
    const g = window.__osCabra;
    if (!g) return false;
    const m = g.scene.getScene('MenuScene');
    return !!m && m.scene.isActive();
  }, null, { timeout: 10_000 });
  await page.waitForFunction(() => !!document.querySelector('#game canvas'));
}

/**
 * Espera a MenuScene, pressiona Enter e aguarda GameScene + HUDScene ativas.
 * Phaser `JustDown` precisa ver a transição up→down entre dois updates, então
 * `keyboard.press` é rápido demais e perde a borda — usamos down+wait+up.
 */
export async function waitForGameplay(page: Page) {
  await waitForMenu(page);
  await page.keyboard.down('Enter');
  await page.waitForTimeout(50);
  await page.keyboard.up('Enter');
  await page.waitForFunction(() => {
    const g = window.__osCabra;
    if (!g) return false;
    const gs = g.scene.getScene('GameScene');
    const hud = g.scene.getScene('HUDScene');
    return !!gs && gs.scene.isActive() && !!hud && hud.scene.isActive();
  }, null, { timeout: 5_000 });
}

/** Espera a transição GameScene → GameOverScene. */
export async function waitForGameOver(page: Page, timeoutMs = 60_000) {
  await page.waitForFunction(() => {
    const g = window.__osCabra;
    if (!g) return false;
    const over = g.scene.getScene('GameOverScene');
    return !!over && over.scene.isActive();
  }, null, { timeout: timeoutMs });
}

export async function holdKey(page: Page, key: string, durationMs: number) {
  await page.keyboard.down(key);
  await page.waitForTimeout(durationMs);
  await page.keyboard.up(key);
}
