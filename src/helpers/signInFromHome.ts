import type { HomePage } from '../pages/home-page';
import type { LoginPage } from '../pages/login-page';

export async function signInFromHome(
  home: HomePage,
  login: LoginPage,
  email: string,
  password: string,
): Promise<void> {
  await home.goto();
  await home.openLogin();
  await login.login(email, password);
}
