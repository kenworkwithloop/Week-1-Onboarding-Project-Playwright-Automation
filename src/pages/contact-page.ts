import { expect, type Page } from '@playwright/test';

export class ContactPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/contact_us', { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/\/contact_us/);
  }

  async expectGetInTouchVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /Get In Touch/i })).toBeVisible();
  }

  async submitInquiry(params: {
    name: string;
    email: string;
    subject: string;
    message: string;
    filePath: string;
  }): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.page.locator('input[name="name"]').fill(params.name);
    await this.page.locator('input[name="email"]').fill(params.email);
    await this.page.locator('input[name="subject"]').fill(params.subject);
    await this.page.locator('#message').fill(params.message);
    await this.page.locator('input[name="upload_file"]').setInputFiles(params.filePath);
    await this.page.getByTestId('submit-button').click();
  }

  async expectSubmitSuccess(): Promise<void> {
    await expect(this.page.locator('#form-section a.btn-success[href="/"]')).toBeVisible();
    const successLines = await this.page
      .getByText('Success! Your details have been submitted successfully.', { exact: true })
      .count();
    expect(successLines).toBeGreaterThanOrEqual(1);
  }

  async clickHomeFromSuccess(): Promise<void> {
    await this.page.locator('#form-section a.btn-success[href="/"]').click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
