import type { Page } from '@playwright/test';
import { UI_BASE_URL } from '../constants';

function applicationOrigin(): string {
  return new URL(UI_BASE_URL).origin;
}

export function isOnApplicationPage(page: Page): boolean {
  try {
    return new URL(page.url()).origin === applicationOrigin();
  } catch {
    return false;
  }
}

/**
 * After a click, ad scripts may navigate the tab off the SUT. Restore the prior listing URL
 * (same-tab ad hops usually respond to goBack; otherwise goto the URL captured before the click).
 */
export async function recoverToApplicationPage(page: Page, priorUrl: string): Promise<void> {
  await page.waitForLoadState('domcontentloaded').catch(() => {});

  if (isOnApplicationPage(page)) return;

  try {
    await page.goBack({ waitUntil: 'domcontentloaded', timeout: 15_000 });
  } catch {
    // No history or back navigation failed.
  }

  await page.waitForLoadState('domcontentloaded').catch(() => {});

  if (!isOnApplicationPage(page)) {
    await page.goto(priorUrl, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  }
}
