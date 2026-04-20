import { expect, type Page } from '@playwright/test';
import { dismissGoogleVignetteIfPresent } from '../helpers/dismissGoogleVignette';

export class CheckoutPage {
  constructor(readonly page: Page) {}

  async expectCheckoutLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout/);
    await expect(this.page.getByRole('heading', { name: /Address Details/i })).toBeVisible();
  }

  async fillOrderComment(text: string): Promise<void> {
    await this.page.locator('textarea[name="message"]').fill(text);
  }

  async placeOrder(): Promise<void> {
    await this.page.locator('a.check_out').filter({ hasText: /Place Order/i }).click();
    await dismissGoogleVignetteIfPresent(this.page);
    if (!/\/payment/.test(this.page.url())) {
      await this.page.goto('/payment', { waitUntil: 'domcontentloaded' });
    }
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** From cart: “Proceed To Checkout” opens modal for guests. */
  async proceedToCheckoutFromCart(): Promise<void> {
    await this.page.locator('a.check_out').filter({ hasText: /Proceed To Checkout/i }).click();
  }

  async expectCheckoutRegisterModalVisible(): Promise<void> {
    await expect(
      this.page.getByText('Register / Login account to proceed on checkout.', { exact: true }),
    ).toBeVisible();
  }

  async clickRegisterLoginInCheckoutModal(): Promise<void> {
    await this.page.locator('#checkoutModal').getByRole('link', { name: /Register \/ Login/i }).click();
    await dismissGoogleVignetteIfPresent(this.page);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async closeCheckoutModal(): Promise<void> {
    await this.page.locator('.close-checkout-modal').click();
  }

  async expectDeliveryAddressContains(text: string | RegExp): Promise<void> {
    const block = this.page.locator('#address_delivery');
    await expect(block).toContainText(text);
  }

  async expectBillingAddressContains(text: string | RegExp): Promise<void> {
    const block = this.page.locator('#address_invoice');
    await expect(block).toContainText(text);
  }
}
