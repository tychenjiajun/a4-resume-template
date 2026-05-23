// @ts-check
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder;
};

/**
 * Extend Playwright test with a pre-configured AxeBuilder fixture.
 *
 * Common configuration:
 * - Tags: WCAG 2.x A + AA + 2.1 A + AA (matches Accessibility Insights automated checks)
 * - Exclude: elements with known issues that are acceptable for a print-focused resume
 */
export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

    await use(makeAxeBuilder);
  },
});

export { expect };