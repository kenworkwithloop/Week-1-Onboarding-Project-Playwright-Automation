import { expect, type Page } from '@playwright/test';
import type { CreateUserPayload } from '../helpers/userFactory';

/** “Enter Account Information” + address block after initial signup POST. */
export class AccountCreationPage {
  constructor(private readonly page: Page) {}

  async expectEnterAccountInformationVisible(): Promise<void> {
    await expect(this.page.getByText('Enter Account Information', { exact: true })).toBeVisible();
  }

  async fillFromPayload(user: CreateUserPayload, options?: { newsletter?: boolean; optin?: boolean }): Promise<void> {
    const titleLower = user.title.toLowerCase();
    if (titleLower === 'mrs') {
      await this.page.locator('#id_gender2').check();
    } else {
      await this.page.locator('#id_gender1').check();
    }

    await this.page.getByTestId('name').fill(user.name);
    await this.page.getByTestId('password').fill(user.password);

    await this.page.getByTestId('days').selectOption(user.birth_date);
    await this.page.getByTestId('months').selectOption({ label: user.birth_month });
    await this.page.getByTestId('years').selectOption(user.birth_year);

    if (options?.newsletter) {
      await this.page.locator('#newsletter').check();
    }
    if (options?.optin) {
      await this.page.locator('#optin').check();
    }

    await this.page.getByTestId('first_name').fill(user.firstname);
    await this.page.getByTestId('last_name').fill(user.lastname);
    await this.page.getByTestId('company').fill(user.company);
    await this.page.getByTestId('address').fill(user.address1);
    await this.page.getByTestId('address2').fill(user.address2);
    await this.page.getByTestId('country').selectOption(user.country);
    await this.page.getByTestId('state').fill(user.state);
    await this.page.getByTestId('city').fill(user.city);
    await this.page.getByTestId('zipcode').fill(user.zipcode);
    await this.page.getByTestId('mobile_number').fill(user.mobile_number);
  }

  async submitCreateAccount(): Promise<void> {
    await this.page.getByTestId('create-account').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectAccountCreated(): Promise<void> {
    await expect(this.page.getByTestId('account-created')).toBeVisible();
    await expect(this.page.getByText(/Account Created!/i)).toBeVisible();
  }

  async clickContinueFromAccountCreated(): Promise<void> {
    await this.page.getByTestId('continue-button').click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectAccountDeleted(): Promise<void> {
    await expect(this.page.getByTestId('account-deleted')).toBeVisible();
    await expect(this.page.getByText(/Account Deleted!/i)).toBeVisible();
  }

  async clickContinueFromAccountDeleted(): Promise<void> {
    await this.page.getByTestId('continue-button').click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
