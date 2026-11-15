import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('22 · Theme & Language', () => {
  describe('01 · Language', () => {
    test(
      '[12052] Customer App / Customer / Language_ Language switch from More applies at once and persists after restart',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.themeLanguage,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12052' },
      async ({ app, data, mobile, bottomNav, homePage }) => {
        await app.ensureLoggedIn(data.customer());
        await app.switchLanguage('ar');
        expect(await bottomNav.getUiLanguage()).toBe('ar');
        await bottomNav.goToHome();
        expect(await homePage.isHomeVisible()).toBe(true);
        await bottomNav.goToRequests();
        await bottomNav.goToPayments();
        await mobile.restartApp();
        expect(await bottomNav.getUiLanguage()).toBe('ar');
        await app.switchLanguage('en');
        await mobile.restartApp();
        expect(await bottomNav.getUiLanguage()).toBe('en');
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[12053] Customer App / Customer / Language_ Numbers, dates and SAR amounts follow the app language',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.themeLanguage,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12053' },
      async ({ app, data, bottomNav, myPaymentsPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await app.switchLanguage('en');
        await bottomNav.goToPayments();
        const en = await myPaymentsPage.getFirstDueAmount();
        expect(await myPaymentsPage.isTextOnScreen('SAR')).toBe(true);
        await app.switchLanguage('ar');
        await bottomNav.goToPayments();
        const ar = await myPaymentsPage.getFirstDueAmount();
        expect(ar).toBe(en);
        expect(await myPaymentsPage.isTextOnScreen('ر.س')).toBe(true);
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[12054] Customer App / Customer / Language_ First launch defaults to Arabic',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.themeLanguage,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12054' },
      async ({ app, mobile, onboardingPage }) => {
        await app.freshStart();
        expect(await onboardingPage.isShownInArabic()).toBe(true);
        expect(await onboardingPage.isSkipLeftOfLanguageToggle()).toBe(false);
        await mobile.restartApp();
        expect(await onboardingPage.isShownInArabic()).toBe(true);
      }
    );
  });

  describe('02 · Arabic', () => {
    test(
      '[12044] Customer App / Customer / Arabic_ Every revamped screen in Arabic matches the Figma Arabic Conversion frames',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.themeLanguage,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12044' },
      async ({ app, data, bottomNav, visual }) => {
        await app.ensureLoggedIn(data.customer());
        await app.switchLanguage('ar');
        for (const [name, go] of [
          ['home', () => bottomNav.goToHome()],
          ['requests', () => bottomNav.goToRequests()],
          ['payments', () => bottomNav.goToPayments()],
          ['more', () => bottomNav.goToMore()],
        ] as const) {
          await go();
          expect(await visual.matchesBaseline(`22-arabic-${name}`)).toBe(true);
        }
        expect(await bottomNav.isHomeTabRightMost()).toBe(true);
        manualCheck('compare each screenshot with section 1452:20504; other revamped screens are covered by their module RTL cases');
        await app.switchLanguage(data.language);
      }
    );
  });

  describe('03 · Typography', () => {
    test(
      '[12043] Customer App / Customer / Typography_ Revamped screens use Plus Jakarta Sans with the Figma type scale',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.themeLanguage,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12043' },
      async ({ app, data, bottomNav, visual }) => {
        await app.openVerifiedLoginScreen();
        expect(await visual.matchesBaseline('22-typography-login')).toBe(true);
        await app.ensureLoggedIn(data.customer());
        for (const [name, go] of [
          ['home', () => bottomNav.goToHome()],
          ['requests', () => bottomNav.goToRequests()],
          ['payments', () => bottomNav.goToPayments()],
          ['more', () => bottomNav.goToMore()],
        ] as const) {
          await go();
          expect(await visual.matchesBaseline(`22-typography-${name}`)).toBe(true);
        }
        manualCheck('font family Plus Jakarta Sans and the Figma type scale on every screenshot (font metadata is not readable from the device)');
      }
    );
  });

  describe('04 · Colour Palette', () => {
    test(
      '[12049] Customer App / Customer / Colour Palette_ Text, button and status colours match the Figma palette exactly',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.themeLanguage,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12049' },
      async ({ app, data, bottomNav, visual }) => {
        await app.ensureLoggedIn(data.customer());
        for (const [name, go] of [
          ['home', () => bottomNav.goToHome()],
          ['requests', () => bottomNav.goToRequests()],
          ['payments', () => bottomNav.goToPayments()],
        ] as const) {
          await go();
          expect(await visual.matchesBaseline(`22-palette-${name}`)).toBe(true);
        }
        manualCheck('read text, button, tab and status chip colours with a colour picker against the Figma palette');
      }
    );
  });

  describe('05 · Dark Mode', () => {
    test(
      '[12045] Customer App / Customer / Dark Mode_ Dark mode login matches Figma (secondary text #A1ACC3, disabled button #A1ACC3 80%, Back to Login #0B8BA3)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.themeLanguage,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12045' },
      async ({ app, data, loginPage, otpPage, accountStatusPage, visual }) => {
        const blocked = data.seedCustomer('lockedAccount');
        await app.ensureGuest();
        await app.setTheme('dark');
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber(data.local(blocked.phone));
        await loginPage.clickOnLoginButton();
        if (await otpPage.isOtpScreenVisible()) {
          await otpPage.enterOtp(blocked.otp);
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        }
        expect(await accountStatusPage.isAccountStatusVisible()).toBe(true);
        expect(await visual.matchesBaseline('22-dark-blocked-login')).toBe(true);
        manualCheck('Figma 1452:1454 — secondary text #A1ACC3, disabled button #A1ACC3 80%');
        await accountStatusPage.clickOnBackToLoginButton();
        await app.ensureGuest();
        await app.setTheme('light');
      }
    );

    test(
      '[12046] Customer App / Customer / Dark Mode_ Dark mode home matches Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.themeLanguage,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12046' },
      async ({ app, guestHomePage, visual }) => {
        await app.ensureGuest();
        await app.setTheme('dark');
        await app.ensureGuest();
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);
        expect(await visual.matchesBaseline('22-dark-guest-home')).toBe(true);
        manualCheck('Figma 1452:3502 — dark Home banner texts #FFFFFF');
        await app.setTheme('light');
      }
    );
  });

  describe('06 · Accessibility', () => {
    test(
      '[12047] Customer App / Customer / Accessibility_ Largest system font size does not cut or overlap text',
      Tag.Corner,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.themeLanguage,
      Tag.type.ui,
      Tag.type.boundary,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12047', blocked: 'needs the device font size set to the largest value in system settings (not an Appium capability on this target)' },
      async () => {}
    );
  });

  describe('07 · Touch Targets', () => {
    test(
      '[12048] Customer App / Customer / Touch Targets_ Tap areas match the Figma sizes (back button 38x38, primary button 299.79x53.99 / 353x60, OTP box 46x61)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.themeLanguage,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12048' },
      async ({ app, loginPage, visual }) => {
        await app.openVerifiedLoginScreen();
        expect(await loginPage.isLoginScreenVisible()).toBe(true);
        expect(await visual.matchesBaseline('22-touch-targets-login')).toBe(true);
        manualCheck('measure back 38x38, primary 299.79x53.99, OTP box 46x61, flow button 353x60 on the screenshots (dp → px per device density)');
      }
    );
  });

  describe('08 · Screen Sizes', () => {
    test(
      '[12050] Customer App / Customer / Screen Sizes_ Revamped screens fit small, large and tablet screens',
      Tag.Corner,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.themeLanguage,
      Tag.type.ui,
      Tag.type.boundary,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12050', blocked: 'needs the small, large and tablet devices (run the visual cases on each BrowserStack device)' },
      async () => {}
    );
  });

  describe('09 · Platforms', () => {
    test(
      '[12051] Customer App / Customer / Platforms_ iOS and Android show the same revamped design',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.themeLanguage,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12051', blocked: 'needs the iOS and Android screenshots side by side (run the suite with PLATFORM=android and PLATFORM=ios and compare the baselines)' },
      async () => {}
    );
  });
});
