import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('01 · Onboarding', () => {
  describe('01 · Splash Screen', () => {
    test(
      '[11829] Customer App / Customer / Splash Screen_ Splash screen matches Figma (background #0D2E46, centred Madark logo, full-bleed 393x852)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.onboarding,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11829' },
      async ({ app, mobile, splashPage, onboardingPage, visual }) => {
        await app.freshStart();
        await mobile.restartApp();
        expect(await splashPage.isSplashVisible()).toBe(true);
        expect(await visual.matchesBaseline('01-splash')).toBe(true);
        manualCheck('Figma 1333:20568 — background #0D2E46 edge to edge, centred white logo, not stretched');
        expect(await splashPage.isSplashGone()).toBe(true);
        expect(await onboardingPage.isOnboardingVisible()).toBe(true);
      }
    );

    test(
      '[11833] Customer App / Customer / Splash Screen_ First launch opens onboarding and later launches skip it to login or home',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.onboarding,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11833' },
      async ({ app, data, mobile, splashPage, onboardingPage, guestHomePage, homePage }) => {
        const customer = data.customer();
        await app.freshStart();
        expect(await splashPage.isSplashGone()).toBe(true);
        expect(await onboardingPage.isOnboardingVisible()).toBe(true);
        expect(await onboardingPage.isShownInArabic()).toBe(true);
        await app.matchLanguage();
        await onboardingPage.clickOnSkipButton();
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);

        await mobile.restartApp();
        expect(await onboardingPage.isOnboardingVisible(5000)).toBe(false);
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);

        await app.loginAs(customer);
        await mobile.restartApp();
        expect(await onboardingPage.isOnboardingVisible(5000)).toBe(false);
        expect(await homePage.isHomeVisible()).toBe(true);

        await app.logout();
        await mobile.restartApp();
        expect(await onboardingPage.isOnboardingVisible(5000)).toBe(false);
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);
        expect(await guestHomePage.isCustomerDataHidden()).toBe(true);
      }
    );
  });

  describe('02 · Onboarding', () => {
    test(
      '[11830] Customer App / Customer / Onboarding_ Onboarding page matches Figma (card radius 54, title #0F2340, Skip and العربية SemiBold 15/22.5 #0CB5BE)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.onboarding,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11830' },
      async ({ app, onboardingPage, visual }) => {
        await app.freshStart();
        if (await onboardingPage.isShownInArabic()) await onboardingPage.clickOnEnglishToggle();
        expect(await onboardingPage.isFirstSlideVisible()).toBe(true);
        expect(await visual.matchesBaseline('01-onboarding-page1')).toBe(true);
        manualCheck('Figma 1333:20606 — card radius 54, Skip/العربية SemiBold 15/22.5 #0CB5BE, title #0F2340, logo badge');
        await onboardingPage.clickOnContinueNowButton();
        expect(await onboardingPage.isSecondSlideVisible()).toBe(true);
        expect(await visual.matchesBaseline('01-onboarding-page2')).toBe(true);
        await onboardingPage.clickOnContinueNowButton();
        expect(await onboardingPage.isThirdSlideVisible()).toBe(true);
        expect(await visual.matchesBaseline('01-onboarding-page3')).toBe(true);
      }
    );

    test(
      '[11831] Customer App / Customer / Onboarding_ Page indicator and Next / Continue Now / Let\'s Start button match Figma (gradient #38D0D0 to #018281, label Bold 16/24 #FFFFFF)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.onboarding,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11831' },
      async ({ app, onboardingPage, visual }) => {
        await app.freshStart();
        await app.matchLanguage();
        expect(await onboardingPage.isContinueNowButtonVisible()).toBe(true);
        expect(await visual.matchesBaseline('01-onboarding-indicator-page1')).toBe(true);
        manualCheck('Figma 1333:20606 — button gradient #38D0D0→#018281 radius 16, label Bold 16/24 #FFFFFF, 3-dot indicator');
        await onboardingPage.clickOnContinueNowButton();
        expect(await onboardingPage.getCurrentSlide()).toBe(2);
        expect(await onboardingPage.isContinueNowButtonVisible()).toBe(true);
        expect(await visual.matchesBaseline('01-onboarding-indicator-page2')).toBe(true);
        await onboardingPage.clickOnContinueNowButton();
        expect(await onboardingPage.getCurrentSlide()).toBe(3);
        expect(await onboardingPage.isLetsStartButtonVisible()).toBe(true);
        expect(await visual.matchesBaseline('01-onboarding-indicator-page3')).toBe(true);
      }
    );

    test(
      '[11832] Customer App / Customer / Onboarding_ Arabic RTL layout is mirrored (Skip position, indicator direction, right-aligned text)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.onboarding,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11832' },
      async ({ app, onboardingPage, visual }) => {
        await app.freshStart();
        if (await onboardingPage.isShownInEnglish()) await onboardingPage.clickOnArabicToggle();
        expect(await onboardingPage.isShownInArabic()).toBe(true);
        expect(await onboardingPage.isSkipLeftOfLanguageToggle()).toBe(false);
        expect(await visual.matchesBaseline('01-onboarding-rtl-page1')).toBe(true);
        await onboardingPage.clickOnContinueNowButton();
        expect(await onboardingPage.isSecondSlideVisible()).toBe(true);
        expect(await visual.matchesBaseline('01-onboarding-rtl-page2')).toBe(true);
        await onboardingPage.clickOnContinueNowButton();
        expect(await onboardingPage.isThirdSlideVisible()).toBe(true);
        expect(await visual.matchesBaseline('01-onboarding-rtl-page3')).toBe(true);
        manualCheck('Arabic Conversion frames 1452:20504 — right-aligned text, indicator right to left');
        await onboardingPage.clickOnEnglishToggle();
        expect(await onboardingPage.isSkipLeftOfLanguageToggle()).toBe(true);
      }
    );

    test(
      '[11834] Customer App / Customer / Onboarding_ Next moves through the 3 pages and Let\'s Start opens Home in guest mode',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.onboarding,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11834' },
      async ({ mobile, app, onboardingPage, guestHomePage }) => {
        await mobile.clearAppData();
        expect(await onboardingPage.isOnboardingVisible()).toBe(true);
        await app.matchLanguage();

        expect(await onboardingPage.isFirstSlideVisible()).toBe(true);
        await onboardingPage.clickOnContinueNowButton();

        expect(await onboardingPage.isSecondSlideVisible()).toBe(true);
        await onboardingPage.clickOnContinueNowButton();

        expect(await onboardingPage.isThirdSlideVisible()).toBe(true);
        await onboardingPage.clickOnLetsStartButton();
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);

        await mobile.restartApp();
        expect(await onboardingPage.isOnboardingVisible(5000)).toBe(false);
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);
      }
    );

    test(
      '[11835] Customer App / Customer / Onboarding_ Skip bypasses the remaining pages and opens Home in guest mode',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.onboarding,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11835' },
      async ({ mobile, app, onboardingPage, guestHomePage }) => {
        await mobile.clearAppData();
        await app.matchLanguage();
        await onboardingPage.clickOnSkipButton();
        expect(await onboardingPage.isSecondSlideVisible()).toBe(false);
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);

        await mobile.clearAppData();
        await app.matchLanguage();
        await onboardingPage.clickOnContinueNowButton();
        expect(await onboardingPage.isSecondSlideVisible()).toBe(true);
        await onboardingPage.clickOnSkipButton();
        expect(await onboardingPage.isThirdSlideVisible()).toBe(false);
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);

        await mobile.restartApp();
        expect(await onboardingPage.isOnboardingVisible(5000)).toBe(false);
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);
      }
    );

    test(
      '[11836] Customer App / Customer / Onboarding_ العربية switch changes the app language immediately and persists after restart',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.onboarding,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11836' },
      async ({ app, mobile, onboardingPage, guestHomePage }) => {
        await app.freshStart();
        expect(await onboardingPage.isShownInArabic()).toBe(true);

        await onboardingPage.clickOnEnglishToggle();
        expect(await onboardingPage.isShownInEnglish()).toBe(true);
        expect(await onboardingPage.isFirstSlideVisible()).toBe(true);

        await mobile.restartApp();
        expect(await onboardingPage.isShownInEnglish()).toBe(true);

        await app.freshStart();
        await onboardingPage.clickOnEnglishToggle();
        await onboardingPage.clickOnArabicToggle();
        expect(await onboardingPage.isShownInArabic()).toBe(true);

        await mobile.restartApp();
        expect(await onboardingPage.isShownInArabic()).toBe(true);
        await onboardingPage.clickOnSkipButton();
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);
      }
    );

    test(
      '[11837] Customer App / Customer / Onboarding_ Back button and background / resume on onboarding keep the current page without crash',
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.onboarding,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11837' },
      async ({ app, mobile, onboardingPage }) => {
        await app.freshStart();
        await app.matchLanguage();
        await onboardingPage.clickOnContinueNowButton();
        expect(await onboardingPage.getCurrentSlide()).toBe(2);

        await mobile.navigateBack();
        expect(await onboardingPage.isOnboardingVisible()).toBe(true);
        expect(await onboardingPage.getCurrentSlide()).toBe(2);

        await mobile.backgroundFor(60);
        expect(await onboardingPage.getCurrentSlide()).toBe(2);

        await mobile.lock();
        await mobile.unlock();
        expect(await onboardingPage.getCurrentSlide()).toBe(2);

        await onboardingPage.clickOnContinueNowButton();
        expect(await onboardingPage.getCurrentSlide()).toBe(3);
      }
    );
  });
});
