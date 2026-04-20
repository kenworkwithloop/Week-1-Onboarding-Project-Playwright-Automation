import { test, expect } from '@playwright/test';
import { AutomationExerciseClient } from '../../src/api/automationExerciseClient';
import { buildNewUserPayload } from '../../src/helpers/userFactory';

test.describe.configure({ retries: 3 });

test.describe('AutomationExercise API', () => {
  test('returns products with success responseCode and non-empty list', async ({
    request,
  }) => {
    const client = new AutomationExerciseClient(request);
    const { response, body } = await client.getProductsList();
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.products?.length).toBeGreaterThan(0);
    expect(body.products?.[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      brand: expect.any(String),
    });
  });

  test('rejects POST to products list with documented message', async ({
    request,
  }) => {
    const client = new AutomationExerciseClient(request);
    const { response, body } = await client.postProductsList();
    expect([200, 405]).toContain(response.status());
    expect(body.responseCode).toBe(405);
    expect(body.message).toMatch(/not supported/i);
  });

  test('returns brands with populated list', async ({ request }) => {
    const client = new AutomationExerciseClient(request);
    const { response, body } = await client.getBrandsList();
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.brands?.length).toBeGreaterThan(0);
    expect(body.brands?.[0]).toMatchObject({
      id: expect.any(Number),
      brand: expect.any(String),
    });
  });

  test('rejects PUT to brands list', async ({ request }) => {
    const client = new AutomationExerciseClient(request);
    const { response, body } = await client.putBrandsList();
    expect([200, 405]).toContain(response.status());
    expect(body.responseCode).toBe(405);
    expect(body.message).toMatch(/not supported/i);
  });

  test('search returns matching products for valid term', async ({ request }) => {
    const client = new AutomationExerciseClient(request);
    const { response, body } = await client.searchProduct('top');
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.products?.length).toBeGreaterThan(0);
    expect(body.products?.some((p) => /top/i.test(p.name))).toBeTruthy();
  });

  test('search without parameter returns 400 and message', async ({ request }) => {
    const client = new AutomationExerciseClient(request);
    const { response, body } = await client.searchProduct(undefined);
    expect([200, 400]).toContain(response.status());
    expect(body.responseCode).toBe(400);
    expect(body.message).toMatch(/search_product/i);
  });

  test('verify login succeeds for valid user', async ({ request }) => {
    const client = new AutomationExerciseClient(request);
    const user = buildNewUserPayload();
    const created = await client.createAccount(user);
    expect(created.body.responseCode).toBe(201);

    const login = await client.verifyLogin({
      email: user.email,
      password: user.password,
    });
    expect(login.response.status()).toBe(200);
    expect(login.body.responseCode).toBe(200);
    expect(login.body.message).toMatch(/exists/i);

    const deleted = await client.deleteAccount({
      email: user.email,
      password: user.password,
    });
    expect(deleted.body.responseCode).toBe(200);
  });

  test('verify login without email returns 400', async ({ request }) => {
    const client = new AutomationExerciseClient(request);
    const { response, body } = await client.verifyLogin({ password: 'x' });
    expect([200, 400]).toContain(response.status());
    expect(body.responseCode).toBe(400);
    expect(body.message).toMatch(/email or password parameter is missing/i);
  });

  test('verify login with invalid credentials returns 404', async ({
    request,
  }) => {
    const client = new AutomationExerciseClient(request);
    const { response, body } = await client.verifyLogin({
      email: 'not_registered@example.com',
      password: 'wrongpassword',
    });
    expect([200, 404]).toContain(response.status());
    expect(body.responseCode).toBe(404);
    expect(body.message).toMatch(/not found/i);
  });

  test('DELETE verify login is not allowed', async ({ request }) => {
    const client = new AutomationExerciseClient(request);
    const { response, body } = await client.deleteVerifyLogin();
    expect([200, 405]).toContain(response.status());
    expect(body.responseCode).toBe(405);
    expect(body.message).toMatch(/not supported/i);
  });

  test('get user detail by email returns user payload', async ({ request }) => {
    const client = new AutomationExerciseClient(request);
    const user = buildNewUserPayload();
    const created = await client.createAccount(user);
    expect(created.body.responseCode).toBe(201);

    const detail = await client.getUserDetailByEmail(user.email);
    expect(detail.response.status()).toBe(200);
    expect(detail.body.responseCode).toBe(200);
    expect(detail.body.user).toMatchObject({
      email: user.email,
      name: user.name,
    });

    await client.deleteAccount({ email: user.email, password: user.password });
  });
});
