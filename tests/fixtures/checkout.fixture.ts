import { test as base } from "./baseTest.fixture";
import { LoginPage } from "../../pages/loginPage";
import { HomePage } from "../../pages/homePage";
import { ProductPage } from "../../pages/productPage";
import { CartPage } from "../../pages/cartPage";
import { CheckoutPage } from "../../pages/checkoutPage";

type CheckoutFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<CheckoutFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from "@playwright/test";
