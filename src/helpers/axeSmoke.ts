import { AxeBuilder } from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export async function expectNoCriticalOrSeriousAxeViolations(
  page: Page,
  options: { path: string; include: string[] },
): Promise<void> {
  await page.goto(options.path, { waitUntil: 'domcontentloaded' });
  let builder = new AxeBuilder({ page });
  for (const selector of options.include) {
    builder = builder.include(selector);
  }
  const results = await builder
    .disableRules(['color-contrast'])
    .exclude('iframe')
    .exclude('.control-carousel')
    .withTags(['wcag2a'])
    .analyze();
  const severe = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  );
  expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
}
