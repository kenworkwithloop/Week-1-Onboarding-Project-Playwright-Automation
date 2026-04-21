import type { BrowserContext, Page } from '@playwright/test';
import { dismissGoogleVignetteIfPresent } from './dismissGoogleVignette';

const AD_HOST_RE =
  /googlesyndication\.com|doubleclick\.net|googleadservices\.com|fundingchoicesmessages\.google\.com|pagead2\.googlesyndication\.com/i;

const contextsWithAdRoutes = new WeakMap<BrowserContext, true>();

/**
 * One-time harness for UI tests: block common ad request hosts and auto-dismiss known overlays
 * before Playwright performs actions, so page objects stay focused on the SUT.
 */
export async function installGoogleAdMitigation(page: Page): Promise<void> {
  const context = page.context();

  if (!contextsWithAdRoutes.has(context)) {
    contextsWithAdRoutes.set(context, true);
    await context.route(AD_HOST_RE, (route) => {
      void route.abort();
    });
  }

  const dismiss = async (): Promise<void> => {
    await dismissGoogleVignetteIfPresent(page);
  };

  await page.addLocatorHandler(page.locator('#google_vignette'), dismiss);
  await page.addLocatorHandler(
    page.locator('ins.adsbygoogle[data-vignette-loaded="true"]'),
    dismiss,
  );
  await page.addLocatorHandler(page.locator('iframe[title="Advertisement"]'), dismiss);
  await page.addLocatorHandler(page.locator('iframe[aria-label="Advertisement"]'), dismiss);
}
