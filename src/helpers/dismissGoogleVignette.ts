import { expect, type Page } from '@playwright/test';

/**
 * Google / AdSense can block interactions via:
 * - URL containing `google_vignette` (interstitial navigation)
 * - `#google_vignette` overlay in the DOM
 * - Large `ins.adsbygoogle` slots with `data-vignette-loaded` (in-page vignette; URL may stay on automationexercise.com)
 */
async function isGoogleVignetteOrBlockingAdOverlay(page: Page): Promise<boolean> {
  let url = '';
  try {
    url = page.url().toLowerCase();
  } catch {
    return false;
  }
  if (url.includes('google_vignette')) return true;

  try {
    return await page.evaluate(() => {
      const vignette = document.querySelector('#google_vignette') as HTMLElement | null;
      if (vignette) {
        const s = getComputedStyle(vignette);
        if (s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0') return true;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const coversMeaningfulViewport = (r: DOMRect) =>
        r.width > vw * 0.35 && r.height > vh * 0.22;

      const slots = document.querySelectorAll('ins.adsbygoogle[data-vignette-loaded="true"]');
      for (const node of slots) {
        const el = node as HTMLElement;
        const r = el.getBoundingClientRect();
        if (coversMeaningfulViewport(r)) return true;
      }

      const adFrames = document.querySelectorAll(
        [
          'iframe[title="Advertisement"]',
          'iframe[aria-label="Advertisement"]',
          'iframe[src*="googlesyndication"]',
          'iframe[src*="doubleclick"]',
          'iframe[name^="aswift_"]',
          'iframe[id^="aswift_"]',
        ].join(', '),
      );
      for (const node of adFrames) {
        const r = (node as HTMLElement).getBoundingClientRect();
        if (coversMeaningfulViewport(r)) return true;
      }

      return false;
    });
  } catch {
    // Navigation / frame swap can destroy the context while we probe the DOM (e.g. after category link click).
    return false;
  }
}

export async function dismissGoogleVignetteIfPresent(page: Page): Promise<void> {
  if (!(await isGoogleVignetteOrBlockingAdOverlay(page))) return;

  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Escape');
  }

  const urlHasVignette = () => page.url().toLowerCase().includes('google_vignette');
  if (urlHasVignette()) {
    await page
      .waitForURL((u) => !u.toString().toLowerCase().includes('google_vignette'), { timeout: 12_000 })
      .catch(() => {});
  }

  await expect
    .poll(async () => !(await isGoogleVignetteOrBlockingAdOverlay(page)), { timeout: 8000 })
    .toBeTruthy()
    .catch(() => {});
}

/**
 * WebKit often shows the vignette / full-page ad **after** add-to-cart, on top of `#cartModal`.
 * Poll and dismiss so the cart modal is reachable for assertions.
 */
export async function dismissGoogleAdOverlayAfterInteraction(page: Page): Promise<void> {
  await expect
    .poll(
      async () => {
        if (!(await isGoogleVignetteOrBlockingAdOverlay(page))) return true;
        for (let i = 0; i < 3; i++) {
          await page.keyboard.press('Escape');
        }
        if (page.url().toLowerCase().includes('google_vignette')) {
          await page
            .waitForURL((u) => !u.toString().toLowerCase().includes('google_vignette'), { timeout: 6000 })
            .catch(() => {});
        }
        return !(await isGoogleVignetteOrBlockingAdOverlay(page));
      },
      { timeout: 12_000 },
    )
    .toBeTruthy()
    .catch(() => {});
}
