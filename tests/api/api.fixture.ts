import { test as base } from '@playwright/test';
import { AutomationExerciseClient } from '../../src/api/automationExerciseClient';

type ApiFixtures = {
  aeApi: AutomationExerciseClient;
};

export const test = base.extend<ApiFixtures>({
  aeApi: async ({ request }, use) => {
    await use(new AutomationExerciseClient(request));
  },
});

export { expect } from '@playwright/test';
