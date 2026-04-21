import { test } from '../../src/fixtures/ui.fixture';
import { APITestingPage } from '../../src/pages/APITestingPage';

test.describe('API Testing Page', () => {
  test('loads successfully', async ({ page }) => {
    const apiTesting = new APITestingPage(page);
    await apiTesting.visit();
  });

  test('navigates to contact us page', async ({ page }) => {
    const apiTesting = new APITestingPage(page);
    await apiTesting.visit();
    await apiTesting.openFromHeader('contactUs');
    await apiTesting.expectAppPage('contactUs');
  });

  test('navigates to home page', async ({ page }) => {
    const apiTesting = new APITestingPage(page);
    await apiTesting.visit();
    await apiTesting.openFromHeader('home');
    await apiTesting.expectAppPage('home');
  });

  test('navigates to products page', async ({ page }) => {
    const apiTesting = new APITestingPage(page);
    await apiTesting.visit();
    await apiTesting.openFromHeader('products');
    await apiTesting.expectAppPage('products');
  });

  test('navigates to cart page', async ({ page }) => {
    const apiTesting = new APITestingPage(page);
    await apiTesting.visit();
    await apiTesting.openFromHeader('viewCart');
    await apiTesting.expectAppPage('viewCart');
  });

  test('navigates to signup login page', async ({ page }) => {
    const apiTesting = new APITestingPage(page);
    await apiTesting.visit();
    await apiTesting.openFromHeader('signupLogin');
    await apiTesting.expectAppPage('signupLogin');
  });

  test('navigates to test cases page', async ({ page }) => {
    const apiTesting = new APITestingPage(page);
    await apiTesting.visit();
    await apiTesting.openFromHeader('testCases');
    await apiTesting.expectAppPage('testCases');
  });
});
