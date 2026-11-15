import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('08 · Request Validation', () => {
  describe('01 · Validation Messages', () => {
    test(
      '[11922] Customer App / Customer / Validation Messages_ Field and server error messages use Figma error style (SemiBold 12/17.4 #DC2626) in English and Arabic',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.requestValidation,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11922' },
      async ({ app, data, requestFinancingPage, addStudentPage, kycPage, visual }) => {
        await app.openRequestFinancing(data.seedCustomer('newBranchCustomer'), data.seed('institution'));
        manualCheck('requested-amount messages are not in build fbb2d4a0 (amount is not customer-entered)');
        const id = data.nationalId();
        for (const name of ['E2E A', 'E2E B']) {
          await requestFinancingPage.clickOnAddAnotherStudentButton();
          await addStudentPage.enterStudentName(name);
          await addStudentPage.enterStudentId(id);
          if (await addStudentPage.isSameIdErrorVisible()) break;
          await addStudentPage.clickOnRelationshipDropdown();
          await addStudentPage.selectRelationshipOption('father');
          await addStudentPage.clickOnAddButton();
        }
        expect(await addStudentPage.isSameIdErrorVisible()).toBe(true);
        expect(await visual.matchesBaseline('08-same-id-error')).toBe(true);
        await app.goBack();
        await app.continueToKyc();
        await kycPage.clickOnNextButton();
        expect(await kycPage.isMustAnswerAllVisible()).toBe(true);
        manualCheck('error style SemiBold 12/17.4 #DC2626; repeat with E2E_LANG=ar');
      }
    );
  });

  describe('02 · Requested Amount', () => {
    test(
      '[11925] Customer App / Customer / Requested Amount_ Requested amount rejects zero, negative, non-numeric and above-limit values as in the current implementation',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.requestValidation,
      Tag.type.functional,
      Tag.type.boundary,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11925', blocked: 'not in build fbb2d4a0 — there is no customer-entered requested amount field (fees come from the institution)' },
      async () => {}
    );
  });

  describe('03 · Branch', () => {
    test(
      '[11930] Customer App / Customer / Branch_ Inactive branch or institution cannot receive a new request',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.requestValidation,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11930' },
      async ({ app, data, institutionDetailsPage, eligibilityPage, requestFinancingPage }) => {
        const branch = data.seed('inactiveBranch');
        await app.ensureLoggedIn(data.seedCustomer('eligibleCustomer'));
        await app.openInstitutionDetails(branch);
        manualCheck('QA deactivates the branch in admin before Financing request');
        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await requestFinancingPage.isRequestFinancingVisible(5000)).toBe(false);
        expect(await eligibilityPage.isBlockingResultVisible()).toBe(true);
      }
    );
  });

  describe('04 · Eligibility', () => {
    test(
      '[11923] Customer App / Customer / Eligibility_ Ineligible customer gets the Ineligible result and no request is created',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.requestValidation,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11923' },
      async ({ app, data, institutionDetailsPage, eligibilityPage, requestFinancingPage, bottomNav, myRequestsPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('ineligibleCustomer'));
        await bottomNav.goToRequests();
        const before = await myRequestsPage.getRequestCardCount();
        await app.openInstitutionDetails(data.seed('institution'));
        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await eligibilityPage.isBlockingResultVisible()).toBe(true);
        expect(await requestFinancingPage.isRequestFinancingVisible(3000)).toBe(false);
        manualCheck('POST LoanApplication/Insert not called');
        await eligibilityPage.clickOnDismissButton().catch(() => app.goBack());
        await bottomNav.goToRequests();
        expect(await myRequestsPage.getRequestCardCount()).toBe(before);
      }
    );
  });

  describe('05 · Ineligible', () => {
    test(
      '[11921] Customer App / Customer / Ineligible_ Ineligible screen matches Figma (title ExtraBold 22/33 #0F2340, body Regular 14/23.1, Back to Requests 353x56 radius 18)',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.requestValidation,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11921' },
      async ({ app, data, bottomNav, myRequestsPage, ineligibleRequestPage, visual }) => {
        const rejected = data.seed('rejectedRequest');
        await app.ensureLoggedIn(data.seedCustomer('rejectedRequest'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnRejectedTab();
        await myRequestsPage.clickOnRejectionReason(rejected.requestNumber);
        expect(await ineligibleRequestPage.isIneligibleVisible()).toBe(true);
        expect(await ineligibleRequestPage.isRequestNumberVisible(rejected.requestNumber)).toBe(true);
        expect(await visual.matchesBaseline('08-ineligible')).toBe(true);
        manualCheck('Figma 1333:26799 — title ExtraBold 22/33 #0F2340, body Regular 14/23.1, Back to Requests 353x56 radius 18');
        await ineligibleRequestPage.clickOnBackToRequestsButton();
        expect(await myRequestsPage.isMyRequestsVisible()).toBe(true);
      }
    );
  });

  describe('06 · Duplicate Request', () => {
    test(
      '[11924] Customer App / Customer / Duplicate Request_ Open request for the same student blocks a second request',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.requestValidation,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11924' },
      async ({ app, data, institutionDetailsPage, eligibilityPage, requestFinancingPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('openRequestCustomer'));
        await app.openInstitutionDetails(data.seed('institution'));
        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await eligibilityPage.isActiveRequestBlockVisible()).toBe(true);
        expect(await requestFinancingPage.isRequestFinancingVisible(3000)).toBe(false);
        await eligibilityPage.clickOnDismissButton().catch(() => app.goBack());
        await app.switchLanguage('ar');
        await app.openInstitutionDetails(data.seed('institution'));
        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await eligibilityPage.isActiveRequestBlockVisible()).toBe(true);
        await eligibilityPage.clickOnDismissButton().catch(() => app.goBack());
        await app.switchLanguage(data.language);
        manualCheck('QA cancels the open request, then Financing request opens Request Financing');
      }
    );
  });

  describe('07 · Rejection Cap', () => {
    test(
      '[11927] Customer App / Customer / Rejection Cap_ Customer at the rejection cap cannot submit a financing request',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.requestValidation,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11927' },
      async ({ app, data, institutionDetailsPage, eligibilityPage, bottomNav, myRequestsPage, requestFinancingPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('rejectionCapCustomer'));
        await bottomNav.goToRequests();
        const before = await myRequestsPage.getRequestCardCount();
        await app.openInstitutionDetails(data.seed('institution'));
        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await eligibilityPage.isBlockingResultVisible()).toBe(true);
        await eligibilityPage.clickOnDismissButton().catch(() => app.goBack());
        await bottomNav.goToRequests();
        expect(await myRequestsPage.getRequestCardCount()).toBe(before);
        const discount = data.seed('pendingInstitutionRequestDiscount');
        manualCheck(`Pay with Discount for ${discount.requestNumber} stays available for the customer at the cap (13 · Pay With Discount)`);
        expect(await requestFinancingPage.isRequestFinancingVisible(2000)).toBe(false);
      }
    );
  });

  describe('08 · SIMAH Consent', () => {
    test(
      '[11926] Customer App / Customer / SIMAH Consent_ Request cannot be submitted without accepting the SIMAH disclosure',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.requestValidation,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11926' },
      async ({ app, data, kycPage, myRequestsPage }) => {
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        await kycPage.completeAllCategories();
        expect(await kycPage.isConfirmationTabVisible()).toBe(true);
        expect(await kycPage.isSimahChecked()).toBe(false);
        expect(await kycPage.isConfirmButtonEnabled()).toBe(false);
        await kycPage.checkSimah();
        await kycPage.uncheckSimah();
        expect(await kycPage.isConfirmButtonEnabled()).toBe(false);
        await kycPage.checkSimah();
        await kycPage.clickOnConfirmButton();
        expect(await kycPage.isSuccessVisible()).toBe(true);
        await kycPage.clickOnBackToRequestsButton();
        expect(await myRequestsPage.isMyRequestsVisible()).toBe(true);
      }
    );
  });

  describe('09 · Salary Certificate', () => {
    test(
      '[11928] Customer App / Customer / Salary Certificate_ Request waiting for a salary certificate stays waiting after the Day 2 reminder',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.requestValidation,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11928' },
      async ({ app, data, bottomNav, myRequestsPage, requestDetailsPage }) => {
        const req = data.seed('salaryCertificateRequest');
        await app.ensureLoggedIn(data.seedCustomer('salaryCertificateRequest'));
        await bottomNav.goToRequests();
        expect(await myRequestsPage.isRequestVisible(req.requestNumber)).toBe(true);
        manualCheck('QA triggers the Day 2 reminder in the Test backend; customer opens the notification');
        await myRequestsPage.pullToRefresh();
        expect(await myRequestsPage.isRequestVisible(req.requestNumber)).toBe(true);
        await myRequestsPage.clickOnRequest(req.requestNumber);
        expect(await requestDetailsPage.isRequestNumberVisible(req.requestNumber)).toBe(true);
        manualCheck('QA cancels the request from admin; after refresh it moves to the Cancelled tab');
      }
    );
  });

  describe('10 · Session', () => {
    test(
      '[11929] Customer App / Customer / Session_ Session expiry during the request asks for login and keeps entered data safe',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.requestValidation,
      Tag.type.functional,
      Tag.type.security,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11929', blocked: 'needs the backend team to invalidate the customer session in the middle of the request' },
      async () => {}
    );
  });
});
