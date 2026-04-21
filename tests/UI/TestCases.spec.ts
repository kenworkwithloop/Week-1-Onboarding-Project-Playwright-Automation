import { test } from '../../src/fixtures/ui.fixture';
import { TestCasesPage } from '../../src/pages/TestCasesPage';

test.describe('Test Cases Page', () => {
  test('loads successfully', async ({ page }) => {
    const testCases = new TestCasesPage(page);
    await testCases.visit();
  });

  test('navigates to api list page', async ({ page }) => {
    const testCases = new TestCasesPage(page);
    await testCases.visit();
    await testCases.openFromHeader('apiList');
    await testCases.expectAppPage('apiList');
  });

  test('navigates to contact us page', async ({ page }) => {
    const testCases = new TestCasesPage(page);
    await testCases.visit();
    await testCases.openFromHeader('contactUs');
    await testCases.expectAppPage('contactUs');
  });

  test('navigates to home page', async ({ page }) => {
    const testCases = new TestCasesPage(page);
    await testCases.visit();
    await testCases.openFromHeader('home');
    await testCases.expectAppPage('home');
  });

  test('navigates to products page', async ({ page }) => {
    const testCases = new TestCasesPage(page);
    await testCases.visit();
    await testCases.openFromHeader('products');
    await testCases.expectAppPage('products');
  });

  test('navigates to cart page', async ({ page }) => {
    const testCases = new TestCasesPage(page);
    await testCases.visit();
    await testCases.openFromHeader('viewCart');
    await testCases.expectAppPage('viewCart');
  });

  test('navigates to signup login page', async ({ page }) => {
    const testCases = new TestCasesPage(page);
    await testCases.visit();
    await testCases.openFromHeader('signupLogin');
    await testCases.expectAppPage('signupLogin');
  });
});
