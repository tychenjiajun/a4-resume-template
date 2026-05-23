// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Screenshot tests for each A4 resume page.
 *
 * Captures full-size screenshots of individual pages for visual review.
 * Screenshots are saved to screenshots/ directory and attached to test results.
 */

const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;
const SCREENSHOT_DIR = 'screenshots';

test.describe('Resume Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });
  });

  for (const mode of ['normal', 'print']) {
    const url = mode === 'print' ? '/?print' : '/';
    const modeLabel = mode === 'print' ? 'print-preview' : 'normal';

    test(`should screenshot page 1 (${modeLabel} view)`, async ({ page }, testInfo) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const page1 = page.locator('.resume-page').first();

      const screenshot = await page1.screenshot({
        path: `${SCREENSHOT_DIR}/page-1-${modeLabel}.png`,
        fullPage: false,
      });

      await testInfo.attach(`page-1-${modeLabel}`, {
        body: screenshot,
        contentType: 'image/png',
      });
    });

    test(`should screenshot page 2 (${modeLabel} view)`, async ({ page }, testInfo) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const page2 = page.locator('.resume-page').nth(1);

      const screenshot = await page2.screenshot({
        path: `${SCREENSHOT_DIR}/page-2-${modeLabel}.png`,
        fullPage: false,
      });

      await testInfo.attach(`page-2-${modeLabel}`, {
        body: screenshot,
        contentType: 'image/png',
      });
    });
  }

  test('should screenshot full document (normal view)', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to top first so both pages are visible
    await page.evaluate(() => window.scrollTo(0, 0));

    const screenshot = await page.screenshot({
      path: `${SCREENSHOT_DIR}/full-document-normal.png`,
      fullPage: true,
    });

    await testInfo.attach('full-document-normal', {
      body: screenshot,
      contentType: 'image/png',
    });
  });

  test('should screenshot full document (print preview)', async ({ page }, testInfo) => {
    await page.goto('/?print');
    await page.waitForLoadState('networkidle');

    const screenshot = await page.screenshot({
      path: `${SCREENSHOT_DIR}/full-document-print-preview.png`,
      fullPage: true,
    });

    await testInfo.attach('full-document-print-preview', {
      body: screenshot,
      contentType: 'image/png',
    });
  });
});