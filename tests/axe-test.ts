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
 * - Tags: WCAG 2.x A + AA + AAA + 2.1 A + AA + AAA
 *   AAA includes best-practice rules (not all are auto-detectable)
 */
export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag21aaa']);

    await use(makeAxeBuilder);
  },
});

export { expect };