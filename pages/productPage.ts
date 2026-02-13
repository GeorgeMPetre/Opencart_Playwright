import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class ProductPage extends BasePage {
  // Listing
  readonly productThumbLinks: Locator;

  // Details
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly successAlert: Locator;

  readonly optionSelects: Locator;
  readonly fileInput: Locator;

  constructor(page: Page) {
    super(page);

    // Listing 
    this.productThumbLinks = page.locator("//div[contains(@class,'product-thumb')]//a");

    // Details
    this.quantityInput = page.locator("#input-quantity");
    this.addToCartButton = page.locator("#button-cart");
    this.successAlert = page.locator(".alert-success");

    this.optionSelects = page.locator("//select[contains(@id,'input-option')]");
    this.fileInput = page.locator("input[type='file']");
  }

  // ---------------------------
  // Dynamic locators
  // ---------------------------
  productByName(productName: string): Locator {
    return this.page.locator(
      `//div[contains(@class,'product-thumb')]//a[normalize-space(text())='${productName}']`
    );
  }

  // ---------------------------
  // Navigation / selection
  // ---------------------------
  async waitForProductVisible(productName: string, timeoutMs = 15000): Promise<boolean> {
    const product = this.productByName(productName);
    try {
      await product.waitFor({ state: "visible", timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }

  async openProductFromList(productName: string, timeoutMs = 15000): Promise<void> {
    const product = this.productByName(productName);

    await Promise.race([
      product.waitFor({ state: "visible", timeout: timeoutMs }).catch(() => {}),
      this.page.waitForLoadState("domcontentloaded", { timeout: timeoutMs }).catch(() => {}),
    ]);

    await product.click();
  }

  async selectProduct(productName: string): Promise<void> {
    await this.openProductFromList(productName);
  }

  // ---------------------------
  // Options (dropdowns)
  // ---------------------------
  async selectRequiredDropdownOptions(): Promise<void> {
    const count = await this.optionSelects.count();

    for (let i = 0; i < count; i++) {
      const sel = this.optionSelects.nth(i);
      const optionCount = await sel.locator("option").count();

      if (optionCount > 1) {
        await sel.scrollIntoViewIfNeeded();
        await sel.selectOption({ index: 1 });
      }
    }
  }

  // ---------------------------
  // Quantity
  // ---------------------------
  async setQuantity(quantity: number, timeoutMs = 15000): Promise<void> {
    await this.quantityInput.waitFor({ state: "visible", timeout: timeoutMs });
    await this.quantityInput.fill(String(quantity));
  }

  // ---------------------------
  // Add to cart
  // ---------------------------
  async clickAddToCart(timeoutMs = 15000): Promise<void> {
    await this.addToCartButton.waitFor({ state: "visible", timeout: timeoutMs });
    await this.addToCartButton.click();
  }

  async addToCart(quantity: number = 1): Promise<void> {
    await this.setQuantity(quantity);
    await this.clickAddToCart();
    await this.waitForAddToCartSuccess().catch(() => false);
  }

  async isAddToCartSuccessMessageDisplayed(): Promise<boolean> {
    const visible = await this.successAlert.isVisible().catch(() => false);
    if (!visible) return false;

    const text = ((await this.successAlert.first().innerText().catch(() => "")) || "").trim();
    return text.includes("Success: You have added") && text.includes("to your shopping cart!");
  }

  async waitForAddToCartSuccess(timeoutMs = 10000): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (await this.isAddToCartSuccessMessageDisplayed()) return true;
      await this.page.waitForTimeout(200);
    }
    return false;
  }

  // ---------------------------
  // Options: modular fillers
  // ---------------------------
  async chooseRadioValue(value: string, timeoutMs = 15000): Promise<void> {
    const radio = this.page.locator(
      `//input[@type='radio' and @value='${value}' and starts-with(@name, 'option[')]`
    );
    await radio.waitFor({ state: "visible", timeout: timeoutMs });
    await radio.check();
  }

  async chooseCheckboxValue(value: string, timeoutMs = 15000): Promise<void> {
    const checkbox = this.page.locator(`//input[@type='checkbox' and @value='${value}']`);
    await checkbox.waitFor({ state: "visible", timeout: timeoutMs });
    await checkbox.click();
  }

  async fillTextOption(name: string, text: string, timeoutMs = 15000): Promise<void> {
    const input = this.page.locator(`[name="${name}"]`);
    await input.waitFor({ state: "visible", timeout: timeoutMs });
    await input.fill(text);
  }

  async fillTextareaOption(name: string, text: string, timeoutMs = 15000): Promise<void> {
    const textarea = this.page.locator(`[name="${name}"]`);
    await textarea.waitFor({ state: "visible", timeout: timeoutMs });
    await textarea.fill(text);
  }

  async fillSelectOption(name: string, index: number = 1, timeoutMs = 15000): Promise<void> {
    const sel = this.page.locator(`[name="${name}"]`);
    await sel.waitFor({ state: "visible", timeout: timeoutMs });
    await sel.scrollIntoViewIfNeeded();
    await sel.selectOption({ index });
  }

  async fillDateOption(name: string, yyyyMmDd: string, timeoutMs = 15000): Promise<void> {
    const input = this.page.locator(`[name="${name}"]`);
    await input.waitFor({ state: "visible", timeout: timeoutMs });
    await input.fill(yyyyMmDd);
  }

  async fillTimeOption(name: string, hhMm: string, timeoutMs = 15000): Promise<void> {
    const input = this.page.locator(`[name="${name}"]`);
    await input.waitFor({ state: "visible", timeout: timeoutMs });
    await input.fill(hhMm);
  }

  async fillDatetimeOption(name: string, value: string, tabOut: boolean = true, timeoutMs = 15000) {
    const input = this.page.locator(`[name="${name}"]`);
    await input.waitFor({ state: "visible", timeout: timeoutMs });
    await input.fill(value);
    if (tabOut) await input.press("Tab");
  }

  async uploadFileOption(buttonId: string, filePath: string, timeoutMs = 15000): Promise<void> {
    const uploadBtn = this.page.locator(`#${buttonId}`);
    await uploadBtn.waitFor({ state: "visible", timeout: timeoutMs });

    const dialogPromise = this.page.waitForEvent("dialog", { timeout: timeoutMs }).catch(() => null);

    await uploadBtn.click();
    await this.fileInput.setInputFiles(filePath);

    const dialog = await dialogPromise;
    if (dialog) await dialog.accept();
  }
}
