import type { Page } from '@playwright/test';
import { APP_PAGES, type AppPageKey } from './PageRouts';
import { AppHeader } from './AppHeader';
import { PageBase } from './PageBase';

export class TestCasesPage extends PageBase {
  readonly header: AppHeader;

  constructor(page: Page) {
    super(page);
    this.header = new AppHeader(page);
  }

  async visit(): Promise<void> {
    await this.goto(APP_PAGES.testCases.path);
    await this.expectTestCasesLoaded();
  }

  async expectTestCasesLoaded(): Promise<void> {
    await this.expectPageLoaded(APP_PAGES.testCases.path);
    await this.expectPageTitle(APP_PAGES.testCases.title);
  }

  async openFromHeader(pageKey: AppPageKey): Promise<void> {
    await this.header.navigateTo(pageKey);
  }
}
