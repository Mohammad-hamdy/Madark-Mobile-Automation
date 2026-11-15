import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('11 · My Requests', () => {
  describe('01 · My Requests', () => {
    test(
      '[11955] Customer App / Customer / My Requests_ My Requests header and tabs match Figma (title ExtraBold 22/33 #0F2340, active tab Bold 13/19.5 #0CB5BE with 2.5px #0DB4BE underline, inactive Medium #7D8795)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.myRequests,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11955' },
      async ({ app, data, bottomNav, myRequestsPage, visual }) => {
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToRequests();
        expect(await myRequestsPage.isMyRequestsVisible()).toBe(true);
        expect(await visual.matchesBaseline('11-my-requests-header-tabs')).toBe(true);
        manualCheck('Figma 1333:26186 — title ExtraBold 22/33 #0F2340, active tab Bold 13/19.5 #0CB5BE with 2.5px underline');
      }
    );

    test(
      '[11956] Customer App / Customer / My Requests_ Request card matches Figma (353 wide, radius 20, fill #FFFFFF 90%, border #0CB5BE 12%, label Regular 11/16.5 #7D8795, value Bold 14/21 #0F2340)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11956' },
      async ({ app, data, bottomNav, myRequestsPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('contractPending'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnApprovedTab();
        expect(await myRequestsPage.hasRequestCards()).toBe(true);
        expect(await visual.matchesBaseline('11-request-card')).toBe(true);
        manualCheck('Figma 1333:26549 RequestCard — 353 wide radius 20, label Regular 11/16.5 #7D8795, value Bold 14/21 #0F2340');
      }
    );

    test(
      '[11957] Customer App / Customer / My Requests_ All 7 status tabs of the current app use the Figma tab style (active Bold 13/19.5 #0CB5BE, inactive Medium 13/19.5 #7D8795)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11957' },
      async ({ app, data, bottomNav, myRequestsPage, visual }) => {
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToRequests();
        for (const tab of ['rescheduled', 'pending', 'underReview', 'approved', 'rejected', 'cancelled', 'paidTuition'] as const) {
          await myRequestsPage.clickOnTab(tab);
          expect(await visual.matchesBaseline(`11-tab-${tab}`)).toBe(true);
        }
        manualCheck('Figma 1333:26287 — 7 tabs in order, selected Bold 13/19.5 #0CB5BE with underline, others Medium #7D8795');
      }
    );

    test(
      '[11958] Customer App / Customer / My Requests_ Empty tab state matches the design system',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.myRequests,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11958' },
      async ({ app, data, bottomNav, myRequestsPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('eligibleCustomer'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnRejectedTab();
        expect(await myRequestsPage.isEmptyStateVisible()).toBe(true);
        expect(await visual.matchesBaseline('11-empty-tab')).toBe(true);
        await app.switchLanguage('ar');
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnRejectedTab();
        expect(await myRequestsPage.isEmptyStateVisible()).toBe(true);
        expect(await visual.matchesBaseline('11-empty-tab-ar')).toBe(true);
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[11959] Customer App / Customer / My Requests_ Arabic RTL tabs are mirrored',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11959' },
      async ({ app, data, bottomNav, myRequestsPage, visual }) => {
        await app.ensureLoggedIn(data.customer());
        await app.switchLanguage('ar');
        await bottomNav.goToRequests();
        expect(await myRequestsPage.isTabActiveRightToLeft()).toBe(true);
        for (const tab of ['rescheduled', 'pending', 'underReview', 'approved', 'rejected', 'cancelled', 'paidTuition'] as const) {
          await myRequestsPage.clickOnTab(tab);
          expect(await visual.matchesBaseline(`11-tab-rtl-${tab}`)).toBe(true);
        }
        manualCheck('Arabic Conversion frames 1452:20504 — tabs right-to-left from the right edge');
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[11960] Customer App / Customer / My Requests_ Each status tab lists only requests in that status',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.myRequests,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11960' },
      async ({ app, data, bottomNav, myRequestsPage }) => {
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToRequests();
        expect(await myRequestsPage.isMyRequestsVisible()).toBe(true);
        const counts: Record<string, number> = {};
        for (const tab of ['rescheduled', 'pending', 'underReview', 'approved', 'rejected', 'cancelled', 'paidTuition'] as const) {
          await myRequestsPage.clickOnTab(tab);
          counts[tab] = await myRequestsPage.getRequestCardCount();
        }
        manualCheck(`card count per tab equals the admin portal: ${JSON.stringify(counts)}`);
      }
    );

    test(
      '[11962] Customer App / Customer / My Requests_ Approved request Proceed opens completion',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.myRequests,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11962' },
      async ({ app, data, requestDetailsPage, contractPage }) => {
        const r = data.seed('contractPending');
        await app.openApprovedRequest(data.seedCustomer('contractPending'), r.requestNumber);
        expect(await requestDetailsPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        expect(await requestDetailsPage.isPaymentBreakdownVisible()).toBe(true);
        expect(await requestDetailsPage.isSignContractStepVisible()).toBe(true);
        await requestDetailsPage.clickOnSignContractButton();
        expect(await contractPage.isContractVisible()).toBe(true);
      }
    );

    test(
      '[11963] Customer App / Customer / My Requests_ Rejected or cancelled request shows the reason in the app language',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11963' },
      async ({ app, data, bottomNav, myRequestsPage, ineligibleRequestPage }) => {
        const rej = data.seed('rejectedRequest');
        await app.ensureLoggedIn(data.seedCustomer('rejectedRequest'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnRejectedTab();
        await myRequestsPage.clickOnRejectionReason(rej.requestNumber);
        expect(await ineligibleRequestPage.isIneligibleVisible()).toBe(true);
        if (rej.reasonEn) expect(await ineligibleRequestPage.isReasonTextVisible(rej.reasonEn)).toBe(true);
        await app.goBack();
        await myRequestsPage.clickOnCancelledTab();
        await myRequestsPage.clickOnCancellationReason();
        expect(await ineligibleRequestPage.isCancellationReasonVisible()).toBe(true);
        await app.goBack();
        await app.switchLanguage('ar');
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnRejectedTab();
        await myRequestsPage.clickOnRejectionReason(rej.requestNumber);
        expect(await ineligibleRequestPage.isIneligibleVisible()).toBe(true);
        if (rej.reasonAr) expect(await ineligibleRequestPage.isReasonTextVisible(rej.reasonAr)).toBe(true);
        await app.goBack();
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[11965] Customer App / Customer / My Requests_ Status refreshes after an action or reopening the app',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11965' },
      async ({ app, data, mobile, bottomNav, myRequestsPage, cancelRequestPage }) => {
        const r = data.seed('cancellableRequest');
        const c = data.seedCustomer('cancellableRequest');
        await app.ensureLoggedIn(c);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(true);
        await myRequestsPage.clickOnCancelRequestButton();
        await cancelRequestPage.clickOnConfirmButton();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(false);
        await myRequestsPage.clickOnCancelledTab();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(true);
        manualCheck('admin approves the under-review request in the admin portal');
        await mobile.terminateApp();
        await mobile.activateApp();
        await app.ensureLoggedIn(c);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnApprovedTab();
      }
    );
  });

  describe('02 · Request Details', () => {
    test(
      '[11961] Customer App / Customer / Request Details_ Request card opens details with steps',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.myRequests,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11961' },
      async ({ app, data, requestDetailsPage }) => {
        const r = data.seed('contractPending');
        await app.openApprovedRequest(data.seedCustomer('contractPending'), r.requestNumber);
        expect(await requestDetailsPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        expect(await requestDetailsPage.isSignContractStepVisible()).toBe(true);
        expect(await requestDetailsPage.areStepsInOrder()).toBe(true);
        await requestDetailsPage.clickOnViewContractButton().catch(() => undefined);
        await app.goBack();
        await app.goBack();
      }
    );
  });

  describe('03 · Paid Tuition Fees', () => {
    test(
      '[11964] Customer App / Customer / Paid Tuition Fees_ Paid tuition fees tab opens the receipt',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11964' },
      async ({ app, data, bottomNav, myRequestsPage, paidTuitionFeesPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('paidTuitionCustomer'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPaidTuitionTab();
        expect(await paidTuitionFeesPage.isPaidCardVisible()).toBe(true);
        expect(await paidTuitionFeesPage.areCardLabelsVisible()).toBe(true);
        await paidTuitionFeesPage.clickOnViewDetailsButton();
        expect(await paidTuitionFeesPage.isReceiptVisible()).toBe(true);
        expect(await paidTuitionFeesPage.areReceiptFieldsVisible()).toBe(true);
        await paidTuitionFeesPage.clickOnDownloadShareButton();
        manualCheck('the share/download sheet opens with the receipt PDF (system UI)');
        await app.goBack();
        await app.goBack();
        expect(await paidTuitionFeesPage.isPaidCardVisible()).toBe(true);
      }
    );
  });

  describe('04 · Open Choose How to Pay', () => {
    test(
      '[11734] [MRUI-MYR-01] [Functional] Open \'Choose how to pay\' from My Requests > Pending requests (discount enabled)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11734' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        expect(await chooseHowToPayPage.isInstallmentsCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isPayInFullCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isContinueFinancingButtonVisible()).toBe(true);
      }
    );

    test(
      '[11735] [MRUI-MYR-02] [Functional] Open \'Choose how to pay\' from My Requests > Pending requests (discount not enabled)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11735' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestNoDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestNoDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isInstallmentsCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isContinueFinancingButtonVisible()).toBe(true);
        expect(await chooseHowToPayPage.isPayInFullCardVisible(3000)).toBe(false);
      }
    );

    test(
      '[11736] [MRUI-MYR-03] [Negative] Requests in non-pending tabs do not open the \'Choose how to pay\' screen',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11736' },
      async ({ app, data, bottomNav, myRequestsPage, chooseHowToPayPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('pendingInstitutionRequestDiscount'));
        await bottomNav.goToRequests();
        for (const tab of ['underReview', 'approved', 'rejected', 'cancelled'] as const) {
          await myRequestsPage.clickOnTab(tab);
          if (!(await myRequestsPage.hasRequestCards())) continue;
          await myRequestsPage.clickOnViewDetailsButton().catch(() => myRequestsPage.clickOnProceedButton());
          expect(await chooseHowToPayPage.isChooseHowToPayVisible(4000)).toBe(false);
          expect(await chooseHowToPayPage.isPayNowButtonVisible(2000)).toBe(false);
          await app.goBack();
        }
      }
    );

    test(
      '[11737] [MRUI-MYR-04] [Functional] Consistency - same request shows identical data from the post-login screen and from My Requests',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11737' },
      async ({ app, data, chooseHowToPayPage }) => {
        const c = data.seedCustomer('pendingInstitutionRequestDiscount');
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.loginToPostLoginScreen(c);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        const postLogin = await chooseHowToPayPage.getShownValues();
        await app.goBack();
        await app.openChooseHowToPayFromRequests(c, r.requestNumber);
        expect(await chooseHowToPayPage.getShownValues()).toEqual(postLogin);
      }
    );
  });

  describe('05 · Regression', () => {
    test(
      '[11788] [MRUI-REG-03] [Regression] My Requests tabs, filters and list items still work as before',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.myRequests,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11788' },
      async ({ app, data, bottomNav, myRequestsPage, requestDetailsPage }) => {
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToRequests();
        for (const tab of ['rescheduled', 'pending', 'underReview', 'approved', 'rejected', 'cancelled', 'paidTuition'] as const) {
          expect(await myRequestsPage.isTabVisible(tab)).toBe(true);
          await myRequestsPage.clickOnTab(tab);
          expect(await myRequestsPage.isMyRequestsVisible()).toBe(true);
        }
        await myRequestsPage.clickOnApprovedTab();
        if (await myRequestsPage.hasRequestCards()) {
          await myRequestsPage.clickOnProceedButton();
          expect(await requestDetailsPage.isRequestDetailsVisible()).toBe(true);
        }
      }
    );
  });
});
