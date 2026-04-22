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

  async expectCartDoesNotContainProduct(description: string): Promise<void> {
    await expect(
      this.page.locator('#cart_info_table').getByText(description, { exact: true }),
    ).toHaveCount(0);
  }

  /** Clicks the trash control on the cart row whose description matches exactly. */
  async removeLineItemWithDescription(description: string): Promise<void> {
    const row = this.page
      .locator('#cart_info_table tbody tr')
      .filter({ has: this.page.getByText(description, { exact: true }) });
    await expect(row).toHaveCount(1);
    await row.locator('a.cart_quantity_delete').click();
    await this.expectCartDoesNotContainProduct(description);
  }

  async expectCartEmptyState(): Promise<void> {
    await expect(this.page.getByText(/Cart is empty!/i)).toBeVisible();
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
