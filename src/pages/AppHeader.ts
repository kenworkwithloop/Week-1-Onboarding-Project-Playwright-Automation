import type { Page } from '@playwright/test';
import { APP_PAGES, type AppPageKey } from './PageRouts';

/**
 * Top navigation shared across the site. All header clicks live here.
 */
export class AppHeader {
  constructor(private readonly page: Page) {}

  private navBar(): ReturnType<Page['locator']> {
    return this.page.locator('#header ul.nav.navbar-nav');
  }

  async navigateTo(pageKey: AppPageKey): Promise<void> {
    const { link } = APP_PAGES[pageKey];
    await this.navBar().getByRole('link', { name: link }).click();
  }
}
