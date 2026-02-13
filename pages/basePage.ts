// basePage.ts
import { Page } from "@playwright/test";
import { Locator, expect } from "@playwright/test";

type Target = string | Locator;

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ---------------------------
  // Locators
  // ---------------------------
  locator(target: Target): Locator {
    return typeof target === "string" ? this.page.locator(target) : target;
  }

  // ---------------------------
  // Wait / state checks
  // ---------------------------
  async isVisible(target: Target, timeoutMs = 5000): Promise<boolean> {
    const loc = this.locator(target);
    return await loc.isVisible({ timeout: timeoutMs });
  }

  async waitVisible(target: Target, timeoutMs = 15000): Promise<void> {
    const loc = this.locator(target);
    await expect(loc).toBeVisible({ timeout: timeoutMs });
  }

  async waitAttached(target: Target, timeoutMs = 15000): Promise<void> {
    const loc = this.locator(target);
    await expect(loc).toBeAttached({ timeout: timeoutMs });
  }

  // ---------------------------
  // Scroll / click helpers
  // ---------------------------
  async scrollIntoView(target: Target): Promise<void> {
    const loc = this.locator(target);
    await loc.scrollIntoViewIfNeeded();
  }

  async click(target: Target, opts?: { timeoutMs?: number }): Promise<void> {
    const loc = this.locator(target);
    await loc.click({ timeout: opts?.timeoutMs ?? 15000 });
  }

  async forceClick(target: Target, opts?: { timeoutMs?: number }): Promise<void> {
    const loc = this.locator(target);
    await loc.click({ timeout: opts?.timeoutMs ?? 15000, force: true });
  }

  async dismissOverlays(): Promise<void> {
    try {
      await this.page.keyboard.press("Escape");
      await this.page.mouse.click(1, 1);
    } catch {
    }
  }

  // ---------------------------
  // Form helpers
  // ---------------------------
  async fill(target: Target, value: string): Promise<void> {
    const loc = this.locator(target);
    await loc.fill(value);
  }

  async type(target: Target, value: string, opts?: { clearFirst?: boolean }): Promise<void> {
    const loc = this.locator(target);
    if (opts?.clearFirst) await loc.fill("");
    await loc.type(value);
  }

  async press(target: Target, key: string): Promise<void> {
    const loc = this.locator(target);
    await loc.press(key);
  }

  async toggle(target: Target): Promise<void> {
    const loc = this.locator(target);
    const isChecked = await loc.isChecked().catch(() => null);
    if (isChecked === null) {
      await loc.click();
      return;
    }
    if (!isChecked) await loc.check();
    else await loc.uncheck();
  }

  async selectByIndex(target: Target, index: number): Promise<void> {
    const loc = this.locator(target);
    const options = loc.locator("option");
    const count = await options.count();
    if (count <= index) throw new Error(`selectByIndex: index ${index} out of range (count=${count})`);
    const value = await options.nth(index).getAttribute("value");
    if (!value) throw new Error("selectByIndex: option has no value attribute");
    await loc.selectOption(value);
  }

  async selectFirstRealOption(selectorForSelects = "select[id*='input-option']"): Promise<void> {
    const selects = this.page.locator(selectorForSelects);
    const count = await selects.count();
    for (let i = 0; i < count; i++) {
      const sel = selects.nth(i);
      const opts = sel.locator("option");
      if ((await opts.count()) > 1) {
        const value = await opts.nth(1).getAttribute("value");
        if (value) await sel.selectOption(value);
      }
    }
  }

  // ---------------------------
  // Text / attribute helpers
  // ---------------------------
  async getText(target: Target): Promise<string> {
    const loc = this.locator(target);
    const txt = await loc.innerText();
    return txt.trim();
  }

  async getAttribute(target: Target, name: string): Promise<string | null> {
    const loc = this.locator(target);
    return await loc.getAttribute(name);
  }

  async getElementsText(target: Target): Promise<string[]> {
    const loc = this.locator(target);
    const texts = await loc.allInnerTexts();
    return texts.map(t => t.trim()).filter(Boolean);
  }
}
