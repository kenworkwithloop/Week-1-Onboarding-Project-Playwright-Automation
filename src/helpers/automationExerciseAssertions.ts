import { expect, type APIResponse } from '@playwright/test';

type MessageLike = {
  responseCode: number;
  message?: string;
};

export function expectAeResponse(
  response: APIResponse,
  body: MessageLike,
  options: {
    responseCode: number;
    httpStatuses?: readonly number[];
    message?: RegExp;
  },
): void {
  if (options.httpStatuses !== undefined) {
    expect(options.httpStatuses).toContain(response.status());
  } else {
    expect(response.status()).toBe(200);
  }
  expect(body.responseCode).toBe(options.responseCode);
  if (options.message !== undefined) {
    expect(body.message).toMatch(options.message);
  }
}
