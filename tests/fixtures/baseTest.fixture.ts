import { closeBrowser } from "@utils/browserCleanup";
import { test as base } from "@playwright/test";

/**
 * Base test fixture with automatic browser cleanup after each test
 */
export const test = base.extend({});

// Global afterEach hook to close browsers after every test
test.afterEach(async ({ page, browser }) => {
  if (page) {
    await closeBrowser(page, browser);
  }
});

export { expect } from "@playwright/test";