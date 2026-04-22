import { test } from '../../../src/fixtures/ui.fixture';
import { HomePage } from '../../../src/pages/HomePage';
import { SignupLoginPage } from '../../../src/pages/SignupLoginPage';

test.use({ storageState: '.auth/user.json' });

test.describe('Authenticated Home Page', () => {
  test.describe.configure({ mode: 'serial' });

  test('loads home with a pre-seeded logged-in session', async ({ page }) => {
    const home = new HomePage(page);
    await home.visit();
    await home.expectAuthenticatedChromeVisible();
  });

  test('logs out from an authenticated session', async ({ page }) => {
    const home = new HomePage(page);
    await home.visit();
    await home.expectAuthenticatedChromeVisible();

    const signupLogin = new SignupLoginPage(page);
    await signupLogin.logout();
  });
});
