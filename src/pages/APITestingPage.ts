import type { Page } from '@playwright/test';
import { APP_PAGES, type AppPageKey } from './PageRouts';
import { AppHeader } from './AppHeader';
import { PageBase } from './PageBase';

export class APITestingPage extends PageBase {
  readonly header: AppHeader;

  constructor(page: Page) {
    super(page);
    this.header = new AppHeader(page);
  }

  async visit(): Promise<void> {
    await this.goto(APP_PAGES.apiList.path);
    await this.expectAPITestingLoaded();
  }

  async expectAPITestingLoaded(): Promise<void> {
    await this.expectPageLoaded(APP_PAGES.apiList.path);
    await this.expectPageTitle(APP_PAGES.apiList.title);
  }

  async openFromHeader(pageKey: AppPageKey): Promise<void> {
    await this.header.navigateTo(pageKey);
  }
}
