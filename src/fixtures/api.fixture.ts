import { test as base } from '@playwright/test';
import { AutomationExerciseClient } from '../api/API';

export type AutomationExerciseApiFixtures = {
  aeApi: AutomationExerciseClient;
};

export const test = base.extend<AutomationExerciseApiFixtures>({
  aeApi: async ({ request }, use) => {
    await use(new AutomationExerciseClient(request));
  },
});

export { expect } from '@playwright/test';
