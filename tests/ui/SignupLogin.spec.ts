import { expect, test } from '../../src/fixtures/ui.fixture';
import { buildNewUserPayload } from '../../src/helpers/userFactory';
import { SignupLoginPage } from '../../src/pages/SignupLoginPage';

test.describe('Signup Login Page', () => {
  test('loads successfully', async ({ page }) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
  });

  test('navigates to test cases page', async ({ page }) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
    await signupLogin.openFromHeader('testCases');
    await signupLogin.expectAppPage('testCases');
  });

  test('navigates to api list page', async ({ page }) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
    await signupLogin.openFromHeader('apiList');
    await signupLogin.expectAppPage('apiList');
  });

  test('navigates to contact us page', async ({ page }) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
    await signupLogin.openFromHeader('contactUs');
    await signupLogin.expectAppPage('contactUs');
  });

  test('navigates to home page', async ({ page }) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
    await signupLogin.openFromHeader('home');
    await signupLogin.expectAppPage('home');
  });

  test('navigates to products page', async ({ page }) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
    await signupLogin.openFromHeader('products');
    await signupLogin.expectAppPage('products');
  });

  test('navigates to cart page', async ({ page }) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
    await signupLogin.openFromHeader('viewCart');
    await signupLogin.expectAppPage('viewCart');
  });

  test('signs up a new account', async ({ page }, testInfo) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
    const user = buildNewUserPayload(testInfo.parallelIndex);
    await signupLogin.completeNewUserSignup(user);
  });

  test('logs out after signing up a new account', async ({ page }, testInfo) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
    const user = buildNewUserPayload(testInfo.parallelIndex);
    await signupLogin.completeNewUserSignup(user);
    await signupLogin.logout();
  });

  test('rejects login with incorrect credentials', async ({ page }) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
    await signupLogin.submitLogin('invalid-user@example.com', 'WrongPassword123!');
    await signupLogin.expectInvalidCredentialsError();
    await signupLogin.expectNotLoggedIn();
    await expect(page).toHaveURL(/\/login/);
  });

  test('deletes the account after signing up', async ({ page }, testInfo) => {
    const signupLogin = new SignupLoginPage(page);
    await signupLogin.visit();
    const user = buildNewUserPayload(testInfo.parallelIndex);
    await signupLogin.completeNewUserSignup(user);
    await signupLogin.deleteLoggedInAccount();
  });
});
