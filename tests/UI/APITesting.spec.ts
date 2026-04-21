import { test } from '../../src/fixtures/ui.fixture';
import { PageBase } from '../../src/pages/PageBase';

test.describe('API Testing Page', () => {
  test('loads successfully', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto('/api_list');
    await pageBase.expectPageLoaded('/api_list');
    await pageBase.expectPageTitle('Automation Practice for API Testing');
  });
});
