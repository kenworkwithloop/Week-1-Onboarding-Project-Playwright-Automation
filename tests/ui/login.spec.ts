import { test, expect } from '../../src/fixtures/test';
import { signInFromHome } from '../../src/helpers/signInFromHome';

test.describe.configure({ retries: 2 });

test.describe('Login UI', () => {
  test('user created via API can sign in from the login page', async ({
    home,
    login,
    testUser,
  }) => {
    await signInFromHome(home, login, testUser.email, testUser.password);
    await login.expectLoggedIn(testUser.name);
  });

  test('invalid credentials keep the user on the login experience', async ({
    home,
    login,
    page,
  }) => {
    await home.goto();
    await home.openLogin();
    await login.login('not_a_real_user@example.com', 'wrong-password');
    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole('heading', { name: /Login to your account/i })).toBeVisible();
  });
});
