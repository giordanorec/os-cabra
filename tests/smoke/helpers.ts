import type { Page } from '@playwright/test';

// `window.__osCabra` é exposto em src/main.ts só em import.meta.env.DEV.
// Representa a instância do Phaser.Game do runtime — usamos para ler
// estado determinístico da cena durante os testes.
declare global {
  interface Window {
    __osCabra?: {
      scene: { getScene: (key: string) => any };
      loop: { actualFps: number };
    };
  }
}

export const GAME_SCENE_KEY = 'GameScene';

export async function waitForGameReady(page: Page) {
  await page.goto('/');
  await page.waitForFunction(() => {
    const g = window.__osCabra;
    if (!g) return false;
    const s = g.scene.getScene('GameScene');
    return !!s && s.scene.isActive();
  }, null, { timeout: 10_000 });
  await page.waitForFunction(() => !!document.querySelector('#game canvas'));
}

export async function holdKey(page: Page, key: string, durationMs: number) {
  await page.keyboard.down(key);
  await page.waitForTimeout(durationMs);
  await page.keyboard.up(key);
}
