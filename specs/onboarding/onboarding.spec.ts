import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('Onboarding', () => {
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
    '[11829] Customer App / Customer / Splash Screen_ Splash screen matches Figma (background #0D2E46, centred Madark logo, full-bleed 393x852)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.onboarding,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11829', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11830] Customer App / Customer / Onboarding_ Onboarding page matches Figma (card radius 54, title #0F2340, Skip and العربية SemiBold 15/22.5 #0CB5BE)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.onboarding,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11830', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11831] Customer App / Customer / Onboarding_ Page indicator and Next / Continue Now / Let\'s Start button match Figma (gradient #38D0D0 to #018281, label Bold 16/24 #FFFFFF)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.onboarding,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11831', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11832] Customer App / Customer / Onboarding_ Arabic RTL layout is mirrored (Skip position, indicator direction, right-aligned text)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.onboarding,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11832', blocked: 'not implemented yet' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11833', blocked: 'not implemented yet' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11836', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11837] Customer App / Customer / Onboarding_ Back button and background / resume on onboarding keep the current page without crash',
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.onboarding,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11837', blocked: 'not implemented yet' },
    async () => {}
  );
});
