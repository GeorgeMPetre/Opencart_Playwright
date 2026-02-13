import { Page } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { AccountPage } from "../../pages/accountPage";

export async function loginAndOpenAccount(
  page: Page,
  credentials: { email: string; password: string }
): Promise<AccountPage> {
  const currentUrl = page.url();
  if (currentUrl.includes("route=account/account") || currentUrl.includes("route=account/success")) {
    const account = new AccountPage(page);
    await account.openAccountDashboard();
    return account;
  }

  const login = new LoginPage(page);
  await login.open();
  await login.login(credentials.email, credentials.password);

  const ok = await login.waitForDashboard(15000);
  if (!ok) throw new Error(`Login failed. Current URL: ${page.url()}`);

  const account = new AccountPage(page);
  await account.openAccountDashboard();
  return account;
}