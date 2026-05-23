// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Integration tests for resume page.
 *
 * Key test: Detect any text that is being truncated with ellipsis.
 */

test.describe('Resume Page - No Ellipsis Text', () => {
  /**
   * Check if an element has text that is actually truncated by ellipsis.
   */
  async function findEllipsisTruncatedText(page) {
    return await page.evaluate(() => {
      const results = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        null,
        false
      );

      while (walker.nextNode()) {
        const el = walker.currentNode;
        const style = window.getComputedStyle(el);

        if (style.display === 'none' || style.visibility === 'hidden') {
          continue;
        }

        const hasEllipsis = style.textOverflow === 'ellipsis';
        const hasHiddenOverflow =
          style.overflow === 'hidden' ||
          style.overflowX === 'hidden' ||
          style.overflowY === 'hidden';

        if (hasEllipsis && hasHiddenOverflow) {
          const scrollWidth = el.scrollWidth;
          const clientWidth = el.clientWidth;

          if (scrollWidth > clientWidth) {
            const textContent = el.textContent?.trim() || '';
            if (textContent.length > 0) {
              results.push({
                selector: el.className || el.tagName,
                text: textContent.substring(0, 100),
                expectedWidth: scrollWidth,
                actualWidth: clientWidth,
              });
            }
          }
        }
      }

      return results;
    });
  }

  test('should have no text truncated by ellipsis on normal view', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const truncatedElements = await findEllipsisTruncatedText(page);

    if (truncatedElements.length > 0) {
      console.log('Found elements with truncated text:');
      truncatedElements.forEach((el) => {
        console.log(`  - ${el.selector}: "${el.text}" (${el.actualWidth}px vs ${el.expectedWidth}px)`);
      });
    }

    expect(truncatedElements).toHaveLength(0);
  });

  test('should have no text truncated by ellipsis on print preview mode', async ({ page }) => {
    await page.goto('/?print');
    await page.waitForLoadState('networkidle');

    const truncatedElements = await findEllipsisTruncatedText(page);

    if (truncatedElements.length > 0) {
      console.log('Found elements with truncated text in print mode:');
      truncatedElements.forEach((el) => {
        console.log(`  - ${el.selector}: "${el.text}" (${el.actualWidth}px vs ${el.expectedWidth}px)`);
      });
    }

    expect(truncatedElements).toHaveLength(0);
  });

  test('should render all resume sections visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sectionCount = await page.evaluate(() => {
      return document.querySelectorAll('.section-title, .sidebar-title, .header-name').length;
    });

    expect(sectionCount).toBeGreaterThanOrEqual(6);
  });

  test('should have header with name', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const headerName = await page.evaluate(() => {
      return document.querySelector('.header-name')?.textContent?.trim();
    });

    expect(headerName).toBeTruthy();
    expect(headerName?.length).toBeGreaterThan(0);
  });

  test('should have contact information', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contactLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('.header-contact a');
      return Array.from(links).map((l) => l.getAttribute('href')).filter(Boolean);
    });

    expect(contactLinks.length).toBeGreaterThanOrEqual(2);
  });

  test('should apply print-preview class when ?print query param is present', async ({ page }) => {
    await page.goto('/?print');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toHaveClass(/print-preview/);
  });

  test('should not have print-preview class without ?print query param', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bodyClass = await page.locator('body').first().getAttribute('class');
    expect(bodyClass ?? '').not.toContain('print-preview');
  });
});
