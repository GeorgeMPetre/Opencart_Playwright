import { test as base } from "./baseTest.fixture";
import { LoginPage } from "../../pages/loginPage";
import { RegisterPage } from "../../pages/registerPage";
import { LOGIN_DATA } from "../data/login.data";

type LoginFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<LoginFixtures>({
  loginPage: async ({ page }, use) => {
    const regPage = new RegisterPage(page);
    await regPage.open();
    
    await regPage.register({
      first: "Test",
      last: "User",
      email: LOGIN_DATA.validEmail,
      password: LOGIN_DATA.validPassword,
      acceptPrivacyPolicy: true,
    });

    await regPage.waitForSubmitOutcome();

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage);
  },
});

export { expect } from "@playwright/test";