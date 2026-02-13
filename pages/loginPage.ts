import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export type LoginOutcome =
  | { outcome: "dashboard" }
  | { outcome: "login_page"; errorVisible: boolean; message: string };

export class LoginPage extends BasePage {
  // Route only 
  readonly LOGIN_ROUTE = "index.php?route=account/login&language=en-gb";

  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  private readonly alertMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.locator("#input-email");
    this.passwordInput = page.locator("#input-password");
    this.loginButton = page.locator("button.btn.btn-primary[type='submit']");
    this.alertMessage = page.locator("div.alert.alert-danger");
  }

  // ---------------------------
  // Navigation
  // ---------------------------
  async open(): Promise<this> {
    await this.page.goto(this.LOGIN_ROUTE, { waitUntil: "domcontentloaded" });
    await this.emailInput.waitFor({ state: "visible", timeout: 15000 });
    return this;
  }

  async openWhileLoggedIn(timeoutMs = 15000): Promise<"dashboard" | "login"> {
    await this.page.goto(this.LOGIN_ROUTE, { waitUntil: "domcontentloaded" });

    await Promise.race([
      this.page.waitForURL(/route=account\/account/, { timeout: timeoutMs }).catch(() => {}),
      this.page.waitForURL(/route=account\/login/, { timeout: timeoutMs }).catch(() => {}),
    ]);

    return this.isOnAccountDashboard() ? "dashboard" : "login";
  }

  // ---------------------------
  // Actions
  // ---------------------------
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill((email ?? "").trim());
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill((password ?? "").trim());
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async submitWithEnter(): Promise<void> {
    await this.passwordInput.press("Enter");
  }

  async login(email: string, password: string, opts?: { submitViaEnter?: boolean }): Promise<void> {
    const submitViaEnter = opts?.submitViaEnter ?? true;

    await this.fillEmail(email);
    await this.fillPassword(password);

    if (submitViaEnter) await this.submitWithEnter();
    else await this.submit();
  }

  // ---------------------------
  // Locator helpers
  // ---------------------------
  alert(): Locator {
    return this.alertMessage;
  }

  // ---------------------------
  // State helpers
  // ---------------------------
  isOnLoginPage(): boolean {
    return this.page.url().includes("route=account/login");
  }

  isOnAccountDashboard(): boolean {
    return this.page.url().includes("route=account/account");
  }

  async waitForDashboard(timeoutMs = 15000): Promise<boolean> {
    try {
      await this.page.waitForURL(/route=account\/account/, { timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    const visible = await this.alertMessage.isVisible().catch(() => false);
    if (!visible) return "";
    return (await this.alertMessage.innerText()).trim();
  }

  async waitForLoginOutcome(timeoutMs = 15000): Promise<LoginOutcome> {
    await Promise.race([
      this.page.waitForURL(/route=account\/account/, { timeout: timeoutMs }).catch(() => {}),
      this.page.waitForURL(/route=account\/login/, { timeout: timeoutMs }).catch(() => {}),
      this.alertMessage.waitFor({ state: "visible", timeout: timeoutMs }).catch(() => {}),
    ]);

    if (this.isOnAccountDashboard()) {
      return { outcome: "dashboard" };
    }

    const msg = await this.getErrorMessage();
    const errorVisible = await this.alertMessage.isVisible().catch(() => false);

    return { outcome: "login_page", errorVisible, message: msg };
  }

  async isAccountLocked(): Promise<boolean> {
    const message = (await this.getErrorMessage()).toLowerCase();
    return ["locked", "too many attempts", "captcha"].some((k) => message.includes(k));
  }
}
