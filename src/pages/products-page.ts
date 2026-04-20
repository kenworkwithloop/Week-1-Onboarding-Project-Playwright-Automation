import { expect, type Locator, type Page } from '@playwright/test';
import {
  dismissGoogleAdOverlayAfterInteraction,
  dismissGoogleVignetteIfPresent,
} from '../helpers/dismissGoogleVignette';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  /** Clicks add-to-cart; `force` avoids ad overlays intercepting the pointer on WebKit/Safari. */
  private async clickAddToCartAnchor(add: Locator): Promise<void> {
    await dismissGoogleVignetteIfPresent(this.page);
    await add.evaluate((el) =>
      (el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' }),
    );
    await dismissGoogleVignetteIfPresent(this.page);
    await add.click({ force: true });
    await dismissGoogleAdOverlayAfterInteraction(this.page);
  }

  private async isBootstrapCartModalOpen(): Promise<boolean> {
    return this.page.evaluate(() => {
      const el = document.querySelector('#cartModal') as HTMLElement | null;
      if (!el) return false;
      if (el.classList.contains('in') || el.classList.contains('show')) return true;
      if (el.getAttribute('aria-hidden') === 'false') return true;
      return document.body.classList.contains('modal-open');
    });
  }

  private async waitForBootstrapCartModalOpen(timeout = 20_000): Promise<void> {
    await expect.poll(async () => this.isBootstrapCartModalOpen(), { timeout }).toBeTruthy();
  }

  private async waitForBootstrapCartModalClosed(timeout = 15_000): Promise<void> {
    await expect.poll(async () => !(await this.isBootstrapCartModalOpen()), { timeout }).toBeTruthy();
  }

  async goto(): Promise<void> {
    await this.page.goto('/products');
  }

  private searchInput(): Locator {
    return this.page.locator('#search_product');
  }

  async searchProducts(term: string): Promise<void> {
    await this.searchInput().fill(term);
    await this.page.locator('#submit_search').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectSearchedProductsHeading(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /Searched Products/i })).toBeVisible();
  }

  async expectSearchResultsRelatedToTerm(term: string): Promise<void> {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'i');
    const cards = this.productCards();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    const related = cards.filter({ hasText: re });
    await expect(related.first()).toBeVisible();
  }

  /**
   * Add from grid index `index` (0-based), aligned with {@link productCards}.
   * Catalog tiles use overlay `<a class="add-to-cart">`; **search results** use plain “Add to cart”
   * controls without that overlay anchor, so we fall back to text/any in-card link.
   * @param skipOverlay — After search, stale overlay anchors can exist in the DOM but never open the
   *   modal on WebKit; retries skip overlay and use the in-card / text controls instead.
   */
  private async clickListingAddControl(index: number, options?: { skipOverlay?: boolean }): Promise<void> {
    await expect
      .poll(async () => !(await this.isBootstrapCartModalOpen()), { timeout: 12_000 })
      .toBeTruthy()
      .catch(() => {});

    const card = this.productCards().nth(index);
    await card.waitFor({ state: 'attached', timeout: 45_000 });
    await card.evaluate((el) =>
      (el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' }),
    );
    await dismissGoogleVignetteIfPresent(this.page);

    const wrapper = this.productCardWrappers().nth(index);
    if (!options?.skipOverlay) {
      const overlayAdd = wrapper.locator('.product-overlay a.add-to-cart').first();
      if ((await overlayAdd.count()) > 0) {
        await dismissGoogleVignetteIfPresent(this.page);
        await wrapper.hover({ force: true });
        await this.clickAddToCartAnchor(overlayAdd);
        return;
      }
    }

    const cardLink = card.locator('a.add-to-cart').first();
    if ((await cardLink.count()) > 0) {
      await this.clickAddToCartAnchor(cardLink);
      return;
    }

    await card.getByText('Add to cart', { exact: true }).first().click({ force: true });
    await dismissGoogleAdOverlayAfterInteraction(this.page);
  }

  async addToCartFromListingByHoverIndex(index: number): Promise<void> {
    const maxAttempts = 3;
    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const skipOverlay = attempt > 0 || index > 0;
      await this.clickListingAddControl(index, { skipOverlay });
      try {
        await this.waitForBootstrapCartModalOpen(22_000);
        return;
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError instanceof Error
      ? lastError
      : new Error('Cart modal did not open after add to cart from listing');
  }

  async openBrandFromSidebar(brandLabel: string | RegExp): Promise<void> {
    const brands = this.page.locator('.brands-name a');
    await brands.filter({ hasText: brandLabel }).first().click();
    await dismissGoogleVignetteIfPresent(this.page);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectBrandHeading(brand: RegExp): Promise<void> {
    await expect(this.page.getByRole('heading', { name: brand })).toBeVisible();
  }

  async addToCartByProductId(productId: number): Promise<void> {
    const addLink = this.page.locator(`a.add-to-cart[data-product-id="${productId}"]`).first();
    await this.clickAddToCartAnchor(addLink);
  }

  async addBlueTopToCart(): Promise<void> {
    const card = this.page.locator('.productinfo').filter({ hasText: 'Blue Top' }).first();
    const addLink = card.locator('a.add-to-cart').first();
    await this.clickAddToCartAnchor(addLink);
  }

  async viewCartFromAddedModal(): Promise<void> {
    await this.waitForBootstrapCartModalOpen();
    const modal = this.page.locator('#cartModal');
    await modal.locator('a[href="/view_cart"]').first().click({ force: true });
    if (!/\/view_cart/.test(this.page.url())) {
      await this.page.goto('/view_cart');
    }
    await expect(this.page).toHaveURL(/\/view_cart/, { timeout: 15_000 });
  }

  async dismissAddedModal(): Promise<void> {
    await this.waitForBootstrapCartModalOpen();
    const modal = this.page.locator('#cartModal');
    const btn = modal.locator('button.close-modal');
    try {
      await btn.click({ force: true });
    } catch {
      await this.page.keyboard.press('Escape');
    }
    try {
      await this.waitForBootstrapCartModalClosed();
    } catch {
      await this.page.keyboard.press('Escape');
      await this.waitForBootstrapCartModalClosed();
    }
    const backdrop = this.page.locator('.modal-backdrop');
    if ((await backdrop.count()) > 0) {
      await backdrop.first().waitFor({ state: 'detached', timeout: 15_000 }).catch(() => {});
    }
  }

  /**
   * Markup always includes “Added!” in `.modal-title` even when the dialog is closed; Bootstrap
   * adds `.in` (BS3) or `.show` (BS4+) on `#cartModal` when the dialog is actually open.
   */
  async expectAddedModalVisible(): Promise<void> {
    await this.waitForBootstrapCartModalOpen();
  }

  /** Product tiles inside `#features_items` / `.features_items` (shared by `/products` and category routes). */
  productCards(): Locator {
    return this.page.locator('.features_items .productinfo');
  }

  /** Outermost wrapper per grid tile (`.col-sm-4` > `.product-image-wrapper`). */
  productCardWrappers(): Locator {
    return this.page.locator('.features_items .product-image-wrapper');
  }

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
    await this.productCards().first().waitFor({ state: 'attached', timeout: 45_000 });
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
