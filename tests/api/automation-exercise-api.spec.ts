/**
 * Read-only API checks run without extra describe-level retries so failures surface quickly.
 * Account-creation flows are grouped in a nested describe with retries=3 for transient HTML overload
 * responses instead of JSON. For local runs against a flaky site, use
 * `npx playwright test --project=api --retries=3`.
 */
import { expectAeResponse } from '../../src/helpers/automationExerciseAssertions';
import { withDisposableUser } from '../../src/helpers/apiTestUsers';
import { buildNewUserPayload } from '../../src/helpers/userFactory';
import { test, expect } from './api.fixture';

test.describe('AutomationExercise API', () => {
  test('returns products with success responseCode and non-empty list', async ({ aeApi }) => {
    const { response, body } = await aeApi.getProductsList();
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.products?.length).toBeGreaterThan(0);
    expect(body.products?.[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      brand: expect.any(String),
    });
  });

  test('rejects POST to products list with documented message', async ({ aeApi }) => {
    const { response, body } = await aeApi.postProductsList();
    expectAeResponse(response, body, {
      httpStatuses: [200, 405],
      responseCode: 405,
      message: /not supported/i,
    });
  });

  test('returns brands with populated list', async ({ aeApi }) => {
    const { response, body } = await aeApi.getBrandsList();
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.brands?.length).toBeGreaterThan(0);
    expect(body.brands?.[0]).toMatchObject({
      id: expect.any(Number),
      brand: expect.any(String),
    });
  });

  test('rejects PUT to brands list', async ({ aeApi }) => {
    const { response, body } = await aeApi.putBrandsList();
    expectAeResponse(response, body, {
      httpStatuses: [200, 405],
      responseCode: 405,
      message: /not supported/i,
    });
  });

  test('search returns matching products for valid term', async ({ aeApi }) => {
    const { response, body } = await aeApi.searchProduct('top');
    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.products?.length).toBeGreaterThan(0);
    expect(body.products?.some((p) => /top/i.test(p.name))).toBeTruthy();
  });

  test('search without parameter returns 400 and message', async ({ aeApi }) => {
    const { response, body } = await aeApi.searchProduct(undefined);
    expectAeResponse(response, body, {
      httpStatuses: [200, 400],
      responseCode: 400,
      message: /search_product/i,
    });
  });

  test('verify login without email returns 400', async ({ aeApi }) => {
    const { response, body } = await aeApi.verifyLogin({ password: 'x' });
    expectAeResponse(response, body, {
      httpStatuses: [200, 400],
      responseCode: 400,
      message: /email or password parameter is missing/i,
    });
  });

  test('verify login with invalid credentials returns 404', async ({ aeApi }) => {
    const { response, body } = await aeApi.verifyLogin({
      email: 'not_registered@example.com',
      password: 'wrongpassword',
    });
    expectAeResponse(response, body, {
      httpStatuses: [200, 404],
      responseCode: 404,
      message: /not found/i,
    });
  });

  test('DELETE verify login is not allowed', async ({ aeApi }) => {
    const { response, body } = await aeApi.deleteVerifyLogin();
    expectAeResponse(response, body, {
      httpStatuses: [200, 405],
      responseCode: 405,
      message: /not supported/i,
    });
  });

  test.describe('account flows (retries for HTML overload instead of JSON)', () => {
    test.describe.configure({ retries: 3 });

    test('verify login succeeds for valid user', async ({ aeApi }, testInfo) => {
      await withDisposableUser(
        aeApi,
        async (user) => {
          const login = await aeApi.verifyLogin({
            email: user.email,
            password: user.password,
          });
          expect(login.response.status()).toBe(200);
          expect(login.body.responseCode).toBe(200);
          expect(login.body.message).toMatch(/exists/i);
        },
        testInfo.workerIndex,
      );
    });

    test('get user detail by email returns user payload', async ({ aeApi }, testInfo) => {
      await withDisposableUser(
        aeApi,
        async (user) => {
          const detail = await aeApi.getUserDetailByEmail(user.email);
          expect(detail.response.status()).toBe(200);
          expect(detail.body.responseCode).toBe(200);
          expect(detail.body.user).toMatchObject({
            email: user.email,
            name: user.name,
          });
        },
        testInfo.workerIndex,
      );
    });

    test('account lifecycle: create, update, get detail, delete (APIs 11–14)', async ({
      aeApi,
    }, testInfo) => {
      const user = buildNewUserPayload(testInfo.workerIndex);
      try {
        const created = await aeApi.createAccount(user);
        expect(created.response.status()).toBe(200);
        expect(created.body.responseCode).toBe(201);
        expect(created.body.message).toMatch(/User created!/i);

        const updatedPayload = { ...user, city: 'UpdatedCity' };
        const updated = await aeApi.updateAccount(updatedPayload);
        expect(updated.response.status()).toBe(200);
        expect(updated.body.responseCode).toBe(200);
        expect(updated.body.message).toMatch(/User updated!/i);

        const detail = await aeApi.getUserDetailByEmail(user.email);
        expect(detail.response.status()).toBe(200);
        expect(detail.body.responseCode).toBe(200);
        expect(detail.body.user).toMatchObject({
          email: user.email,
          name: user.name,
          city: 'UpdatedCity',
        });

        const deleted = await aeApi.deleteAccount({
          email: user.email,
          password: user.password,
        });
        expect(deleted.response.status()).toBe(200);
        expect(deleted.body.responseCode).toBe(200);
        expect(deleted.body.message).toMatch(/Account deleted!/i);
      } finally {
        const cleanup = await aeApi.deleteAccount({
          email: user.email,
          password: user.password,
        });
        expect([200, 404]).toContain(cleanup.body.responseCode);
      }
    });

    test('create account rejects duplicate email (API contract)', async ({ aeApi }, testInfo) => {
      const user = buildNewUserPayload(testInfo.workerIndex);
      const first = await aeApi.createAccount(user);
      expect(first.body.responseCode).toBe(201);
      try {
        const second = await aeApi.createAccount(user);
        expect(second.response.status()).toBe(200);
        expect(second.body.responseCode).toBe(400);
        expect(second.body.message).toMatch(/email already exists/i);
      } finally {
        const cleanup = await aeApi.deleteAccount({
          email: user.email,
          password: user.password,
        });
        expect([200, 404]).toContain(cleanup.body.responseCode);
      }
    });
  });
});
