import { test, expect } from "./fixtures/cart.fixture";
import { moneyEq } from "../utils/money.js";
import { SoftAssert } from "../utils/assertions.js";
import { resetLoginAttempts } from "../utils/dbUtils.js";
import { LoginPage } from "../pages/loginPage";
import { CART_DATA } from "./data/cart.data";
import { CART_EXPECTED } from "./expected/cart.expected";
import { fillAppleCinemaOptions } from "./workflows/cart.workflow";
import { LOGIN_DATA } from "./data/login.data";
import { TAGS } from "./config/tags";

test.describe("TestAddEditCartFunctionality", { tag: [...TAGS.suites.cart] }, () => {
  test("test_01_add_single_product_to_cart", { tag: [...TAGS.type.positive, ...TAGS.feature.cartOps] }, async ({ homePage, productPage, cartPage }) => {
    const soft = new SoftAssert();

    await homePage.openLaptopsAndNotebooks();
    await productPage.selectProduct(CART_DATA.products.hp);
    await productPage.addToCart(1);

    await homePage.openCart();
    await cartPage.waitForReady();

    await expect.poll(async () => await cartPage.isProductInCart(CART_DATA.products.hp)).toBeTruthy();

    await soft.assertEqual(
      await cartPage.getProductQuantity(CART_DATA.products.hp),
      1,
      `Quantity for ${CART_DATA.products.hp} should be 1`
    );

    const total = await cartPage.getTotalPrice(CART_DATA.products.hp);
    await soft.assertTrue(
      total !== null && moneyEq(total, CART_EXPECTED.hpLp3065Total),
      `Total price for ${CART_DATA.products.hp} should be ${CART_EXPECTED.hpLp3065Total}, but got: ${total}`
    );

    await soft.assertAll();
  });

  test("test_02_add_multiple_quantities", { tag: [...TAGS.type.positive, ...TAGS.feature.cartOps] }, async ({ homePage, productPage, cartPage }) => {
    const soft = new SoftAssert();

    await homePage.openLaptopsAndNotebooks();

    await productPage.selectProduct(CART_DATA.products.macbook);
    for (let i = 0; i < 3; i++) {
      await productPage.addToCart(1);
    }

    await homePage.openCart();

    const ok = await cartPage.waitForProductQuantity(CART_DATA.products.macbook, 3);
    await soft.assertTrue(ok, "Quantity of MacBook should become 3");

    await soft.assertEqual(
      await cartPage.getProductQuantity(CART_DATA.products.macbook),
      3,
      "Quantity of MacBook should be 3 after adding it three times"
    );

    await soft.assertAll();
  });

  test("test_03_edit_quantity_in_cart", { tag: [...TAGS.type.positive, ...TAGS.feature.cartOps] }, async ({ homePage, productPage, cartPage }) => {
    const soft = new SoftAssert();

    await homePage.openLaptopsAndNotebooks();

    await productPage.selectProduct(CART_DATA.products.macbook);
    await productPage.addToCart();

    await homePage.openCart();
    await cartPage.waitForReady();

    await expect.poll(async () => await cartPage.isProductInCart(CART_DATA.products.macbook)).toBeTruthy();

    await expect.poll(async () => {
      await cartPage.updateQuantity(CART_DATA.products.macbook, 2);
      return true;
    }, { timeout: 30000 }).toBeTruthy();
    await cartPage.waitForProductQuantity(CART_DATA.products.macbook, 2);

    await soft.assertEqual(
      await cartPage.getProductQuantity(CART_DATA.products.macbook),
      2,
      "Product quantity should be updated to 2"
    );

    await soft.assertAll();
  });

  test("test_04_remove_product_from_cart", { tag: [...TAGS.type.positive, ...TAGS.feature.cartOps] }, async ({ homePage, productPage, cartPage }) => {
    const soft = new SoftAssert();

    await homePage.openCameras();

    await productPage.selectProduct(CART_DATA.products.canon);
    await productPage.selectRequiredDropdownOptions();
    await productPage.addToCart();

    await homePage.openCart();
    await cartPage.removeProduct(CART_DATA.products.canon);

    await soft.assertFalse(await cartPage.isProductInCart(CART_DATA.products.canon), "Product should be removed");
    await soft.assertTrue(await cartPage.isCartEmptyMessageDisplayed(), "Empty cart message should be shown");

    await soft.assertAll();
  });

  test("test_05_cart_persists_after_login", { tag: [...TAGS.type.positive, ...TAGS.feature.cartPersistence, ...TAGS.auth.session] }, async ({ page, homePage, productPage, cartPage }) => {
    await resetLoginAttempts(LOGIN_DATA.validEmail);

    const soft = new SoftAssert();
    const login = new LoginPage(page);

    await homePage.ensureHome();
    await productPage.selectProduct(CART_DATA.products.iphone);
    await productPage.addToCart();

    await homePage.openCart();

    await soft.assertTrue(
      page.url().includes("route=checkout/cart"),
      `Expected cart page before login, URL was: ${page.url()}`
    );

    await soft.assertTrue(
      await cartPage.isProductInCart(CART_DATA.products.iphone),
      "Expected iPhone in cart BEFORE login"
    );

    await login.open();
    await login.login(LOGIN_DATA.validEmail, LOGIN_DATA.validPassword);

    await page.waitForLoadState("networkidle");
    await homePage.openCart();
    if (!page.url().includes("route=checkout/cart")) {
      await cartPage.open();
    }

    await soft.assertTrue(
      page.url().includes("route=checkout/cart"),
      `Expected cart page after login, URL was: ${page.url()}`
    );

    await soft.assertTrue(
      await cartPage.isProductInCart(CART_DATA.products.iphone),
      "Expected iPhone still in cart AFTER login"
    );

    await soft.assertAll();
  });

  test("test_06_add_multiple_different_products", { tag: [...TAGS.type.positive, ...TAGS.feature.cartOps] }, async ({ homePage, productPage, cartPage }) => {
    const soft = new SoftAssert();

    await homePage.openDesktopsMac();
    await productPage.selectProduct(CART_DATA.products.imac);
    await productPage.addToCart();

    await homePage.openLaptopsAndNotebooks();
    await productPage.selectProduct(CART_DATA.products.macbookAir);
    await productPage.addToCart();

    await homePage.openCart();
    await cartPage.waitForReady();

    await soft.assertTrue(await cartPage.isProductInCart(CART_DATA.products.imac), "iMac should be in cart");
    await soft.assertTrue(await cartPage.isProductInCart(CART_DATA.products.macbookAir), "MacBook Air should be in cart");

    await soft.assertAll();
  });

  test("test_07_cart_total_price_updates_correctly", { tag: [...TAGS.type.positive, ...TAGS.feature.pricing] }, async ({ homePage, productPage, cartPage }) => {
    const soft = new SoftAssert();
    const productName = CART_DATA.products.macbookAir;

    await homePage.openLaptopsAndNotebooks();
    await productPage.selectProduct(productName);
    await productPage.addToCart();

    await homePage.openCart();
    await cartPage.waitForReady();

    await cartPage.updateQuantity(productName, 2);
    await cartPage.waitForProductQuantity(productName, 2);

    await expect
      .poll(async () => {
        const total = await cartPage.getCartGrandTotal();
        return total !== null && moneyEq(total, CART_EXPECTED.macbookAirGrandTotalForQty2);
      }, { timeout: 30000 })
      .toBeTruthy();

    await soft.assertEqual(await cartPage.getProductQuantity(productName), 2, `Expected qty of ${productName} to be 2`);
    await soft.assertAll();
  });

  test("test_08_add_product_without_quantity_defaults_to_one", { tag: [...TAGS.type.positive, ...TAGS.feature.cartOps] }, async ({ homePage, productPage, cartPage }) => {
    const soft = new SoftAssert();

    await homePage.ensureHome();
    await productPage.selectProduct(CART_DATA.products.iphone);
    await productPage.addToCart();

    await homePage.openCart();

    await soft.assertEqual(await cartPage.getProductQuantity(CART_DATA.products.iphone), 1, "Quantity defaults to 1");
    await soft.assertAll();
  });

  test("test_09_edit_cart_to_zero_quantity_removes_product", { tag: [...TAGS.type.edge, ...TAGS.feature.cartOps] }, async ({ homePage, productPage, cartPage }) => {
    const soft = new SoftAssert();

    await homePage.ensureHome();
    await productPage.selectProduct(CART_DATA.products.appleCinema);

    await fillAppleCinemaOptions(productPage, CART_DATA.uploadFilePath);
    await productPage.addToCart();

    const added = await productPage.waitForAddToCartSuccess();
    await soft.assertTrue(added, "Expected add-to-cart success message after adding Apple Cinema");

    await homePage.openCart();
    await cartPage.waitForReady();

    await expect.poll(async () => await cartPage.isProductInCart(CART_DATA.products.appleCinema)).toBeTruthy();

    await cartPage.updateQuantity(CART_DATA.products.appleCinema, 0);

    await expect.poll(async () => await cartPage.isCartEmptyMessageDisplayed(), { timeout: 30000 }).toBeTruthy();

    await soft.assertTrue(
      await cartPage.isCartEmptyMessageDisplayed(),
      "Expected empty cart message after setting quantity to 0"
    );

    await soft.assertAll();
  });

  test("test_10_cart_empty_state_visual_validation", { tag: [...TAGS.type.positive, ...TAGS.feature.emptyCart] }, async ({ homePage, cartPage }) => {
    const soft = new SoftAssert();

    await homePage.openCart();

    await soft.assertTrue(await cartPage.isCartEmptyMessageDisplayed(), "Empty cart message should be visible");
    await soft.assertTrue(await cartPage.isCartLayoutCorrectWhenEmpty(), "Layout should not be broken");
    await soft.assertAll();
  });
});