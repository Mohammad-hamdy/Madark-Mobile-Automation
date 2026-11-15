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
npx cross-env E2E_TARGET=local ANDROID_APP_PATH=path/to/madark-qa.apk npm run test:smoke
```

## Reference repos are read-only

Everything under `Mobile runner/repos/` is reference material only: the user app, the 16 backend services, the institution portal and the dashboard. The WDIO guideline repo `webdriverIo-flutter-automation-framework-build` (skill and markdown files) is too. They are read to build the scripts and never changed. Each one is locked:

- **No commits:** `pre-commit`, `prepare-commit-msg`, `pre-merge-commit`, `pre-rebase`, `pre-applypatch` and `pre-push` hooks all exit 1. `prepare-commit-msg` still runs under `git commit --no-verify`.
- **No push:** the push URL is `READ-ONLY-push-disabled`, so `git push` fails even with `--no-verify`. The real URL is saved in `git config readonly.pushurl`.
- **No edits:** every tracked file has the read-only attribute.
- **Still readable/updatable:** `.git` stays writable, so `git fetch` and `npm run snapshot` (`git archive`) keep working. Nothing is checked out into the working tree.

Manage the locks with `tools/reference-repos.sh` (Git Bash):

```bash
tools/reference-repos.sh status                  # all reference repos: hooks, push, uncommitted changes
tools/reference-repos.sh lock                    # lock all, e.g. after cloning a new reference repo
tools/reference-repos.sh unlock ../repos/Madarak-UserApp/Madarak-UserApp   # unlock one repo only
```

Updating a reference repo to the latest code still works while it's locked: `git fetch` updates the refs, and `npm run snapshot` exports them. To move the working tree itself (`git pull` or `git checkout`), unlock that repo, update it, and lock it again.

The test cases come from `data/ado/mobile_regression_cases.json` (the Azure DevOps export). The old `madark-ai-runner` (an AI agent on BrowserStack) is no longer used by this framework.

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
config/suite-layout.ts      module (feature) order and screen order → the 01, 02, … numbers
scripts/snapshot-app.ts     git archive APP_REF (default origin/new_design_kinan) -> .app-snapshot/<sha>
scripts/scan-app.ts         -> generated/app-map.json, i18n/{en,ar}.json, i18n-usage.json, literals.json, server-public-key.pem
scripts/gen-pages-index.ts  -> pages/index.ts (every page class, in module order, as a lazy fixture)
scripts/import-suite.ts     ADO JSON -> generated/suite.json + specs/NN-<module>/NN-<module>.spec.ts (rebuild, keeps bodies)
scripts/verify-locators.ts  every page key exists in EN+AR and is used in the scanned app; lists known gaps
pages/NN-<module>/          one class per screen; private inline locators; one Allure step per method
api/                        encrypted ApiClient, builders, services, workflows (preconditions)
utils/app-setup.ts          Given workflows: fresh start, guest, login (+ post-login screen), env/encryption, language, theme, open request/contract …
utils/test-data.ts          `data` fixture: customer, Dev OTP, seeds, generated values, money/discount helpers
utils/visual.ts             `visual` fixture: screenshot vs approved baseline for the "matches Figma" cases
fixtures/test.fixture.ts    test() wrapper: lazy pages + data, visual, app, mobile, api injected; tags; ADO link
```

**Layout (01, 02, …).** Specs and pages follow the customer journey in the app; the order lives in `config/suite-layout.ts`:

| # | Module | # | Module |
|---|---|---|---|
| 01 | Onboarding | 12 | Complete Institution Request |
| 02 | Guest Mode | 13 | Pay With Discount |
| 03 | Registration | 14 | Cancel Request |
| 04 | Sign In | 15 | Payment |
| 05 | Home | 16 | Early Settlement |
| 06 | Institutions | 17 | Withdrawal |
| 07 | Submit Request | 18 | Notifications |
| 08 | Request Validation | 19 | Profile |
| 09 | KYC | 20 | More & Support |
| 10 | Contract Activation | 21 | App States |
| 11 | My Requests | 22 | Theme & Language |

Each module is one spec file `specs/NN-<module>/NN-<module>.spec.ts` (one app session per file) with one `describe('NN · <Screen>')` per screen in screen order. Pages live in the matching `pages/NN-<module>/`; shared pages are in `pages/00-common/`. To reorder modules or screens, edit `config/suite-layout.ts` and run `npm run import:suite`: it rebuilds the files and moves every existing test body unchanged.

**Seeds (backend state).** Cases that need an existing request, loan, institution setup or sandbox card read a named seed: `data.seed('pendingInstitutionRequestDiscount')`. Seeds live in `environment/testdata/<env>/seed.json` (gitignored); copy `environment/testdata/seed.example.json` and fill in real Dev data. A case whose seed (or seed field) is missing is **skipped with the seed name**, never failed or faked. Consumed seeds (`cancellableRequest`, `payableDiscountRequest`, `closableAccount`, `phoneChangeTarget`) must be refreshed after a run.

**Visual checks.** "Matches Figma" cases assert `visual.matchesBaseline('<name>')` and record the Figma inspection as a manual Allure step. Baselines are `baselines/<platform>/<lang>/<WxH>/<name>.png` and should be committed once approved. On the first run a missing baseline is recorded from the screenshot; review it in Allure, then commit it. `E2E_STRICT_VISUAL=1` fails on missing baselines; `npm run visual:update` re-records them all.

**Manual steps.** Steps that cannot be verified from the device (back-office checks, API call counts, Figma inspection, system share sheets) are written as `manualCheck('…')`. This adds a *skipped* Allure step so the case stays 1:1 with ADO and the gap is visible in the report.

**Encryption.** `api/client.ts` mirrors `app_interceptors.dart`. Each request body is encrypted with a fresh AES-256-GCM key and a 12-byte IV, the key is wrapped with the server RSA key (OAEP-SHA256), and the request is sent as `{encryptedAESKey, encryptedPayload, iv, tag}` with `X-Encrypted: 1`. The `{data, tag, iv}` response is decrypted with the same AES key. The server key is read from the app's `rsa_helper.dart` on each scan.

**Locators** follow this order: Semantics/ValueKey → widget + i18n → hint → visible i18n text (matches EN *and* AR). Text that isn't translated, such as the QA pickers and the language toggle, comes from `generated/literals.json`, which is extracted from DEV. Nothing is invented. When no locator exists, the page uses `missing()` (`cannot-be-located`) or `structural()` (`structural-only`), and the gap is listed in `generated/missing.locator`.

**Test cases.** One ADO work item = one `test('[<ADO id>] <title>', …)`. Steps map 1:1 to page calls, and assertions use page checks built on the app's i18n, never hardcoded text. A case that can't run stays in its spec as a skipped test carrying `blocked: '<reason>'` and its ADO link, so all 291 stay traceable. **Re-running `npm run import:suite` never overwrites a test body.**

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

| Status (`generated/suite.json`) | Cases | Meaning |
|---|---|---|
| `ready` | 270 | Implemented. Runs when its seeds exist; otherwise it skips with the seed name |
| `needs-qa-action` | 16 | Needs a QA or backend action during the run: proxy failure, remote config (maintenance / force update), push notification, token expiry, AlinmaPay outage, system font size, device matrix |
| `not-in-build` | 5 | The feature in ADO doesn't exist in build fbb2d4a0: Forgot/Change Password (no password login), customer-entered requested amount (11917, 11925), payment method sheet (11984) |

Typecheck covers all 22 specs. Not yet run on a device; the first run needs `.env.local` and `environment/testdata/dev/seed.json`.

Some steps depend on external systems: Nafath sandbox approval, the Geidea/AlinmaPay checkout, file pickers and share sheets. Those cases drive the app up to the external screen, record the external part as `manualCheck`, and assert the app's result screen.

## Known issues to resolve with the app team

1. **No accessibility ids.** 0 of 86 screens have a `ValueKey` or `Semantics(identifier:)`. Locators rely on i18n text. 14 elements are located structurally (listed in `generated/missing.locator`): OTP input, sign-up/KYC/contract checkboxes, Choose-how-to-pay radios, withdrawal "+", biometric switch, notification rows, KYC/complaint option rows, and the payment gateway card fields. The Home notification bell has no label at all, so tests open Notifications from More. Ask for `Semantics(identifier: …)` on these first.
2. **ADO expected text ≠ app text.** Examples:
   - "Welcome Back" / "Continue" / "Invalid phone number." vs "Welcome Back," / "Login" / "Mobile number must start with 5".
   - The guest "You are currently viewing this page as a guest." is replaced by "Create an account to follow your requests easily".
   - The "Pending Finance Request" popup is replaced by the post-login "Choose how to pay" screen.
   - The "Select a Student" sheet is replaced by inline student cards.
   - "Manage Payments > Early Settlement" is now "Pay Full".
   - The bottom-nav label is "Payments" where Figma says "My Payments".

   Tests assert the app's i18n; each difference is either a test-case update or an app bug.
3. **Visual baselines** need QA approval: the first run records them, and QA reviews and commits them.
4. **Dev OTP.** `User/GetUserOtpDev` is commented out in the app, so OTP comes from `E2E_CUSTOMER_OTP` (the fixed Dev OTP).
5. **Build & upload pipeline** lives in the mobile repo and is not added. It must upload the QA-flavor APK as `madark-apk-qa` (and a simulator `.app` zip as `madark-simulator-qa` for iOS). The repository-dispatch step above is optional.
