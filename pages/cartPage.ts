import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class CartPage extends BasePage {
  // Route only
  readonly CART_ROUTE = "index.php?route=checkout/cart&language=en-gb";

  // Locators
  readonly content: Locator;
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly emptyCartMessage: Locator;

  readonly checkoutButton: Locator;
  readonly updateButton: Locator;

  readonly grandTotalValueCell: Locator;

  constructor(page: Page) {
    super(page);

    this.content = page.locator("#content");
    this.cartTable = page.locator("#content table.table");
    this.cartRows = page.locator("#content table.table tbody tr");
    this.emptyCartMessage = page.locator("#content p:has-text('Your shopping cart is empty')");

    this.checkoutButton = page.locator("#content a.btn.btn-primary:has-text('Checkout')");

    this.updateButton = page.locator(
      "//button[@type='submit' and contains(@formaction,'route=checkout/cart') and contains(@formaction,'edit')]"
    );

    this.grandTotalValueCell = page.locator(
      "//*[@id='checkout-total']//tr[.//*[normalize-space()='Total']]/td[2]"
    );
  }

  // ---------------------------
  // Navigation
  // ---------------------------
  async open(): Promise<this> {
    await this.page.goto(this.CART_ROUTE, { waitUntil: "domcontentloaded" });
    await this.waitForReady();
    return this;
  }

  isOnCartPage(): boolean {
    return this.page.url().includes("route=checkout/cart");
  }

  // ---------------------------
  // Dynamic locators
  // ---------------------------
  rowForProduct(productName: string): Locator {
    return this.page.locator("table.table tr", {
      has: this.page.locator("a", { hasText: productName }),
    });
  }

  removeButtonForProduct(productName: string): Locator {
    return this.rowForProduct(productName).locator("button[formaction*='cart'][formaction*='remove']");
  }

  qtyInputForProduct(productName: string): Locator {
    return this.rowForProduct(productName).locator("input[name*='quantity']");
  }

  // ---------------------------
  // Waits
  // ---------------------------
  async waitForReady(timeoutMs = 15000): Promise<void> {
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async waitFor(
    predicate: () => Promise<boolean>,
    timeoutMs = 10000,
    intervalMs = 250
  ): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (await predicate().catch(() => false)) return true;
      await this.page.waitForTimeout(intervalMs);
    }
    return false;
  }

  // ---------------------------
  // Cart checks
  // ---------------------------
  async isProductInCart(productName: string): Promise<boolean> {
    await this.waitForReady();
    return (await this.rowForProduct(productName).count()) > 0;
  }

  async isCartEmptyMessageDisplayed(): Promise<boolean> {
    await this.waitForReady();
    return (await this.emptyCartMessage.count()) > 0;
  }

  async isCartLayoutCorrectWhenEmpty(): Promise<boolean> {
    await this.waitForReady();
    return await this.content.isVisible().catch(() => false);
  }

  // ---------------------------
  // Quantity
  // ---------------------------
  async getProductQuantity(productName: string): Promise<number | null> {
    await this.waitForReady();
    const input = this.qtyInputForProduct(productName);
    if ((await input.count()) === 0) return null;

    try {
      const value = ((await input.first().inputValue()) || "").trim();
      const n = Number(value);
      return Number.isInteger(n) ? n : null;
    } catch {
      return null;
    }
  }

  async waitForProductQuantity(productName: string, expectedQty: number, timeoutMs = 8000): Promise<boolean> {
    return await this.waitFor(async () => (await this.getProductQuantity(productName)) === expectedQty, timeoutMs);
  }

  async setQuantity(productName: string, quantity: number): Promise<void> {
    await this.waitForReady();
    const input = this.qtyInputForProduct(productName);
    await input.waitFor({ state: "visible", timeout: 15000 });
    await input.fill(String(quantity));
  }

  async updateCart(): Promise<void> {
    await this.waitForReady();
    await this.updateButton.waitFor({ state: "visible", timeout: 15000 });
    await this.updateButton.click();

    await this.page.waitForLoadState("networkidle").catch(() => {});
    await this.waitForReady();
  }

  async updateQuantity(productName: string, quantity: number): Promise<void> {
    await this.setQuantity(productName, quantity);
    await this.updateCart();
  }

  // ---------------------------
  // Remove product
  // ---------------------------
  async removeProduct(productName: string, timeoutMs = 10000): Promise<void> {
    await this.waitForReady();

    const row = this.rowForProduct(productName);
    if ((await row.count()) === 0) return;

    const removeBtn = this.removeButtonForProduct(productName);
    await removeBtn.waitFor({ state: "visible", timeout: 15000 });
    await removeBtn.click();

    await this.waitFor(async () => {
      const rowCount = await row.count();
      const emptyVisible = (await this.emptyCartMessage.count()) > 0;
      return rowCount === 0 || emptyVisible;
    }, timeoutMs);

    await this.waitForReady();
  }

  // ---------------------------
  // Prices
  // ---------------------------
  private parsePrice(text: string): number | null {
    const clean = (text || "")
      .replace("£", "")
      .replace("$", "")
      .replace(/,/g, "")
      .trim();

    if (!clean) return null;

    const n = Number(clean);
    return Number.isFinite(n) ? n : null;
  }

  async getUnitPrice(productName: string): Promise<number | null> {
    await this.waitForReady();
    const row = this.rowForProduct(productName);
    if ((await row.count()) === 0) return null;

    const cells = row.first().locator("td.text-end");
    if ((await cells.count()) === 0) return null;

    return this.parsePrice(await cells.nth(0).innerText());
  }

  async getTotalPrice(productName: string): Promise<number | null> {
    await this.waitForReady();
    const row = this.rowForProduct(productName);
    if ((await row.count()) === 0) return null;

    const cells = row.first().locator("td");
    const c = await cells.count();
    if (c === 0) return null;

    for (let i = 0; i < c; i++) {
      const text = (await cells.nth(i).innerText()).trim();
      if (/^[£$]?\d{1,3}(,\d{3})*(\.\d{2})?$/.test(text)) {
        const price = this.parsePrice(text);
        if (price !== null) return price;
      }
    }
    return null;
  }

  async getCartGrandTotal(): Promise<number | null> {
    await this.waitForReady();
    await this.grandTotalValueCell.waitFor({ state: "visible", timeout: 15000 });
    return this.parsePrice(await this.grandTotalValueCell.innerText());
  }

  // ---------------------------
  // Checkout
  // ---------------------------
  async proceedToCheckout(): Promise<void> {
    await this.waitForReady();
    await this.checkoutButton.waitFor({ state: "visible", timeout: 15000 });
    await this.checkoutButton.scrollIntoViewIfNeeded();
    await this.checkoutButton.click();
    
    await this.page.waitForURL(/route=checkout\/checkout/, { timeout: 15000 });
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(1000); 
  }
}
