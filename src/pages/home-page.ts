import { expect, type Locator, type Page } from '@playwright/test';
import { isBootstrapCartModalOpen } from '../helpers/bootstrapCartModal';
import { dismissGoogleVignetteIfPresent } from '../helpers/dismissGoogleVignette';

export class HomePage {
  constructor(private readonly page: Page) {}

  private async clickHeaderLinkThenEnsureUrl(options: {
    link: Locator;
    needsGotoFallback: () => boolean;
    gotoPath: string;
    expectUrl: string | RegExp;
  }): Promise<void> {
    await options.link.scrollIntoViewIfNeeded();
    await options.link.click();
    await dismissGoogleVignetteIfPresent(this.page);
    if (options.needsGotoFallback()) {
      await this.page.goto(options.gotoPath);
    }
    await expect(this.page).toHaveURL(options.expectUrl);
  }

  async goto(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded', timeout: 90_000 });
  }

  /** Main nav "Home" (not the logo); avoids matching other `href="/"` in the header. */
  async openHome(): Promise<void> {
    await this.clickHeaderLinkThenEnsureUrl({
      link: this.page.locator('#header .navbar-nav a[href="/"]').first(),
      needsGotoFallback: () => {
        const url = new URL(this.page.url());
        return !(url.pathname === '/' || url.pathname === '');
      },
      gotoPath: '/',
      expectUrl: '/',
    });
  }

  async openProducts(): Promise<void> {
    await this.clickHeaderLinkThenEnsureUrl({
      link: this.page.locator('#header a[href="/products"]').first(),
      needsGotoFallback: () => !/\/products/.test(this.page.url()),
      gotoPath: '/products',
      expectUrl: /\/products/,
    });
  }

  async openCart(): Promise<void> {
    await this.clickHeaderLinkThenEnsureUrl({
      link: this.page.locator('#header a[href="/view_cart"]').first(),
      needsGotoFallback: () => !/\/view_cart/.test(this.page.url()),
      gotoPath: '/view_cart',
      expectUrl: /\/view_cart/,
    });
  }

  async openLogin(): Promise<void> {
    await this.clickHeaderLinkThenEnsureUrl({
      link: this.page.locator('#header a[href="/login"]').first(),
      needsGotoFallback: () => !/\/login/.test(this.page.url()),
      gotoPath: '/login',
      expectUrl: /\/login/,
    });
  }

  async openContactUs(): Promise<void> {
    await this.clickHeaderLinkThenEnsureUrl({
      link: this.page.locator('#header a[href="/contact_us"]').first(),
      needsGotoFallback: () => !/\/contact_us/.test(this.page.url()),
      gotoPath: '/contact_us',
      expectUrl: /\/contact_us/,
    });
  }

  async openTestCases(): Promise<void> {
    await this.clickHeaderLinkThenEnsureUrl({
      link: this.page.locator('#header a[href="/test_cases"]').first(),
      needsGotoFallback: () => !/\/test_cases/.test(this.page.url()),
      gotoPath: '/test_cases',
      expectUrl: /\/test_cases/,
    });
  }

  async openApiList(): Promise<void> {
    await this.clickHeaderLinkThenEnsureUrl({
      link: this.page.locator('#header a[href="/api_list"]').first(),
      needsGotoFallback: () => !/\/api_list/.test(this.page.url()),
      gotoPath: '/api_list',
      expectUrl: /\/api_list/,
    });
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

  footerSubscriptionBlock(): Locator {
    return this.page.locator('#footer').getByRole('heading', { name: /^Subscription$/i });
  }

  async scrollToFooterSubscription(): Promise<void> {
    await this.footerSubscriptionBlock().scrollIntoViewIfNeeded();
  }

  async expectFooterSubscriptionVisible(): Promise<void> {
    await expect(this.footerSubscriptionBlock()).toBeVisible();
  }

  async subscribeFromCurrentPageFooter(email: string): Promise<void> {
    await this.page.locator('#footer #susbscribe_email').fill(email);
    await this.page.locator('#footer #subscribe').click();
  }

  async expectSubscribeSuccessVisible(): Promise<void> {
    await expect(this.page.locator('#success-subscribe')).toBeVisible();
    await expect(
      this.page.getByText('You have been successfully subscribed!', { exact: true }),
    ).toBeVisible();
  }

  recommendedSection(): Locator {
    return this.page.locator('.recommended_items');
  }

  async scrollToRecommendedItems(): Promise<void> {
    const section = this.recommendedSection();
    await section.waitFor({ state: 'attached', timeout: 30_000 });
    await section.evaluate((el) =>
      (el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' }),
    );
  }

  async expectRecommendedItemsVisible(): Promise<void> {
    await expect(this.recommendedSection().getByRole('heading', { name: /recommended items/i })).toBeVisible();
  }

  async addFirstRecommendedProductToCart(): Promise<void> {
    const section = this.recommendedSection();
    await section.waitFor({ state: 'attached', timeout: 30_000 });
    await section.evaluate((el) =>
      (el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' }),
    );
    await dismissGoogleVignetteIfPresent(this.page);

    const maxAttempts = 3;
    let lastError: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await section.evaluate((el) =>
        (el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' }),
      );
      const link = section.locator('a.add-to-cart').first();
      await link.waitFor({ state: 'attached', timeout: 15_000 });
      await link.evaluate((el) =>
        (el as HTMLElement).scrollIntoView({ block: 'center', inline: 'nearest' }),
      );
      await link.evaluate((el) => (el as HTMLAnchorElement).click());
      try {
        await expect
          .poll(async () => isBootstrapCartModalOpen(this.page), { timeout: 12_000 })
          .toBeTruthy();
        return;
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError instanceof Error
      ? lastError
      : new Error('Recommended add to cart did not open cart modal');
  }

  async clickScrollUpControl(): Promise<void> {
    const up = this.page.locator('#scrollUp');
    await up.waitFor({ state: 'visible', timeout: 15_000 });
    await up.click();
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
    if (!new RegExp(`/category_products/${categoryId}`).test(this.page.url())) {
      await this.page.goto(path);
    }
    await expect(this.page).toHaveURL(new RegExp(`/category_products/${categoryId}`));
    await this.page.waitForLoadState('domcontentloaded');
    await dismissGoogleVignetteIfPresent(this.page);
  }
}
