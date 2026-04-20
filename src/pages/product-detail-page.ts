import { expect, type Page } from '@playwright/test';
import { dismissGoogleVignetteIfPresent } from '../helpers/dismissGoogleVignette';

export class ProductDetailPage {
  constructor(private readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/product_details\//);
  }

  async expectProductInformationVisible(params: {
    name: RegExp;
    category: RegExp;
    price: RegExp;
    availability: RegExp;
    condition: RegExp;
    brand: RegExp;
  }): Promise<void> {
    const info = this.page.locator('.product-information');
    await expect(info.getByRole('heading', { level: 2 })).toHaveText(params.name);
    await expect(info.locator('p').filter({ hasText: /Category:/i })).toHaveText(params.category);
    await expect(info.locator('span').filter({ hasText: /^Rs\./i }).first()).toHaveText(params.price);
    await expect(info.locator('p').filter({ hasText: /Availability:/i })).toHaveText(params.availability);
    await expect(info.locator('p').filter({ hasText: /Condition:/i })).toHaveText(params.condition);
    await expect(info.locator('p').filter({ hasText: /Brand:/i })).toHaveText(params.brand);
  }

  async setQuantity(n: number): Promise<void> {
    await this.page.locator('#quantity').fill(String(n));
  }

  async addToCart(): Promise<void> {
    const btn = this.page.locator('button.cart').first();
    await btn.scrollIntoViewIfNeeded();
    await dismissGoogleVignetteIfPresent(this.page);
    await btn.click({ force: true });
  }

  async expectWriteReviewVisible(): Promise<void> {
    await expect(this.page.getByRole('link', { name: /Write Your Review/i })).toBeVisible();
  }

  async submitReview(name: string, email: string, review: string): Promise<void> {
    await this.page.locator('#name').fill(name);
    await this.page.locator('#email').fill(email);
    await this.page.locator('#review').fill(review);
    await this.page.locator('#button-review').click();
  }

  async expectReviewThankYou(): Promise<void> {
    await expect(
      this.page.locator('#reviews').getByText('Thank you for your review.', { exact: true }),
    ).toBeVisible({ timeout: 3000 });
  }
}
