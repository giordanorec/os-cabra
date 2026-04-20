import { expect, test } from '@playwright/test';
import { waitForGameplay } from './helpers';

// HUD oficial — lives / score / chain multiplier
// QA_PLAN não tem TC dedicado pra HUD mas o M2 introduz, e é fundamental.
// Cobrimos: estrutura inicial, atualização de score via evento, e o
// multiplicador aparecer quando chain ≥ CHAIN_THRESHOLD (5) em < CHAIN_RESET_MS (4s).
test.describe('HUD — M2', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => {
      throw err;
    });
    await waitForGameplay(page);
  });

  test('estrutura inicial: SCORE 000000, 3 vidas, multiplicador oculto', async ({ page }) => {
    // `hud-*` events são emitidos via delayedCall(50); esperamos estabilizar.
    await page.waitForTimeout(120);
    const state = await page.evaluate(() => {
      const hud = window.__osCabra!.scene.getScene('HUDScene');
      return {
        scoreText: hud.scoreValue.text as string,
        icons: (hud.lifeIcons as any[]).map((i) => i.visible as boolean),
        multVisible: hud.multiplierText.visible as boolean
      };
    });
    expect(state.scoreText).toBe('000000');
    expect(state.icons).toEqual([true, true, true]);
    expect(state.multVisible).toBe(false);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_2/hud-01-initial.png',
      fullPage: false
    });
  });

  test('kill chain de 5 no intervalo liga multiplicador x1.5 na HUD', async ({ page }) => {
    // Programamos 5 kills rápidos via ScoreManager.registerKill direto —
    // blindado contra timing de spawn. CHAIN_THRESHOLD=5, MULTIPLIER=1.5,
    // pontos arbitrários (100 cada). Cálculo:
    //   kill 1-4 com mult 1x = 400pts
    //   kill 5 com chainCount=5 >= THRESHOLD → mult=1.5 → round(100*1.5)=150
    //   total = 550
    const chain = await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      const baseNow = gs.time.now as number;
      for (let i = 0; i < 5; i++) {
        gs.scoreManager.registerKill(100, baseNow + i * 200);
      }
      return {
        scoreValue: gs.scoreManager.value as number,
        multiplierActive: gs.scoreManager.multiplierActive as boolean
      };
    });
    expect(chain.scoreValue).toBe(550);
    expect(chain.multiplierActive).toBe(true);

    await page.waitForFunction(() => {
      const hud = window.__osCabra!.scene.getScene('HUDScene') as any;
      return hud.multiplierText.visible === true && hud.scoreValue.text === '000550';
    }, null, { timeout: 2_000 });

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_2/hud-02-chain-multiplier.png',
      fullPage: false
    });
  });

  test('chain expira após CHAIN_RESET_MS e multiplicador some', async ({ page }) => {
    await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      const now = gs.time.now as number;
      for (let i = 0; i < 5; i++) gs.scoreManager.registerKill(100, now + i * 100);
    });
    await page.waitForFunction(() => {
      const hud = window.__osCabra!.scene.getScene('HUDScene') as any;
      return hud.multiplierText.visible === true;
    });

    // Avança `tick(now + 5000)` pra ultrapassar CHAIN_RESET_MS (4000).
    await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene') as any;
      gs.scoreManager.tick(gs.time.now + 5000);
    });

    await page.waitForFunction(() => {
      const hud = window.__osCabra!.scene.getScene('HUDScene') as any;
      return hud.multiplierText.visible === false;
    }, null, { timeout: 2_000 });
  });
});
