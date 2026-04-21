import { expect, type Locator, type Page } from '@playwright/test';
import { APP_PAGES, type AppPageKey } from './PageRouts';
import { AppHeader } from './AppHeader';
import { PageBase } from './PageBase';

export type ContactFormPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachmentPath?: string;
};

export class ContactUsPage extends PageBase {
  readonly header: AppHeader;
  readonly contactForm: Locator;
  readonly submissionSuccessBanner: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new AppHeader(page);
    this.contactForm = page.locator('#contact-us-form');
    this.submissionSuccessBanner = page.locator('.contact-form .alert-success');
  }

  async visit(): Promise<void> {
    await this.goto(APP_PAGES.contactUs.path);
    await this.expectContactUsLoaded();
  }

  async expectContactUsLoaded(): Promise<void> {
    await this.expectPageLoaded(APP_PAGES.contactUs.path);
    await this.expectPageTitle(APP_PAGES.contactUs.title);
  }

  async openFromHeader(pageKey: AppPageKey): Promise<void> {
    await this.header.navigateTo(pageKey);
  }

  async expectContactFormVisible(): Promise<void> {
    await expect(this.contactForm).toBeVisible();
    await expect(this.contactForm.getByTestId('name')).toBeVisible();
    await expect(this.contactForm.getByTestId('email')).toBeVisible();
    await expect(this.contactForm.getByTestId('subject')).toBeVisible();
    await expect(this.contactForm.getByTestId('message')).toBeVisible();
    await expect(this.contactForm.getByTestId('submit-button')).toBeVisible();
  }

  async fillContactForm(payload: ContactFormPayload): Promise<void> {
    await this.contactForm.getByTestId('name').fill(payload.name);
    await this.contactForm.getByTestId('email').fill(payload.email);
    await this.contactForm.getByTestId('subject').fill(payload.subject);
    await this.contactForm.getByTestId('message').fill(payload.message);
    if (payload.attachmentPath) {
      await this.contactForm.locator('input[name="upload_file"]').setInputFiles(payload.attachmentPath);
    }
  }

  async submitContactForm(payload: ContactFormPayload): Promise<void> {
    await this.fillContactForm(payload);
    this.page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toMatch(/proceed/i);
      await dialog.accept();
    });
    await this.contactForm.getByTestId('submit-button').click();
  }

  async expectContactSubmissionSucceeded(): Promise<void> {
    await expect(this.submissionSuccessBanner).toBeVisible();
    await expect(this.submissionSuccessBanner).toContainText(
      /Success! Your details have been submitted successfully/i,
    );
    await expect(
      this.page.locator('#form-section').getByRole('link', { name: /home/i }),
    ).toBeVisible();
  }
}
