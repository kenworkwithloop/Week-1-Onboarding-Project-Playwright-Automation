import { test } from '../../src/fixtures/ui.fixture';
import { PageBase } from '../../src/pages/PageBase';

test.describe('Contact Us Page', () => {
  test('loads successfully', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto('/contact_us');
    await pageBase.expectPageLoaded('/contact_us');
    await pageBase.expectPageTitle('Automation Exercise - Contact Us');
  });
});
