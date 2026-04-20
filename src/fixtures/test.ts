import { test as base, expect } from '@playwright/test';
import { AutomationExerciseClient } from '../api/automationExerciseClient';
import type { CreateUserPayload } from '../helpers/userFactory';
import { buildNewUserPayload } from '../helpers/userFactory';
import { CartPage } from '../pages/cart-page';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import { ProductsPage } from '../pages/products-page';

type AppFixtures = {
  aeApi: AutomationExerciseClient;
  testUser: CreateUserPayload;
  home: HomePage;
  login: LoginPage;
  products: ProductsPage;
  cart: CartPage;
};

export const test = base.extend<AppFixtures>({
  aeApi: async ({ request }, use) => {
    await use(new AutomationExerciseClient(request));
  },

  testUser: async ({ aeApi }, use, testInfo) => {
    const user = buildNewUserPayload(testInfo.workerIndex);
    const created = await aeApi.createAccount(user);
    expect(created.body.responseCode).toBe(201);
    await use(user);
    const deleted = await aeApi.deleteAccount({
      email: user.email,
      password: user.password,
    });
    expect([200, 404]).toContain(deleted.body.responseCode);
  },

  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  login: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  products: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
