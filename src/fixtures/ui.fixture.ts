import { test as base } from '@playwright/test';
import { installGoogleAdMitigation } from '../helpers/installGoogleAdMitigation';

export const test = base.extend({
  page: async ({ page }, use) => {
    await installGoogleAdMitigation(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
