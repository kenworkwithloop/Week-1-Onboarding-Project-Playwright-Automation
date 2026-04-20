import { expectAeResponse } from '../../src/helpers/automationExerciseAssertions';
import { withDisposableUser } from '../../src/helpers/apiTestUsers';
import { test, expect } from './api.fixture';

test.describe.configure({ retries: 3 });

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
});
