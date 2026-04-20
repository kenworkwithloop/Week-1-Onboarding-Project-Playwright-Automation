import { test, expect } from '../../src/fixtures/test';
import { buildNewUserPayload, uniqueEmail } from '../../src/helpers/userFactory';
import { signInFromHome } from '../../src/helpers/signInFromHome';

test.describe.configure({ retries: 2 });

test.describe('AutomationExercise official scenarios — auth (TC1–TC5)', () => {
  test('TC1: Register User (UI signup, newsletters, delete account)', async ({
    page,
    home,
    signup,
    accountCreation,
    login,
  }) => {
    const user = buildNewUserPayload();
    user.email = uniqueEmail();

    await home.goto();
    await home.openLogin();
    await signup.expectNewUserSignupVisible();
    await signup.submitInitialSignup(user.name, user.email);
    await accountCreation.expectEnterAccountInformationVisible();
    await accountCreation.fillFromPayload(user, { newsletter: true, optin: true });
    await accountCreation.submitCreateAccount();
    await accountCreation.expectAccountCreated();
    await accountCreation.clickContinueFromAccountCreated();
    await login.expectLoggedIn(user.name);
    await login.deleteAccountFromHeader();
    await accountCreation.expectAccountDeleted();
    await accountCreation.clickContinueFromAccountDeleted();
    await expect(page).toHaveURL('/');
  });

  test('TC2: Login User with correct email and password (then delete account)', async ({
    home,
    login,
    accountCreation,
    testUser,
  }) => {
    await signInFromHome(home, login, testUser.email, testUser.password);
    await login.expectLoggedIn(testUser.name);
    await login.deleteAccountFromHeader();
    await accountCreation.expectAccountDeleted();
    await accountCreation.clickContinueFromAccountDeleted();
  });

  test('TC3: Login User with incorrect email and password', async ({ home, login }) => {
    await home.goto();
    await home.openLogin();
    await login.login('not_a_real_user@example.com', 'wrong-password');
    await login.expectIncorrectCredentialsMessage();
  });

  test('TC4: Logout User', async ({ page, home, login, testUser }) => {
    await signInFromHome(home, login, testUser.email, testUser.password);
    await login.expectLoggedIn(testUser.name);
    await login.logout();
    await expect(page).toHaveURL(/\/login/);
    await login.expectLoginFormVisible();
  });

  test('TC5: Register User with existing email', async ({ aeApi, home, signup }, testInfo) => {
    const user = buildNewUserPayload(testInfo.workerIndex);
    const created = await aeApi.createAccount(user);
    expect(created.body.responseCode).toBe(201);

    await home.goto();
    await home.openLogin();
    await signup.expectNewUserSignupVisible();
    await signup.submitInitialSignup(user.name, user.email);
    await signup.expectEmailAlreadyExistsMessage();

    const deleted = await aeApi.deleteAccount({ email: user.email, password: user.password });
    expect([200, 404]).toContain(deleted.body.responseCode);
  });
});
