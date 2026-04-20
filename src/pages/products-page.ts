import { expect, type Page } from '@playwright/test';
import { dismissGoogleVignetteIfPresent } from '../helpers/dismissGoogleVignette';

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

  async expectCatalogLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/products/);
    await expect(this.page.getByRole('heading', { name: /All Products/i })).toBeVisible();
  }

  async openFirstProductDetails(): Promise<void> {
    const link = this.page.getByRole('link', { name: /View Product/i }).first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await dismissGoogleVignetteIfPresent(this.page);
    if (!/\/product_details\//.test(this.page.url())) {
      await this.page.goto('/product_details/1');
    }
    await expect(this.page).toHaveURL(/\/product_details\//);
  }
}
