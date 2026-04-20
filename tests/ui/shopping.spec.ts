import { test } from '../../src/fixtures/test';
import { expectCartContainsProduct } from '../../src/helpers/cartAssertions';
import { signInFromHome } from '../../src/helpers/signInFromHome';

test.describe.configure({ retries: 2 });

test.describe('Shopping cart UI', () => {
  test('adds a product to the cart and shows it on the cart page', async ({
    page,
    home,
    login,
    products,
    testUser,
  }) => {
    await signInFromHome(home, login, testUser.email, testUser.password);
    await home.openProducts();
    await products.addBlueTopToCart();
    await products.expectAddedModalVisible();
    await products.dismissAddedModal();
    await home.openCart();
    await expectCartContainsProduct(page, 'Blue Top');
  });
});
