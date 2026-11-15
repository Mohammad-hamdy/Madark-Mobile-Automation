import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('14 · Cancel Request', () => {
  describe('01 · Cancel Request', () => {
    test(
      '[11975] Customer App / Customer / Cancel Request_ Cancel confirmation uses the Figma Cancel Request style (title ExtraBold 20/30, body Regular 14/23.1 #7D8795, Dismiss SemiBold 16/24 #0F2340, Continue Bold 16/24 #FFFFFF) with the current confirmation text',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.cancelRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11975' },
      async ({ app, data, bottomNav, myRequestsPage, cancelRequestPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('cancellableRequest'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        await myRequestsPage.clickOnCancelRequestButton();
        expect(await cancelRequestPage.isConfirmationVisible()).toBe(true);
        expect(await visual.matchesBaseline('14-cancel-confirmation')).toBe(true);
        manualCheck('Figma 1333:27232 — title ExtraBold 20/30 #0F2340, body and both buttons');
        await cancelRequestPage.clickOnBackButton();
      }
    );

    test(
      '[11978] Customer App / Customer / Cancel Request_ Customer cancels an eligible request and it moves to Cancelled',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.cancelRequest,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11978' },
      async ({ app, data, bottomNav, myRequestsPage, cancelRequestPage }) => {
        const r = data.seed('cancellableRequest');
        await app.ensureLoggedIn(data.seedCustomer('cancellableRequest'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        await myRequestsPage.clickOnCancelRequestButton();
        expect(await cancelRequestPage.isConfirmationVisible()).toBe(true);
        await cancelRequestPage.tapOutside();
        expect(await cancelRequestPage.isConfirmationVisible()).toBe(true);
        await cancelRequestPage.clickOnConfirmButton();
        expect(await cancelRequestPage.isSuccessVisible()).toBe(true);
        await app.goBack().catch(() => undefined);
        await myRequestsPage.clickOnCancelledTab();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(true);
        manualCheck('admin / institution portal shows the request cancelled by the customer');
      }
    );

    test(
      '[11979] Customer App / Customer / Cancel Request_ Cancel is offered only for cancellable statuses',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.cancelRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11979' },
      async ({ app, data, bottomNav, myRequestsPage }) => {
        const s = data.seed('requestStatusesCustomer');
        await app.ensureLoggedIn(data.seedCustomer('requestStatusesCustomer'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isCancelRequestButtonVisible()).toBe(true);
        if (s.expiredRequestNumber) {
          await myRequestsPage.clickOnRequest(s.expiredRequestNumber);
          expect(await myRequestsPage.isExpiredDialogVisible()).toBe(true);
          await myRequestsPage.clickOnExpiredOkButton();
        }
        for (const tab of ['underReview', 'approved', 'rejected', 'cancelled'] as const) {
          await myRequestsPage.clickOnTab(tab);
          expect(await myRequestsPage.isCancelRequestButtonVisible()).toBe(false);
        }
      }
    );

    test(
      '[11980] Customer App / Customer / Cancel Request_ Dismiss closes the sheet and the request is unchanged',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.cancelRequest,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11980' },
      async ({ app, data, mobile, bottomNav, myRequestsPage, cancelRequestPage }) => {
        const r = data.seed('cancellableRequest');
        const c = data.seedCustomer('cancellableRequest');
        await app.ensureLoggedIn(c);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        await myRequestsPage.clickOnCancelRequestButton();
        await cancelRequestPage.tapOutside();
        expect(await cancelRequestPage.isConfirmationVisible()).toBe(true);
        await cancelRequestPage.clickOnBackButton();
        expect(await cancelRequestPage.isConfirmationVisible(3000)).toBe(false);
        await mobile.terminateApp();
        await mobile.activateApp();
        await app.ensureLoggedIn(c);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(true);
      }
    );

    test(
      '[11981] Customer App / Customer / Cancel Request_ Cancellation API failure shows the failure message and Try Again works',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.cancelRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11981', blocked: 'needs QA to force the cancel API to fail and then restore it during the case' },
      async () => {}
    );
  });

  describe('02 · Cancel Success', () => {
    test(
      '[11976] Customer App / Customer / Cancel Success_ Cancel success uses the Figma style (title ExtraBold 24/30 #0F2340) with the current message Request canceled successfully',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.cancelRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11976' },
      async ({ app, data, bottomNav, myRequestsPage, cancelRequestPage, visual }) => {
        const c = data.seedCustomer('cancellableRequest');
        await app.ensureLoggedIn(c);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        await myRequestsPage.clickOnCancelRequestButton();
        await cancelRequestPage.clickOnConfirmButton();
        expect(await cancelRequestPage.isSuccessVisible()).toBe(true);
        expect(await visual.matchesBaseline('14-cancel-success')).toBe(true);
        manualCheck('repeat in Arabic with a second cancellable request (seed cancellableRequest is consumed by this run)');
      }
    );

    test(
      '[11982] Customer App / Customer / Cancel Success_ Create New Request after cancellation opens a new request',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.cancelRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11982' },
      async ({ app, data, bottomNav, myRequestsPage, cancelRequestPage, homePage }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.seedCustomer('cancellableRequest'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        await myRequestsPage.clickOnCancelRequestButton();
        await cancelRequestPage.clickOnConfirmButton();
        expect(await cancelRequestPage.isSuccessVisible()).toBe(true);
        if (await cancelRequestPage.isCreateNewRequestVisible()) await cancelRequestPage.clickOnCreateNewRequestButton();
        else await bottomNav.goToHome();
        expect(await homePage.isEducationTypeVisible(data.pick(inst.educationType, inst.educationTypeAr))).toBe(true);
        await app.openInstitutionDetails(inst);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnCancelledTab();
        expect(await myRequestsPage.hasRequestCards()).toBe(true);
      }
    );
  });

  describe('03 · Cancel Failed', () => {
    test(
      '[11977] Customer App / Customer / Cancel Failed_ Cancel failure uses the Figma style (title ExtraBold 24/36 #0F2340) with the current message Failed to cancel the request. Please try again.',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.cancelRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11977', blocked: 'needs QA to force the cancel API (PUT LoanApplication/CancelRequest) to fail' },
      async () => {}
    );
  });
});
