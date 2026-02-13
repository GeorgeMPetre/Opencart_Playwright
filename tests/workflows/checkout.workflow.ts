import { Page } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { HomePage } from "../../pages/homePage";
import { ProductPage } from "../../pages/productPage";
import { CartPage } from "../../pages/cartPage";
import { CheckoutPage } from "../../pages/checkoutPage";
import { resetLoginAttempts } from "../../utils/dbUtils";
import { wakeUpBrowser } from "../../utils/browserCleanup";

export async function loginAddProductsAndGoToCheckout(
  page: Page,
  params: {
    email: string;
    password: string;
    products: string[];
  }
): Promise<{ home: HomePage; product: ProductPage; cart: CartPage; checkout: CheckoutPage }> {
  await resetLoginAttempts(params.email);

  const login = new LoginPage(page);
  const home = new HomePage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await login.open();
  await login.login(params.email, params.password);

  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(500);

  await home.openHome();

  for (const p of params.products) {
    await wakeUpBrowser(page);
    
    await home.openLaptopsAndNotebooks();
    await page.waitForLoadState("networkidle");

    await product.selectProduct(p);
    await product.addToCart();
    
    await product.waitForAddToCartSuccess(10000);
    
    await home.openHome();
  }

  await wakeUpBrowser(page);
  
  await cart.open();
  
  await cart.proceedToCheckout();

  return { home, product, cart, checkout };
}