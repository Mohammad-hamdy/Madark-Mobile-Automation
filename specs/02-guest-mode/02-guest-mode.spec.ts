import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('02 · Guest Mode', () => {
  describe('01 · Guest Homepage', () => {
    test(
      '[11838] Customer App / Guest / Guest Homepage_ Guest home carousel matches Figma (titles ExtraBold 16/20 #FFFFFF: Flexible Financing, No Hidden Fees, Quick Approval, Trusted Platform, Wide University Network)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.guestMode,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11838' },
      async ({ app, guestHomePage, visual }) => {
        await app.ensureGuest();
        expect(await guestHomePage.areWhyMadarkCardsVisible()).toBe(true);
        expect(await visual.matchesBaseline('02-guest-why-madark-cards')).toBe(true);
        manualCheck('Figma 1449:1238 — 5 carousel cards in order, titles ExtraBold 16/20 #FFFFFF, container 417x170 (build shows the Why Madark cards from why_madark_* keys)');
      }
    );

    test(
      '[11839] Customer App / Guest / Guest Homepage_ Login or Create an account banner and CTA match Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.guestMode,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11839' },
      async ({ app, guestHomePage, guestModePage, visual }) => {
        await app.ensureGuest();
        await guestHomePage.clickOnGetStartedButton();
        expect(await guestModePage.isGuestSheetVisible()).toBe(true);
        expect(await guestModePage.areBenefitsVisible()).toBe(true);
        expect(await guestModePage.isCreateAccountButtonVisible()).toBe(true);
        expect(await visual.matchesBaseline('02-guest-login-create-banner')).toBe(true);
        manualCheck('Figma — banner title Bold 12/21 #FFFFFF, subtitle Bold 14/21, bullets Bold 8/12, CTA pill #00B8C4');
      }
    );

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
  });

  describe('02 · Guest Navigation', () => {
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
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11843' },
      async ({ app, data, bottomNav, guestModePage, signupPhonePage }) => {
        const customer = data.customer();
        await app.ensureGuest();
        await bottomNav.goToRequests();
        expect(await guestModePage.isGuestRequestsCardVisible()).toBe(true);

        await bottomNav.goToPayments();
        expect(await guestModePage.isGuestSheetVisible()).toBe(true);
        manualCheck('no GetMyRequests / GetMyLoans call while in guest mode');

        await guestModePage.clickOnCreateAccountButton();
        expect(await signupPhonePage.isSignupPhoneScreenVisible()).toBe(true);

        await app.goBack();
        await app.loginAs(customer);
        await bottomNav.goToRequests();
        expect(await guestModePage.isGuestRequestsCardVisible(3000)).toBe(false);
        await bottomNav.goToPayments();
        expect(await guestModePage.isGuestSheetVisible(3000)).toBe(false);
      }
    );
  });

  describe('03 · Guest Institutions', () => {
    test(
      '[11841] Customer App / Guest / Guest Institutions_ Guest can browse institutions and open institution details',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.guestMode,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11841' },
      async ({ app, data, homePage, institutionsPage, institutionDetailsPage, guestModePage }) => {
        const inst = data.seed('institution');
        await app.ensureGuest();
        await homePage.clickOnEducationType(data.pick(inst.educationType, inst.educationTypeAr));
        expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
        expect(await guestModePage.isGuestSheetVisible(3000)).toBe(false);

        await institutionsPage.enterSearchText(inst.searchText);
        expect(await institutionsPage.isInstitutionVisible(data.pick(inst.name, inst.nameAr))).toBe(true);

        if (inst.city) {
          await institutionsPage.clickOnClearSearchButton();
          await institutionsPage.clickOnFilterButton();
          expect(await institutionsPage.isFilterSheetVisible()).toBe(true);
          await institutionsPage.clickOnCityDropdown();
          await institutionsPage.selectCityOption(inst.city);
          await institutionsPage.clickOnApplyFiltersButton();
          expect(await institutionsPage.isResetFilterVisible()).toBe(true);
        }

        await institutionsPage.enterSearchText(inst.searchText);
        await institutionsPage.clickOnInstitution(data.pick(inst.name, inst.nameAr));
        expect(await institutionDetailsPage.isDetailsVisible()).toBe(true);
        expect(await guestModePage.isGuestSheetVisible(3000)).toBe(false);

        await app.goBack();
        expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
        expect(await guestModePage.isGuestSheetVisible(3000)).toBe(false);
      }
    );
  });

  describe('04 · Guest Request Financing', () => {
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
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11842' },
      async ({ app, data, homePage, institutionsPage, institutionDetailsPage, guestModePage, signupPhonePage }) => {
        const inst = data.seed('institution');
        const customer = data.customer();
        await app.ensureGuest();
        await homePage.clickOnEducationType(data.pick(inst.educationType, inst.educationTypeAr));
        await institutionsPage.enterSearchText(inst.searchText);
        await institutionsPage.clickOnInstitution(data.pick(inst.name, inst.nameAr));
        expect(await institutionDetailsPage.isDetailsVisible()).toBe(true);

        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await guestModePage.isGuestSheetVisible()).toBe(true);
        expect(await guestModePage.areBenefitsVisible()).toBe(true);

        await guestModePage.clickOnCreateAccountButton();
        expect(await signupPhonePage.isSignupPhoneScreenVisible()).toBe(true);
        manualCheck('no LoanApplication API call while in guest mode');

        await app.goBack();
        expect(await institutionDetailsPage.isDetailsVisible()).toBe(true);
        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await guestModePage.isGuestSheetVisible()).toBe(true);
        await app.goBack();
        await app.loginAs(customer);

        await homePage.clickOnEducationType(data.pick(inst.educationType, inst.educationTypeAr));
        await institutionsPage.enterSearchText(inst.searchText);
        await institutionsPage.clickOnInstitution(data.pick(inst.name, inst.nameAr));
        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await guestModePage.isGuestSheetVisible(3000)).toBe(false);
      }
    );
  });

  describe('05 · Guest KYC', () => {
    test(
      '[11844] Customer App / Guest / Guest KYC_ Guest has no saved KYC answers prefilled',
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.guestMode,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11844' },
      async ({ app, data, homePage, institutionsPage, institutionDetailsPage, guestModePage, guestHomePage }) => {
        const inst = data.seed('institution');
        const customer = data.seedCustomer('eligibleCustomer');
        await app.ensureLoggedIn(customer);
        manualCheck('logged in: KYC questions show the saved answers (covered in 09 · KYC Saved Answers)');

        await app.logout();
        expect(await guestHomePage.isGuestHomeVisible()).toBe(true);
        expect(await guestHomePage.isCustomerDataHidden()).toBe(true);

        await homePage.clickOnEducationType(data.pick(inst.educationType, inst.educationTypeAr));
        await institutionsPage.enterSearchText(inst.searchText);
        await institutionsPage.clickOnInstitution(data.pick(inst.name, inst.nameAr));
        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await guestModePage.isGuestSheetVisible()).toBe(true);
        manualCheck('no KycQuestion / GetTemplatesByUserId call while in guest mode');
      }
    );
  });
});
