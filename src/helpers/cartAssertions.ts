import { expect, type Page } from '@playwright/test';
import { CartPage } from '../pages/cart-page';

export async function expectCartContainsProduct(
  page: Page,
  productName: string | RegExp,
): Promise<void> {
  const cart = new CartPage(page);
  const byRow = cart.productRow(productName);
  if ((await byRow.count()) > 0) {
    await expect(byRow).toBeVisible();
    return;
  }
  await expect(cart.lineItem(productName)).toBeVisible();
}
