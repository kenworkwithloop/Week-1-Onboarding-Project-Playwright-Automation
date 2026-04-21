import { expect, type Locator, type Page } from '@playwright/test';
import { APP_PAGES } from './PageRouts';

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
    console.log('expecting page title: ', title);
    console.log('page title: ', await this.page.title());
    await expect(this.page).toHaveTitle(title);
  }
  
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  headerNav(): Locator {
    return this.page.locator('#header ul.nav.navbar-nav');
  }

  getByRole(role: AriaRole, name: string, options?: { exact?: boolean }): Locator {
    return this.page.getByRole(role, { name, ...(options ?? {}) });
  }
}