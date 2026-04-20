import { test, expect } from '../../src/fixtures/test';

test.describe.configure({ retries: 2 });

test.describe('AutomationExercise official scenarios — scroll (TC25–TC26)', () => {
  test('TC25: Verify Scroll Up using Arrow button and Scroll Down functionality', async ({
    home,
    page,
  }) => {
    await home.goto();
    await home.scrollToFooterSubscription();
    await home.expectFooterSubscriptionVisible();
    await home.clickScrollUpControl();
    await expect(
      page.getByRole('heading', { name: /Full-Fledged practice website for Automation Engineers/i }).first(),
    ).toBeInViewport();
  });

  test('TC26: Verify Scroll Up without Arrow button and Scroll Down functionality', async ({
    home,
    page,
  }) => {
    await home.goto();
    await home.scrollToFooterSubscription();
    await home.expectFooterSubscriptionVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(
      page.getByRole('heading', { name: /Full-Fledged practice website for Automation Engineers/i }).first(),
    ).toBeInViewport();
  });
});
