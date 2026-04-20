import { test, expect } from '../../src/fixtures/test';

test.describe.configure({ retries: 2 });

test.beforeEach(async ({ home }) => {
  await home.goto();
});

test.describe('Header navigation smoke', () => {
  test('loads Home from the main nav', async ({ home, page }) => {
    await home.openProducts();
    await home.openHome();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /AutomationExercise/i })).toBeVisible();
  });

  test('loads Signup / Login (login page) from the header', async ({ home, page }) => {
    await home.openLogin();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /Login to your account/i })).toBeVisible();
  });

  test('exposes Video Tutorials as external YouTube link in the header', async ({ home, page }) => {
    const video = page.locator('#header .navbar-nav').getByRole('link', { name: /Video Tutorials/i });
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('href', /youtube\.com/i);
  });

  test('loads Contact Us from the header', async ({ home, page }) => {
    await home.openContactUs();
    await expect(page).toHaveURL(/\/contact_us/);
    await expect(page.getByRole('heading', { name: /Contact Us/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Get In Touch/i })).toBeVisible();
  });

  test('loads Test Cases from the header', async ({ home, page }) => {
    await home.openTestCases();
    await expect(page).toHaveURL(/\/test_cases/);
    await expect(
      page.getByRole('heading', { level: 2, name: /^Test Cases$/i }),
    ).toBeVisible();
  });

  test('loads API list from the header', async ({ home, page }) => {
    await home.openApiList();
    await expect(page).toHaveURL(/\/api_list/);
    await expect(page.getByRole('heading', { name: /APIs List for practice/i })).toBeVisible();
  });

  test('loads signup route (distinct from login URL)', async ({ home, page }) => {
    await home.openSignup();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByRole('heading', { name: /New User Signup!/i })).toBeVisible();
  });

  test('loads Products from the header', async ({ home, products }) => {
    await home.openProducts();
    await products.expectCatalogLoaded();
  });

  test('loads Cart from the header', async ({ home, page }) => {
    await home.openCart();
    await expect(page).toHaveURL(/\/view_cart/);
    await expect(page.locator('#cart_items').getByText('Shopping Cart')).toBeVisible();
  });
});

test.describe('Deep link navigation smoke', () => {
  test('loads category listing from home sidebar', async ({ home, page }) => {
    await home.openCategoryProducts(4);
    await expect(page).toHaveURL(/\/category_products\/4/);
    await expect(page.getByRole('heading', { name: /Kids - Dress Products/i })).toBeVisible();
  });

  test('loads product details from first View Product on products page', async ({
    home,
    products,
    page,
  }) => {
    await home.openProducts();
    await products.openFirstProductDetails();
    await expect(page).toHaveURL(/\/product_details\//);
    await expect(page.getByRole('heading', { name: /Blue Top/i })).toBeVisible();
  });
});
