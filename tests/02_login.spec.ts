import { test, expect } from "./fixtures/login.fixture";
import { LOGIN_DATA } from "./data/login.data";
import { LOGIN_MESSAGES } from "./expected/login.messages";
import { uniqueEmail } from "../utils/uniqueEmail.js";
import { TAGS } from "./config/tags.js";
import { resetLoginAttempts } from "@utils/dbUtils";

test.describe("Login", { tag: ["@login", "@ui"] }, () => {
  test(
    "login with valid credentials -> dashboard",
    { tag: [...TAGS.type.positive] },
    async ({ loginPage, page }) => {
      await loginPage.login(LOGIN_DATA.validEmail, LOGIN_DATA.validPassword);

      const outcome = await loginPage.waitForLoginOutcome();
      await expect(page).toHaveURL(/route=account\/account/);
    }
  );

  test(
    "uppercase email -> still logs in",
    { tag: [...TAGS.type.positive] },
    async ({ loginPage, page }) => {
      await loginPage.login(LOGIN_DATA.validEmail.toUpperCase(), LOGIN_DATA.validPassword);

      const outcome = await loginPage.waitForLoginOutcome();
      await expect(page).toHaveURL(/route=account\/account/);
    }
  );

  test(
    "spaces around credentials -> trimmed and works",
    { tag: [...TAGS.type.positive] },
    async ({ loginPage, page }) => {
      await loginPage.login(`  ${LOGIN_DATA.validEmail}  `, `  ${LOGIN_DATA.validPassword}  `);

      const outcome = await loginPage.waitForLoginOutcome();
      await expect(page).toHaveURL(/route=account\/account/);
    }
  );

  test(
    "wrong password -> warning and stay on login",
    { tag: [...TAGS.type.negative] },
    async ({ loginPage, page }) => {
      await loginPage.login(LOGIN_DATA.validEmail, "WrongPass");

      const outcome = await loginPage.waitForLoginOutcome();
      expect(outcome.outcome).toBe("login_page");

      await expect(loginPage.alert()).toBeVisible();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(LOGIN_MESSAGES.warningNoMatch);
      await expect(page).toHaveURL(/route=account\/login/);
    }
  );

  test(
    "blank email and password -> warning",
    { tag: [...TAGS.type.negative] },
    async ({ loginPage, page }) => {
      await resetLoginAttempts(LOGIN_DATA.validEmail);
      await page.waitForTimeout(500);

      await loginPage.login("", "");

      const outcome = await loginPage.waitForLoginOutcome();
      expect(outcome.outcome).toBe("login_page");

      await expect(loginPage.alert()).toBeVisible();
      const msg = (await loginPage.getErrorMessage()).toLowerCase();
      expect(msg).toContain(LOGIN_MESSAGES.warningNoMatch.toLowerCase());
      expect(page.url()).toContain("route=account/login");
    }
  );

  test(
    "unregistered email -> warning",
    { tag: [...TAGS.type.negative] },
    async ({ loginPage, page }) => {
      const email = uniqueEmail("unknown");

      await loginPage.login(email, "AnyPassword");

      const outcome = await loginPage.waitForLoginOutcome();
      expect(outcome.outcome).toBe("login_page");

      await expect(loginPage.alert()).toBeVisible();
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(LOGIN_MESSAGES.warningNoMatch);
      await expect(page).toHaveURL(/route=account\/login/);
    }
  );


  test(
  "SQL injection with existing email -> login fails",
  { tag: [...TAGS.type.negative, "@security"] },
  async ({ loginPage, page }) => {
    await loginPage.login(LOGIN_DATA.validEmail, "' OR '1'='1");

    const outcome = await loginPage.waitForLoginOutcome();
    expect(outcome.outcome).toBe("login_page");

    await loginPage.alert().waitFor({ state: "visible", timeout: 5000 }); // Add explicit wait
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(LOGIN_MESSAGES.warningNoMatch);

    await expect(loginPage.alert()).toBeVisible();
    await expect(page).toHaveURL(/route=account\/login/);
  }
);

  test(
  "SQL injection in email field -> login fails",
  { tag: [...TAGS.type.negative, "@security"] },
  async ({ loginPage, page }) => {
    await loginPage.login("email'or1=1@example.com", "any_password");

    const outcome = await loginPage.waitForLoginOutcome();
    expect(outcome.outcome).toBe("login_page");

    await loginPage.alert().waitFor({ state: "visible", timeout: 5000 }); 
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(LOGIN_MESSAGES.warningNoMatch);

    await expect(loginPage.alert()).toBeVisible();
    await expect(page).toHaveURL(/route=account\/login/);
  }

);

  test(
  "multiple failed login attempts -> warning or blocking",
  { tag: [...TAGS.type.negative, "@security"] },
  async ({ loginPage, page }) => {
    for (let i = 0; i < 5; i++) {
      await loginPage.login(LOGIN_DATA.validEmail, "WrongPass");
      await page.waitForTimeout(500); 
    }

    const errorMessage = await loginPage.getErrorMessage();
    const msg = errorMessage.toLowerCase();

    const onLoginPage = page.url().includes("route=account/login");
    const hasWarning = [
      LOGIN_MESSAGES.warningNoMatch.toLowerCase(),
      LOGIN_MESSAGES.warningTooManyAttempts.toLowerCase(),
    ].some((warning) => msg.includes(warning));

    expect(onLoginPage || hasWarning).toBeTruthy();
    await expect(loginPage.alert()).toBeVisible();
  }
);


  test(
    "access login while logged in -> redirected to account",
    { tag: ["@security", "@regression"] },
    async ({ loginPage, page }) => {
      await resetLoginAttempts(LOGIN_DATA.validEmail);
      await page.waitForTimeout(1000);
      await loginPage.login(LOGIN_DATA.validEmail, LOGIN_DATA.validPassword);
      const first = await loginPage.waitForLoginOutcome();
      await expect(page).toHaveURL(/route=account\/account/);
      await loginPage.openWhileLoggedIn();
      await expect(page).toHaveURL(/route=account\/account/);
    }
  );
});