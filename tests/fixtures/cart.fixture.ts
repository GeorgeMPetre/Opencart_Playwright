import { test as base } from "./baseTest.fixture";
import { HomePage } from "../../pages/homePage";
import { ProductPage } from "../../pages/productPage";
import { CartPage } from "../../pages/cartPage";

type CartFixtures = {
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
};

export const test = base.extend<CartFixtures>({
  homePage: async ({ page }, use) => {
    const home = new HomePage(page);
    await home.openHome();
    await use(home);
  },

  productPage: async ({ page }, use) => {
    const product = new ProductPage(page);
    await use(product);
  },

  cartPage: async ({ page }, use) => {
    const cart = new CartPage(page);
    await use(cart);
  },
});

export { expect } from "@playwright/test";
