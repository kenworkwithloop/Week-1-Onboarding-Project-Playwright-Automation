import type { Page } from '@playwright/test';

export async function dismissGoogleVignetteIfPresent(page: Page): Promise<void> {
  if (page.url().includes('google_vignette')) {
    await page.keyboard.press('Escape');
  }
}
