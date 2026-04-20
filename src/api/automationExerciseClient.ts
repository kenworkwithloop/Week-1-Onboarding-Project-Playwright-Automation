import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { CreateUserPayload } from '../helpers/userFactory';
import { payloadToFormRecord } from '../helpers/userFactory';

async function readJson<T>(response: APIResponse): Promise<T> {
  const text = await response.text();
  const trimmed = text.trimStart();
  if (!trimmed.startsWith('{')) {
    throw new Error(
      `AutomationExercise API returned non-JSON (HTTP ${response.status()}): ${text.slice(0, 200)}`,
    );
  }
  return JSON.parse(text) as T;
}

export type ProductsListBody = {
  responseCode: number;
  products?: Array<{ id: number; name: string; price: string; brand: string }>;
};

export type BrandsListBody = {
  responseCode: number;
  brands?: Array<{ id: number; brand: string }>;
};

export type MessageBody = {
  responseCode: number;
  message?: string;
};

export type SearchProductBody = ProductsListBody;

export type VerifyLoginBody = MessageBody & {
  user?: { email: string };
};

export type GetUserDetailBody = {
  responseCode: number;
  user?: Record<string, unknown>;
};

export class AutomationExerciseClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProductsList(): Promise<{ response: APIResponse; body: ProductsListBody }> {
    const response = await this.request.get('/api/productsList');
    const body = await readJson<ProductsListBody>(response);
    return { response, body };
  }

  async postProductsList(): Promise<{ response: APIResponse; body: MessageBody }> {
    const response = await this.request.post('/api/productsList');
    const body = await readJson<MessageBody>(response);
    return { response, body };
  }

  async getBrandsList(): Promise<{ response: APIResponse; body: BrandsListBody }> {
    const response = await this.request.get('/api/brandsList');
    const body = await readJson<BrandsListBody>(response);
    return { response, body };
  }

  async putBrandsList(): Promise<{ response: APIResponse; body: MessageBody }> {
    const response = await this.request.put('/api/brandsList');
    const body = await readJson<MessageBody>(response);
    return { response, body };
  }

  async searchProduct(
    searchProduct: string | undefined,
  ): Promise<{ response: APIResponse; body: SearchProductBody }> {
    const response = await this.request.post('/api/searchProduct', {
      form: searchProduct === undefined ? {} : { search_product: searchProduct },
    });
    const body = await readJson<SearchProductBody>(response);
    return { response, body };
  }

  async verifyLogin(params: {
    email?: string;
    password?: string;
  }): Promise<{ response: APIResponse; body: VerifyLoginBody }> {
    const form: Record<string, string> = {};
    if (params.email !== undefined) form.email = params.email;
    if (params.password !== undefined) form.password = params.password;
    const response = await this.request.post('/api/verifyLogin', { form });
    const body = await readJson<VerifyLoginBody>(response);
    return { response, body };
  }

  async deleteVerifyLogin(): Promise<{ response: APIResponse; body: MessageBody }> {
    const response = await this.request.delete('/api/verifyLogin');
    const body = await readJson<MessageBody>(response);
    return { response, body };
  }

  async createAccount(
    payload: CreateUserPayload,
  ): Promise<{ response: APIResponse; body: MessageBody }> {
    const response = await this.request.post('/api/createAccount', {
      form: payloadToFormRecord(payload),
    });
    const body = await readJson<MessageBody>(response);
    return { response, body };
  }

  async deleteAccount(params: {
    email: string;
    password: string;
  }): Promise<{ response: APIResponse; body: MessageBody }> {
    const response = await this.request.delete('/api/deleteAccount', {
      form: { email: params.email, password: params.password },
    });
    const body = await readJson<MessageBody>(response);
    return { response, body };
  }

  async getUserDetailByEmail(
    email: string,
  ): Promise<{ response: APIResponse; body: GetUserDetailBody }> {
    const response = await this.request.get('/api/getUserDetailByEmail', {
      params: { email },
    });
    const body = await readJson<GetUserDetailBody>(response);
    return { response, body };
  }
}
