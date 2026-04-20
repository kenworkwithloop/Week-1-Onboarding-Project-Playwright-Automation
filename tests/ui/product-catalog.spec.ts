import { test, expect } from '../../src/fixtures/test';
import {
  ALL_PRODUCTS_CATALOG_COUNT,
  CATEGORY_PRODUCT_CATALOG_SCENARIOS,
} from '../../src/helpers/productCatalogExpectations';

test.describe.configure({ retries: 2 });

test.describe('Product catalog', () => {
  test.beforeEach(async ({ home }) => {
    await home.goto();
  });

  test.describe('All products (`/products`)', () => {
    test('lists the expected number of product cards', async ({ home, products }) => {
      await home.openProducts();
      await products.expectCatalogLoaded();
      await products.expectListedProductCount(ALL_PRODUCTS_CATALOG_COUNT);
    });

    test('each product tile exposes a consistent card shell (product agnostic)', async ({ home, products }) => {
      await home.openProducts();
      await products.expectCatalogLoaded();
      const wrappers = products.productCardWrappers();
      await expect(wrappers).toHaveCount(ALL_PRODUCTS_CATALOG_COUNT);
      for (let i = 0; i < ALL_PRODUCTS_CATALOG_COUNT; i++) {
        await products.expectProductCardWrapperStructure(wrappers.nth(i));
      }
    });
  });

  test.describe('Category sidebar (`/category_products/:id`)', () => {
    for (const scenario of CATEGORY_PRODUCT_CATALOG_SCENARIOS) {
      test(`category ${scenario.categoryId} lists ${scenario.expectedProductCount} product cards`, async ({
        home,
        products,
        page,
      }) => {
        await home.openCategoryProducts(scenario.categoryId);
        await expect(page).toHaveURL(new RegExp(`/category_products/${scenario.categoryId}`));
        await expect(page.getByRole('heading', { name: scenario.heading })).toBeVisible();
        await products.expectListedProductCount(scenario.expectedProductCount);
      });
    }
  });
});
