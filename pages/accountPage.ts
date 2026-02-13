// navigationPage.ts
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./basePage";

export class AccountPage extends BasePage {
  // Use Playwright baseURL from config
  readonly urls = {
    base: "http://localhost/opencart/upload/",
    account: "http://localhost/opencart/upload/index.php?route=account/account&language=en-gb",
    affiliate: "http://localhost/opencart/upload/index.php?route=account/affiliate&language=en-gb",
  };

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
  readonly loginLink: Locator;

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

  // Account
  readonly accountMarker: Locator;

  readonly editAccount: Locator;
  readonly changePassword: Locator;
  readonly addressBook: Locator;
  readonly accountWishlist: Locator;

  readonly paymentMethods: Locator;
  readonly orderHistory: Locator;
  readonly subscriptions: Locator;
  readonly rewardPoints: Locator;
  readonly returnRequests: Locator;
  readonly transactions: Locator;

  readonly downloadsOnAccount: Locator;

  // Messages
  readonly alertSuccess: Locator;
  readonly alertDanger: Locator;
  readonly emptyCartMessage: Locator;

  // Affiliate
  readonly affiliateEntry: Locator;
  readonly affiliateCompany: Locator;
  readonly affiliateWebsite: Locator;
  readonly affiliateTax: Locator;
  readonly affiliatePaymentCheque: Locator;
  readonly affiliateChequePayee: Locator;
  readonly affiliateAgree: Locator;
  readonly continueButton: Locator;

  // Newsletter
  readonly newsletterSidebar: Locator;
  readonly newsletterInContent: Locator;
  readonly newsletterCheckbox: Locator;

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

    this.myAccount = page.locator("a[href*='route=account/account']").first();
    this.loginLink = page.getByRole("link", { name: "Login" });

    // Categories
    this.desktops = page.getByRole("link", { name: "Desktops" });
    this.desktopsMac = page.getByRole("link", { name: "Mac (1)" });

    this.laptopsNotebooks = page.getByRole("link", { name: "Laptops & Notebooks" });
    this.laptopsShowAll = page.locator("a.see-all:has-text('Laptops')");

    this.components = page.getByRole("link", { name: "Components" });
    this.componentsShowAll = page.getByRole("link", { name: "Show All Components" });

    this.tablets = page.getByRole("link", { name: "Tablets" });
    this.software = page.getByRole("link", { name: "Software" });
    this.phonesPdas = page.getByRole("link", { name: "Phones & PDAs" });
    this.cameras = page.getByRole("link", { name: "Cameras" });
    this.mp3Players = page.getByRole("link", { name: "MP3 Players" });

    // Account
    this.accountMarker = page.locator("#account-account");

    this.editAccount = page.getByRole("link", { name: "Edit your account information" });
    this.changePassword = page.getByRole("link", { name: "Change your password" });
    this.addressBook = page.getByRole("link", { name: "Modify your address book entries" });
    this.accountWishlist = page.getByRole("link", { name: "Modify your wish list" });

    this.paymentMethods = page.locator(
      "a:has-text('Payment Methods'), a:has-text('Modify your payment methods')"
    );
    this.orderHistory = page.getByRole("link", { name: "View your order history" });
    this.subscriptions = page.locator("a:has-text('Subscriptions'), a:has-text('Manage your subscriptions')");
    this.rewardPoints = page.getByRole("link", { name: "Your Reward Points" });
    this.returnRequests = page.getByRole("link", { name: "View your return requests" });
    this.transactions = page.getByRole("link", { name: "Your Transactions" });

    this.downloadsOnAccount = page.locator(
  "a:has-text('Downloads'), a:has-text('View your downloads')"
  );

    // Messages
    this.alertSuccess = page.locator("div.alert-success");
    this.alertDanger = page.locator("div.alert-danger");
    this.emptyCartMessage = page.locator("#content p:has-text('Your shopping cart is empty')");

    // Affiliate
    this.affiliateEntry = page.locator(
      "a:has-text('Register for an affiliate account'), a:has-text('Affiliate account'), a:has-text('My Affiliate Account')"
    );
    this.affiliateCompany = page.locator("input[name='company']");
    this.affiliateWebsite = page.locator("input[name='website']");
    this.affiliateTax = page.locator("input[name='tax']");
    this.affiliatePaymentCheque = page.locator("input[type='radio'][value='cheque']");
    this.affiliateChequePayee = page.locator("input[name='cheque']");
    this.affiliateAgree = page.locator("input[type='checkbox'][name='agree']");
    this.continueButton = page.locator(
      "button[type='submit']:has-text('Continue'), input[type='submit'][value='Continue']"
    );

    // Newsletter
    this.newsletterSidebar = page.locator(
      "aside#column-right a.list-group-item[href*='route=account/newsletter']"
    );
    this.newsletterInContent = page.locator("#content a[href*='route=account/newsletter']");
    this.newsletterCheckbox = page.locator("#input-newsletter");
  }

  // ---------------------------
  // Public navigation
  // ---------------------------
  async openHome(): Promise<void> {
    await this.page.goto(this.urls.base, { waitUntil: "domcontentloaded" });
    await expect(this.body).toBeVisible();
  }

  async ensureHome(): Promise<void> {
    if (!this.page.url().includes("/upload/index.php")) {
      await this.openHome();
    }
  }

  async openAccountDashboard(): Promise<void> {
    await this.page.goto(this.urls.account, { waitUntil: "domcontentloaded" });
    await expect(this.accountMarker).toBeVisible();
    await expect(this.content).toBeVisible();
  }

  // ---------------------------
  // Currency
  // ---------------------------
  async setCurrencyEuro(): Promise<void> {
    await this.currencyToggle.click();
    await this.currencyEuro.click();

    await expect
      .poll(async () => {
        const texts = await this.priceText.allInnerTexts().catch(() => []);
        return texts.some((t) => t.includes("€"));
      })
      .toBeTruthy();
  }

  async isCurrencyEuro(): Promise<boolean> {
    const texts = await this.priceText.allInnerTexts().catch(() => []);
    return texts.some((t) => t.includes("€"));
  }

  // ---------------------------
  // Header / account / cart
  // ---------------------------
  async openLoginFromHeader(): Promise<void> {
    await this.page.keyboard.press("Home");
    await this.myAccount.click();
  const loginLink = this.page.getByRole("link", { name: "Login" }).first();
  await loginLink.click();
  await expect(this.content).toBeVisible();
  }

  async openWishlist(): Promise<void> {
    await this.wishlistTotal.click();
    await Promise.race([
      this.page.waitForURL(/route=account\/wishlist/, { timeout: 15000 }).catch(() => {}),
      this.page.waitForURL(/route=account\/login/, { timeout: 15000 }).catch(() => {}),
    ]);
  }

  async isRedirectedToLogin(): Promise<boolean> {
  return this.page.url().includes("route=account/login");
  }

  async openCart(): Promise<void> {
    await this.shoppingCart.click();
    await expect(this.content).toBeVisible();
  }

  async openCheckout(): Promise<void> {
    await this.checkout.click();
    await this.page.waitForURL(/route=checkout/, { timeout: 15000 });
    await expect(this.content).toBeVisible();
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
  async openDesktopsMac(): Promise<void> {
    await this.desktops.click();
    await this.desktopsMac.click();
    await expect(this.content).toBeVisible();
  }

  async openLaptopsAndNotebooks(): Promise<void> {
    await this.laptopsNotebooks.click({ noWaitAfter: true });
    await expect(this.laptopsShowAll).toBeVisible();
    await this.laptopsShowAll.click();
  }

  async openComponents(): Promise<void> {
    await this.components.click();
    await this.componentsShowAll.click();
    await expect(this.content).toBeVisible();
  }

  async openTablets(): Promise<void> {
    await this.tablets.click();
    await expect(this.content).toBeVisible();
  }

  async openSoftware(): Promise<void> {
    await this.software.click();
    await expect(this.content).toBeVisible();
  }

  async openPhonesAndPdas(): Promise<void> {
    await this.phonesPdas.click();
    await expect(this.content).toBeVisible();
  }

  async openCameras(): Promise<void> {
    await this.cameras.click();
    await expect(this.content).toBeVisible();
  }

  async openMp3Players(): Promise<void> {
    await this.mp3Players.click();
    await expect(this.content).toBeVisible();
  }

  // ---------------------------
  // Account pages
  // ---------------------------
  private async headingContains(text: string, ignoreCase = false): Promise<boolean> {
    try {
      const h = await this.h1.innerText({ timeout: 5000 });
      if (!h) return false;
      return ignoreCase ? h.trim().toLowerCase().includes(text.toLowerCase()) : h.trim().includes(text);
    } catch {
      return false;
    }
  }

  async openEditAccount(): Promise<void> {
    await this.editAccount.click();
    await expect(this.h1).toBeVisible();
  }
  async onEditAccount(): Promise<boolean> {
    return await this.headingContains("My Account Information");
  }

  async openChangePassword(): Promise<void> {
    await this.changePassword.click();
    await expect(this.h1).toBeVisible();
  }
  async onChangePassword(): Promise<boolean> {
    return await this.headingContains("Change Password");
  }

  async openAddressBook(): Promise<void> {
    await this.addressBook.click();
    await expect(this.h1).toBeVisible();
  }
  async onAddressBook(): Promise<boolean> {
    return await this.headingContains("Address Book");
  }

  async openAccountWishlist(): Promise<void> {
    await this.accountWishlist.click();
    await expect(this.h1).toBeVisible();
  }
  async onAccountWishlist(): Promise<boolean> {
    return await this.headingContains("wishlist", true);
  }

  async openPaymentMethods(): Promise<void> {
    await this.paymentMethods.click();
    await expect(this.h1).toBeVisible();
  }
  async onPaymentMethods(): Promise<boolean> {
    return await this.headingContains("Payment Method");
  }

  async openOrderHistory(): Promise<void> {
    await this.orderHistory.click();
    await expect(this.h1).toBeVisible();
  }
  async onOrderHistory(): Promise<boolean> {
    return await this.headingContains("Order History");
  }

  async openSubscriptions(): Promise<void> {
  const sidebarLink = this.page.locator("#column-right a:has-text('Subscriptions')");
  const contentLink = this.page.locator("#content a:has-text('Subscriptions')");

  if (await sidebarLink.first().isVisible().catch(() => false)) {
    await sidebarLink.first().click();
  } else {
    await contentLink.first().click();
  }
  await expect(this.content).toBeVisible();
  await expect(this.page).toHaveURL(/route=account\/subscription/);
}


  async subscriptionsVisible(): Promise<boolean> {
  if (!this.page.url().includes("route=account/subscription")) return false;
  const txt = (await this.content.innerText().catch(() => "")).toLowerCase();
  return txt.includes("subscription") || txt.includes("subscriptions") || txt.includes("recurring");
}

  async openDownloads(): Promise<void> {
  const sidebarLink = this.page.locator("#column-right a:has-text('Downloads')");
  const contentLink = this.page.locator("#content a:has-text('Downloads')");

  if (await sidebarLink.first().isVisible().catch(() => false)) {
    await sidebarLink.first().click();
  } else {
    await contentLink.first().click();
  }
  await expect(this.content).toBeVisible();
  await expect(this.page).toHaveURL(/route=account\/download/);
}

  async downloadsVisible(): Promise<boolean> {
    if (!this.page.url().includes("route=account/download")) return false;
    const txt = (await this.content.innerText().catch(() => "")).toLowerCase();
    return txt.includes("download") || txt.includes("downloads") || txt.includes("no downloads");
  }

  async openRewardPoints(): Promise<void> {
    await this.rewardPoints.click();
    await expect(this.h1).toBeVisible();
  }
  async onRewardPoints(): Promise<boolean> {
    return await this.headingContains("Your Reward Points");
  }

  async openReturnRequests(): Promise<void> {
    await this.returnRequests.click();
    await expect(this.h1).toBeVisible();
  }
  async onReturnRequests(): Promise<boolean> {
    return await this.headingContains("Returns");
  }

  async openTransactions(): Promise<void> {
    await this.transactions.click();
    await expect(this.h1).toBeVisible();
  }
  async onTransactions(): Promise<boolean> {
    return await this.headingContains("Your Transactions");
  }

  // ---------------------------
  // Affiliate
  // ---------------------------
 async openAffiliate(): Promise<void> {
    if (await this.onAffiliatePage()) return;

    await this.page.waitForLoadState("domcontentloaded", { timeout: 10000 }).catch(() => {});

    if (!this.page.url().includes("customer_token")) {
      throw new Error(`Not authenticated. Current URL: ${this.page.url()}`);
    }

    const currentUrl = this.page.url();
    const tokenMatch = currentUrl.match(/customer_token=([^&]+)/);
    
    if (!tokenMatch) {
      throw new Error(`Customer token not found in URL: ${currentUrl}`);
    }

    const customerToken = tokenMatch[1];
    const affiliateUrl = `http://localhost/opencart/upload/index.php?route=account/affiliate&language=en-gb&customer_token=${customerToken}`;

    await this.page.goto(affiliateUrl, { waitUntil: "domcontentloaded" });

    await expect(this.page.getByRole("heading", { name: "Your Affiliate Information" }))
      .toBeVisible();
  }


  async registerAffiliate(params: {
    company: string;
    website: string;
    taxId: string;
    paymentMethod: string;
    chequePayeeName?: string;
  }): Promise<void> {
    await this.openAffiliate();

    await this.affiliateCompany.waitFor({ state: "visible" });

    await this.affiliateCompany.fill(params.company);
    await this.affiliateWebsite.fill(params.website);
    await this.affiliateTax.fill(params.taxId);

    if ((params.paymentMethod || "").trim().toLowerCase() === "cheque") {
      await this.affiliatePaymentCheque.check();
      if (params.chequePayeeName) {
        await this.affiliateChequePayee.fill(params.chequePayeeName);
      }
    }

    await this.affiliateAgree.check();
    await this.continueButton.click();
    await expect(this.alertSuccess).toBeVisible();
  }

  async affiliateSuccess(): Promise<boolean> {
    const t = (await this.alertSuccess.first().innerText().catch(() => "")).toLowerCase();
    return t.includes("successfully updated");
  }

  async onAffiliatePage(): Promise<boolean> {
    return await this.headingContains("Affiliate");
  }

  // ---------------------------
  // Newsletter
  // ---------------------------
  async openNewsletter(): Promise<void> {
    if (!this.page.url().includes("route=account/account")) {
      await this.openAccountDashboard();
    }

    const sidebarVisible = await this.newsletterSidebar.first().isVisible().catch(() => false);
    const link = sidebarVisible ? this.newsletterSidebar.first() : this.newsletterInContent.first();

    const href = await link.getAttribute("href");
    if (!href) throw new Error("Newsletter link not found on Account page.");

    await this.page.goto(href, { waitUntil: "domcontentloaded" });
    await expect(this.page).toHaveURL(/route=account\/newsletter/);
    await expect(this.content).toBeVisible();
  }

  async setNewsletter(subscribe = true): Promise<void> {
    const checkboxCount = await this.newsletterCheckbox.count();

    if (checkboxCount > 0) {
      const checked = await this.newsletterCheckbox.isChecked().catch(() => false);
      if (subscribe !== checked) {
        if (subscribe) await this.newsletterCheckbox.check();
        else await this.newsletterCheckbox.uncheck();
      }
    } else {
      const value = subscribe ? "1" : "0";
      await this.page.locator(`input[type='radio'][value='${value}']`).check();
    }

    await this.continueButton.click();
    await expect(this.alertSuccess).toBeVisible();
  }

  async newsletterSuccess(): Promise<boolean> {
    const t = (await this.alertSuccess.first().innerText().catch(() => "")).toLowerCase();
    return t.includes("newsletter subscription has been successfully updated");
  }

  // ---------------------------
  // Logout
  // ---------------------------
  async logoutNow(): Promise<void> {
    await this.logout.click();
    await expect(this.body).toBeVisible();
  }

  async isLoggedOut(): Promise<boolean> {
    const html = await this.page.content();
    return html.includes("Account Logout");
  }
}

