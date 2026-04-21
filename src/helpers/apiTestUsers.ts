import { expect } from '@playwright/test';
import type { AutomationExerciseClient } from '../api/API';
import type { CreateUserPayload } from './userFactory';
import { buildNewUserPayload } from './userFactory';

export async function withDisposableUser(
  client: AutomationExerciseClient,
  fn: (user: CreateUserPayload) => Promise<void>,
  workerIndex = 0,
): Promise<void> {
  const user = buildNewUserPayload(workerIndex);
  const created = await client.createAccount(user);
  expect(created.body.responseCode).toBe(201);
  try {
    await fn(user);
  } finally {
    const deleted = await client.deleteAccount({
      email: user.email,
      password: user.password,
    });
    expect([200, 404]).toContain(deleted.body.responseCode);
  }
}
