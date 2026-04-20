import { test, expect } from '../../src/fixtures/test';
import { uniqueEmail } from '../../src/helpers/userFactory';

test.describe.configure({ retries: 2 });

test.describe('AutomationExercise official scenarios — products, categories, review (TC8–TC9, TC18–TC19, TC21)', () => {
  test('TC8: Verify All Products and product detail page', async ({ home, products, productDetail }) => {
    await home.goto();
    await home.openProducts();
    await products.expectCatalogLoaded();
    await expect(products.productCards().first()).toBeVisible();
    await products.openFirstProductDetails();
    await productDetail.expectLoaded();
    await productDetail.expectProductInformationVisible({
      name: /Blue Top/i,
      category: /Category: Women > Tops/i,
      price: /Rs\.\s*500/,
      availability: /Availability: In Stock/i,
      condition: /Condition: New/i,
      brand: /Brand: Polo/i,
    });
  });

  test('TC9: Search Product', async ({ home, products }) => {
    await home.goto();
    await home.openProducts();
    await products.expectCatalogLoaded();
    await products.searchProducts('Blue');
    await products.expectSearchedProductsHeading();
    await products.expectSearchResultsRelatedToTerm('Blue');
  });

  test('TC18: View Category Products', async ({ home, page }) => {
    await home.goto();
    const accordion = page.locator('#accordian');
    await expect(accordion).toBeVisible();
    await accordion.locator('a[href="#Women"]').click();
    await accordion.locator('a[href="/category_products/1"]').click();
    await expect(page).toHaveURL(/\/category_products\/1/);
    await expect(page.getByRole('heading', { name: /Women - Dress Products/i })).toBeVisible();
    await accordion.locator('a[href="#Men"]').click();
    await accordion.locator('a[href="/category_products/3"]').click();
    await expect(page).toHaveURL(/\/category_products\/3/);
    await expect(page.getByRole('heading', { name: /Men - Tshirts Products/i })).toBeVisible();
  });

  test('TC19: View & Cart Brand Products', async ({ home, products, page }) => {
    await home.goto();
    await home.openProducts();
    await products.expectCatalogLoaded();
    await expect(page.locator('.brands_products')).toBeVisible();
    await products.openBrandFromSidebar(/Polo/i);
    await expect(page).toHaveURL(/\/brand_products\/Polo/);
    await products.expectBrandHeading(/Brand - Polo Products/i);
    await expect(products.productCards().first()).toBeVisible();
    await products.openBrandFromSidebar(/H&M/i);
    await expect(page).toHaveURL(/\/brand_products\//);
    await products.expectBrandHeading(/Brand - H&M Products/i);
  });

  test('TC21: Add review on product', async ({ home, products, productDetail, page }) => {
    await home.goto();
    await home.openProducts();
    await products.expectCatalogLoaded();
    await products.openFirstProductDetails();
    await productDetail.expectWriteReviewVisible();
    await productDetail.submitReview('Reviewer', uniqueEmail(), 'Great product for TC21.');
    await productDetail.expectReviewThankYou();
  });
});
