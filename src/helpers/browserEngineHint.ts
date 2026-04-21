import type { Page } from '@playwright/test';

/** True when the page is likely driven by WebKit (e.g. Playwright `webkit` project / Safari-like UA). */
export async function isLikelyWebKit(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const ua = navigator.userAgent;
    return /\bSafari\b/i.test(ua) && !/\b(Chrome|Chromium|Edg)\b/i.test(ua);
  });
}
