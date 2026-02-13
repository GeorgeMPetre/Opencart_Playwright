import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
  // Routes
  readonly HOME_ROUTE = "index.php?route=common/home&language=en-gb";
  readonly CART_ROUTE = "index.php?route=checkout/cart&language=en-gb";

  // Generic
  readonly body: Locator;
  readonly content: Locator;
  readonly h1: Locator;

  // Currency
  readonly currencyToggle: Locator;
  readonly currencyEuro: Locator;
  readonly priceText: Locator;

  // Header links
  readonly wishlistTotal: Locator;
  readonly shoppingCart: Locator;
  readonly checkout: Locator;
  readonly logout: Locator;
  readonly myAccount: Locator;

  // Categories
  readonly desktops: Locator;
  readonly desktopsMac: Locator;

  readonly laptopsNotebooks: Locator;
  readonly laptopsShowAll: Locator;

  readonly components: Locator;
  readonly componentsShowAll: Locator;

  readonly tablets: Locator;
  readonly software: Locator;
  readonly phonesPdas: Locator;
  readonly cameras: Locator;
  readonly mp3Players: Locator;

  // Messages
  readonly alertSuccess: Locator;
  readonly alertDanger: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Generic
    this.body = page.locator("body");
    this.content = page.locator("#content");
    this.h1 = page.locator("h1").first();

    // Currency
    this.currencyToggle = page.locator("#form-currency a[data-bs-toggle='dropdown']");
    this.currencyEuro = page.locator("#form-currency a.dropdown-item:has-text('Euro')");
    this.priceText = page.locator(".price, .product-price, .product-thumb .price");

    // Header links
    this.wishlistTotal = page.locator("#wishlist-total");
    this.shoppingCart = page.locator("a[title='Shopping Cart']");
    this.checkout = page.locator("a[title='Checkout']");
    this.logout = page.getByRole("link", { name: "Logout" });

    this.myAccount = page.locator("a[title='My Account'], a[href*='route=account/account']").first();

    // Categories
    this.desktops = page.getByRole("link", { name: "Desktops" });
    this.desktopsMac = page.getByRole("link", { name: /Mac\s*\(\d+\)/ });

    this.laptopsNotebooks = page.getByRole("link", { name: "Laptops & Notebooks" });
    this.laptopsShowAll = page.locator("a.see-all:has-text('Laptops')");

    this.components = page.getByRole("link", { name: "Components" });
    this.componentsShowAll = page.getByRole("link", { name: "Show All Components" });

    this.tablets = page.getByRole("link", { name: "Tablets" });
    this.software = page.getByRole("link", { name: "Software" });
    this.phonesPdas = page.getByRole("link", { name: "Phones & PDAs" });
    this.cameras = page.getByRole("link", { name: "Cameras" });
    this.mp3Players = page.getByRole("link", { name: "MP3 Players" });

    // Messages
    this.alertSuccess = page.locator("div.alert-success");
    this.alertDanger = page.locator("div.alert-danger");
    this.emptyCartMessage = page.locator("#content p:has-text('Your shopping cart is empty')");
  }

  // ---------------------------
  // Navigation
  // ---------------------------
  async openHome(): Promise<void> {
    await this.page.goto(this.HOME_ROUTE, { waitUntil: "domcontentloaded" });
    await this.body.waitFor({ state: "visible", timeout: 15000 });
  }

  async ensureHome(): Promise<void> {
    if (!this.page.url().includes("route=common/home")) {
      await this.openHome();
    }
  }

  // ---------------------------
  // Currency
  // ---------------------------
  async setCurrencyEuro(timeoutMs = 15000): Promise<void> {
    await this.currencyToggle.click();
    await this.currencyEuro.click();

    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const texts = await this.priceText.allInnerTexts().catch(() => []);
      if (texts.some((t) => t.includes("€"))) return;
      await this.page.waitForTimeout(200);
    }
  }

  async isCurrencyEuro(): Promise<boolean> {
    const texts = await this.priceText.allInnerTexts().catch(() => []);
    return texts.some((t) => t.includes("€"));
  }

  // ---------------------------
  // Header / cart / checkout
  // ---------------------------
  async openLoginFromHeader(timeoutMs = 15000): Promise<void> {
    await this.page.keyboard.press("Home").catch(() => {});
    await this.myAccount.click();

    const loginLink = this.page.getByRole("link", { name: "Login" }).first();
    await loginLink.click();

    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async openWishlist(timeoutMs = 15000): Promise<void> {
    await this.wishlistTotal.click();
    await Promise.race([
      this.page.waitForURL(/route=account\/wishlist/, { timeout: timeoutMs }).catch(() => {}),
      this.page.waitForURL(/route=account\/login/, { timeout: timeoutMs }).catch(() => {}),
    ]);
  }

  isRedirectedToLogin(): boolean {
    return this.page.url().includes("route=account/login");
  }

    async openCart(timeoutMs = 15000): Promise<void> {
    await this.shoppingCart.click();
    await this.page.waitForURL(/route=checkout\/cart/, { timeout: timeoutMs });
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async openCheckout(timeoutMs = 15000): Promise<void> {
    await this.checkout.click();
    await Promise.race([
      this.page.waitForURL(/route=checkout\/checkout/, { timeout: timeoutMs }).catch(() => {}),
      this.page.waitForURL(/route=checkout\/cart/, { timeout: timeoutMs }).catch(() => {}),
      this.page.waitForURL(/route=account\/login/, { timeout: timeoutMs }).catch(() => {}),
    ]);
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async isEmptyCartMessageVisible(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible().catch(() => false);
  }

  async isContentVisible(): Promise<boolean> {
    return await this.content.isVisible().catch(() => false);
  }

  // ---------------------------
  // Category navigation
  // ---------------------------
  async openDesktopsMac(timeoutMs = 15000): Promise<void> {
    await this.desktops.click();
    await this.desktopsMac.click();
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async openLaptopsAndNotebooks(timeoutMs = 15000): Promise<void> {
    await this.laptopsNotebooks.click();
    await this.laptopsShowAll.click();
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async openComponents(timeoutMs = 15000): Promise<void> {
    await this.components.click();
    await this.componentsShowAll.click();
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async openTablets(timeoutMs = 15000): Promise<void> {
    await this.tablets.click();
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async openSoftware(timeoutMs = 15000): Promise<void> {
    await this.software.click();
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async openPhonesAndPdas(timeoutMs = 15000): Promise<void> {
    await this.phonesPdas.click();
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async openCameras(timeoutMs = 15000): Promise<void> {
    await this.cameras.click();
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }

  async openMp3Players(timeoutMs = 15000): Promise<void> {
    await this.mp3Players.click();
    await this.content.waitFor({ state: "visible", timeout: timeoutMs });
  }
}
