import { expect, type Page } from '@playwright/test';

/** Test card values accepted by the demo payment form (no real charge). */
export const DEMO_PAYMENT_CARD = {
  nameOnCard: 'Test User',
  /** Demo site accepts dummy card data (no real charge). */
  cardNumber: '123456789012',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2030',
} as const;

export class PaymentPage {
  constructor(private readonly page: Page) {}

  async expectPaymentLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/payment/);
    await expect(this.page.getByRole('heading', { name: /^Payment$/i })).toBeVisible();
  }

  async payWithDemoCard(): Promise<void> {
    const c = DEMO_PAYMENT_CARD;
    await this.page.getByTestId('name-on-card').fill(c.nameOnCard);
    await this.page.getByTestId('card-number').fill(c.cardNumber);
    await this.page.getByTestId('cvc').fill(c.cvc);
    await this.page.getByTestId('expiry-month').fill(c.expiryMonth);
    await this.page.getByTestId('expiry-year').fill(c.expiryYear);
    await this.page.getByTestId('pay-button').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectOrderPlacedSuccess(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /Order Placed!/i })).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      this.page.getByText('Congratulations! Your order has been confirmed!', { exact: true }),
    ).toBeVisible();
  }

  downloadInvoice(): ReturnType<Page['waitForEvent']> {
    return this.page.waitForEvent('download');
  }

  invoiceDownloadLink() {
    return this.page.locator('a[href^="/download_invoice"]');
  }
}
