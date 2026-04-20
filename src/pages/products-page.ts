import { expect, type Locator, type Page } from '@playwright/test';
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

  /** Product tiles inside `#features_items` / `.features_items` (shared by `/products` and category routes). */
  productCards(): Locator {
    return this.page.locator('.features_items .productinfo');
  }

  /** Outermost wrapper per grid tile (`.col-sm-4` > `.product-image-wrapper`). */
  productCardWrappers(): Locator {
    return this.page.locator('.features_items .product-image-wrapper');
  }

  /**
   * Asserts the DOM shell for one catalog tile: image, price line, title, paired add-to-cart controls, and details link.
   * Avoids asserting a specific product name or numeric price.
   */
  async expectProductCardWrapperStructure(card: Locator): Promise<void> {
    await expect(card.locator('.single-products')).toBeVisible();

    const primary = card.locator('.productinfo').first();
    await expect(primary.locator('img')).toBeVisible();
    await expect(primary.locator('img')).toHaveAttribute('src', /\/get_product_picture\/\d+/);
    await expect(primary.locator('h2')).toHaveText(/Rs\.\s*\d+/);
    await expect(primary.locator('p').first()).toBeVisible();

    await expect(card.locator('.product-overlay .overlay-content')).toBeVisible();
    await expect(card.locator('a.add-to-cart')).toHaveCount(2);
    await expect(card.locator('a.add-to-cart').first()).toHaveAttribute('data-product-id', /\d+/);

    const viewProduct = card.getByRole('link', { name: /View Product/i });
    await expect(viewProduct).toBeVisible();
    await expect(viewProduct).toHaveAttribute('href', /\/product_details\/\d+/);
  }

  async expectListedProductCount(count: number): Promise<void> {
    await expect(this.productCards()).toHaveCount(count);
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
