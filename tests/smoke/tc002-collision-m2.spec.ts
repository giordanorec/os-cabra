import { expect, test } from '@playwright/test';
import { waitForGameplay } from './helpers';

// TC-002 — Colisão com inimigo (M2 real)
// Em M1 este caso rodou só como placeholder (inimigo estático). M2 traz
// o comportamento pedido no QA_PLAN:
//  - `Player.takeDamage` consome 1 vida e aciona i-frame de `PLAYER_INVULN_MS`.
//  - Durante i-frames, `takeDamage` retorna false (não debita vida).
//  - `HUDScene` esconde o rectangle da vida perdida via `setLives`.
//  - `onDeath` dispara quando lives<=0 → `GameScene.endGame(false)`.
test.describe('TC-002 — Colisão player×inimigo + i-frames (M2)', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => {
      throw err;
    });
    await waitForGameplay(page);
  });

  test('estado inicial: 3 vidas, 3 ícones visíveis na HUD', async ({ page }) => {
    const lives = await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene');
      const hud = window.__osCabra!.scene.getScene('HUDScene');
      return {
        playerLives: gs.player.lives as number,
        icons: (hud.lifeIcons as any[]).map((i) => i.visible as boolean)
      };
    });
    expect(lives.playerLives).toBe(3);
    expect(lives.icons).toEqual([true, true, true]);
  });

  test('dano debita 1 vida e liga i-frames; hit durante i-frames não debita', async ({ page }) => {
    // Inferimos takeDamage via API exposta — mais estável do que tentar
    // colidir com inimigo real no tempo do spawn.
    const firstHit = await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene');
      const now = gs.time.now as number;
      const took = gs.player.takeDamage(now) as boolean;
      return {
        took,
        lives: gs.player.lives as number,
        invulnUntil: gs.player.invulnUntilMs as number,
        now
      };
    });
    expect(firstHit.took).toBe(true);
    expect(firstHit.lives).toBe(2);
    expect(firstHit.invulnUntil).toBeGreaterThan(firstHit.now);

    const iconsAfterHit = await page.evaluate(() => {
      const hud = window.__osCabra!.scene.getScene('HUDScene');
      return (hud.lifeIcons as any[]).map((i) => i.visible as boolean);
    });
    expect(iconsAfterHit).toEqual([true, true, false]);

    // Segundo hit imediato deve ser absorvido pelos i-frames (retorno false).
    const secondHit = await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene');
      const now = gs.time.now as number;
      const took = gs.player.takeDamage(now) as boolean;
      return { took, lives: gs.player.lives as number };
    });
    expect(secondHit.took).toBe(false);
    expect(secondHit.lives).toBe(2);

    await page.screenshot({
      path: 'docs/qa_screenshots/milestone_2/tc002-after-hit.png',
      fullPage: false
    });
  });

  test('3 hits válidos (fora de i-frames) zeram vidas e disparam Game Over', async ({ page }) => {
    // Simulamos 3 dano espaçados além de PLAYER_INVULN_MS (1200ms).
    const path = await page.evaluate(() => {
      const gs = window.__osCabra!.scene.getScene('GameScene');
      const base = gs.time.now as number;
      const took: boolean[] = [];
      took.push(gs.player.takeDamage(base + 0) as boolean);
      took.push(gs.player.takeDamage(base + 1500) as boolean);
      took.push(gs.player.takeDamage(base + 3000) as boolean);
      return {
        took,
        lives: gs.player.lives as number,
        ended: gs.ended as boolean
      };
    });
    expect(path.took).toEqual([true, true, true]);
    expect(path.lives).toBe(0);
    expect(path.ended).toBe(true);
  });
});
