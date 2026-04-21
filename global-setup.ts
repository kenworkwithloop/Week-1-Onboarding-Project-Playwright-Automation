import { chromium, request, selectors } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { setTimeout as sleep } from 'node:timers/promises';
import { UI_BASE_URL } from './src/constants';
import { AutomationExerciseClient } from './src/api/API';
import { buildNewUserPayload } from './src/helpers/userFactory';
import { installGoogleAdMitigation } from './src/helpers/installGoogleAdMitigation';

async function globalSetup(): Promise<void> {
  selectors.setTestIdAttribute('data-qa');
  const authDir = path.join(__dirname, '.auth');
  fs.mkdirSync(authDir, { recursive: true });
  const storagePath = path.join(authDir, 'user.json');

  const maxAttempts = 6;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const apiContext = await request.newContext({ baseURL: UI_BASE_URL });
    const browser = await chromium.launch();
    try {
      const client = new AutomationExerciseClient(apiContext);
      const user = buildNewUserPayload();

      const create = await client.createAccount(user);
      if (create.body.responseCode !== 201) {
        throw new Error(
          `Global setup: createAccount failed: ${JSON.stringify(create.body)}`,
        );
      }

      const context = await browser.newContext({ baseURL: UI_BASE_URL });
      const page = await context.newPage();
      await installGoogleAdMitigation(page);

      await page.goto('/login', { waitUntil: 'domcontentloaded' });
      await page.getByTestId('login-email').fill(user.email);
      await page.getByTestId('login-password').fill(user.password);
      await page.getByTestId('login-button').click();
      await page.getByText(/Logged in as/i).waitFor({ state: 'visible', timeout: 60_000 });

      await context.storageState({ path: storagePath });
      await context.close();
      await apiContext.dispose();
      await browser.close();
      return;
    } catch (error) {
      lastError = error;
      await browser.close().catch(() => {});
      await apiContext.dispose().catch(() => {});
      if (attempt === maxAttempts - 1) break;
      await sleep(3000 * (attempt + 1));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Global setup failed after ${maxAttempts} attempts: ${String(lastError)}`);
}

export default globalSetup;
