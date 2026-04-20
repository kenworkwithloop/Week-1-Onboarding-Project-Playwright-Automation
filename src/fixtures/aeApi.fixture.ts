import { test as base } from '@playwright/test';
import { AutomationExerciseClient } from '../api/automationExerciseClient';

export type AeApiFixtures = {
  aeApi: AutomationExerciseClient;
};

export const test = base.extend<AeApiFixtures>({
  aeApi: async ({ request }, use) => {
    await use(new AutomationExerciseClient(request));
  },
});

export { expect } from '@playwright/test';
