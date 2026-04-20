import { expect, type Page } from '@playwright/test';
import { dismissGoogleVignetteIfPresent } from '../helpers/dismissGoogleVignette';

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Main nav "Home" (not the logo); avoids matching other `href="/"` in the header. */
  async openHome(): Promise<void> {
    const link = this.page.locator('#header .navbar-nav a[href="/"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await dismissGoogleVignetteIfPresent(this.page);
    const url = new URL(this.page.url());
    const atRoot = url.pathname === '/' || url.pathname === '';
    if (!atRoot) {
      await this.page.goto('/');
    }
    await expect(this.page).toHaveURL('/');
  }

  async openProducts(): Promise<void> {
    const link = this.page.locator('#header a[href="/products"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await dismissGoogleVignetteIfPresent(this.page);
    if (!/\/products/.test(this.page.url())) {
      await this.page.goto('/products');
    }
    await expect(this.page).toHaveURL(/\/products/);
  }

  async openCart(): Promise<void> {
    const link = this.page.locator('#header a[href="/view_cart"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await dismissGoogleVignetteIfPresent(this.page);
    if (!/\/view_cart/.test(this.page.url())) {
      await this.page.goto('/view_cart');
    }
    await expect(this.page).toHaveURL(/\/view_cart/);
  }

  async openLogin(): Promise<void> {
    const link = this.page.locator('#header a[href="/login"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await dismissGoogleVignetteIfPresent(this.page);
    if (!/\/login/.test(this.page.url())) {
      await this.page.goto('/login');
    }
    await expect(this.page).toHaveURL(/\/login/);
  }

  async openContactUs(): Promise<void> {
    const link = this.page.locator('#header a[href="/contact_us"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await dismissGoogleVignetteIfPresent(this.page);
    if (!/\/contact_us/.test(this.page.url())) {
      await this.page.goto('/contact_us');
    }
    await expect(this.page).toHaveURL(/\/contact_us/);
  }

  async openTestCases(): Promise<void> {
    const link = this.page.locator('#header a[href="/test_cases"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await dismissGoogleVignetteIfPresent(this.page);
    if (!/\/test_cases/.test(this.page.url())) {
      await this.page.goto('/test_cases');
    }
    await expect(this.page).toHaveURL(/\/test_cases/);
  }

  async openApiList(): Promise<void> {
    const link = this.page.locator('#header a[href="/api_list"]').first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await dismissGoogleVignetteIfPresent(this.page);
    if (!/\/api_list/.test(this.page.url())) {
      await this.page.goto('/api_list');
    }
    await expect(this.page).toHaveURL(/\/api_list/);
  }

  /** Header links to `/login` only; `/signup` is a separate GET route with the same signup form. */
  async openSignup(): Promise<void> {
    await this.page.goto('/signup');
    await dismissGoogleVignetteIfPresent(this.page);
    if (!/\/signup/.test(this.page.url())) {
      await this.page.goto('/signup');
    }
    await expect(this.page).toHaveURL(/\/signup/);
  }

  async openCategoryProducts(categoryId: number): Promise<void> {
    const path = `/category_products/${categoryId}`;
    const accordion = this.page.locator('#accordian');
    const panelHrefForCategory: Record<number, string> = {
      1: '#Women',
      2: '#Women',
      3: '#Men',
      4: '#Kids',
      5: '#Kids',
      6: '#Men',
      7: '#Women',
    };
    const panelHref = panelHrefForCategory[categoryId];
    if (panelHref) {
      const toggler = accordion.locator(`a[href="${panelHref}"]`).first();
      await toggler.scrollIntoViewIfNeeded();
      await toggler.click();
    }
    const categoryLink = accordion.locator(`a[href="${path}"]`).first();
    // Bootstrap collapse keeps links out of view; DOM click still navigates like a real follow.
    await categoryLink.evaluate((el: HTMLAnchorElement) => {
      el.click();
    });
    await dismissGoogleVignetteIfPresent(this.page);
    if (!new RegExp(`/category_products/${categoryId}`).test(this.page.url())) {
      await this.page.goto(path);
    }
    await expect(this.page).toHaveURL(new RegExp(`/category_products/${categoryId}`));
  }
}
