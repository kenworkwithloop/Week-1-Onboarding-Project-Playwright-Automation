# Week 1 Onboarding — Playwright Automation (AutomationExercise)

End-to-end UI tests and API tests against [Automation Exercise](https://automationexercise.com/), using TypeScript, Page Object Model (POM), and Playwright’s `request` API.

## Prerequisites

- Node.js 20+ recommended
- Network access to `https://automationexercise.com` (third-party site; occasional maintenance or rate limits can cause flakes)

## Setup

```bash
npm install
npm run install:browsers
```

If Playwright cannot find browser binaries (for example after cloning on a new machine), run `npm run install:browsers` again. Some environments set `PLAYWRIGHT_BROWSERS_PATH`; if installs land in an unexpected cache, unset it for one run: `PLAYWRIGHT_BROWSERS_PATH= npx playwright install`.

Optional: override the site origin (defaults to `https://automationexercise.com`):

```bash
export BASE_URL=https://automationexercise.com
```

## Run tests

```bash
npm test                    # API + UI (Chromium, Firefox, WebKit, plus chromium-authenticated if specs exist)
npm run test:api            # API only (still runs global setup that prepares auth storage)
npm run test:ui             # All UI projects
npm run test:headed         # All tests headed
npm run test:debug          # Playwright inspector
npm run test:playwright-ui  # Interactive Playwright UI mode
npm run codegen             # Record locators against the live site
```

Target a single project or file:

```bash
npx playwright test --project=chromium
npx playwright test tests/ui/Home.spec.ts
npx playwright test --project=api
```

## Layout

| Path | Purpose |
|------|---------|
| [src/constants.ts](src/constants.ts) | `UI_BASE_URL` from `BASE_URL` (trailing slash stripped); used by Playwright `baseURL` |
| [src/pages/](src/pages/) | Page objects — UI interactions and route expectations (`PageRouts`, `CheckoutPage`, `PaymentPage`, etc.) |
| [src/api/API.ts](src/api/API.ts) | `AutomationExerciseClient` — typed helpers for public REST endpoints |
| [src/fixtures/api.fixture.ts](src/fixtures/api.fixture.ts) | Base `test` with `aeApi` (`AutomationExerciseClient` over Playwright `request`) |
| [src/fixtures/ui.fixture.ts](src/fixtures/ui.fixture.ts) | UI `test` / `expect`; wraps `page` with Google ad mitigation ([installGoogleAdMitigation](src/helpers/installGoogleAdMitigation.ts)) |
| [src/helpers/](src/helpers/) | `userFactory`, API assertion helpers, ad overlay handling (`dismissGoogleVignette`, route blocking), navigation recovery |
| [tests/ui/](tests/ui/) | Browser workflows (POM in specs) |
| [tests/api/](tests/api/) | API-only specs, asserting JSON `responseCode` and payloads |
| [global-setup.ts](global-setup.ts) | Creates a user via API, logs in once in the browser, writes `.auth/user.json` for the `chromium-authenticated` project |

The UI uses `data-qa` attributes for stable hooks; Playwright is configured with `testIdAttribute: 'data-qa'` so `getByTestId('login-email')` maps to `data-qa="login-email"`.

Authenticated UI specs live under `tests/ui/authenticated/` (see `chromium-authenticated` in [playwright.config.ts](playwright.config.ts)). Until specs exist there, that project simply matches nothing; global setup still produces `.auth/user.json` for future use.

## Extending the suite

1. **New page**: add a class under `src/pages/` with locators (`getByRole`, `getByTestId`, etc.) and actions. Avoid raw CSS unless necessary; do not use `waitForTimeout`.
2. **New UI spec**: import `test` / `expect` from [src/fixtures/ui.fixture.ts](src/fixtures/ui.fixture.ts). For one-off accounts, use [buildNewUserPayload](src/helpers/userFactory.ts) with `SignupLoginPage` (or the API client) the same way existing specs do.
3. **New API coverage**: import `test` / `expect` from [src/fixtures/api.fixture.ts](src/fixtures/api.fixture.ts). Add methods to `AutomationExerciseClient` in [src/api/API.ts](src/api/API.ts) and assertions in `tests/api/`. Prefer checks on `responseCode` and message/body fields; HTTP status may be `200` while the JSON envelope carries `405` / `404` / `400` for some scenarios.

## Notes

- **Global setup** runs before any project and seeds `.auth/user.json` for logged-in flows. It uses its own disposable user via the public API.
- **AutomationExercise API** sometimes returns HTML “heavy load” pages instead of JSON; `AutomationExerciseClient` parses JSON strictly and throws a short, readable error when the body is not JSON. CI enables Playwright retries (see [playwright.config.ts](playwright.config.ts)); for flaky local API runs, try `npx playwright test --project=api --retries=3`.
- **Google ads / vignette overlays**: UI tests install request blocking for common ad hosts plus locator handlers to dismiss overlays before actions, so page objects stay focused on the app.
