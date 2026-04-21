import { test } from '../../src/fixtures/ui.fixture';
import { buildNewUserPayload } from '../../src/helpers/userFactory';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { PaymentPage } from '../../src/pages/PaymentPage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { SignupLoginPage } from '../../src/pages/SignupLoginPage';
import { ViewCartPage } from '../../src/pages/ViewCartPage';

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

  test('adds a product to the cart', async ({ page }) => {
    const products = new ProductsPage(page);
    await products.visit();
    const productName = await products.addProductToCartAtIndex(0);
    await products.openViewCartFromAddedModal();
    const cart = new ViewCartPage(page);
    await cart.expectViewCartLoaded();
    await cart.expectCartContainsProduct(productName);
  });

  test('adds a product and completes checkout as a new customer', async ({ page }, testInfo) => {
    const products = new ProductsPage(page);
    await products.visit();
    const productName = await products.addProductToCartAtIndex(0);
    await products.openViewCartFromAddedModal();

    const cart = new ViewCartPage(page);
    await cart.expectViewCartLoaded();
    await cart.expectCartContainsProduct(productName);
    await cart.proceedToCheckout();

    const checkout = new CheckoutPage(page);
    let registeredDuringCheckout = false;
    if (await cart.requiresSignInForCheckout()) {
      await cart.openRegisterOrLoginFromCheckoutGate();
      const signupLogin = new SignupLoginPage(page);
      await signupLogin.expectSignupLoginLoaded();
      const user = buildNewUserPayload(testInfo.parallelIndex);
      await signupLogin.completeNewUserSignup(user);
      registeredDuringCheckout = true;
      await cart.visit();
      await cart.expectViewCartLoaded();
      await cart.expectCartContainsProduct(productName);
      await cart.proceedToCheckoutWhenAuthenticated();
    } else {
      await checkout.expectNavigatedToCheckout();
    }

    await checkout.expectCheckoutLoaded();
    await checkout.placeOrderAndGoToPayment();

    const payment = new PaymentPage(page);
    await payment.expectPaymentLoaded();
    await payment.fillDemoCard();
    await payment.payAndConfirmOrder();
    await payment.expectOrderPlaced();

    if (registeredDuringCheckout) {
      const signupLogin = new SignupLoginPage(page);
      await signupLogin.deleteLoggedInAccount();
    }
  });
});
