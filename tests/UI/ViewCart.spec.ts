import { test } from '../../src/fixtures/ui.fixture';
import { ViewCartPage } from '../../src/pages/ViewCartPage';

test.describe('View Cart Page', () => {
  test('loads successfully', async ({ page }) => {
    const viewCart = new ViewCartPage(page);
    await viewCart.visit();
  });

  test('navigates to signup login page', async ({ page }) => {
    const viewCart = new ViewCartPage(page);
    await viewCart.visit();
    await viewCart.openFromHeader('signupLogin');
    await viewCart.expectAppPage('signupLogin');
  });

  test('navigates to test cases page', async ({ page }) => {
    const viewCart = new ViewCartPage(page);
    await viewCart.visit();
    await viewCart.openFromHeader('testCases');
    await viewCart.expectAppPage('testCases');
  });

  test('navigates to api list page', async ({ page }) => {
    const viewCart = new ViewCartPage(page);
    await viewCart.visit();
    await viewCart.openFromHeader('apiList');
    await viewCart.expectAppPage('apiList');
  });

  test('navigates to contact us page', async ({ page }) => {
    const viewCart = new ViewCartPage(page);
    await viewCart.visit();
    await viewCart.openFromHeader('contactUs');
    await viewCart.expectAppPage('contactUs');
  });

  test('navigates to home page', async ({ page }) => {
    const viewCart = new ViewCartPage(page);
    await viewCart.visit();
    await viewCart.openFromHeader('home');
    await viewCart.expectAppPage('home');
  });

  test('navigates to products page', async ({ page }) => {
    const viewCart = new ViewCartPage(page);
    await viewCart.visit();
    await viewCart.openFromHeader('products');
    await viewCart.expectAppPage('products');
  });
});
