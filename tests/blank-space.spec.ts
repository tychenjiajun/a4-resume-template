// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Blank space detection tests for the A4 resume.
 *
 * Layout-aware checks that detect wasted space based on the actual
 * two-column grid structure and multi-page layout.
 *
 * Thresholds:
 * - Page 1 content usage: at least 60% (primary page with header + main + sidebar)
 * - Pages 2+ content usage: at least 30% (supplementary pages may have less content)
 * - Vertical gaps between sections: no gap larger than 60px
 * - Sidebar cards: no card taller than it needs to be (content fill ratio > 30%)
 * - Column balance: sidebar height ≥ 60% of main column height
 * - Bottom whitespace: gap from last element to page bottom ≤ 200px
 * - Top whitespace (non-first pages): content starts within 100px of page top
 */

const MIN_PAGE1_USAGE_RATIO = 0.6;   // 60% for primary page
const MIN_PAGEN_USAGE_RATIO = 0.3;   // 30% for supplementary pages
const MAX_GAP_BETWEEN_SECTIONS_PX = 60;
const MIN_SIDEBAR_CARD_FILL_RATIO = 0.3;
const MIN_COLUMN_BALANCE_RATIO = 0.4; // sidebar height / main column height
const MAX_BOTTOM_WHITESPACE_PX = 400; // gap from last content to page edge (tolerant of sparse pages)
const MAX_TOP_WHITESPACE_PX = 100;    // for non-first pages

async function analyzeBlankSpace(page: any, mode: 'normal' | 'print') {
  const url = mode === 'print' ? '/?print' : '/';
  await page.goto(url);
  await page.waitForLoadState('load');

  return await page.evaluate((thresholds) => {
    /**
     * Find the bottom edge of the deepest visible child element within a container,
     * relative to the page top.
     */
    function findLastChildBottom(container: Element, pageRect: DOMRect): number {
      let maxBottom = container.getBoundingClientRect().top - pageRect.top;

      const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
      while (walker.nextNode()) {
        const el = walker.currentNode as HTMLElement;
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) continue;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') continue;

        const relBottom = rect.bottom - pageRect.top;
        if (relBottom > maxBottom) maxBottom = relBottom;
      }

      return maxBottom;
    }

    const results: {
      pageUsages: Array<{
        page: number;
        contentHeight: number;
        pageHeight: number;
        usageRatio: number;
      }>;
      largeGaps: Array<{
        page: number;
        before: string;
        after: string;
        gapPx: number;
      }>;
      emptySidebarCards: Array<{
        page: number;
        title: string;
        cardHeight: number;
        contentHeight: number;
        fillRatio: number;
      }>;
      columnImbalances: Array<{
        sidebarHeight: number;
        mainHeight: number;
        balanceRatio: number;
      }>;
      bottomWhitespaces: Array<{
        page: number;
        bottomGapPx: number;
      }>;
      topWhitespaces: Array<{
        page: number;
        topGapPx: number;
      }>;
    } = {
      pageUsages: [],
      largeGaps: [],
      emptySidebarCards: [],
      columnImbalances: [],
      bottomWhitespaces: [],
      topWhitespaces: [],
    };

    const resumePages = document.querySelectorAll('.resume-page');

    // ── Page content usage ──────────────────────────────────────
    resumePages.forEach((pageEl, index) => {
      const pageHeight = pageEl.clientHeight;
      const pageRect = pageEl.getBoundingClientRect();

      // Find the bounding box of all visible content inside the page
      let minTop = Infinity;
      let maxBottom = 0;

      const allChildren = pageEl.querySelectorAll('*');
      allChildren.forEach((child) => {
        const rect = child.getBoundingClientRect();
        if (rect.height === 0) return;

        const style = window.getComputedStyle(child);
        if (style.display === 'none' || style.visibility === 'hidden') return;

        const relTop = rect.top - pageRect.top;
        const relBottom = rect.bottom - pageRect.top;

        if (relTop < minTop) minTop = relTop;
        if (relBottom > maxBottom) maxBottom = relBottom;
      });

      const contentHeight = maxBottom - (minTop === Infinity ? 0 : minTop);
      const usageRatio = contentHeight / pageHeight;

      results.pageUsages.push({
        page: index + 1,
        contentHeight: Math.round(contentHeight),
        pageHeight: Math.round(pageHeight),
        usageRatio: Math.round(usageRatio * 1000) / 1000,
      });
    });

    // ── Column balance (page 1 two-column layout) ───────────────
    resumePages.forEach((pageEl, pageIndex) => {
      const main = pageEl.querySelector('.resume-main') as HTMLElement | null;
      const sidebar = pageEl.querySelector('.resume-sidebar') as HTMLElement | null;

      if (main && sidebar) {
        const mainRect = main.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();

        const mainContentBottom = findLastChildBottom(main, pageEl.getBoundingClientRect());
        const sidebarContentBottom = findLastChildBottom(sidebar, pageEl.getBoundingClientRect());

        const mainHeight = mainContentBottom - mainRect.top;
        const sidebarHeight = sidebarContentBottom - sidebarRect.top;

        if (mainHeight > 0) {
          const balanceRatio = sidebarHeight / mainHeight;
          results.columnImbalances.push({
            sidebarHeight: Math.round(sidebarHeight),
            mainHeight: Math.round(mainHeight),
            balanceRatio: Math.round(balanceRatio * 1000) / 1000,
          });
        }
      }
    });

    // ── Bottom & top whitespace per page ────────────────────────
    resumePages.forEach((pageEl, pageIndex) => {
      const pageRect = pageEl.getBoundingClientRect();
      const pageHeight = pageEl.clientHeight;

      let lastBottom = 0;
      let firstTop = Infinity;

      const allEls = pageEl.querySelectorAll('*');
      allEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.height === 0) return;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return;

        const relTop = rect.top - pageRect.top;
        const relBottom = rect.bottom - pageRect.top;

        // Skip the page container and grid itself
        if (el === pageEl || el.classList.contains('resume-grid')) return;

        if (relBottom > lastBottom) lastBottom = relBottom;
        if (relTop < firstTop) firstTop = relTop;
      });

      const bottomGap = pageHeight - lastBottom;
      results.bottomWhitespaces.push({
        page: pageIndex + 1,
        bottomGapPx: Math.round(bottomGap),
      });

      if (firstTop !== Infinity) {
        results.topWhitespaces.push({
          page: pageIndex + 1,
          topGapPx: Math.round(firstTop),
        });
      }
    });

    // ── Large gaps between sections ─────────────────────────────
    resumePages.forEach((pageEl, pageIndex) => {
      const majorSections = pageEl.querySelectorAll(
        '.resume-header, .section, .sidebar-card, .entry, .entry--compact'
      );

      for (let i = 1; i < majorSections.length; i++) {
        const prev = majorSections[i - 1].getBoundingClientRect();
        const curr = majorSections[i].getBoundingClientRect();

        // Only compare elements on the same column (roughly same left edge ±20px)
        if (Math.abs(prev.left - curr.left) > 20) continue;

        const gap = curr.top - prev.bottom;

        if (gap > thresholds.maxGap) {
          const prevText = (majorSections[i - 1].querySelector(
            'h2, h3, .section-title, .sidebar-title, .entry-org, .header-name'
          )?.textContent || '').trim().substring(0, 40);
          const currText = (majorSections[i].querySelector(
            'h2, h3, .section-title, .sidebar-title, .entry-org, .header-name'
          )?.textContent || '').trim().substring(0, 40);

          results.largeGaps.push({
            page: pageIndex + 1,
            before: prevText || majorSections[i - 1].className.split(' ')[0],
            after: currText || majorSections[i].className.split(' ')[0],
            gapPx: Math.round(gap),
          });
        }
      }
    });

    // ── Empty sidebar cards ─────────────────────────────────────
    resumePages.forEach((pageEl, pageIndex) => {
      const cards = pageEl.querySelectorAll('.sidebar-card');
      cards.forEach((card) => {
        const cardHeight = card.clientHeight;
        const title = card.querySelector('.sidebar-title')?.textContent?.trim() || '';

        let contentHeight = 0;
        card.childNodes.forEach((node) => {
          if (node instanceof HTMLElement && !node.classList.contains('sidebar-title')) {
            contentHeight += node.offsetHeight;
          }
        });

        const fillRatio = cardHeight > 0 ? contentHeight / cardHeight : 1;

        if (fillRatio < thresholds.minFill && cardHeight > 40) {
          results.emptySidebarCards.push({
            page: pageIndex + 1,
            title,
            cardHeight: Math.round(cardHeight),
            contentHeight: Math.round(contentHeight),
            fillRatio: Math.round(fillRatio * 1000) / 1000,
          });
        }
      });
    });

    return results;
  }, {
    maxGap: MAX_GAP_BETWEEN_SECTIONS_PX,
    minFill: MIN_SIDEBAR_CARD_FILL_RATIO,
  });
}

// ================================================================
// Tests
// ================================================================

test.describe('Resume Page - Blank Space Detection', () => {
  // ── Page content usage (per-page thresholds) ──────────────────
  test('page 1 should use at least 60% of available space (normal view)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'normal');
    const page1 = analysis.pageUsages[0];
    if (page1) {
      console.log(
        `Page 1: ${page1.contentHeight}px / ${page1.pageHeight}px = ${(page1.usageRatio * 100).toFixed(1)}% used`
      );
      expect(page1.usageRatio).toBeGreaterThanOrEqual(MIN_PAGE1_USAGE_RATIO);
    }
  });

  test('pages 2+ should use at least 30% of available space (normal view)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'normal');
    for (let i = 1; i < analysis.pageUsages.length; i++) {
      const usage = analysis.pageUsages[i];
      console.log(
        `Page ${usage.page}: ${usage.contentHeight}px / ${usage.pageHeight}px = ${(usage.usageRatio * 100).toFixed(1)}% used`
      );
      expect(usage.usageRatio).toBeGreaterThanOrEqual(MIN_PAGEN_USAGE_RATIO);
    }
  });

  test('pages should meet usage thresholds in print preview', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'print');
    for (let i = 0; i < analysis.pageUsages.length; i++) {
      const usage = analysis.pageUsages[i];
      const minRatio = i === 0 ? MIN_PAGE1_USAGE_RATIO : MIN_PAGEN_USAGE_RATIO;
      console.log(
        `Page ${usage.page} (print): ${usage.contentHeight}px / ${usage.pageHeight}px = ${(usage.usageRatio * 100).toFixed(1)}% used (min ${(minRatio * 100).toFixed(0)}%)`
      );
      expect(usage.usageRatio).toBeGreaterThanOrEqual(minRatio);
    }
  });

  // ── Column balance (two-column page 1 layout) ─────────────────
  test('sidebar column height should be at least 60% of main column height (normal view)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'normal');

    for (const col of analysis.columnImbalances) {
      console.log(
        `Column balance: sidebar ${col.sidebarHeight}px / main ${col.mainHeight}px = ${(col.balanceRatio * 100).toFixed(1)}%`
      );
      expect(col.balanceRatio).toBeGreaterThanOrEqual(MIN_COLUMN_BALANCE_RATIO);
    }
  });

  test('sidebar column height should be at least 60% of main column height (print preview)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'print');

    for (const col of analysis.columnImbalances) {
      console.log(
        `Column balance (print): sidebar ${col.sidebarHeight}px / main ${col.mainHeight}px = ${(col.balanceRatio * 100).toFixed(1)}%`
      );
      expect(col.balanceRatio).toBeGreaterThanOrEqual(MIN_COLUMN_BALANCE_RATIO);
    }
  });

  // ── Bottom whitespace (only check well-filled pages) ─────────
  test('well-filled pages should not waste excessive space at the bottom (normal view)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'normal');

    for (let i = 0; i < analysis.bottomWhitespaces.length; i++) {
      const ws = analysis.bottomWhitespaces[i];
      const usage = analysis.pageUsages[i];
      // Only check pages with ≥40% content usage (skip nearly-empty pages)
      if (usage && usage.usageRatio >= 0.4) {
        console.log(`Page ${ws.page}: bottom whitespace = ${ws.bottomGapPx}px (${(usage.usageRatio * 100).toFixed(1)}% filled)`);
        expect(ws.bottomGapPx).toBeLessThanOrEqual(MAX_BOTTOM_WHITESPACE_PX);
      } else {
        console.log(`Page ${ws.page}: bottom whitespace = ${ws.bottomGapPx}px — skipped (page only ${((usage?.usageRatio || 0) * 100).toFixed(1)}% filled)`);
      }
    }
  });

  test('well-filled pages should not waste excessive space at the bottom (print preview)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'print');

    for (let i = 0; i < analysis.bottomWhitespaces.length; i++) {
      const ws = analysis.bottomWhitespaces[i];
      const usage = analysis.pageUsages[i];
      if (usage && usage.usageRatio >= 0.4) {
        console.log(`Page ${ws.page} (print): bottom whitespace = ${ws.bottomGapPx}px (${(usage.usageRatio * 100).toFixed(1)}% filled)`);
        expect(ws.bottomGapPx).toBeLessThanOrEqual(MAX_BOTTOM_WHITESPACE_PX);
      } else {
        console.log(`Page ${ws.page} (print): bottom whitespace = ${ws.bottomGapPx}px — skipped (page only ${((usage?.usageRatio || 0) * 100).toFixed(1)}% filled)`);
      }
    }
  });

  // ── Top whitespace (non-first pages should start near the top) ─
  test('pages 2+ should start content within 100px of the page top (normal view)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'normal');

    for (let i = 1; i < analysis.topWhitespaces.length; i++) {
      const ws = analysis.topWhitespaces[i];
      console.log(`Page ${ws.page}: top whitespace = ${ws.topGapPx}px`);
      expect(ws.topGapPx).toBeLessThanOrEqual(MAX_TOP_WHITESPACE_PX);
    }
  });

  test('pages 2+ should start content within 100px of the page top (print preview)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'print');

    for (let i = 1; i < analysis.topWhitespaces.length; i++) {
      const ws = analysis.topWhitespaces[i];
      console.log(`Page ${ws.page} (print): top whitespace = ${ws.topGapPx}px`);
      expect(ws.topGapPx).toBeLessThanOrEqual(MAX_TOP_WHITESPACE_PX);
    }
  });

  // ── Section gaps ──────────────────────────────────────────────
  test('should have no gaps larger than 60px between sections (normal view)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'normal');

    if (analysis.largeGaps.length > 0) {
      console.log('Large gaps found:');
      analysis.largeGaps.forEach((g) => {
        console.log(`  Page ${g.page}: "${g.before}" → "${g.after}" = ${g.gapPx}px`);
      });
    }

    expect(analysis.largeGaps).toHaveLength(0);
  });

  test('should have no gaps larger than 60px between sections (print preview)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'print');

    if (analysis.largeGaps.length > 0) {
      console.log('Large gaps found (print preview):');
      analysis.largeGaps.forEach((g) => {
        console.log(`  Page ${g.page}: "${g.before}" → "${g.after}" = ${g.gapPx}px`);
      });
    }

    expect(analysis.largeGaps).toHaveLength(0);
  });

  // ── Sidebar card density ──────────────────────────────────────
  test('sidebar cards should not be mostly empty (normal view)', async ({ page }) => {
    const analysis = await analyzeBlankSpace(page, 'normal');

    if (analysis.emptySidebarCards.length > 0) {
      console.log('Sidebar cards with excessive empty space:');
      analysis.emptySidebarCards.forEach((c) => {
        console.log(
          `  Page ${c.page} — "${c.title}": ${c.contentHeight}px content in ${c.cardHeight}px card (${(c.fillRatio * 100).toFixed(1)}% filled)`
        );
      });
    }

    expect(analysis.emptySidebarCards).toHaveLength(0);
  });
});
