import { test, expect } from "@playwright/test";
import { resetLoginAttempts } from "../utils/dbUtils.js";
import { SoftAssert } from "../utils/assertions.js";
import { CHECKOUT_DATA } from "./data/checkout.data";
import { loginAddProductsAndGoToCheckout } from "./workflows/checkout.workflow";
import { CartPage } from "../pages/cartPage";
import { CheckoutPage } from "../pages/checkoutPage";
import { LoginPage } from "../pages/loginPage";
import { HomePage } from "../pages/homePage";
import { ProductPage } from "../pages/productPage";
import { AccountPage } from "../pages/accountPage";
import { TAGS } from "./config/tags";

test.describe("TestCheckoutFlow", { tag: [...TAGS.suites.checkout] }, () => {
  test(
    "test_01_happy_path_checkout_single_product",
    { tag: [...TAGS.type.positive, ...TAGS.feature.checkoutFlow] },
    async ({ page }) => {
      const soft = new SoftAssert();

      const { checkout } = await loginAddProductsAndGoToCheckout(page, {
        email: CHECKOUT_DATA.credentials.email,
        password: CHECKOUT_DATA.credentials.password,
        products: [CHECKOUT_DATA.products.hp],
      });

      await checkout.completeNewAddressCheckoutFlow({ ...CHECKOUT_DATA.address, requireAgree: true });

      await expect(page).toHaveURL(/route=checkout\/success/, { timeout: 15000 });

      await soft.assertTrue(await checkout.isOrderSuccessful(), "Verify order placed success message.");
      await soft.assertAll();
    }
  );

  test(
  "test_02_checkout_with_multiple_products",
  { tag: [...TAGS.type.positive, ...TAGS.feature.checkoutFlow] },
  async ({ page }) => {
    test.setTimeout(90000);
    const soft = new SoftAssert();

    const { checkout } = await loginAddProductsAndGoToCheckout(page, {
      email: CHECKOUT_DATA.credentials.email,
      password: CHECKOUT_DATA.credentials.password,
      products: [CHECKOUT_DATA.products.macbook, CHECKOUT_DATA.products.macbookAir],
    });

    await checkout.completeNewAddressCheckoutFlow({ ...CHECKOUT_DATA.address });

    await expect(page).toHaveURL(/route=checkout\/success/, { timeout: 15000 });

    await soft.assertTrue(
      await checkout.isOrderSuccessful(),
      "Verify order success message with multiple products."
    );
    await soft.assertAll();
  }
);

  test(
    "test_03_checkout_with_empty_cart",
    { tag: [...TAGS.type.negative, ...TAGS.feature.emptyCart] },
    async ({ page }) => {
      await resetLoginAttempts(CHECKOUT_DATA.credentials.email);

      const soft = new SoftAssert();

      const login = new LoginPage(page);
      const home = new HomePage(page);
      const product = new ProductPage(page);
      const cart = new CartPage(page);

      await login.open();
      await login.login(CHECKOUT_DATA.credentials.email, CHECKOUT_DATA.credentials.password);

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);

      await home.openLaptopsAndNotebooks();
      await page.waitForLoadState("networkidle");

      await product.selectProduct(CHECKOUT_DATA.products.macbookAir);
      await product.addToCart();
      await product.waitForAddToCartSuccess(10000);

      await cart.open();
      await cart.removeProduct(CHECKOUT_DATA.products.macbookAir);

      const currentUrl = page.url();
      await soft.assertTrue(
        currentUrl.includes("route=checkout/cart"),
        `Verify user stays on cart page when cart is empty. URL: ${currentUrl}`
      );

      await soft.assertAll();
    }
  );

  test(
    "test_04_edit_cart_quantity_then_checkout",
    { tag: [...TAGS.type.positive, ...TAGS.feature.checkoutFlow, ...TAGS.feature.cartOps] },
    async ({ page }) => {
      const soft = new SoftAssert();

      const login = new LoginPage(page);
      const home = new HomePage(page);
      const product = new ProductPage(page);
      const cart = new CartPage(page);
      const checkout = new CheckoutPage(page);

      await login.open();
      await login.login(CHECKOUT_DATA.credentials.email, CHECKOUT_DATA.credentials.password);

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);

      await home.openLaptopsAndNotebooks();
      await product.selectProduct(CHECKOUT_DATA.products.macbook);
      await product.addToCart();
      await product.waitForAddToCartSuccess(10000);

      await cart.open();
      await cart.updateQuantity(CHECKOUT_DATA.products.macbook, 2);
      await cart.waitForProductQuantity(CHECKOUT_DATA.products.macbook, 2);

      await soft.assertEqual(
        await cart.getProductQuantity(CHECKOUT_DATA.products.macbook),
        2,
        "Expected qty to be 2."
      );

      await cart.proceedToCheckout();

      await checkout.completeNewAddressCheckoutFlow({ ...CHECKOUT_DATA.address });

      await expect(page).toHaveURL(/route=checkout\/success/, { timeout: 15000 });

      await soft.assertTrue(
        await checkout.isOrderSuccessful(),
        "Expected successful checkout after updating quantity."
      );
      await soft.assertAll();
    }
  );

  test(
    "test_05_cancel_checkout_and_verify_cart",
    { tag: [...TAGS.type.positive, ...TAGS.feature.checkoutFlow] },
    async ({ page }) => {
      await resetLoginAttempts(CHECKOUT_DATA.credentials.email);

      const soft = new SoftAssert();

      const login = new LoginPage(page);
      const home = new HomePage(page);
      const product = new ProductPage(page);
      const cart = new CartPage(page);

      await login.open();
      await login.login(CHECKOUT_DATA.credentials.email, CHECKOUT_DATA.credentials.password);

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);

      await home.openLaptopsAndNotebooks();
      await product.selectProduct(CHECKOUT_DATA.products.hp);
      await product.addToCart();
      await product.waitForAddToCartSuccess(10000);

      await cart.open();
      await cart.proceedToCheckout();

      await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});
      await cart.open();

      await expect
        .poll(async () => await cart.isProductInCart(CHECKOUT_DATA.products.hp), { timeout: 15000 })
        .toBeTruthy();

      await soft.assertTrue(
        await cart.isProductInCart(CHECKOUT_DATA.products.hp),
        "Product still present in cart after cancelling checkout."
      );

      await soft.assertAll();
    }
  );

  test(
    "test_06_checkout_then_view_order_history",
    { tag: [...TAGS.type.positive, ...TAGS.feature.postCheckout, ...TAGS.feature.orderHistory] },
    async ({ page }) => {
      await resetLoginAttempts(CHECKOUT_DATA.credentials.email);

      const soft = new SoftAssert();

      const { checkout } = await loginAddProductsAndGoToCheckout(page, {
        email: CHECKOUT_DATA.credentials.email,
        password: CHECKOUT_DATA.credentials.password,
        products: [CHECKOUT_DATA.products.macbookAir],
      });

      await checkout.completeNewAddressCheckoutFlow({ ...CHECKOUT_DATA.address });

      await expect(page).toHaveURL(/route=checkout\/success/, { timeout: 15000 });
      await soft.assertTrue(await checkout.isOrderSuccessful(), "Order should be successful.");

      const account = new AccountPage(page);
      await account.openAccountDashboard();
      await account.openOrderHistory();

      const historyTable = page.locator("#content .table-responsive");
      await expect(historyTable).toBeVisible({ timeout: 15000 });

      const text = (await historyTable.innerText().catch(() => "")) || "";
      await soft.assertTrue(text.includes("#"), "Expected order history to contain an order entry.");

      await soft.assertAll();
    }
  );
});