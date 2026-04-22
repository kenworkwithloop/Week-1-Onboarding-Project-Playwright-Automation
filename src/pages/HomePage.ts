import { expect, type Page } from '@playwright/test';
import { APP_PAGES, type AppPageKey } from './PageRouts';
import { AppHeader } from './AppHeader';
import { PageBase } from './PageBase';

export class HomePage extends PageBase {
  readonly header: AppHeader;

  constructor(page: Page) {
    super(page);
    this.header = new AppHeader(page);
  }

  async visit(): Promise<void> {
    await this.goto(APP_PAGES.home.path);
    await this.expectHomeLoaded();
  }

  async expectHomeLoaded(): Promise<void> {
    await this.expectPageLoaded(APP_PAGES.home.path);
    await this.expectPageTitle(APP_PAGES.home.title);
  }

  async expectAuthenticatedChromeVisible(): Promise<void> {
    await expect(this.page.getByRole('link', { name: /logout/i })).toBeVisible();
    await expect(this.page.getByText(/Logged in as/i)).toBeVisible();
  }

  async openFromHeader(pageKey: AppPageKey): Promise<void> {
    await this.header.navigateTo(pageKey);
  }
}
