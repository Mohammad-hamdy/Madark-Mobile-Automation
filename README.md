# Madark Mobile Automation

End-to-end regression suite for the Madark customer app (Flutter), built with **WebdriverIO 8 + Appium 2 + Mocha + TypeScript**. One suite runs on Android and iOS, locally or on BrowserStack. It defaults to the **Dev** environment with **request encryption on**.

The app code is never modified. The framework reads the app source from a read-only `git archive` snapshot.

## Quick start

```bash
npm install
cp .env.example .env.local          # fill in E2E_CUSTOMER_PHONE / E2E_CUSTOMER_OTP and BrowserStack keys
npm run generate                    # snapshot app -> scan -> import ADO suite -> verify locators
npm run verify:crypto               # local check of the AES-GCM + RSA-OAEP request format
npm run verify:api                  # encrypted login against Dev (needs .env.local)
npm run test:bs:smoke               # smoke tests on BrowserStack
npm run allure:report
```

Local Appium (requires Android SDK + emulator):

```bash
npm run appium:install-drivers && npm run appium     # in one terminal
npx cross-env E2E_TARGET=local ANDROID_APP_PATH=../madark-ai-runner/apps/madark-qa.apk npm run test:smoke
```

## Mobile repo is read-only

The local clone `repos/Madarak-UserApp/Madarak-UserApp` is used only as a source to read, and it is locked:

- `.git/hooks/pre-commit`, `prepare-commit-msg`, `pre-merge-commit`, `pre-rebase`, `pre-applypatch` and `pre-push` all exit 1. `prepare-commit-msg` still runs under `git commit --no-verify`.
- The push URL is set to `READ-ONLY-push-disabled`, so `git push` fails even with `--no-verify`.
- `git fetch` still works, so `npm run snapshot` can export new commits with `git archive`. Nothing is ever checked out or written to the working tree.

To undo (only if you really need to commit from this clone):

```bash
cd repos/Madarak-UserApp/Madarak-UserApp
rm .git/hooks/pre-commit .git/hooks/prepare-commit-msg .git/hooks/pre-merge-commit .git/hooks/pre-rebase .git/hooks/pre-applypatch .git/hooks/pre-push
git remote set-url --push origin https://dev.azure.com/Madark/Madarak-UserApp/_git/Madarak-UserApp
git config --unset readonly.reason
```

## Run switches

| Variable | Values | Default |
|---|---|---|
| `E2E_ENV` | `dev`, `preprod` | `dev` |
| `E2E_ENCRYPTION` | `true`, `false` | `true` |
| `E2E_LANG` | `en`, `ar` | `en` |
| `PLATFORM` | `android`, `ios` | `android` |
| `E2E_TARGET` | `local`, `browserstack` | `local` |
| `E2E_TAGS` | comma list, all must match: `smoke`, `p0`, `signIn`, `Negative`, `11874` … | none |

Every session checks the login screen's QA pickers and selects **Environment = `E2E_ENV`** and **Encryption = `E2E_ENCRYPTION`**. It reads both values back and fails fast if they don't match. This needs the **QA flavor** build (`com.madark.institution.qa`).

## How it is built

```
scripts/snapshot-app.ts   git archive APP_REF (default origin/new_design_kinan) -> .app-snapshot/<sha>
scripts/scan-app.ts       -> generated/app-map.json, i18n/{en,ar}.json, i18n-usage.json, literals.json, server-public-key.pem
scripts/import-suite.ts   ADO JSON -> generated/suite.json + specs/<module>/<module>.spec.ts (append-only)
scripts/verify-locators.ts  every page key exists in EN+AR and is used in the scanned app; lists known gaps
pages/                    one class per screen; private inline locators; one Allure step per method
api/                      encrypted ApiClient, builders, services, workflows (preconditions)
utils/app-setup.ts        UI workflows: open login, match language, enforce env/encryption, loginAs
fixtures/test.fixture.ts  test() wrapper: pages, testdata, api, mobile, app injected; tags; ADO link
```

**Encryption.** `api/client.ts` mirrors `app_interceptors.dart`. Each request body is encrypted with a fresh AES-256-GCM key and a 12-byte IV, the key is wrapped with the server RSA key (OAEP-SHA256), and the request is sent as `{encryptedAESKey, encryptedPayload, iv, tag}` with `X-Encrypted: 1`. The `{data, tag, iv}` response is decrypted with the same AES key. The server key is read from the app's `rsa_helper.dart` on each scan.

**Locators** follow this order: Semantics/ValueKey → widget + i18n → hint → visible i18n text (matches EN *and* AR). Text that isn't translated, such as the QA pickers and the language toggle, comes from `generated/literals.json`, which is extracted from DEV. Nothing is invented. When no locator exists, the page uses `missing()` (`cannot-be-located`) or `structural()` (`structural-only`), and the gap is listed in `generated/missing.locator`.

**Test cases.** One ADO work item = one `test('[<ADO id>] <title>', …)`. Steps map 1:1 to page calls, and assertions use `I18n.t`/page checks, never hardcoded text. A case that isn't automated yet stays in its spec as a skipped stub carrying `blocked: '<reason>'` and its ADO link, so all 291 stay traceable. **Re-running `npm run import:suite` never overwrites an implemented test.** To implement a case, replace its stub body and remove `blocked`.

## CI (GitHub Actions)

| Workflow | Runs on | Device |
|---|---|---|
| `android-wdio-tests.yml` | `ubuntu-latest` (KVM) | Android emulator (API 34, google_apis x86_64) + local Appium on the runner |
| `ios-wdio-tests.yml` | `macos-14` | iOS simulator + local Appium (XCUITest); needs a **simulator** `.app` zip, not an `.ipa` |
| `wdio-tests.yml` | any | BrowserStack real devices (`E2E_TARGET=browserstack`) |

Every workflow runs typecheck → `verify:locators` → `verify:crypto` → `verify:api` (encrypted Dev login), then WDIO. Each one uploads a single-file Allure report, the raw results and the Appium logs, even when tests fail.

**Secrets:** `E2E_CUSTOMER_PHONE`, `E2E_CUSTOMER_OTP`, `MOBILE_REPO_TOKEN` (read access to the mobile repo's Actions artifacts), and optionally `APK_URL_TOKEN`. For `wdio-tests.yml`, also `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`.

**App input:** pass the mobile build's `apk_run_id` (artifact `madark-apk-qa`) or a direct `apk_url`. To start the Android run automatically after a QA build, the mobile repo's build workflow can add this step (not added there yet):

```yaml
- name: Trigger automation
  uses: peter-evans/repository-dispatch@v3
  with:
    token: ${{ secrets.AUTOMATION_REPO_TOKEN }}
    repository: Madark/Madark-Mobile-Automation
    event-type: madark-apk-ready
    client-payload: '{"run_id": "${{ github.run_id }}", "artifact": "madark-apk-qa", "tags": "smoke", "lang": "en"}'
```

## Status (snapshot fbb2d4a0, app 1.0.7+83)

| | Cases |
|---|---|
| Implemented | 5: 11834, 11835 (Onboarding) · 11840 (GuestMode) · 11874, 11875 (SignIn) |
| Automatable now, not yet implemented | 148 |
| Need seeded data / mocks (backend state, payment gateway, Nafath) | 128 |
| Manual / device only | 10 |

Not yet run on a device. The first BrowserStack smoke run needs `.env.local`.

## Known issues to resolve with the app team

1. **No accessibility ids.** 0 of 86 screens have a `ValueKey` or `Semantics(identifier:)`. Locators rely on i18n text, and the OTP input is located structurally. Ask for `Semantics(identifier: …)` on interactive widgets, starting with login, OTP, home, request financing and payment.
2. **ADO expected text ≠ app text.** For example, the cases expect "Welcome Back", "Continue" and "Invalid phone number.", while the app shows "Welcome Back,", "Login" and "Mobile number must start with 5". Tests assert the app's i18n. Each difference is either a test-case update or an app bug.
3. **Figma "matches design" cases** (about 92) need visual comparison, which isn't wired yet (`madark-ai-runner/src/visual.ts` can be reused).
4. **Dev OTP.** `User/GetUserOtpDev` is commented out in the app, so OTP comes from `E2E_CUSTOMER_OTP` (the fixed Dev OTP).
5. **Build & upload pipeline** lives in the mobile repo and is not added. It must upload the QA-flavor APK as `madark-apk-qa` (and a simulator `.app` zip as `madark-simulator-qa` for iOS). The repository-dispatch step above is optional.
