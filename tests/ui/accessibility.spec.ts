import { AxeBuilder } from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe.configure({ retries: 2 });

test.describe('Accessibility smoke', () => {
  test('home page has no critical or serious axe violations', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium',
      'Axe smoke is limited to Chromium to reduce duplicate noise across engines.',
    );
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const results = await new AxeBuilder({ page })
      .include('#header')
      .include('#slider')
      .disableRules(['color-contrast'])
      .exclude('iframe')
      .exclude('.control-carousel')
      .withTags(['wcag2a'])
      .analyze();
    const severe = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
  });

  test('products page has no critical or serious axe violations', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');
    await page.goto('/products', { waitUntil: 'domcontentloaded' });
    const results = await new AxeBuilder({ page })
      .include('#header')
      .include('.features_items')
      .disableRules(['color-contrast'])
      .exclude('iframe')
      .exclude('.control-carousel')
      .withTags(['wcag2a'])
      .analyze();
    const severe = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
  });
});
