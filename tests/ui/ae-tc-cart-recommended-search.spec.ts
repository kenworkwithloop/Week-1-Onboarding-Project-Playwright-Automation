import { test, expect } from '../../src/fixtures/test';
import { signInFromHome } from '../../src/helpers/signInFromHome';

test.describe.configure({ retries: 2 });

function rupeesToNumber(text: string): number {
  const digits = text.replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

test.describe('AutomationExercise official scenarios — cart, recommended, search+cart (TC12–TC13, TC17, TC20, TC22)', () => {
  test('TC12: Add Products in Cart', async ({ page, home, products, cart }) => {
    await home.goto();
    await home.openProducts();
    await products.expectCatalogLoaded();
    await products.addToCartFromListingByHoverIndex(0);
    await products.expectAddedModalVisible();
    await products.dismissAddedModal();
    await products.addToCartFromListingByHoverIndex(1);
    await products.expectAddedModalVisible();
    await products.viewCartFromAddedModal();
    await expect(page).toHaveURL(/\/view_cart/);
    await cart.expectRowCount(2);
    const p1 = await cart.unitPriceForProduct('Blue Top');
    const p2 = await cart.unitPriceForProduct('Men Tshirt');
    const t1 = await cart.lineTotalForProduct('Blue Top');
    const t2 = await cart.lineTotalForProduct('Men Tshirt');
    expect(rupeesToNumber(t1)).toBe(rupeesToNumber(p1));
    expect(rupeesToNumber(t2)).toBe(rupeesToNumber(p2));
    expect(await cart.quantityButtonTextForProduct('Blue Top')).toBe('1');
    expect(await cart.quantityButtonTextForProduct('Men Tshirt')).toBe('1');
    expect(rupeesToNumber(t1) + rupeesToNumber(t2)).toBe(rupeesToNumber(p1) + rupeesToNumber(p2));
  });

  test('TC13: Verify Product quantity in Cart', async ({ home, products, productDetail, cart }) => {
    await home.goto();
    await home.openProducts();
    await products.openFirstProductDetails();
    await productDetail.setQuantity(4);
    await productDetail.addToCart();
    await products.expectAddedModalVisible();
    await products.viewCartFromAddedModal();
    expect(await cart.quantityButtonTextForProduct('Blue Top')).toBe('4');
  });

  test('TC17: Remove Products From Cart', async ({ home, products, cart }) => {
    await home.goto();
    await home.openProducts();
    await products.addToCartFromListingByHoverIndex(0);
    await products.dismissAddedModal();
    await products.addToCartFromListingByHoverIndex(1);
    await products.viewCartFromAddedModal();
    await cart.expectRowCount(2);
    await cart.removeLineForProductId(1);
    await cart.expectRowCount(1);
    await expect(cart.lineItem('Men Tshirt')).toBeVisible();
  });

  test('TC20: Search Products and Verify Cart After Login', async ({ home, products, login, cart, testUser }) => {
    await home.goto();
    await home.openProducts();
    await products.searchProducts('blue');
    await products.expectSearchedProductsHeading();
    const count = await products.productCards().count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await products.addToCartFromListingByHoverIndex(i);
      await products.expectAddedModalVisible();
      await products.dismissAddedModal();
    }
    await home.openCart();
    await expect(cart.lineItem(/blue/i)).toBeVisible();
    await signInFromHome(home, login, testUser.email, testUser.password);
    await login.expectLoggedIn(testUser.name);
    await home.openCart();
    await expect(cart.lineItem(/blue/i)).toBeVisible();
  });

  test('TC22: Add to cart from Recommended items', async ({ home, products, page }) => {
    await home.goto();
    await home.scrollToRecommendedItems();
    await home.expectRecommendedItemsVisible();
    await home.addFirstRecommendedProductToCart();
    await products.expectAddedModalVisible();
    await products.viewCartFromAddedModal();
    await expect(page.locator('#cart_info tbody tr').first()).toBeVisible();
  });
});
