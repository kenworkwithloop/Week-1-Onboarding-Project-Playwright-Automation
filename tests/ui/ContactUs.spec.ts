import path from 'path';
import { test } from '../../src/fixtures/ui.fixture';
import { ContactUsPage } from '../../src/pages/ContactUsPage';

test.describe('Contact Us Page', () => {
  test('loads successfully', async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.visit();
  });

  test('submits contact form after confirming the dialog', async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.visit();
    await contactUs.expectContactFormVisible();

    const attachmentPath = path.join(__dirname, '../../test-data/contact.txt');
    await contactUs.submitContactForm({
      name: 'Playwright User',
      email: 'playwright.user@example.com',
      subject: 'UI automation test',
      message: 'This submission was created by an automated Playwright test.',
      attachmentPath,
    });

    await contactUs.expectContactSubmissionSucceeded();
  });

  test('navigates to home page', async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.visit();
    await contactUs.openFromHeader('home');
    await contactUs.expectAppPage('home');
  });

  test('navigates to products page', async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.visit();
    await contactUs.openFromHeader('products');
    await contactUs.expectAppPage('products');
  });

  test('navigates to cart page', async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.visit();
    await contactUs.openFromHeader('viewCart');
    await contactUs.expectAppPage('viewCart');
  });

  test('navigates to signup login page', async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.visit();
    await contactUs.openFromHeader('signupLogin');
    await contactUs.expectAppPage('signupLogin');
  });

  test('navigates to test cases page', async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.visit();
    await contactUs.openFromHeader('testCases');
    await contactUs.expectAppPage('testCases');
  });

  test('navigates to api testing page', async ({ page }) => {
    const contactUs = new ContactUsPage(page);
    await contactUs.visit();
    await contactUs.openFromHeader('apiList');
    await contactUs.expectAppPage('apiList');
  });
});
