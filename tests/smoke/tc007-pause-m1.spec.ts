import { expect, test } from '@playwright/test';
import { waitForGameReady } from './helpers';

// TC-007 — Pausa congela (QA_PLAN.md §4)
//
// Pausa com ESC ainda NÃO é implementada em M1 (ver REPORT_GAMEPLAY_DEV_M1.md:
// "Menu/HUD/GameOver ficam pro M2"). InputManager mapeia Action.PAUSE = ESC,
// mas nenhum consumer chama `scene.scene.pause()`.
//
// Este spec existe para:
//  1. Verificar EXPLICITAMENTE que pressionar ESC não pausa no M1 — é o
//     comportamento esperado pro milestone, mas precisa ser fixado como
//     regressão (se alguém implementar pausa parcial acidentalmente, sabemos).
//  2. Marcar o teste como `.fixme` pra sinalizar "cobertura pendente em M2".
//     Quando M2 implementar pausa, remover `.fixme` e o assert inverte.
test.describe('TC-007 — Pausa (não implementada em M1)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => {
      throw err;
    });
    await waitForGameReady(page);
  });

  test('ESC não pausa a GameScene em M1 (placeholder)', async ({ page }) => {
    const wasPausedBefore = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').scene.isPaused() as boolean;
    });
    expect(wasPausedBefore).toBe(false);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    const isPausedAfter = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').scene.isPaused() as boolean;
    });
    // Comportamento atual do M1: ESC é registrado mas ninguém pausa.
    expect(isPausedAfter).toBe(false);
  });

  test.fixme('TODO M2: ESC pausa e ESC de novo retoma', async ({ page }) => {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    const paused = await page.evaluate(() => {
      return window.__osCabra!.scene.getScene('GameScene').scene.isPaused() as boolean;
    });
    expect(paused).toBe(true);
  });
});
