import { test, expect } from "./fixtures/navigation.fixture";
import { RegisterPage } from "../pages/registerPage";
import { loginAndOpenAccount } from "./workflows/auth.workflow";
import { LOGIN_DATA } from "./data/login.data";
import { NAV_DATA } from "./data/navigation.data";
import { uniqueEmail } from "../utils/uniqueEmail";
import { TAGS } from "./config/tags";

test.describe("Navigation", { tag: [...TAGS.suites.navigation] }, () => {
  // ---------------------------
  // Header / Unauthenticated
  // ---------------------------
  test(
    "change currency to euro",
    { tag: [...TAGS.feature.currency] },
    async ({ homePage }) => {
      await homePage.setCurrencyEuro();
      expect(await homePage.isCurrencyEuro()).toBeTruthy();
    }
  );

  test(
    "my account unauthenticated opens login",
    { tag: [...TAGS.auth.unauthenticated, ...TAGS.feature.header] },
    async ({ homePage, page }) => {
      await homePage.openLoginFromHeader();
      expect(await homePage.isContentVisible()).toBeTruthy();
      await expect(page).toHaveURL(/route=account\/login/);
    }
  );

  test(
    "wishlist unauthenticated redirects to login",
    { tag: [...TAGS.auth.unauthenticated, ...TAGS.feature.wishlist] },
    async ({ homePage, page }) => {
      await homePage.openWishlist();
      expect(homePage.isRedirectedToLogin()).toBeTruthy();
      await expect(page).toHaveURL(/route=account\/login/);
    }
  );

  test(
    "open cart",
    { tag: [...TAGS.feature.cartOps] },
    async ({ homePage, page }) => {
      await homePage.openCart();
      expect(await homePage.isContentVisible()).toBeTruthy();
      await expect(page).toHaveURL(/route=checkout\/cart/);
    }
  );

  test(
    "checkout unauthenticated empty cart redirects to cart",
    { tag: [...TAGS.auth.unauthenticated, ...TAGS.feature.emptyCart] },
    async ({ homePage, page }) => {
      await homePage.openCheckout();
      await expect(page).toHaveURL(/route=checkout\/cart/);
      expect(await homePage.isEmptyCartMessageVisible()).toBeTruthy();
    }
  );

  // ---------------------------
  // Categories
  // ---------------------------
  test("navigate to desktops/mac", { tag: [...TAGS.feature.categories] }, async ({ homePage }) => {
    await homePage.openDesktopsMac();
    expect(await homePage.isContentVisible()).toBeTruthy();
  });

  test("navigate to laptops and notebooks", { tag: [...TAGS.feature.categories] }, async ({ homePage }) => {
    await homePage.openLaptopsAndNotebooks();
    expect(await homePage.isContentVisible()).toBeTruthy();
  });

  test("navigate to components", { tag: [...TAGS.feature.categories] }, async ({ homePage }) => {
    await homePage.openComponents();
    expect(await homePage.isContentVisible()).toBeTruthy();
  });

  test("navigate to tablets", { tag: [...TAGS.feature.categories] }, async ({ homePage }) => {
    await homePage.openTablets();
    expect(await homePage.isContentVisible()).toBeTruthy();
  });

  test("navigate to software", { tag: [...TAGS.feature.categories] }, async ({ homePage }) => {
    await homePage.openSoftware();
    expect(await homePage.isContentVisible()).toBeTruthy();
  });

  test("navigate to phones and PDAs", { tag: [...TAGS.feature.categories] }, async ({ homePage }) => {
    await homePage.openPhonesAndPdas();
    expect(await homePage.isContentVisible()).toBeTruthy();
  });

  test("navigate to cameras", { tag: [...TAGS.feature.categories] }, async ({ homePage }) => {
    await homePage.openCameras();
    expect(await homePage.isContentVisible()).toBeTruthy();
  });

  test("navigate to mp3 players", { tag: [...TAGS.feature.categories] }, async ({ homePage }) => {
    await homePage.openMp3Players();
    expect(await homePage.isContentVisible()).toBeTruthy();
  });

  // ---------------------------
  // Account / Authenticated 
  // ---------------------------
  test("account dashboard authenticated", { tag: [...TAGS.auth.authenticated, ...TAGS.feature.account] }, async ({ accountPage }) => {
    expect(await accountPage.content.isVisible().catch(() => false)).toBeTruthy();
  });

  test("edit account authenticated", { tag: [...TAGS.auth.authenticated, ...TAGS.feature.account] }, async ({ accountPage }) => {
    await accountPage.openEditAccount();
    expect(await accountPage.onEditAccount()).toBeTruthy();
  });

  test("change password authenticated", { tag: [...TAGS.auth.authenticated, ...TAGS.feature.account] }, async ({ accountPage }) => {
    await accountPage.openChangePassword();
    expect(await accountPage.onChangePassword()).toBeTruthy();
  });

  test("payment methods authenticated", { tag: [...TAGS.auth.authenticated, ...TAGS.feature.account] }, async ({ accountPage }) => {
    await accountPage.openPaymentMethods();
    expect(await accountPage.onPaymentMethods()).toBeTruthy();
  });

  test("address book authenticated", { tag: [...TAGS.auth.authenticated, ...TAGS.feature.account] }, async ({ accountPage }) => {
    await accountPage.openAddressBook();
    expect(await accountPage.onAddressBook()).toBeTruthy();
  });

  test("wishlist authenticated", { tag: [...TAGS.auth.authenticated, ...TAGS.feature.wishlist] }, async ({ accountPage }) => {
    await accountPage.openAccountWishlist();
    expect(await accountPage.onAccountWishlist()).toBeTruthy();
  });

  test("order history authenticated", { tag: [...TAGS.auth.authenticated, ...TAGS.feature.orderHistory] }, async ({ accountPage }) => {
    await accountPage.openOrderHistory();
    expect(await accountPage.onOrderHistory()).toBeTruthy();
  });

  test("subscriptions authenticated", { tag: [...TAGS.auth.authenticated] }, async ({ accountPage }) => {
    await accountPage.openSubscriptions();
    expect(await accountPage.subscriptionsVisible()).toBeTruthy();
  });

  test("downloads authenticated", { tag: [...TAGS.auth.authenticated] }, async ({ accountPage }) => {
    await accountPage.openDownloads();
    expect(await accountPage.downloadsVisible()).toBeTruthy();
  });

  test("reward points authenticated", { tag: [...TAGS.auth.authenticated] }, async ({ accountPage }) => {
    await accountPage.openRewardPoints();
    expect(await accountPage.onRewardPoints()).toBeTruthy();
  });

  test("return requests authenticated", { tag: [...TAGS.auth.authenticated] }, async ({ accountPage }) => {
    await accountPage.openReturnRequests();
    expect(await accountPage.onReturnRequests()).toBeTruthy();
  });

  test("transactions authenticated", { tag: [...TAGS.auth.authenticated] }, async ({ accountPage }) => {
    await accountPage.openTransactions();
    expect(await accountPage.onTransactions()).toBeTruthy();
  });

  test("affiliate account page authenticated", { tag: [...TAGS.auth.authenticated, ...TAGS.feature.affiliate] }, async ({ accountPage }) => {
    await accountPage.openAffiliate();
    expect(await accountPage.onAffiliatePage()).toBeTruthy();
  });

  test(
    "affiliate register authenticated (fresh user)",
    { tag: [...TAGS.auth.authenticated, ...TAGS.feature.affiliate] },
    async ({ page }) => {
      const reg = new RegisterPage(page);
      await reg.open();

      const email = uniqueEmail("affiliate");
      await reg.register({
        first: "Jean",
        last: "Doe",
        email,
        password: LOGIN_DATA.validPassword,
        acceptPrivacyPolicy: true,
      });

      const account = await loginAndOpenAccount(page, { email, password: LOGIN_DATA.validPassword });

      await account.registerAffiliate({
        company: NAV_DATA.affiliate.company,
        website: NAV_DATA.affiliate.website,
        taxId: NAV_DATA.affiliate.taxId,
        paymentMethod: NAV_DATA.affiliate.paymentMethod,
        chequePayeeName: NAV_DATA.affiliate.chequePayeeName,
      });

      expect(await account.affiliateSuccess()).toBeTruthy();
    }
  );

  test("newsletter subscription authenticated", { tag: [...TAGS.auth.authenticated, ...TAGS.feature.newsletter] }, async ({ accountPage }) => {
    await accountPage.openNewsletter();
    await accountPage.setNewsletter(true);
    expect(await accountPage.newsletterSuccess()).toBeTruthy();
  });

  test("logout", { tag: [...TAGS.auth.authenticated] }, async ({ accountPage }) => {
    await accountPage.logoutNow();
    expect(await accountPage.isLoggedOut()).toBeTruthy();
  });
});