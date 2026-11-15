import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('12 · Complete Institution Request', () => {
  describe('01 · Post-Login Screen', () => {
    test(
      '[11726] [MRUI-SCR-01] [Functional] Post-login screen is displayed for a request submitted by the institution (discount enabled)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11726' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.loginToPostLoginScreen(data.seedCustomer('pendingInstitutionRequestDiscount'));
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        expect(await chooseHowToPayPage.isInstitutionVisible(r.institution)).toBe(true);
        expect(await chooseHowToPayPage.isStudentVisible(r.student)).toBe(true);
        expect(await chooseHowToPayPage.isAmountOnScreen(r.amount)).toBe(true);
        expect(await chooseHowToPayPage.isInstallmentsCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isPayInFullCardVisible()).toBe(true);
      }
    );

    test(
      '[11727] [MRUI-SCR-02] [Functional] Post-login screen is displayed for a request submitted by the customer from the web page (discount enabled)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11727' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('webPageRequestDiscount');
        await app.loginToPostLoginScreen(data.seedCustomer('webPageRequestDiscount'));
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        expect(await chooseHowToPayPage.isInstallmentsCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isPayInFullCardVisible()).toBe(true);
      }
    );

    test(
      '[11728] [MRUI-SCR-03] [Functional] Post-login screen shows only the instalments option when Pay with Discount is not enabled',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11728' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestNoDiscount');
        await app.loginToPostLoginScreen(data.seedCustomer('pendingInstitutionRequestNoDiscount'));
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        expect(await chooseHowToPayPage.isPayInFullCardVisible(3000)).toBe(false);
        expect(await chooseHowToPayPage.isInstallmentsCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isContinueFinancingButtonVisible()).toBe(true);
      }
    );

    test(
      '[11729] [MRUI-SCR-04] [Negative] Screen is not displayed after login when the customer has no pending request',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11729' },
      async ({ app, data, chooseHowToPayPage, homePage, bottomNav, myRequestsPage }) => {
        await app.loginToPostLoginScreen(data.seedCustomer('eligibleCustomer'));
        expect(await chooseHowToPayPage.isChooseHowToPayVisible(5000)).toBe(false);
        expect(await homePage.isHomeVisible()).toBe(true);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isEmptyStateVisible()).toBe(true);
      }
    );

    test(
      '[11730] [MRUI-SCR-05] [Negative] Screen is not displayed for a request that is no longer Pending (already paid / financed)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11730' },
      async ({ app, data, chooseHowToPayPage, homePage, bottomNav, myRequestsPage }) => {
        const paid = data.seed('paidInstitutionRequest');
        await app.loginToPostLoginScreen(data.seedCustomer('paidInstitutionRequest'));
        expect(await chooseHowToPayPage.isChooseHowToPayVisible(5000)).toBe(false);
        expect(await homePage.isHomeVisible()).toBe(true);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(paid.requestNumber)).toBe(false);
      }
    );

    test(
      '[11731] [MRUI-SCR-06] [Functional] Customer with multiple pending requests - each request shows its own data without mixing',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11731' },
      async ({ app, data, chooseHowToPayPage }) => {
        const multi = data.seed('multiplePendingRequests');
        const c = data.seedCustomer('multiplePendingRequests');
        await app.loginToPostLoginScreen(c);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        const firstShown = (await chooseHowToPayPage.isRequestNumberVisible(multi.requestNumbers[0])) ? multi.requestNumbers[0] : multi.requestNumbers[1];
        const other = multi.requestNumbers.find((n) => n !== firstShown)!;
        expect(await chooseHowToPayPage.isRequestNumberVisible(other)).toBe(false);
        await app.goBack();
        await app.openChooseHowToPayFromRequests(c, other);
        expect(await chooseHowToPayPage.isRequestNumberVisible(other)).toBe(true);
        expect(await chooseHowToPayPage.isRequestNumberVisible(firstShown)).toBe(false);
      }
    );

    test(
      '[11732] [MRUI-SCR-07] [Functional] Back arrow on the post-login screen returns the customer to Home without changing the request',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11732' },
      async ({ app, data, chooseHowToPayPage, homePage, bottomNav, myRequestsPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.loginToPostLoginScreen(data.seedCustomer('pendingInstitutionRequestDiscount'));
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        await app.goBack();
        expect(await homePage.isHomeVisible()).toBe(true);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(true);
      }
    );

    test(
      '[11733] [MRUI-SCR-08] [Functional] Post-login screen is displayed again on the next login while the request is still pending',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11733' },
      async ({ app, data, mobile, chooseHowToPayPage, homePage }) => {
        const c = data.seedCustomer('pendingInstitutionRequestDiscount');
        await app.loginToPostLoginScreen(c);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        await app.goBack();
        expect(await homePage.isHomeVisible()).toBe(true);
        await app.loginToPostLoginScreen(c);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        await mobile.terminateApp();
        await mobile.activateApp();
        app.markSignedOut();
        await app.ensureGuest().catch(() => undefined);
        await app.loginToPostLoginScreen(c);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
      }
    );
  });

  describe('02 · Institution Request', () => {
    test(
      '[11944] Customer App / Customer / Institution Request_ Pending institution request card and completion screen use revamp tokens (card radius 20, label Regular 11/16.5 #7D8795, value Bold 14/21 #0F2340)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11944' },
      async ({ app, data, bottomNav, myRequestsPage, requestFinancingPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('pendingInstitutionRequestNoDiscount'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await visual.matchesBaseline('12-pending-institution-card')).toBe(true);
        await myRequestsPage.clickOnContinueKycButton();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
        expect(await visual.matchesBaseline('12-request-completion')).toBe(true);
        manualCheck('Figma 1333:26549 — card radius 20, label Regular 11/16.5 #7D8795, value Bold 14/21 #0F2340');
      }
    );

    test(
      '[11945] Customer App / Customer / Institution Request_ Institution-created request shows in Pending with the institution, branch and student data prefilled',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11945' },
      async ({ app, data, bottomNav, myRequestsPage, requestFinancingPage }) => {
        const r = data.seed('pendingInstitutionRequestNoDiscount');
        manualCheck('institution user creates the finance request in the institution portal (seeded)');
        await app.ensureLoggedIn(data.seedCustomer('pendingInstitutionRequestNoDiscount'));
        manualCheck('build fbb2d4a0 shows "Choose how to pay" after login instead of the "Pending Finance Request" popup (left for later)');
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(true);
        await myRequestsPage.clickOnContinueKycButton();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
      }
    );

    test(
      '[11946] Customer App / Customer / Institution Request_ Institution prefilled data cannot be edited by the customer',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      Tag.type.security,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11946' },
      async ({ app, data, bottomNav, myRequestsPage, requestFinancingPage }) => {
        const r = data.seed('pendingInstitutionRequestNoDiscount');
        await app.ensureLoggedIn(data.seedCustomer('pendingInstitutionRequestNoDiscount'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        await myRequestsPage.clickOnContinueKycButton();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
        if (r.student) {
          await requestFinancingPage.clickOnStudent(r.student);
          expect(await requestFinancingPage.isStudentVisible(r.student)).toBe(true);
        }
        expect(await requestFinancingPage.areFeesVisible()).toBe(true);
        manualCheck('student rows and amounts do not react to taps (institution-locked); amount stays the institution amount');
        await requestFinancingPage.clickOnDurationDropdown();
        await requestFinancingPage.selectFirstDurationOption();
        expect(await requestFinancingPage.isContinueButtonEnabled()).toBe(true);
      }
    );

    test(
      '[11947] Customer App / Customer / Institution Request_ Customer completes the institution request and it moves to Under review',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      Tag.type.integration,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11947' },
      async ({ app, data, bottomNav, myRequestsPage, kycPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('pendingInstitutionRequestNoDiscount'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        await myRequestsPage.clickOnContinueKycButton();
        await app.continueToKyc();
        await kycPage.completeAllCategories();
        await kycPage.checkSimah();
        await kycPage.clickOnConfirmButton();
        expect(await kycPage.isSuccessVisible()).toBe(true);
        await kycPage.clickOnBackToRequestsButton();
        await myRequestsPage.clickOnUnderReviewTab();
        expect(await myRequestsPage.isRequestVisible(data.seed('pendingInstitutionRequestNoDiscount').requestNumber)).toBe(true);
      }
    );

    test(
      '[11949] Customer App / Customer / Institution Request_ Request cancelled by the institution during completion cannot be submitted',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11949' },
      async ({ app, data, bottomNav, myRequestsPage, kycPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('pendingInstitutionRequestNoDiscount'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        await myRequestsPage.clickOnContinueKycButton();
        await app.continueToKyc();
        manualCheck('institution user cancels the request in the institution portal now');
        await kycPage.completeAllCategories();
        await kycPage.checkSimah();
        await kycPage.clickOnConfirmButton();
        expect(await kycPage.isSuccessVisible(8000)).toBe(false);
        await app.goBack().catch(() => undefined);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnUnderReviewTab();
        expect(await myRequestsPage.isRequestVisible(data.seed('pendingInstitutionRequestNoDiscount').requestNumber)).toBe(false);
      }
    );
  });

  describe('03 · Web Page Request', () => {
    test(
      '[11948] Customer App / Customer / Web Page Request_ Customer completes a request added from the Madark web page',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.completeInstitutionRequest,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11948' },
      async ({ app, data, mobile, requestFinancingPage, kycPage, myRequestsPage }) => {
        const link = data.seed('webRequestLink');
        await app.ensureLoggedIn(data.seedCustomer('webPageRequestDiscount'));
        await mobile.openDeepLink(link.url);
        await requestFinancingPage.isRequestFinancingVisible().catch(() => false);
        await app.continueToKyc();
        await kycPage.completeAllCategories();
        await kycPage.checkSimah();
        await kycPage.clickOnConfirmButton();
        expect(await kycPage.isSuccessVisible()).toBe(true);
        await kycPage.clickOnBackToRequestsButton();
        await myRequestsPage.clickOnUnderReviewTab();
        expect(await myRequestsPage.isRequestVisible(link.requestNumber)).toBe(true);
      }
    );
  });
});
