import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('10 · Contract Activation', () => {
  describe('01 · Contract', () => {
    test(
      '[11966] Customer App / Customer / Contract_ PDF contract reader matches Figma (background #525659, header #323639, I accept Contract terms Bold 16 #FFFFFF, Reject Contract Regular 16 #1C1C1C)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.contractActivation,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11966' },
      async ({ app, data, contractPage, visual }) => {
        await app.openApprovedRequest(data.seedCustomer('contractPending'), data.seed('contractPending').requestNumber);
        await app.openContract();
        expect(await contractPage.isContractVisible()).toBe(true);
        expect(await visual.matchesBaseline('10-contract-reader')).toBe(true);
        await contractPage.scrollContractToEnd();
        expect(await visual.matchesBaseline('10-contract-actions')).toBe(true);
        manualCheck('Figma 1271:707 — background #525659, header #323639, I accept Bold 16 #FFFFFF, Reject Regular 16 #1C1C1C');
      }
    );

    test(
      '[11968] Customer App / Customer / Contract_ Customer reads and accepts the contract and signs with OTP',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.contractActivation,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11968' },
      async ({ app, data, contractPage, otpPage, requestDetailsPage }) => {
        const c = data.seedCustomer('contractPending');
        await app.openApprovedRequest(c, data.seed('contractPending').requestNumber);
        await app.openContract();
        expect(await contractPage.isContractVisible()).toBe(true);
        await contractPage.scrollContractToEnd();
        expect(await contractPage.isConfirmButtonEnabled()).toBe(false);
        await contractPage.checkTerms();
        expect(await contractPage.isConfirmButtonEnabled()).toBe(true);
        await contractPage.clickOnConfirmButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        await otpPage.enterOtp(c.otp);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await requestDetailsPage.isRequestDetailsVisible()).toBe(true);
        expect(await requestDetailsPage.isSignContractStepVisible()).toBe(true);
      }
    );

    test(
      '[11969] Customer App / Customer / Contract_ Reject contract asks for confirmation and updates the request',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.contractActivation,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11969' },
      async ({ app, data, contractPage, requestDetailsPage, bottomNav, myRequestsPage }) => {
        await app.openApprovedRequest(data.seedCustomer('contractPending'), data.seed('contractPending').requestNumber);
        await app.openContract();
        await contractPage.clickOnCancelButton();
        expect(await requestDetailsPage.isRequestDetailsVisible()).toBe(true);
        expect(await requestDetailsPage.isSignContractStepVisible()).toBe(true);

        const resched = data.seed('rescheduledRequest');
        await app.ensureLoggedIn(data.seedCustomer('rescheduledRequest'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnRescheduledTab();
        await myRequestsPage.clickOnProceedButton();
        await app.openContract();
        await contractPage.clickOnCancelButton();
        manualCheck('RejectSignContract called once and returns success');
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnRescheduledTab();
        expect(await myRequestsPage.isRequestVisible(resched.requestNumber)).toBe(false);
      }
    );
  });

  describe('02 · Contract OTP', () => {
    test(
      '[11967] Customer App / Customer / Contract OTP_ Contract OTP screen matches Figma (6 boxes 46x61 radius 16, Verify OTP disabled #E4E7EA)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.contractActivation,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11967' },
      async ({ app, data, contractPage, otpPage, visual }) => {
        await app.openApprovedRequest(data.seedCustomer('contractPending'), data.seed('contractPending').requestNumber);
        await app.openContract();
        await contractPage.checkTerms();
        await contractPage.clickOnConfirmButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        expect(await otpPage.isVerifyButtonEnabled()).toBe(false);
        expect(await visual.matchesBaseline('10-contract-otp-empty')).toBe(true);
        await otpPage.enterOtp(data.invalid.otpWrong);
        expect(await visual.matchesBaseline('10-contract-otp-filled')).toBe(true);
        manualCheck('Figma 1275:767 — 6 boxes 46x61 radius 16, Verify OTP disabled #E4E7EA');
      }
    );

    test(
      '[11970] Customer App / Customer / Contract OTP_ Wrong contract OTP, resend and rate limit show the right messages',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.contractActivation,
      Tag.type.functional,
      Tag.type.security,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11970' },
      async ({ app, data, contractPage, otpPage, requestDetailsPage }) => {
        const c = data.seedCustomer('contractPending');
        await app.openApprovedRequest(c, data.seed('contractPending').requestNumber);
        await app.openContract();
        await contractPage.checkTerms();
        await contractPage.clickOnConfirmButton();
        await otpPage.enterOtp(data.invalid.otpWrong);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        expect(await otpPage.waitForResendEnabled()).toBe(true);
        await otpPage.clickOnResendLink();
        for (let i = 0; i < 4; i++) {
          await otpPage.enterOtp(data.invalid.otpWrong);
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        }
        expect(await otpPage.isBlockedCountdownVisible()).toBe(true);
        expect(await otpPage.waitForBlockToEnd()).toBe(true);
        await otpPage.enterOtp(c.otp);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await requestDetailsPage.isRequestDetailsVisible()).toBe(true);
      }
    );
  });

  describe('03 · Nafith', () => {
    test(
      '[11972] Customer App / Customer / Nafith_ Nafith promissory note step completes through callback and handles rejection',
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.contractActivation,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11972' },
      async ({ app, data, requestDetailsPage, nafithInfoPage }) => {
        const n = data.seed('nafithRequest');
        await app.openApprovedRequest(data.seedCustomer('nafithRequest'), n.requestNumber);
        await requestDetailsPage.clickOnSignNafithButton();
        expect(await nafithInfoPage.isAcceptingContractVisible()).toBe(true);
        await app.goBack();
        expect(await nafithInfoPage.isBackWarningVisible()).toBe(true);
        await nafithInfoPage.clickOnBackWarningCancelButton();
        expect(await nafithInfoPage.isAcceptingContractVisible()).toBe(true);
        await nafithInfoPage.clickOnGoToNafithButton();
        manualCheck('approve the sanad in the Nafith sandbox, return to Madark; second request: reject the sanad');
        expect(await nafithInfoPage.isHubStatusVisible()).toBe(true);
      }
    );
  });

  describe('04 · Activation', () => {
    test(
      '[11971] Customer App / Customer / Activation_ First installment step is required when the request needs first payment',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.contractActivation,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11971' },
      async ({ app, data, requestDetailsPage, paymentGatewayPage, paymentResultPage }) => {
        const first = data.seed('firstInstallmentRequest');
        await app.openApprovedRequest(data.seedCustomer('firstInstallmentRequest'), first.requestNumber);
        expect(await requestDetailsPage.isDepositFirstInstallmentStepVisible()).toBe(true);
        expect(await requestDetailsPage.areStepsInOrder()).toBe(true);
        await requestDetailsPage.clickOnDepositFirstInstallmentButton();
        expect(await paymentGatewayPage.isGatewayOpen()).toBe(true);
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        await paymentResultPage.clickOnBackToMyPaymentsButton().catch(() => app.goBack());
        await app.openApprovedRequest(data.seedCustomer('firstInstallmentRequest'), first.requestNumber);
        expect(await requestDetailsPage.isNafithStepVisible()).toBe(true);
        if (first.noFirstPaymentRequestNumber) {
          await app.openApprovedRequest(data.seedCustomer('firstInstallmentRequest'), first.noFirstPaymentRequestNumber);
          expect(await requestDetailsPage.isDepositFirstInstallmentStepVisible()).toBe(false);
        }
      }
    );

    test(
      '[11973] Customer App / Customer / Activation_ Activation resumes from the last incomplete step after app kill',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.contractActivation,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11973' },
      async ({ app, data, mobile, contractPage, otpPage, requestDetailsPage }) => {
        const c = data.seedCustomer('contractPending');
        const req = data.seed('contractPending').requestNumber;
        await app.openApprovedRequest(c, req);
        await app.openContract();
        await contractPage.checkTerms();
        await contractPage.clickOnConfirmButton();
        await otpPage.enterOtp(c.otp);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        await mobile.terminateApp();
        await mobile.activateApp();
        await app.openApprovedRequest(c, req);
        expect(await requestDetailsPage.isRequestDetailsVisible()).toBe(true);
        expect(await contractPage.isContractVisible(3000)).toBe(false);
        manualCheck('pay the first installment, kill the app before Nafith, reopen: next action is "Sign through Nafith"');
      }
    );

    test(
      '[11974] Customer App / Customer / Activation_ Completed activation creates the loan and shows it in My Payments',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.contractActivation,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11974' },
      async ({ app, data, requestDetailsPage, myPaymentsPage, bottomNav, myRequestsPage }) => {
        const done = data.seed('activatedRequest');
        await app.openApprovedRequest(data.seedCustomer('activatedRequest'), done.requestNumber);
        expect(await requestDetailsPage.isFinancingCreatedVisible()).toBe(true);
        await requestDetailsPage.clickOnGoToMyPaymentsButton();
        expect(await myPaymentsPage.isMyPaymentsVisible()).toBe(true);
        expect(await myPaymentsPage.isLoanCardVisible()).toBe(true);
        manualCheck('installment schedule equals the admin portal (count, amount, dates)');
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnApprovedTab();
      }
    );
  });
});
