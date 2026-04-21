import { test } from '../../src/fixtures/ui.fixture';
import { PageBase } from '../../src/pages/PageBase';

test.describe('Test Cases Page', () => {
  test('loads successfully', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto('/test_cases');
    await pageBase.expectPageLoaded('/test_cases');
    await pageBase.expectPageTitle('Automation Practice Website for UI Testing - Test Cases');
  });
});
