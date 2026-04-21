import { expect, type Locator, type Page } from '@playwright/test';
import { dismissGoogleAdOverlayAfterInteraction } from '../helpers/dismissGoogleVignette';
import { APP_PAGES, type AppPageKey } from './PageRouts';
import { AppHeader } from './AppHeader';
import { PageBase } from './PageBase';

export class ProductsPage extends PageBase {
  readonly header: AppHeader;
  /** Product tiles on `/products` and category listings (Automation Exercise catalog markup). */
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new AppHeader(page);
    this.productCards = page.locator('.features_items .productinfo');
  }

  async visit(): Promise<void> {
    await this.goto(APP_PAGES.products.path);
    await this.expectProductsLoaded();
  }

  async expectProductsLoaded(): Promise<void> {
    await this.expectPageLoaded(APP_PAGES.products.path);
    await this.expectPageTitle(APP_PAGES.products.title);
  }

  async openFromHeader(pageKey: AppPageKey): Promise<void> {
    await this.header.navigateTo(pageKey);
  }

  async expectAddedToCartModalVisible(): Promise<void> {
    const modal = this.page.locator('#cartModal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(/Added!/);
    await expect(modal).toContainText(/added to cart/i);
  }

  /**
   * Adds the product at the given zero-based index to the cart and returns its listing title (card `p` text).
   */
  async addProductToCartAtIndex(index: number): Promise<string> {
    const card = this.productCards.nth(index);
    await expect(card).toBeVisible();
    const productName = (await card.locator('p').first().innerText()).trim();
    await card.scrollIntoViewIfNeeded();
    await card.locator('a.add-to-cart').click();
    await this.expectAddedToCartModalVisible();
    await dismissGoogleAdOverlayAfterInteraction(this.page);
    return productName;
  }

  async openViewCartFromAddedModal(): Promise<void> {
    await this.page.locator('#cartModal').getByRole('link', { name: /view cart/i }).click();
    await this.page.waitForURL('**/view_cart**', { timeout: 60_000 });
  }
}
