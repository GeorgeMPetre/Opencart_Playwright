import { test, expect } from "./fixtures/registration.fixture";
import { REGISTRATION_DATA } from "./data/registration.data";
import { REGISTRATION_MESSAGES } from "./expected/registration.messages";
import { PASSWORD_BOUNDARY_CASES } from "./data/password.boundaries";
import { uniqueEmail } from "../utils/uniqueEmail.js";
import { TAGS } from "./config/tags.js";
import { LoginPage } from "@pages/loginPage";
import { RegisterPage } from "@pages/registerPage";

test.describe("Registration", { tag: [...TAGS.suites.registration] }, () => {
  test(
    "register with valid details -> success",
    { tag: [...TAGS.type.positive] },
    async ({ regPage, page }) => {
      const email = uniqueEmail("ok");

      await regPage.register({
        first: REGISTRATION_DATA.defaultUser.first,
        last: REGISTRATION_DATA.defaultUser.last,
        email,
        password: REGISTRATION_DATA.validPassword,
      });

      const ok = await regPage.waitForSuccessUrl();
      expect(ok).toBeTruthy();
      await expect(page).toHaveURL(/route=account\/success/);
    }
  );

  test(
    "register with existing email -> warning",
    { tag: [...TAGS.type.negative] },
    async ({ regPage }) => {
      await regPage.register({
        first: REGISTRATION_DATA.defaultUser.first,
        last: REGISTRATION_DATA.defaultUser.last,
        email: REGISTRATION_DATA.existingEmail,
        password: REGISTRATION_DATA.validPassword,
      });

      const outcome = await regPage.waitForSubmitOutcome();
      expect(outcome.outcome).toBe("global_warning");

      if (outcome.outcome === "global_warning") {
        expect(outcome.message).toContain(REGISTRATION_MESSAGES.warningExistingEmail);
      }
    }
  );

  test(
    "empty fields -> validation errors",
    { tag: [...TAGS.type.negative] },
    async ({ regPage, page }) => {
      await regPage.register({ first: "", last: "", email: "", password: "" });

      await expect(page).toHaveURL(/route=account\/register/);

      await expect(regPage.error("firstname")).toContainText(REGISTRATION_MESSAGES.firstNameLength);
      await expect(regPage.error("lastname")).toContainText(REGISTRATION_MESSAGES.lastNameLength);
      await expect(regPage.error("email")).toContainText(REGISTRATION_MESSAGES.emailInvalid);
      await expect(regPage.error("password")).toContainText(REGISTRATION_MESSAGES.passwordLength);
    }
  );

  test(
    "invalid email format -> email validation error",
    { tag: [...TAGS.type.negative] },
    async ({ regPage, page }) => {
      await regPage.register({
        first: REGISTRATION_DATA.defaultUser.first,
        last: REGISTRATION_DATA.defaultUser.last,
        email: "test@invalid",
        password: REGISTRATION_DATA.validPassword,
      });

      await expect(page).toHaveURL(/route=account\/register/);
      await expect(regPage.error("email")).toBeVisible();
      await expect(regPage.error("email")).toContainText(REGISTRATION_MESSAGES.emailInvalid);
    }
  );

  test(
    "special characters in name -> blocked",
    { tag: [...TAGS.type.negative] },
    async ({ regPage, page }) => {
      const email = uniqueEmail("specialchars");

      await regPage.register({
        first: "John$",
        last: "D@e",
        email,
        password: REGISTRATION_DATA.validPassword,
      });

      const outcome = await regPage.waitForSubmitOutcome();
      expect(outcome.outcome).not.toBe("success");
      await expect(page).toHaveURL(/route=account\/register/);
    }
  );
});

  test.describe("password boundaries (4..20)", () => {
    for (const c of PASSWORD_BOUNDARY_CASES) {
      test(
        `len=${c.password.length}`,
        { tag: [...TAGS.type.boundary] },
        async ({ regPage, page }) => {
          const email = uniqueEmail(`pw${c.password.length}`);

          await regPage.register({
            first: REGISTRATION_DATA.defaultUser.first,
            last: REGISTRATION_DATA.defaultUser.last,
            email,
            password: c.password,
          });

          const outcome = await regPage.waitForSubmitOutcome();

          if (c.shouldPass) {
            expect(outcome.outcome).toBe("success");
            await expect(page).toHaveURL(/route=account\/success/);
          } else {
            await expect(page).toHaveURL(/route=account\/register/);
            await expect(regPage.error("password")).toContainText(REGISTRATION_MESSAGES.passwordLength);
          }
        }
      );
    }
  });



  test(
  "register with spaces only -> validation errors",
  { tag: [...TAGS.type.negative] },
  async ({ regPage, page }) => {
    await regPage.register({
      first: "   ",
      last: "   ",
      email: "   ",
      password: "   ",
    });

    const outcome = await regPage.waitForSubmitOutcome();

    expect(outcome.outcome).not.toBe("success");
    await expect(page).toHaveURL(/route=account\/register/);

    const firstnameError = await regPage.error("firstname").textContent();
    const lastnameError = await regPage.error("lastname").textContent();
    const emailError = await regPage.error("email").textContent();
    const passwordError = await regPage.error("password").textContent();

    const hasAnyError = [firstnameError, lastnameError, emailError, passwordError]
      .some(error => error && error.trim().length > 0);


    expect(
      hasAnyError || 
      outcome.outcome === "global_warning" || 
      outcome.outcome === "still_on_register"
    ).toBeTruthy();
  }
);


  test(
  "registration while logged in -> blocked or duplicate email warning",
  { tag: [...TAGS.type.negative] },
  async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(REGISTRATION_DATA.credentials.email, REGISTRATION_DATA.credentials.password);

    const regPage = new RegisterPage(page);
    try {
      await regPage.open();
    } catch {     
      await page.goto("http://localhost/opencart/upload/index.php?route=account/logout");
      await page.waitForLoadState("domcontentloaded");
      await regPage.open();
    }

    if (!page.url().includes("route=account/register")) {
      await expect(page).not.toHaveURL(/route=account\/register/);
      return;
    }

    await regPage.register({
      first: REGISTRATION_DATA.defaultUser.first,
      last: REGISTRATION_DATA.defaultUser.last,
      email: REGISTRATION_DATA.credentials.email,
      password: REGISTRATION_DATA.credentials.password,
    });

    const outcome = await regPage.waitForSubmitOutcome();
    expect(outcome.outcome).toBe("global_warning");

    if (outcome.outcome === "global_warning") {
      expect(outcome.message).toContain(REGISTRATION_MESSAGES.warningExistingEmail);
    }
  }
);
