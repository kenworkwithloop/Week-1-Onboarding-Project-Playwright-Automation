import { expect, type Page } from '@playwright/test';
import { APP_PAGES } from './PageRouts';
import { PageBase } from './PageBase';

export class CheckoutPage extends PageBase {
  constructor(page: Page) {
    super(page);
  }

  /**
   * After "Proceed To Checkout" as a guest, the app may take longer than default expect
   * timeouts to reach `/checkout`.
   */
  async expectNavigatedToCheckout(options?: { timeout?: number }): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${APP_PAGES.checkout.path}/?$`), {
      timeout: options?.timeout ?? 60_000,
    });
  }

  async expectCheckoutLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${APP_PAGES.checkout.path}/?$`));
    await expect(this.page).toHaveTitle(APP_PAGES.checkout.title);
    await expect(this.page.getByTestId('checkout-info')).toBeVisible();
  }

  async placeOrderAndGoToPayment(): Promise<void> {
    await this.page.getByRole('link', { name: /place order/i }).click();
    await this.page.waitForURL('**/payment**', { timeout: 60_000 });
  }
}
