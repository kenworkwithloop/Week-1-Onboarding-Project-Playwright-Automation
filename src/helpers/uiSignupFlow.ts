import type { AccountCreationPage } from '../pages/account-creation-page';
import type { HomePage } from '../pages/home-page';
import type { LoginPage } from '../pages/login-page';
import type { SignupPage } from '../pages/signup-page';
import type { CreateUserPayload } from './userFactory';

export async function completeUiSignupFromLoginPage(params: {
  home: HomePage;
  signup: SignupPage;
  accountCreation: AccountCreationPage;
  login: LoginPage;
  user: CreateUserPayload;
  options?: { newsletter?: boolean; optin?: boolean };
}): Promise<void> {
  const { home, signup, accountCreation, login, user, options } = params;
  await home.goto();
  await home.openLogin();
  await signup.expectNewUserSignupVisible();
  await signup.submitInitialSignup(user.name, user.email);
  await accountCreation.expectEnterAccountInformationVisible();
  await accountCreation.fillFromPayload(user, options);
  await accountCreation.submitCreateAccount();
  await accountCreation.expectAccountCreated();
  await accountCreation.clickContinueFromAccountCreated();
  await login.expectLoggedIn(user.name);
}
