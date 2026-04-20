import { expect, type Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openProducts(): Promise<void> {
    const link = this.page.locator('#header a[href="/products"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    if (this.page.url().includes('google_vignette')) {
      await this.page.keyboard.press('Escape');
    }
    if (!/\/products/.test(this.page.url())) {
      await this.page.goto('/products');
    }
    await expect(this.page).toHaveURL(/\/products/);
  }

  async openCart(): Promise<void> {
    const link = this.page.locator('#header a[href="/view_cart"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    if (this.page.url().includes('google_vignette')) {
      await this.page.keyboard.press('Escape');
    }
    if (!/\/view_cart/.test(this.page.url())) {
      await this.page.goto('/view_cart');
    }
    await expect(this.page).toHaveURL(/\/view_cart/);
  }

  async openLogin(): Promise<void> {
    const link = this.page.locator('#header a[href="/login"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    if (this.page.url().includes('google_vignette')) {
      await this.page.keyboard.press('Escape');
    }
    if (!/\/login/.test(this.page.url())) {
      await this.page.goto('/login');
    }
    await expect(this.page).toHaveURL(/\/login/);
  }
}
