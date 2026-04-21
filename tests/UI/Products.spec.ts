import { test } from '../../src/fixtures/ui.fixture';
import { PageBase } from '../../src/pages/PageBase';

test.describe('Products Page', () => {
  test('loads successfully', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto('/products');
    await pageBase.expectPageLoaded('/products');
    await pageBase.expectPageTitle('Automation Exercise - All Products');
  });
});
