import { expect, type Locator, type Page } from '@playwright/test';
import { APP_PAGES, type AppPageKey } from './PageRouts';

type PageGetByRole = Page['getByRole'];
type AriaRole = Parameters<PageGetByRole>[0];

export class PageBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async expectPageLoaded(path: string): Promise<void> {
    await expect(this.page).toHaveURL(path);
  }

  async expectPageTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async expectAppPage(key: AppPageKey): Promise<void> {
    const route = APP_PAGES[key];
    await this.expectPageLoaded(route.path);
    await this.expectPageTitle(route.title);
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  getByRole(role: AriaRole, name: string, options?: { exact?: boolean }): Locator {
    return this.page.getByRole(role, { name, ...(options ?? {}) });
  }
}