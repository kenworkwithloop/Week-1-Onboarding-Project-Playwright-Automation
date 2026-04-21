import type { Page } from '@playwright/test';
import { APP_PAGES, type AppPageKey } from './PageRouts';
import { AppHeader } from './AppHeader';
import { PageBase } from './PageBase';

export class ProductsPage extends PageBase {
  readonly header: AppHeader;

  constructor(page: Page) {
    super(page);
    this.header = new AppHeader(page);
  }

  async visit(): Promise<void> {
    await this.goto(APP_PAGES.products.path);
    await this.expectProductsLoaded();
  }

  async expectProductsLoaded(): Promise<void> {
    await this.expectPageLoaded(APP_PAGES.products.path);
    await this.expectPageTitle(APP_PAGES.products.title);
  }

  async openFromHeader(pageKey: AppPageKey): Promise<void> {
    await this.header.navigateTo(pageKey);
  }
}
