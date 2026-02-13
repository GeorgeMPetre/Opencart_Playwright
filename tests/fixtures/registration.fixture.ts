import { test as base } from "./baseTest.fixture";
import { RegisterPage } from "../../pages/registerPage";

type RegistrationFixtures = {
  regPage: RegisterPage;
};

export const test = base.extend<RegistrationFixtures>({
  regPage: async ({ page }, use) => {
    const regPage = new RegisterPage(page);
    await regPage.open();
    await use(regPage);
  },
});

export { expect } from "@playwright/test";
