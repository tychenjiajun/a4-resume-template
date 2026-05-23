// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Overflow detection tests for the A4 resume.
 *
 * Ensures no content extends beyond the 210mm × 297mm page boundaries.
 * Each .resume-page has `overflow: hidden`, so content that exceeds the
 * page dimensions is silently clipped — these tests catch that before print.
 */

const A4_WIDTH_PX = 794; // 210mm at 96dpi
const A4_HEIGHT_PX = 1123; // 297mm at 96dpi

/**
 * Evaluate whether any element's content overflows its `.resume-page` container.
 * Returns overflow details for debugging on failure.
 */
async function detectOverflow(page, mode: 'normal' | 'print') {
  const url = mode === 'print' ? '/?print' : '/';
  await page.goto(url);
  await page.waitForLoadState('load');

  return await page.evaluate(() => {
    const results: Array<{
      page: number;
      direction: 'horizontal' | 'vertical';
      overflow: number;
      selector: string;
      text: string;
    }> = [];

    const resumePages = document.querySelectorAll('.resume-page');

    resumePages.forEach((pageEl, index) => {
      const pageRect = pageEl.getBoundingClientRect();

      // Use child-element bounding rects to detect overflow, keeping only
      // the deepest (most specific) element per overflow direction.
      const candidateSelectors = [
        '.resume-grid', '.resume-header', '.resume-main', '.resume-sidebar',
        '.header', '.section', '.sidebar', '.entry', '.sidebar-card',
      ];
      const allChildren = pageEl.querySelectorAll(candidateSelectors.join(', '));

      const overflowByDir: Record<'horizontal' | 'vertical', {
        overflow: number;
        selector: string;
        text: string;
      } | null> = { horizontal: null, vertical: null };

      allChildren.forEach((child) => {
        const rect = child.getBoundingClientRect();
        const rawClass = child.className.split(' ')[0] || child.tagName.toLowerCase();
        const className = rawClass.startsWith('.') ? rawClass : `.${rawClass}`;

        const rightOverflow = rect.right - pageRect.right;
        if (rightOverflow > 1) {
          if (!overflowByDir.horizontal || rightOverflow > overflowByDir.horizontal.overflow) {
            overflowByDir.horizontal = {
              overflow: rightOverflow,
              selector: className,
              text: (child.textContent || '').trim().substring(0, 80),
            };
          }
        }

        const bottomOverflow = rect.bottom - pageRect.bottom;
        if (bottomOverflow > 1) {
          if (!overflowByDir.vertical || bottomOverflow > overflowByDir.vertical.overflow) {
            overflowByDir.vertical = {
              overflow: bottomOverflow,
              selector: className,
              text: (child.textContent || '').trim().substring(0, 80),
            };
          }
        }
      });

      // Fallback: if no specific child was found but the page itself
      // scrolls, report at the page level.
      const scrollW = pageEl.scrollWidth;
      const scrollH = pageEl.scrollHeight;
      const clientW = pageEl.clientWidth;
      const clientH = pageEl.clientHeight;

      if (!overflowByDir.horizontal && scrollW > clientW + 1) {
        overflowByDir.horizontal = {
          overflow: scrollW - clientW,
          selector: '.resume-page',
          text: '(page-level horizontal overflow)',
        };
      }
      if (!overflowByDir.vertical && scrollH > clientH + 1) {
        overflowByDir.vertical = {
          overflow: scrollH - clientH,
          selector: '.resume-page',
          text: '(page-level vertical overflow)',
        };
      }

      for (const dir of ['horizontal', 'vertical'] as const) {
        const entry = overflowByDir[dir];
        if (entry) {
          results.push({
            page: index + 1,
            direction: dir,
            overflow: entry.overflow,
            selector: entry.selector,
            text: entry.text,
          });
        }
      }
    });

    return results;
  });
}

test.describe('Resume Page - Overflow Detection', () => {
  test('should have no content overflowing horizontally on normal view', async ({ page }) => {
    const overflows = await detectOverflow(page, 'normal');
    const horizontal = overflows.filter((o) => o.direction === 'horizontal');

    if (horizontal.length > 0) {
      console.log('Horizontal overflow detected:');
      horizontal.forEach((o) => {
        console.log(`  Page ${o.page} — ${o.selector}: +${o.overflow}px "${o.text}"`);
      });
    }

    expect(horizontal).toHaveLength(0);
  });

  test('should have no content overflowing vertically on normal view', async ({ page }) => {
    const overflows = await detectOverflow(page, 'normal');
    const vertical = overflows.filter((o) => o.direction === 'vertical');

    if (vertical.length > 0) {
      console.log('Vertical overflow detected:');
      vertical.forEach((o) => {
        console.log(`  Page ${o.page} — ${o.selector}: +${o.overflow}px "${o.text}"`);
      });
    }

    expect(vertical).toHaveLength(0);
  });

  test('should have no content overflowing horizontally in print preview', async ({ page }) => {
    const overflows = await detectOverflow(page, 'print');
    const horizontal = overflows.filter((o) => o.direction === 'horizontal');

    if (horizontal.length > 0) {
      console.log('Horizontal overflow detected (print preview):');
      horizontal.forEach((o) => {
        console.log(`  Page ${o.page} — ${o.selector}: +${o.overflow}px "${o.text}"`);
      });
    }

    expect(horizontal).toHaveLength(0);
  });

  test('should have no content overflowing vertically in print preview', async ({ page }) => {
    const overflows = await detectOverflow(page, 'print');
    const vertical = overflows.filter((o) => o.direction === 'vertical');

    if (vertical.length > 0) {
      console.log('Vertical overflow detected (print preview):');
      vertical.forEach((o) => {
        console.log(`  Page ${o.page} — ${o.selector}: +${o.overflow}px "${o.text}"`);
      });
    }

    expect(vertical).toHaveLength(0);
  });

  test('each resume page should be exactly A4 size', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');

    const dimensions = await page.evaluate(() => {
      const pages = document.querySelectorAll('.resume-page');
      return Array.from(pages).map((p) => ({
        width: p.clientWidth,
        height: p.clientHeight,
      }));
    });

    for (const dim of dimensions) {
      // Allow ±2px tolerance for sub-pixel rounding
      expect(dim.width).toBeGreaterThanOrEqual(A4_WIDTH_PX - 2);
      expect(dim.width).toBeLessThanOrEqual(A4_WIDTH_PX + 2);
      expect(dim.height).toBeGreaterThanOrEqual(A4_HEIGHT_PX - 2);
      expect(dim.height).toBeLessThanOrEqual(A4_HEIGHT_PX + 2);
    }
  });
});
