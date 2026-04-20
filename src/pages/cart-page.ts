import type { Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/view_cart');
  }

  async expectEmpty(): Promise<void> {
    await this.page.locator('#empty_cart').waitFor({ state: 'visible' });
    await this.page.getByText(/Cart is empty!/i).waitFor({ state: 'visible' });
  }

  productRow(productName: string | RegExp) {
    return this.page.locator('#cart_info').getByRole('row', { name: productName });
  }

  lineItem(productName: string | RegExp) {
    return this.page.locator('#cart_info').getByText(productName, { exact: false }).first();
  }
}
