import { test } from '../../src/fixtures/ui.fixture';
import { ProductsPage } from '../../src/pages/ProductsPage';

test.describe('Products Page', () => {
  test('loads successfully', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.visit();
  });

  test('navigates to cart page', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.visit();
    await products.openFromHeader('viewCart');
    await products.expectAppPage('viewCart');
  });

  test('navigates to signup login page', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.visit();
    await products.openFromHeader('signupLogin');
    await products.expectAppPage('signupLogin');
  });

  test('navigates to test cases page', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.visit();
    await products.openFromHeader('testCases');
    await products.expectAppPage('testCases');
  });

  test('navigates to api list page', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.visit();
    await products.openFromHeader('apiList');
    await products.expectAppPage('apiList');
  });

  test('navigates to contact us page', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.visit();
    await products.openFromHeader('contactUs');
    await products.expectAppPage('contactUs');
  });

  test('navigates to home page', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.visit();
    await products.openFromHeader('home');
    await products.expectAppPage('home');
  });
});
