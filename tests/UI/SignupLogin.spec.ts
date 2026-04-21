import { test } from '../../src/fixtures/ui.fixture';
import { PageBase } from '../../src/pages/PageBase';

test.describe('Signup Login Page', () => {
  test('loads successfully', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto('/login');
    await pageBase.expectPageLoaded('/login');
    await pageBase.expectPageTitle('Automation Exercise - Signup / Login');
  });
});
