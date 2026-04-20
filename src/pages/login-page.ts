import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByTestId('login-button').click();
  }

  async expectLoggedIn(name: string): Promise<void> {
    await this.page.getByText(new RegExp(`Logged in as\\s+${name}`, 'i')).waitFor({
      state: 'visible',
    });
    await this.page.locator('a[href="/logout"]').waitFor({ state: 'visible' });
  }

  async expectIncorrectCredentialsMessage(): Promise<void> {
    await expect(
      this.page.getByText('Your email or password is incorrect!', { exact: true }),
    ).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.page.locator('a[href="/logout"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async deleteAccountFromHeader(): Promise<void> {
    await this.page.locator('a[href="/delete_account"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /Login to your account/i })).toBeVisible();
  }
}
