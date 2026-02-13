import { Page, Browser } from "@playwright/test";

/**
 * Global function to close browsers after each test
 * Handles both Page and Browser cleanup safely
 */
export async function closeBrowser(page?: Page, browser?: Browser): Promise<void> {
  try {
    if (page && !page.isClosed()) {
      await page.close();
    }

    if (browser && !browser.contexts()) {
      await browser.close();
    }
  } catch (error) {
    console.warn(`Error during browser cleanup: ${error}`);
  }
}

/**
 * Ensures all browser resources are properly released
 * Can be called as a safety measure in cleanup scenarios
 */
export async function cleanupBrowserResources(context?: any): Promise<void> {
  try {
    if (context?.page) {
      await closeBrowser(context.page);
    }

    if (context?.browser) {
      await closeBrowser(undefined, context.browser);
    }
  } catch (error) {
    console.warn(`Error during resource cleanup: ${error}`);
  }
}

/**
 * Wakes up Firefox when it's been idle in the background
 * Firefox can become unresponsive when idle - this helper activates it
 * Safe to call on any browser - only acts on Firefox
 */
export async function wakeUpBrowser(page: Page): Promise<void> {
  try {
    if (page.isClosed()) {
      return;
    }
    
    const browserName = page.context().browser()?.browserType().name();
    
    if (browserName === "firefox") {
      await Promise.race([
        (async () => {
          await page.mouse.move(0, 0);
          await page.waitForTimeout(50);
          await page.mouse.move(1, 1);
        })(),
        page.waitForTimeout(500) 
      ]);
    }
  } catch (error) {
    console.warn(`Error during browser wake-up: ${error}`);
  }
}