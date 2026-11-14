import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('GuestMode', () => {
  test(
    '[11840] Customer App / Guest / Guest Homepage_ Guest opens the app without login and sees browse-only home content',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.guestMode,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11840' },
    async ({ mobile, app, onboardingPage, guestHomePage, bottomNav }) => {
      await mobile.clearAppData();
      await app.matchLanguage();
      await onboardingPage.clickOnSkipButton();
      expect(await guestHomePage.isGuestHomeVisible()).toBe(true);

      expect(await guestHomePage.isEligibilityDescriptionVisible()).toBe(true);

      expect(await guestHomePage.isWhyMadarkSectionVisible()).toBe(true);

      expect(await bottomNav.isBottomNavigationVisible()).toBe(true);
    }
  );

  test(
    '[11838] Customer App / Guest / Guest Homepage_ Guest home carousel matches Figma (titles ExtraBold 16/20 #FFFFFF: Flexible Financing, No Hidden Fees, Quick Approval, Trusted Platform, Wide University Network)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.guestMode,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11838', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11839] Customer App / Guest / Guest Homepage_ Login or Create an account banner and CTA match Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.guestMode,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11839', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11841] Customer App / Guest / Guest Institutions_ Guest can browse institutions and open institution details',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.guestMode,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11841', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11842] Customer App / Guest / Guest Request Financing_ Request Financing as guest asks for login or sign-up and returns to the flow after login',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.guestMode,
    Tag.type.functional,
    Tag.type.security,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11842', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11843] Customer App / Guest / Guest Navigation_ My Requests and My Payments tabs require login for a guest',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.guestMode,
    Tag.type.functional,
    Tag.type.security,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11843', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11844] Customer App / Guest / Guest KYC_ Guest has no saved KYC answers prefilled',
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.guestMode,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11844', blocked: 'not implemented yet' },
    async () => {}
  );
});
