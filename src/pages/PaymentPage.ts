import { expect, type Page } from '@playwright/test';
import { APP_PAGES, type AppPageKey } from './PageRouts';
import { PageBase } from './PageBase';

const DEMO_CARD = {
  nameOnCard: 'Automation Test',
  cardNumber: '4242424242424242',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2030',
} as const;

export class PaymentPage extends PageBase {
  constructor(page: Page) {
    super(page);
  }

  async expectPaymentLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp('/payment/?$'));
    await expect(this.page).toHaveTitle(APP_PAGES.payment.title);
  }

  async fillDemoCard(): Promise<void> {
    await this.page.getByTestId('name-on-card').fill(DEMO_CARD.nameOnCard);
    await this.page.getByTestId('card-number').fill(DEMO_CARD.cardNumber);
    await this.page.getByTestId('cvc').fill(DEMO_CARD.cvc);
    await this.page.getByTestId('expiry-month').fill(DEMO_CARD.expiryMonth);
    await this.page.getByTestId('expiry-year').fill(DEMO_CARD.expiryYear);
  }

  async payAndConfirmOrder(): Promise<void> {
    await this.page.getByTestId('pay-button').click();
    await this.page.waitForURL('**/payment_done**', { timeout: 60_000 });
  }

  async expectOrderPlaced(): Promise<void> {
    await expect(this.page).toHaveURL(/\/payment_done\//);
    await expect(this.page).toHaveTitle(APP_PAGES.orderPlaced.title);
    await expect(this.page.getByTestId('order-placed')).toBeVisible();
    await expect(this.page.getByTestId('order-placed')).toContainText(/Order Placed/i);
  }
}
