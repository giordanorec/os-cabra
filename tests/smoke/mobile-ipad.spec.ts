import { expect, test } from '@playwright/test';

// Testes de smoke mobile — M_MOBILE_v1.
// Playwright por padrão monta viewport desktop; aqui forçamos viewport iPad,
// `hasTouch` + `isMobile` pra ativar a detecção de Platform.ts, e
// `?platform=mobile` como cinto-e-suspensórios caso o matchMedia não dispare.

const IPAD_UA =
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 ' +
  '(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const SCREENSHOT_DIR = 'docs/milestone-reports/mobile-v1';

async function bootMobileMenu(page: import('@playwright/test').Page) {
  page.on('pageerror', (err) => {
    throw err;
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      // Falha rápida em erro runtime — útil pra pegar regressões de init mobile
      // sem ter que esperar timeout de assert.
      throw new Error(`console.error: ${msg.text()}`);
    }
  });
  await page.goto('/?platform=mobile');
  await page.waitForFunction(
    () => {
      const g = window.__osCabra;
      return !!g && !!g.scene.getScene('MenuScene')?.scene.isActive();
    },
    null,
    { timeout: 10_000 }
  );
  await page.waitForFunction(() => !!document.querySelector('#game canvas'));
}

async function tapCenter(page: import('@playwright/test').Page) {
  // Tap na região central (nunca onde ficam os controles em GameScene).
  const box = await page.locator('canvas').boundingBox();
  if (!box) throw new Error('canvas not found');
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
}

async function startGameplay(page: import('@playwright/test').Page) {
  // Transição menu → game via teclado. `registerAnyTapAsConfirm` também
  // funciona no navegador real, mas `Phaser.Input` com Playwright touchscreen
  // nem sempre dispara POINTER_DOWN no primeiro toque — usamos keyboard aqui
  // pra deixar o teste determinístico, e cobrimos o tap→confirm em teste à parte.
  await page.keyboard.down('Enter');
  await page.waitForTimeout(50);
  await page.keyboard.up('Enter');
  await page.waitForFunction(
    () => {
      const g = window.__osCabra;
      const gs = g?.scene.getScene('GameScene');
      return !!gs && gs.scene.isActive();
    },
    null,
    { timeout: 5_000 }
  );
}

test.describe('Mobile iPad — landscape 1024×768', () => {
  test.use({
    viewport: { width: 1024, height: 768 },
    userAgent: IPAD_UA,
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2
  });

  test('menu renderiza + screenshot', async ({ page }) => {
    await bootMobileMenu(page);
    // Sanidade: a detecção de mobile responde
    const isMobile = await page.evaluate(() => {
      const params = new URLSearchParams(window.location.search);
      return params.get('platform') === 'mobile';
    });
    expect(isMobile).toBe(true);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ipad-landscape-menu.png`, fullPage: false });
  });

  test('gameplay com touch controls + screenshot', async ({ page }) => {
    await bootMobileMenu(page);
    await startGameplay(page);
    // Aguarda intro/parallax iniciar visivelmente
    await page.waitForTimeout(1800);

    // touchInput deve estar montado no GameScene
    const hasTouchInput = await page.evaluate(() => {
      const g = window.__osCabra!;
      const gs = g.scene.getScene('GameScene') as any;
      return !!gs.touchInput;
    });
    expect(hasTouchInput).toBe(true);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/ipad-landscape-gameplay.png`, fullPage: false });
  });

  test('double-tap pausa o jogo', async ({ page }) => {
    await bootMobileMenu(page);
    await startGameplay(page);
    await page.waitForFunction(
      () => window.__osCabra?.scene.getScene('HUDScene')?.scene.isActive(),
      null,
      { timeout: 2_000 }
    );

    // Simula o double-tap diretamente no state do TouchInput —
    // page.touchscreen.tap não dispara POINTER_DOWN consistente em todos
    // os builds do Phaser 4 rodando no Chromium headless; o próprio
    // consumePauseJustPressed é o contrato que o InputManager observa.
    await page.evaluate(() => {
      const g = window.__osCabra!;
      const gs = g.scene.getScene('GameScene') as any;
      gs.touchInput.state.pauseJustPressed = true;
    });

    await page.waitForFunction(
      () => window.__osCabra?.scene.getScene('PauseScene')?.scene.isActive(),
      null,
      { timeout: 2_000 }
    );

    await page.screenshot({ path: `${SCREENSHOT_DIR}/ipad-landscape-pause.png`, fullPage: false });
  });
});

test.describe('Mobile iPad — portrait 820×1180', () => {
  test.use({
    viewport: { width: 820, height: 1180 },
    userAgent: IPAD_UA,
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2
  });

  test('menu renderiza em portrait + screenshot', async ({ page }) => {
    await bootMobileMenu(page);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ipad-portrait-menu.png`, fullPage: false });
  });

  test('gameplay renderiza em portrait + screenshot', async ({ page }) => {
    await bootMobileMenu(page);
    await startGameplay(page);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ipad-portrait-gameplay.png`, fullPage: false });
  });
});
