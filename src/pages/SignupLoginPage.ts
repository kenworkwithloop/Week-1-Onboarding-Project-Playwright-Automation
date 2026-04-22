import { expect, type Locator, type Page } from '@playwright/test';
import type { CreateUserPayload } from '../helpers/userFactory';
import { APP_PAGES, type AppPageKey } from './PageRouts';
import { AppHeader } from './AppHeader';
import { PageBase } from './PageBase';

export class SignupLoginPage extends PageBase {
  readonly header: AppHeader;
  readonly signupForm: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new AppHeader(page);
    this.signupForm = page.locator('.signup-form');
  }

  async visit(): Promise<void> {
    await this.goto(APP_PAGES.signupLogin.path);
    await this.expectSignupLoginLoaded();
  }

  async expectSignupLoginLoaded(): Promise<void> {
    await this.expectPageLoaded(APP_PAGES.signupLogin.path);
    await this.expectPageTitle(APP_PAGES.signupLogin.title);
  }

  async openFromHeader(pageKey: AppPageKey): Promise<void> {
    await this.header.navigateTo(pageKey);
  }

  async submitLogin(email: string, password: string): Promise<void> {
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByTestId('login-button').click();
  }

  async expectInvalidCredentialsError(): Promise<void> {
    await expect(
      this.page.getByText(/Your email or password is incorrect!?/i),
    ).toBeVisible();
  }

  async expectNotLoggedIn(): Promise<void> {
    await expect(this.page.getByText(/Logged in as/i)).not.toBeVisible();
  }

  async expectNewUserSignupFormVisible(): Promise<void> {
    await expect(this.signupForm).toContainText('New User Signup!');
    await expect(this.signupForm.getByTestId('signup-name')).toBeVisible();
    await expect(this.signupForm.getByTestId('signup-email')).toBeVisible();
    await expect(this.signupForm.getByTestId('signup-button')).toBeVisible();
  }

  async submitSignupStepOne(name: string, email: string): Promise<void> {
    await this.signupForm.getByTestId('signup-name').fill(name);
    await this.signupForm.getByTestId('signup-email').fill(email);
    await this.signupForm.getByTestId('signup-button').click();
    await this.page.waitForURL('**/signup', { timeout: 60_000 });
  }

  async expectEnterAccountInformationVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/\/signup$/);
    await expect(this.page).toHaveTitle('Automation Exercise - Signup');
    await expect(
      this.page.getByRole('heading', { name: /enter account information/i }),
    ).toBeVisible();
  }

  async fillSignupAccountDetails(user: CreateUserPayload): Promise<void> {
    const titleRadio =
      user.title === 'Mrs'
        ? this.page.locator('#id_gender2')
        : this.page.locator('#id_gender1');
    await titleRadio.check();

    await this.page.getByTestId('password').fill(user.password);
    await this.page.getByTestId('days').selectOption(user.birth_date);
    await this.page.getByTestId('months').selectOption({ label: user.birth_month });
    await this.page.getByTestId('years').selectOption(user.birth_year);

    await this.page.getByTestId('first_name').fill(user.firstname);
    await this.page.getByTestId('last_name').fill(user.lastname);
    await this.page.getByTestId('company').fill(user.company);
    await this.page.getByTestId('address').fill(user.address1);
    if (user.address2) {
      await this.page.getByTestId('address2').fill(user.address2);
    }
    await this.page.getByTestId('country').selectOption(user.country);
    await this.page.getByTestId('state').fill(user.state);
    await this.page.getByTestId('city').fill(user.city);
    await this.page.getByTestId('zipcode').fill(user.zipcode);
    await this.page.getByTestId('mobile_number').fill(user.mobile_number);
  }

  async submitCreateAccount(): Promise<void> {
    await this.page.getByTestId('create-account').click();
    await this.page.waitForURL('**/account_created**', { timeout: 60_000 });
  }

  async expectAccountCreated(): Promise<void> {
    await expect(this.page).toHaveURL(/account_created/);
    await expect(this.page).toHaveTitle('Automation Exercise - Account Created');
    await expect(this.page.getByTestId('account-created')).toBeVisible();
  }

  async continueFromAccountCreated(): Promise<void> {
    await this.page.getByTestId('continue-button').click();
    await this.page.getByText(/Logged in as/i).waitFor({ state: 'visible', timeout: 60_000 });
  }

  async expectLoggedInAs(name: string): Promise<void> {
    const banner = this.page.getByText(/Logged in as/i);
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(name);
  }

  async completeNewUserSignup(user: CreateUserPayload): Promise<void> {
    await this.expectNewUserSignupFormVisible();
    await this.submitSignupStepOne(user.name, user.email);
    await this.expectEnterAccountInformationVisible();
    await this.fillSignupAccountDetails(user);
    await this.submitCreateAccount();
    await this.expectAccountCreated();
    await this.continueFromAccountCreated();
    await this.expectLoggedInAs(user.name);
  }

  async logout(): Promise<void> {
    await this.header.logout();
    await this.page.waitForURL('**/login', { timeout: 60_000 });
    await expect(this.page.getByText(/Logged in as/i)).not.toBeVisible();
    await this.expectSignupLoginLoaded();
  }

  async expectAccountDeletedPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/delete_account\/?$/);
    const heading = this.page.getByTestId('account-deleted');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Account Deleted/i);
    await expect(this.page.getByText(/Logged in as/i)).not.toBeVisible();
  }

  /**
   * Deletes the current session's account (header link + confirm dialog) and lands on the deleted confirmation view.
   */
  async deleteLoggedInAccount(): Promise<void> {
    await this.header.deleteAccount();
    await this.page.waitForURL('**/delete_account**', { timeout: 60_000 });
    await this.expectAccountDeletedPage();
  }
}
