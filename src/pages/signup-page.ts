import { expect, type Page } from '@playwright/test';
import { dismissGoogleVignetteIfPresent } from '../helpers/dismissGoogleVignette';

/** Initial “New User Signup!” step (`/login` or `/signup`). */
export class SignupPage {
  constructor(private readonly page: Page) {}

  async gotoLogin(): Promise<void> {
    await this.page.goto('/login');
    await dismissGoogleVignetteIfPresent(this.page);
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectNewUserSignupVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /New User Signup!/i })).toBeVisible();
  }

  async submitInitialSignup(name: string, email: string): Promise<void> {
    await this.page.getByTestId('signup-name').fill(name);
    await this.page.getByTestId('signup-email').fill(email);
    await this.page.getByTestId('signup-button').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectEmailAlreadyExistsMessage(): Promise<void> {
    await expect(this.page.getByText('Email Address already exist!', { exact: true })).toBeVisible();
  }
}
