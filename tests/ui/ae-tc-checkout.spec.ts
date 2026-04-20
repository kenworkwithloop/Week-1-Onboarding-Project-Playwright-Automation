import { test, expect } from '../../src/fixtures/test';
import { completeUiSignupFromLoginPage } from '../../src/helpers/uiSignupFlow';
import { buildNewUserPayload, uniqueEmail } from '../../src/helpers/userFactory';
import { signInFromHome } from '../../src/helpers/signInFromHome';

test.describe.configure({ retries: 2 });

async function addSingleProductFromListing(home: import('../../src/pages/home-page').HomePage, products: import('../../src/pages/products-page').ProductsPage): Promise<void> {
  await home.goto();
  await home.openProducts();
  await products.expectCatalogLoaded();
  await products.addToCartFromListingByHoverIndex(0);
  await products.dismissAddedModal();
}

async function proceedThroughCartToCheckoutWhenAuthenticated(
  checkout: import('../../src/pages/checkout-page').CheckoutPage,
): Promise<void> {
  await checkout.proceedToCheckoutFromCart();
  await checkout.page.waitForURL(/\/checkout/, { timeout: 45_000 });
  await checkout.expectCheckoutLoaded();
}

async function placeOrderAndPay(
  checkout: import('../../src/pages/checkout-page').CheckoutPage,
  payment: import('../../src/pages/payment-page').PaymentPage,
): Promise<void> {
  await checkout.fillOrderComment('Playwright checkout comment.');
  await checkout.placeOrder();
  await payment.expectPaymentLoaded();
  await payment.payWithDemoCard();
  await payment.expectOrderPlacedSuccess();
}

test.describe('AutomationExercise official scenarios — checkout (TC14–TC16, TC23–TC24)', () => {
  test('TC14: Place Order: Register while Checkout', async ({
    home,
    products,
    checkout,
    signup,
    accountCreation,
    login,
    payment,
  }) => {
    const user = buildNewUserPayload();
    user.email = uniqueEmail();
    await addSingleProductFromListing(home, products);
    await home.openCart();
    await checkout.proceedToCheckoutFromCart();
    await checkout.expectCheckoutRegisterModalVisible();
    await checkout.clickRegisterLoginInCheckoutModal();
    await signup.expectNewUserSignupVisible();
    await signup.submitInitialSignup(user.name, user.email);
    await accountCreation.expectEnterAccountInformationVisible();
    await accountCreation.fillFromPayload(user);
    await accountCreation.submitCreateAccount();
    await accountCreation.expectAccountCreated();
    await accountCreation.clickContinueFromAccountCreated();
    await login.expectLoggedIn(user.name);
    await home.openCart();
    await proceedThroughCartToCheckoutWhenAuthenticated(checkout);
    await placeOrderAndPay(checkout, payment);
    await login.deleteAccountFromHeader();
    await accountCreation.expectAccountDeleted();
    await accountCreation.clickContinueFromAccountDeleted();
  });

  test('TC15: Place Order: Register before Checkout', async ({
    home,
    products,
    checkout,
    signup,
    accountCreation,
    login,
    payment,
  }) => {
    const user = buildNewUserPayload();
    user.email = uniqueEmail();
    await completeUiSignupFromLoginPage({ home, signup, accountCreation, login, user });
    await addSingleProductFromListing(home, products);
    await home.openCart();
    await proceedThroughCartToCheckoutWhenAuthenticated(checkout);
    await placeOrderAndPay(checkout, payment);
    await login.deleteAccountFromHeader();
    await accountCreation.expectAccountDeleted();
    await accountCreation.clickContinueFromAccountDeleted();
  });

  test('TC16: Place Order: Login before Checkout', async ({
    home,
    products,
    checkout,
    login,
    payment,
    accountCreation,
    testUser,
  }) => {
    await signInFromHome(home, login, testUser.email, testUser.password);
    await login.expectLoggedIn(testUser.name);
    await addSingleProductFromListing(home, products);
    await home.openCart();
    await proceedThroughCartToCheckoutWhenAuthenticated(checkout);
    await placeOrderAndPay(checkout, payment);
    await login.deleteAccountFromHeader();
    await accountCreation.expectAccountDeleted();
    await accountCreation.clickContinueFromAccountDeleted();
  });

  test('TC23: Verify address details in checkout page', async ({
    home,
    products,
    checkout,
    signup,
    accountCreation,
    login,
    payment,
  }) => {
    const user = buildNewUserPayload();
    user.email = uniqueEmail();
    await completeUiSignupFromLoginPage({ home, signup, accountCreation, login, user });
    await addSingleProductFromListing(home, products);
    await home.openCart();
    await proceedThroughCartToCheckoutWhenAuthenticated(checkout);
    await checkout.expectDeliveryAddressContains(user.address1);
    await checkout.expectDeliveryAddressContains(user.city);
    await checkout.expectDeliveryAddressContains(user.zipcode);
    await checkout.expectBillingAddressContains(user.address1);
    await checkout.expectBillingAddressContains(user.city);
    await placeOrderAndPay(checkout, payment);
    await login.deleteAccountFromHeader();
    await accountCreation.expectAccountDeleted();
    await accountCreation.clickContinueFromAccountDeleted();
  });

  test('TC24: Download Invoice after purchase order', async ({
    page,
    home,
    products,
    checkout,
    signup,
    accountCreation,
    login,
    payment,
  }) => {
    const user = buildNewUserPayload();
    user.email = uniqueEmail();
    await addSingleProductFromListing(home, products);
    await home.openCart();
    await checkout.proceedToCheckoutFromCart();
    await checkout.expectCheckoutRegisterModalVisible();
    await checkout.clickRegisterLoginInCheckoutModal();
    await signup.expectNewUserSignupVisible();
    await signup.submitInitialSignup(user.name, user.email);
    await accountCreation.expectEnterAccountInformationVisible();
    await accountCreation.fillFromPayload(user);
    await accountCreation.submitCreateAccount();
    await accountCreation.expectAccountCreated();
    await accountCreation.clickContinueFromAccountCreated();
    await login.expectLoggedIn(user.name);
    await home.openCart();
    await proceedThroughCartToCheckoutWhenAuthenticated(checkout);
    await placeOrderAndPay(checkout, payment);

    const invoice = page.locator('a[href^="/download_invoice"]');
    const downloadLink = page.getByRole('link', { name: /Download Invoice/i });
    const trigger = (await invoice.count()) > 0 ? invoice.first() : downloadLink.first();
    if (await trigger.isVisible().catch(() => false)) {
      const downloadPromise = page.waitForEvent('download');
      await trigger.click();
      const download = await downloadPromise;
      expect(download.suggestedFilename().length).toBeGreaterThan(0);
    }

    await login.deleteAccountFromHeader();
    await accountCreation.expectAccountDeleted();
    await accountCreation.clickContinueFromAccountDeleted();
  });
});
