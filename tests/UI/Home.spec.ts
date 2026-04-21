import { test } from '../../src/fixtures/ui.fixture';
import { PageBase } from '../../src/pages/PageBase';
import { APP_PAGES } from '../../src/pages/PageRouts';

test.describe('Home Page', () => {
  test('loads successfully', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto(APP_PAGES.home.path);
    await pageBase.expectPageLoaded(APP_PAGES.home.path);
    await pageBase.expectPageTitle(APP_PAGES.home.title);
  });

  test('navigates to products page', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto(APP_PAGES.home.path);
    await pageBase.expectPageLoaded(APP_PAGES.home.path);
    await pageBase.expectPageTitle(APP_PAGES.home.title);

    await pageBase.headerNav().getByRole('link', { name: APP_PAGES.products.link }).click();    
    await pageBase.expectPageLoaded(APP_PAGES.products.path);
    await pageBase.expectPageTitle(APP_PAGES.products.title);
  });

  test('navigates to cart page', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto(APP_PAGES.home.path);
    await pageBase.expectPageLoaded(APP_PAGES.home.path);
    await pageBase.expectPageTitle(APP_PAGES.home.title);

    await pageBase.headerNav().getByRole('link', { name: APP_PAGES.viewCart.link }).click();
    await pageBase.expectPageLoaded(APP_PAGES.viewCart.path);
    await pageBase.expectPageTitle(APP_PAGES.viewCart.title);
  });

  test('navigates to signup login page', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto(APP_PAGES.home.path);
    await pageBase.expectPageLoaded(APP_PAGES.home.path);
    await pageBase.expectPageTitle(APP_PAGES.home.title);

    await pageBase.headerNav().getByRole('link', { name: APP_PAGES.signupLogin.link }).click();
    await pageBase.expectPageLoaded(APP_PAGES.signupLogin.path);
    await pageBase.expectPageTitle(APP_PAGES.signupLogin.title);
  });

  test('navigates to test cases page', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto(APP_PAGES.home.path);
    await pageBase.expectPageLoaded(APP_PAGES.home.path);
    await pageBase.expectPageTitle(APP_PAGES.home.title);

    await pageBase.headerNav().getByRole('link', { name: APP_PAGES.testCases.link }).click();
    await pageBase.expectPageLoaded(APP_PAGES.testCases.path);
    await pageBase.expectPageTitle(APP_PAGES.testCases.title);
  });

  test('navigates to api list page', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto(APP_PAGES.home.path);
    await pageBase.expectPageLoaded(APP_PAGES.home.path);
    await pageBase.expectPageTitle(APP_PAGES.home.title);

    await pageBase.headerNav().getByRole('link', { name: APP_PAGES.apiList.link }).click();
    await pageBase.expectPageLoaded(APP_PAGES.apiList.path);
    await pageBase.expectPageTitle(APP_PAGES.apiList.title);
  });

  test('navigates to contact us page', async ({ page }) => {
    const pageBase = new PageBase(page);
    await pageBase.goto(APP_PAGES.home.path);
    await pageBase.expectPageLoaded(APP_PAGES.home.path);
    await pageBase.expectPageTitle(APP_PAGES.home.title);
    
    await pageBase.headerNav().getByRole('link', { name: APP_PAGES.contactUs.link }).click();
    await pageBase.expectPageLoaded(APP_PAGES.contactUs.path);
    await pageBase.expectPageTitle(APP_PAGES.contactUs.title);
  });

});
