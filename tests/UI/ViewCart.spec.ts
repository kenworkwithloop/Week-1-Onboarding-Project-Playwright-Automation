import { test } from '../../src/fixtures/ui.fixture';
import { PageBase } from '../../src/pages/PageBase';

test.describe('View Cart Page', () => {
  test('loads successfully', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto('/view_cart');
    await pageBase.expectPageLoaded('/view_cart');
    await pageBase.expectPageTitle('Automation Exercise - Checkout');
  });
});
