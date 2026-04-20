import { expect, type Page } from '@playwright/test';

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

  async expectRowCount(count: number): Promise<void> {
    const rows = this.page.locator('#cart_info tbody tr');
    await expect(rows).toHaveCount(count);
  }

  async removeLineForProductId(productId: number): Promise<void> {
    await this.page.locator(`a.cart_quantity_delete[data-product-id="${productId}"]`).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  rowForProductName(productName: string) {
    return this.page.locator('#cart_info tbody tr').filter({ hasText: productName });
  }

  async quantityButtonTextForProduct(productName: string): Promise<string> {
    const btn = this.rowForProductName(productName).locator('.cart_quantity button').first();
    return (await btn.textContent())?.trim() ?? '';
  }

  async lineTotalForProduct(productName: string): Promise<string> {
    const cell = this.rowForProductName(productName).locator('td.cart_total p').first();
    return (await cell.textContent())?.trim() ?? '';
  }

  async unitPriceForProduct(productName: string): Promise<string> {
    const cell = this.rowForProductName(productName).locator('td.cart_price p').first();
    return (await cell.textContent())?.trim() ?? '';
  }
}
