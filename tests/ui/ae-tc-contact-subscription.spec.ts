import path from 'path';
import { test, expect } from '../../src/fixtures/test';
import { uniqueEmail } from '../../src/helpers/userFactory';

test.describe.configure({ retries: 2 });

test.describe('AutomationExercise official scenarios — contact & subscription (TC6, TC10–TC11)', () => {
  test('TC6: Contact Us Form', async ({ contact, page }) => {
    await contact.goto();
    await contact.expectGetInTouchVisible();
    const filePath = path.join(process.cwd(), 'test-data', 'contact.txt');
    await contact.submitInquiry({
      name: 'Test User',
      email: uniqueEmail(),
      subject: 'Automation inquiry',
      message: 'Playwright TC6 message body.',
      filePath,
    });
    await contact.expectSubmitSuccess();
    await contact.clickHomeFromSuccess();
    await expect(page).toHaveURL('/');
  });

  test('TC10: Verify Subscription in home page', async ({ home, page }) => {
    await home.goto();
    await home.scrollToFooterSubscription();
    await home.expectFooterSubscriptionVisible();
    await home.subscribeFromCurrentPageFooter(uniqueEmail());
    await home.expectSubscribeSuccessVisible();
  });

  test('TC11: Verify Subscription in Cart page', async ({ home, page }) => {
    await home.goto();
    await home.openCart();
    await home.scrollToFooterSubscription();
    await home.expectFooterSubscriptionVisible();
    await home.subscribeFromCurrentPageFooter(uniqueEmail());
    await home.expectSubscribeSuccessVisible();
  });
});
