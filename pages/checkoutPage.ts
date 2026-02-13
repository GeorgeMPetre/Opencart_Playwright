import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class CheckoutPage extends BasePage {
  // Locators (Shipping address)
  readonly shippingNewRadio: Locator;
  readonly shippingNewSection: Locator;

  readonly shippingFirstName: Locator;
  readonly shippingLastName: Locator;
  readonly shippingAddress1: Locator;
  readonly shippingCity: Locator;
  readonly shippingPostcode: Locator;
  readonly shippingCountry: Locator;
  readonly shippingZone: Locator;

  readonly shippingAddressContinue: Locator;

  // Shipping / Payment methods
  readonly shippingMethodSelect: Locator;
  readonly shippingMethodRefresh: Locator;

  readonly paymentMethodSelect: Locator;
  readonly paymentMethodRefresh: Locator;

  readonly agreeCheckbox: Locator;
  readonly alertDanger: Locator;

  // Confirm / Success
  readonly confirmButton: Locator;
  readonly successMessageH1: Locator;

  constructor(page: Page) {
    super(page);

    // Shipping address
    this.shippingNewRadio = page.locator("#input-shipping-new");
    this.shippingNewSection = page.locator("#shipping-new");

    this.shippingFirstName = page.locator("#input-shipping-firstname");
    this.shippingLastName = page.locator("#input-shipping-lastname");
    this.shippingAddress1 = page.locator("#input-shipping-address-1");
    this.shippingCity = page.locator("#input-shipping-city");
    this.shippingPostcode = page.locator("#input-shipping-postcode");
    this.shippingCountry = page.locator("#input-shipping-country");
    this.shippingZone = page.locator("#input-shipping-zone");

    this.shippingAddressContinue = page.locator("#button-shipping-address");

    // Shipping / Payment
    this.shippingMethodSelect = page.locator("#input-shipping-method");
    this.shippingMethodRefresh = page.locator("#button-shipping-method");

    this.paymentMethodSelect = page.locator("#input-payment-method");
    this.paymentMethodRefresh = page.locator("#button-payment-method");

    this.agreeCheckbox = page.locator("#input-agree");
    this.alertDanger = page.locator("#alert .alert-danger");

    // Confirm / success
    this.confirmButton = page.locator("#checkout-payment button.btn-primary");
    this.successMessageH1 = page.locator("#content h1");
  }

  // ---------------------------
  // Generic waits
  // ---------------------------
  private async waitFor(
    predicate: () => Promise<boolean>,
    timeoutMs = 15000,
    intervalMs = 250
  ): Promise<boolean> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (await predicate().catch(() => false)) return true;
      await this.page.waitForTimeout(intervalMs);
      
    }
    return false;
  }

  private async waitForVisible(loc: Locator, timeoutMs = 15000): Promise<void> {
    await loc.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async selectByVisibleText(select: Locator, text: string): Promise<void> {
    await this.waitForVisible(select);
    await select.scrollIntoViewIfNeeded();
    await select.selectOption({ label: text });
  }

  // ---------------------------
  // High-level flow
  // ---------------------------
  async completeNewAddressCheckoutFlow(params?: {
    firstname?: string;
    lastname?: string;
    address1?: string;
    city?: string;
    postcode?: string;
    country?: string;
    zone?: string;
    requireAgree?: boolean;
  }): Promise<void> {
    const {
      firstname = "John",
      lastname = "Doe",
      address1 = "123 Testing Street",
      city = "Testville",
      postcode = "CT1 2AB",
      country = "United Kingdom",
      zone = "Kent",
      requireAgree = false,
    } = params || {};

    await this.selectNewShippingAddress();
    await this.fillNewShippingAddress({ firstname, lastname, address1, city, postcode, country, zone });
    await this.submitNewShippingAddress();

    await this.refreshAndSelectShippingMethod();
    await this.refreshAndSelectPaymentMethod();

    if (requireAgree) await this.agreeIfPresent();

    await this.confirmOrder();
  }

  async isOrderSuccessful(): Promise<boolean> {
    const visible = await this.successMessageH1.isVisible().catch(() => false);
    if (!visible) return false;

    const text = ((await this.successMessageH1.innerText().catch(() => "")) || "").toLowerCase();
    return text.includes("your order has been placed");
  }

  // ---------------------------
  // Shipping address
  // ---------------------------
  async selectNewShippingAddress(): Promise<void> {
    if ((await this.shippingNewRadio.count()) === 0) return;

    await this.shippingNewRadio.waitFor({ state: "attached", timeout: 15000 });

    const checked = await this.shippingNewRadio.isChecked().catch(() => false);
    if (!checked) {
      await this.shippingNewRadio.scrollIntoViewIfNeeded();
      await this.shippingNewRadio.click();
    }

    await this.waitForVisible(this.shippingNewSection);
  }

  async fillNewShippingAddress(params: {
    firstname: string;
    lastname: string;
    address1: string;
    city: string;
    postcode: string;
    country: string;
    zone: string;
  }): Promise<void> {
    const { firstname, lastname, address1, city, postcode, country, zone } = params;

    await this.waitForVisible(this.shippingFirstName);
    await this.shippingFirstName.fill(firstname);

    await this.shippingLastName.fill(lastname);
    await this.shippingAddress1.fill(address1);
    await this.shippingCity.fill(city);
    await this.shippingPostcode.fill(postcode);

    await this.selectByVisibleText(this.shippingCountry, country);

    await this.waitForSelectToHaveEnabledValueOptions(this.shippingZone, 15000);
    await this.selectByVisibleText(this.shippingZone, zone);
  }

  async submitNewShippingAddress(): Promise<void> {
    await this.waitForVisible(this.shippingAddressContinue);
    await this.shippingAddressContinue.scrollIntoViewIfNeeded();
    await this.shippingAddressContinue.click();

    await this.shippingMethodRefresh.waitFor({ state: "attached", timeout: 15000 });
  }

  // ---------------------------
  // Shipping / Payment methods
  // ---------------------------
  private async waitForSelectToHaveEnabledValueOptions(select: Locator, timeoutMs = 10000): Promise<void> {
    const ok = await this.waitFor(async () => {
      const opts = select.locator("option");
      const n = await opts.count();
      if (n === 0) return false;

      for (let i = 0; i < n; i++) {
        const opt = opts.nth(i);
        const value = ((await opt.getAttribute("value")) || "").trim();
        const disabled = await opt.getAttribute("disabled");
        if (value && disabled === null) return true;
      }
      return false;
    }, timeoutMs);

    if (!ok) throw new Error("Select did not load enabled options in time.");
  }

  private async selectFirstEnabledValueOption(select: Locator): Promise<void> {
    const opts = select.locator("option");
    const n = await opts.count();
    if (n === 0) throw new Error("No options found in select.");

    for (let i = 0; i < n; i++) {
      const opt = opts.nth(i);
      const value = ((await opt.getAttribute("value")) || "").trim();
      const disabled = await opt.getAttribute("disabled");
      if (value && disabled === null) {
        await select.scrollIntoViewIfNeeded();
        await select.selectOption({ index: i });
        return;
      }
    }

    throw new Error("No enabled selectable options found.");
  }

  async refreshAndSelectShippingMethod(): Promise<void> {
    await this.waitForVisible(this.shippingMethodRefresh);
    await this.page.waitForTimeout(500);
    
    await this.shippingMethodRefresh.click();
    await this.page.waitForTimeout(500);

    await this.shippingMethodSelect.waitFor({ state: "attached", timeout: 15000 });
    await this.page.waitForTimeout(500);
    
    await this.shippingMethodSelect.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);

    await this.waitForSelectToHaveEnabledValueOptions(this.shippingMethodSelect, 15000);
    await this.page.waitForTimeout(500);
    
    await this.selectFirstEnabledValueOption(this.shippingMethodSelect);
    await this.page.waitForTimeout(500);

    await this.waitForVisible(this.paymentMethodRefresh, 20000);
  }

  async refreshAndSelectPaymentMethod(): Promise<void> {
    await this.waitForVisible(this.paymentMethodRefresh, 20000);
    await this.page.waitForTimeout(500);
    
    await this.paymentMethodRefresh.click();
    await this.page.waitForTimeout(500);

    if (await this.hasNoPaymentMethodsAlert()) {
      throw new Error("No payment methods configured in store.");
    }

    await this.paymentMethodSelect.waitFor({ state: "attached", timeout: 15000 });
    await this.page.waitForTimeout(500);
    
    await this.paymentMethodSelect.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);

    await this.waitForSelectToHaveEnabledValueOptions(this.paymentMethodSelect, 15000);
    await this.page.waitForTimeout(500);
    
    await this.selectFirstEnabledValueOption(this.paymentMethodSelect);
    await this.page.waitForTimeout(500);

    const ok = await this.waitFor(
      async () => await this.confirmButton.isEnabled().catch(() => false),
      20000
    );
    if (!ok) throw new Error("Confirm button did not become enabled.");
  }

  async hasNoPaymentMethodsAlert(): Promise<boolean> {
    const count = await this.alertDanger.count();
    if (count === 0) return false;

    const texts = await this.alertDanger.allInnerTexts();
    return texts.some((t) => (t || "").toLowerCase().includes("no payment method available"));
  }

  async agreeIfPresent(): Promise<void> {
    if ((await this.agreeCheckbox.count()) === 0) return;

    if (await this.agreeCheckbox.isVisible().catch(() => false)) {
      const checked = await this.agreeCheckbox.isChecked().catch(() => false);
      if (!checked) {
        await this.agreeCheckbox.scrollIntoViewIfNeeded();
        await this.agreeCheckbox.check();
      }
    }
  }

  // ---------------------------
  // Confirm
  // ---------------------------
  async confirmOrder(): Promise<void> {
    await this.waitForVisible(this.confirmButton);
    await this.confirmButton.scrollIntoViewIfNeeded();

    const ok = await this.waitFor(async () => await this.confirmButton.isEnabled().catch(() => false), 15000);
    if (!ok) throw new Error("Confirm button is not enabled.");

    await this.confirmButton.click();
  }
}
