import { test } from '../../src/fixtures/ui.fixture';
import { HomePage } from '../../src/pages/HomePage';

test.describe('Home Page', () => {
  test('loads successfully', async ({ page }) => {
    const home = new HomePage(page);
    await home.visit();
  });

  test('navigates to products page', async ({ page }) => {
    const home = new HomePage(page);
    await home.visit();
    await home.openFromHeader('products');
    await home.expectAppPage('products');
  });

  test('navigates to cart page', async ({ page }) => {
    const home = new HomePage(page);
    await home.visit();
    await home.openFromHeader('viewCart');
    await home.expectAppPage('viewCart');
  });

  test('navigates to signup login page', async ({ page }) => {
    const home = new HomePage(page);
    await home.visit();
    await home.openFromHeader('signupLogin');
    await home.expectAppPage('signupLogin');
  });

  test('navigates to test cases page', async ({ page }) => {
    const home = new HomePage(page);
    await home.visit();
    await home.openFromHeader('testCases');
    await home.expectAppPage('testCases');
  });

  test('navigates to api list page', async ({ page }) => {
    const home = new HomePage(page);
    await home.visit();
    await home.openFromHeader('apiList');
    await home.expectAppPage('apiList');
  });

  test('navigates to contact us page', async ({ page }) => {
    const home = new HomePage(page);
    await home.visit();
    await home.openFromHeader('contactUs');
    await home.expectAppPage('contactUs');
  });
});
