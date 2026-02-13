import { test as base } from "./baseTest.fixture";
import { HomePage } from "../../pages/homePage";
import { AccountPage } from "../../pages/accountPage";
import { loginAndOpenAccount } from "../workflows/auth.workflow";
import { LOGIN_DATA } from "../data/login.data";

type NavigationFixtures = {
  homePage: HomePage;
  accountPage: AccountPage;
};

export const test = base.extend<NavigationFixtures>({
  homePage: async ({ page }, use) => {
    const home = new HomePage(page);
    await home.openHome();
    await use(home);
  },

  accountPage: async ({ page }, use) => {
    const account = await loginAndOpenAccount(page, {
      email: LOGIN_DATA.validEmail,
      password: LOGIN_DATA.validPassword,
    });
    await use(account);
  },
});

export { expect } from "@playwright/test";
