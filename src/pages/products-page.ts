import { expect, type Page } from '@playwright/test';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/products');
  }

  async addToCartByProductId(productId: number): Promise<void> {
    const addLink = this.page.locator(`a.add-to-cart[data-product-id="${productId}"]`).first();
    await addLink.scrollIntoViewIfNeeded();
    await addLink.click();
  }

  async addBlueTopToCart(): Promise<void> {
    const card = this.page.locator('.productinfo').filter({ hasText: 'Blue Top' }).first();
    const addLink = card.locator('a.add-to-cart').first();
    await addLink.scrollIntoViewIfNeeded();
    await addLink.click();
  }

  async dismissAddedModal(): Promise<void> {
    const modal = this.page.locator('#cartModal');
    await modal.getByRole('button', { name: /Continue Shopping/i }).click();
    await expect(modal).toBeHidden();
  }

  async expectAddedModalVisible(): Promise<void> {
    const modal = this.page.locator('#cartModal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Added!', { exact: true })).toBeVisible();
  }
}
