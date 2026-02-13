import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export type RegistrationField = "firstname" | "lastname" | "email" | "password";

export type SubmitOutcome =
  | { outcome: "success" }
  | { outcome: "global_warning"; message: string }
  | { outcome: "field_errors"; errors: Record<RegistrationField, string> }
  | { outcome: "still_on_register" };

export class RegisterPage extends BasePage {
  // Route only 
  readonly REGISTER_ROUTE = "index.php?route=account/register&language=en-gb";

  // Locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  readonly privacyPolicyCheckbox: Locator;
  readonly continueButton: Locator;

  readonly globalWarning: Locator;
  readonly fieldErrors: Locator;

  private readonly errorFirstName: Locator;
  private readonly errorLastName: Locator;
  private readonly errorEmail: Locator;
  private readonly errorPassword: Locator;

  readonly breadcrumb: Locator;
  readonly contentH1: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator("#input-firstname");
    this.lastNameInput = page.locator("#input-lastname");
    this.emailInput = page.locator("#input-email");
    this.passwordInput = page.locator("#input-password");

    this.privacyPolicyCheckbox = page.locator("input[name='agree'][type='checkbox']");
    this.continueButton = page.getByRole("button", { name: "Continue" });

    this.globalWarning = page.locator(".alert-danger");
    this.fieldErrors = page.locator(".text-danger");

    this.errorFirstName = page.locator("#error-firstname");
    this.errorLastName = page.locator("#error-lastname");
    this.errorEmail = page.locator("#error-email");
    this.errorPassword = page.locator("#error-password");

    this.breadcrumb = page.locator("ol.breadcrumb");
    this.contentH1 = page.locator("#content h1");
  }

  // ---------------------------
  // Navigation
  // ---------------------------
  async open(): Promise<this> {
    await this.page.goto(this.REGISTER_ROUTE, { waitUntil: "domcontentloaded" });
    await this.waitForLoadedState();
    return this;
  }

  isOnRegisterPage(): boolean {
    return this.page.url().includes("route=account/register");
  }

  private async waitForLoadedState(timeoutMs = 15000): Promise<"form" | "warning" | "redirected"> {
    const isRedirected = async () => {
      await this.page.waitForURL((url) => !url.toString().includes("route=account/register"), {
        timeout: timeoutMs,
      });
      return "redirected" as const;
    };

    const hasForm = async () => {
      await this.firstNameInput.waitFor({ state: "visible", timeout: timeoutMs });
      return "form" as const;
    };

    const hasWarning = async () => {
      await this.globalWarning.waitFor({ state: "visible", timeout: timeoutMs });
      return "warning" as const;
    };

    return await Promise.race([
      hasForm().catch(() => "form" as const),
      hasWarning().catch(() => "warning" as const),
      isRedirected().catch(() => "form" as const),
    ]);
  }

  // ---------------------------
  // Actions
  // ---------------------------
  async enterFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async setPrivacyPolicy(accept = true): Promise<void> {
    if (accept) await this.privacyPolicyCheckbox.check();
    else await this.privacyPolicyCheckbox.uncheck();
  }

  async submit(): Promise<void> {
    await this.continueButton.click();
  }

  async register(params: {
    first: string;
    last: string;
    email: string;
    password: string;
    acceptPrivacyPolicy?: boolean;
  }): Promise<void> {
    const { first, last, email, password, acceptPrivacyPolicy = true } = params;

    await this.enterFirstName(first);
    await this.enterLastName(last);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.setPrivacyPolicy(acceptPrivacyPolicy);
    await this.submit();
  }

  // ---------------------------
  // Locator helpers
  // ---------------------------
  error(field: RegistrationField): Locator {
    switch (field) {
      case "firstname":
        return this.errorFirstName;
      case "lastname":
        return this.errorLastName;
      case "email":
        return this.errorEmail;
      case "password":
        return this.errorPassword;
    }
  }

  // ---------------------------
  // Reads / waits 
  // ---------------------------
  async waitForSuccessUrl(timeoutMs = 15000): Promise<boolean> {
    try {
      await this.page.waitForURL(/route=account\/success/, { timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }

  async getGlobalWarningText(): Promise<string | null> {
    const visible = await this.globalWarning.isVisible().catch(() => false);
    if (!visible) return null;
    return (await this.globalWarning.innerText()).trim();
  }

  async getErrorText(field: RegistrationField): Promise<string> {
    const loc = this.error(field);
    const count = await loc.count();
    if (count === 0) return "";
    const txt = await loc.first().innerText().catch(() => "");
    return (txt || "").trim();
  }

  async getAllFieldErrors(): Promise<Record<RegistrationField, string>> {
    const [firstname, lastname, email, password] = await Promise.all([
      this.getErrorText("firstname"),
      this.getErrorText("lastname"),
      this.getErrorText("email"),
      this.getErrorText("password"),
    ]);

    return { firstname, lastname, email, password };
  }

  async waitForAnyFieldError(timeoutMs = 15000): Promise<boolean> {
    try {
      await this.fieldErrors.first().waitFor({ state: "visible", timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }

  async waitForGlobalWarningVisible(timeoutMs = 15000): Promise<boolean> {
    try {
      await this.globalWarning.waitFor({ state: "visible", timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }

  async waitForSubmitOutcome(timeoutMs = 15000): Promise<SubmitOutcome> {
  await Promise.race([
    this.page.waitForURL(/route=account\/success/, { timeout: timeoutMs }),
    this.waitForGlobalWarningVisible(timeoutMs),
    this.waitForAnyFieldError(timeoutMs),
    this.page.waitForTimeout(timeoutMs),
  ]).catch(() => {});

  if (this.page.url().includes("route=account/success")) {
    return { outcome: "success" };
  }

  const warning = await this.getGlobalWarningText();
  if (warning) {
    return { outcome: "global_warning", message: warning };
  }

  if (await this.fieldErrors.first().isVisible().catch(() => false)) {
    return { outcome: "field_errors", errors: await this.getAllFieldErrors() };
  }

  return { outcome: "still_on_register" };
}
}
