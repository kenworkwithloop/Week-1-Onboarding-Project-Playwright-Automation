import { test } from '@playwright/test';
import { expectNoCriticalOrSeriousAxeViolations } from '../../src/helpers/axeSmoke';

test.describe.configure({ retries: 2 });

test.describe('Accessibility smoke', () => {
  test('home page has no critical or serious axe violations', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium',
      'Axe smoke is limited to Chromium to reduce duplicate noise across engines.',
    );
    await expectNoCriticalOrSeriousAxeViolations(page, {
      path: '/',
      include: ['#header', '#slider'],
    });
  });

  test('products page has no critical or serious axe violations', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium');
    await expectNoCriticalOrSeriousAxeViolations(page, {
      path: '/products',
      include: ['#header', '.features_items'],
    });
  });
});
