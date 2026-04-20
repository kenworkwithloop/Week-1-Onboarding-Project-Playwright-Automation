import { test, expect } from '../../../src/fixtures/test';

test.describe.configure({ retries: 2 });

test.describe('Authenticated session', () => {
  test('header shows logged-in state from saved storage', async ({ home, page }) => {
    await home.goto();
    await expect(page.getByText(/Logged in as/i)).toBeVisible();
  });

  test('can open products while authenticated', async ({ home, products }) => {
    await home.goto();
    await home.openProducts();
    await products.expectCatalogLoaded();
  });
});
