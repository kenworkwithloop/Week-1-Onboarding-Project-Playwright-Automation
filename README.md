# Week 1 Onboarding — Playwright Automation (AutomationExercise)

End-to-end UI tests, API tests, and accessibility smoke checks against [Automation Exercise](https://automationexercise.com/), using TypeScript, Page Object Model (POM), and Playwright’s `request` API.

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
npm test                    # API + all UI projects (Chromium, Firefox, WebKit, authenticated)
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
npx playwright test tests/ui/login.spec.ts
npx playwright test --project=api
```

## Layout

| Path | Purpose |
|------|---------|
| [src/constants.ts](src/constants.ts) | `UI_BASE_URL` from `BASE_URL` (trailing slash stripped); used by Playwright `baseURL` |
| [src/pages/](src/pages/) | Page objects — all UI interactions |
| [src/api/automationExerciseClient.ts](src/api/automationExerciseClient.ts) | Typed helpers for public REST endpoints |
| [src/fixtures/aeApi.fixture.ts](src/fixtures/aeApi.fixture.ts) | Base `test` with `aeApi` (`AutomationExerciseClient` over Playwright `request`) |
| [src/fixtures/test.ts](src/fixtures/test.ts) | Extends the AE API fixture with `testUser` (API create + delete), page objects including `productDetail`, and other app fixtures |
| [tests/api/api.fixture.ts](tests/api/api.fixture.ts) | Re-exports the lightweight fixture for API specs (`aeApi` only) |
| [src/helpers/](src/helpers/) | User factory, cart assertions, Bootstrap cart modal helpers, API assertion helpers, accessibility smoke utilities |
| [tests/ui/](tests/ui/) | Browser workflows (POM only in specs) |
| [tests/api/](tests/api/) | API-only specs, asserting JSON `responseCode` and payloads |
| [global-setup.ts](global-setup.ts) | Creates a user via API, logs in once in the browser, writes `.auth/user.json` for the `chromium-authenticated` project |

The UI uses `data-qa` attributes for stable hooks; Playwright is configured with `testIdAttribute: 'data-qa'` so `getByTestId('login-email')` maps to `data-qa="login-email"`.

## Extending the suite

1. **New page**: add a class under `src/pages/` with locators (`getByRole`, `getByTestId`, etc.) and actions. Avoid raw CSS unless necessary; do not use `waitForTimeout`.
2. **New UI spec**: import `test` / `expect` from [src/fixtures/test.ts](src/fixtures/test.ts). Pass `testUser` into the test only when you need an isolated account (fixture creates and deletes the user via API).
3. **New API coverage**: import `test` / `expect` from [tests/api/api.fixture.ts](tests/api/api.fixture.ts) (or from [src/fixtures/aeApi.fixture.ts](src/fixtures/aeApi.fixture.ts) if the spec lives outside `tests/api/`). Add methods to `AutomationExerciseClient` and assertions in `tests/api/`. Prefer checks on `responseCode` and message/body fields; HTTP status may be `200` while the JSON envelope carries `405` / `404` / `400` for some scenarios.

## Notes

- **Global setup** runs before any project and seeds `.auth/user.json`. Do not delete that account from tests that rely on `chromium-authenticated`.
- **AutomationExercise API** sometimes returns HTML “heavy load” pages instead of JSON; API tests use retries and strict JSON parsing with clear errors when the site is overloaded. For flaky local API runs, try `npx playwright test --project=api --retries=3`.
- **Accessibility** tests run on Chromium only and flag `critical` / `serious` axe issues on a narrow subset of the DOM (`#header`, hero `#slider` or product listing), with `color-contrast` disabled and carousel controls excluded—this is a **smoke** signal on a third-party demo site, not a full WCAG audit.
- **Google ad overlays** sometimes hijack the first navigation click (`#google_vignette`). `HomePage` falls back to `goto` after `Escape` so flows stay reliable without `waitForTimeout`.
