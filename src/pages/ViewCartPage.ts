import { expect, type Page } from '@playwright/test';
import { APP_PAGES, type AppPageKey } from './PageRouts';
import { AppHeader } from './AppHeader';
import { PageBase } from './PageBase';

export class ViewCartPage extends PageBase {
  readonly header: AppHeader;

  constructor(page: Page) {
    super(page);
    this.header = new AppHeader(page);
  }

  async visit(): Promise<void> {
    await this.goto(APP_PAGES.viewCart.path);
    await this.expectViewCartLoaded();
  }

  async expectViewCartLoaded(): Promise<void> {
    await this.expectPageLoaded(APP_PAGES.viewCart.path);
    await this.expectPageTitle(APP_PAGES.viewCart.title);
  }

  async openFromHeader(pageKey: AppPageKey): Promise<void> {
    await this.header.navigateTo(pageKey);
  }

  async expectCartContainsProduct(description: string): Promise<void> {
    const table = this.page.locator('#cart_info_table');
    await expect(table).toBeVisible();
    await expect(table.getByText(description, { exact: true })).toBeVisible();
  }

  /** Clicks the primary checkout CTA from the cart (guest or returning flow). */
  async proceedToCheckout(): Promise<void> {
    await this.page.locator('a.check_out').first().click();
  }

  /** True when checkout is blocked until the user registers or logs in (guest cart). */
  async requiresSignInForCheckout(): Promise<boolean> {
    return this.page.getByText(/Register.*Login account to proceed/i).isVisible();
  }

  /** From the cart checkout panel, opens `/login` to register or sign in. */
  async openRegisterOrLoginFromCheckoutGate(): Promise<void> {
    await this.page.getByRole('link', { name: /Register.*Login/i }).click();
    await this.page.waitForURL('**/login**', { timeout: 60_000 });
  }

  /** When already authenticated, proceeds from cart straight to `/checkout`. */
  async proceedToCheckoutWhenAuthenticated(): Promise<void> {
    await this.proceedToCheckout();
    await this.page.waitForURL('**/checkout**', { timeout: 60_000 });
  }
}
