import { expect, type Page } from '@playwright/test';

export async function isBootstrapCartModalOpen(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const el = document.querySelector('#cartModal') as HTMLElement | null;
    if (!el) return false;
    if (el.classList.contains('in') || el.classList.contains('show')) return true;
    if (el.getAttribute('aria-hidden') === 'false') return true;
    return document.body.classList.contains('modal-open');
  });
}

export async function waitForBootstrapCartModalOpen(
  page: Page,
  timeout = 20_000,
): Promise<void> {
  await expect.poll(async () => isBootstrapCartModalOpen(page), { timeout }).toBeTruthy();
}

export async function waitForBootstrapCartModalClosed(
  page: Page,
  timeout = 15_000,
): Promise<void> {
  await expect.poll(async () => !(await isBootstrapCartModalOpen(page)), { timeout }).toBeTruthy();
}
