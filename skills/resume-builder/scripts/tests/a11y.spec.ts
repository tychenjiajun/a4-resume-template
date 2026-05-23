// @ts-check
import { test, expect } from './axe-test';

/**
 * Accessibility tests for the resume page.
 *
 * Uses axe-core via @axe-core/playwright to detect WCAG A/AA/AAA violations.
 * These complement the compile-time SCSS contrast checks in _palette.scss.
 */

test.describe('Accessibility', () => {
  test('should not have any automatically detectable WCAG A/AA/AAA violations on normal view', async ({ page, makeAxeBuilder }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await makeAxeBuilder().analyze();

    await testInfo.attach('a11y-scan-results-normal', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });

    expect(results.violations).toEqual([]);
  });

  test('should not have any automatically detectable WCAG A/AA/AAA violations in print preview', async ({ page, makeAxeBuilder }, testInfo) => {
    await page.goto('/?print');
    await page.waitForLoadState('networkidle');

    const results = await makeAxeBuilder().analyze();

    await testInfo.attach('a11y-scan-results-print', {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json',
    });

    expect(results.violations).toEqual([]);
  });

  test('should not have WCAG A/AA/AAA violations in the header section', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await makeAxeBuilder()
      .include('.header')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('should not have WCAG A/AA/AAA violations in the sidebar', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await makeAxeBuilder()
      .include('.resume-sidebar')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});