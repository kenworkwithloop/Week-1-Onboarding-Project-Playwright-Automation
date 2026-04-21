import { expect, type Page } from '@playwright/test';
import { APP_PAGES, type AppPageKey } from './PageRouts';

export class AppHeader {
  constructor(private readonly page: Page) {}

  private navBar(): ReturnType<Page['locator']> {
    return this.page.locator('#header ul.nav.navbar-nav');
  }

  async navigateTo(pageKey: AppPageKey): Promise<void> {
    const { link } = APP_PAGES[pageKey];
    await this.navBar().getByRole('link', { name: link }).click();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('link', { name: /logout/i }).click();
  }

  async deleteAccount(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });
    await this.page.getByRole('link', { name: /delete account/i }).click();
  }
}
