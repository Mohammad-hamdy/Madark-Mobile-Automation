import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('17 · Withdrawal', () => {
  describe('01 · Withdrawal', () => {
    test(
      '[12012] Customer App / Customer / Withdrawal_ Customer submits withdrawal for an active loan and it shows Under Review',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.withdrawal,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12012' },
      async ({ app, data, bottomNav, morePage, withdrawalPage }) => {
        const w = data.seed('withdrawalLoan');
        await app.ensureLoggedIn(data.seedCustomer('withdrawalLoan'));
        await bottomNav.goToMore();
        await morePage.clickOnWithdrawRequestsItem();
        expect(await withdrawalPage.isWithdrawRequestsVisible()).toBe(true);
        const before = await withdrawalPage.getRequestCount();
        await withdrawalPage.clickOnAddButton();
        await withdrawalPage.clickOnLoan(w.loanNumber);
        await withdrawalPage.clickOnContinueButton();
        expect(await withdrawalPage.isSelectStudentVisible()).toBe(true);
        await withdrawalPage.clickOnTimingDropdown();
        await withdrawalPage.selectFirstWeekOption();
        await withdrawalPage.clickOnSubmitButton();
        expect(await withdrawalPage.isSubmittedVisible()).toBe(true);
        expect(await withdrawalPage.getRequestCount()).toBeGreaterThan(before);
      }
    );

    test(
      '[12013] Customer App / Customer / Withdrawal_ Submit without students shows the select student message',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.withdrawal,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12013' },
      async ({ app, data, bottomNav, morePage, withdrawalPage }) => {
        const w = data.seed('withdrawalLoan');
        await app.ensureLoggedIn(data.seedCustomer('withdrawalLoan'));
        for (const lang of ['en', 'ar'] as const) {
          await app.switchLanguage(lang);
          await bottomNav.goToMore();
          await morePage.clickOnWithdrawRequestsItem();
          await withdrawalPage.clickOnAddButton();
          await withdrawalPage.clickOnLoan(w.loanNumber);
          await withdrawalPage.clickOnContinueButton();
          for (const s of w.students ?? []) await withdrawalPage.clickOnStudent(s);
          await withdrawalPage.clickOnSubmitButton();
          expect(await withdrawalPage.isSelectStudentMessageVisible()).toBe(true);
          await app.goBack();
          await app.goBack();
        }
        if (w.loanWithoutStudents) {
          await withdrawalPage.clickOnAddButton();
          await withdrawalPage.clickOnLoan(w.loanWithoutStudents);
          await withdrawalPage.clickOnContinueButton();
          expect(await withdrawalPage.isNoStudentsVisible()).toBe(true);
        }
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[12014] Customer App / Customer / Withdrawal_ Existing pending withdrawal blocks a new one',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.withdrawal,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12014' },
      async ({ app, data, bottomNav, morePage, withdrawalPage }) => {
        const w = data.seed('pendingWithdrawal');
        await app.ensureLoggedIn(data.seedCustomer('pendingWithdrawal'));
        await bottomNav.goToMore();
        await morePage.clickOnWithdrawRequestsItem();
        const before = await withdrawalPage.getRequestCount();
        await withdrawalPage.clickOnAddButton();
        await withdrawalPage.clickOnLoan(w.loanNumber);
        await withdrawalPage.clickOnContinueButton();
        await withdrawalPage.clickOnSubmitButton();
        expect(await withdrawalPage.isSubmittedVisible()).toBe(false);
        await app.goBack();
        await app.goBack();
        expect(await withdrawalPage.getRequestCount()).toBe(before);
      }
    );
  });

  describe('02 · Withdrawal Attachment', () => {
    test(
      '[12018] Customer App / Customer / Withdrawal Attachment_ Attachment upload works and failed submit shows the error',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.withdrawal,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12018' },
      async ({ app, data, mobile, bottomNav, morePage, withdrawalPage }) => {
        const w = data.seed('withdrawalLoan');
        const files = data.seed('kycFiles');
        await app.ensureLoggedIn(data.seedCustomer('withdrawalLoan'));
        await mobile.pushFile(files.devicePath, files.validPdf);
        await bottomNav.goToMore();
        await morePage.clickOnWithdrawRequestsItem();
        await withdrawalPage.clickOnAddButton();
        await withdrawalPage.clickOnLoan(w.loanNumber);
        await withdrawalPage.clickOnContinueButton();
        expect(await withdrawalPage.isAttachmentsSectionVisible()).toBe(true);
        await withdrawalPage.clickOnAddImageButton(1);
        manualCheck('pick the pushed PDF in the system picker; a second file shows "Maximum 1 attachments allowed", a file over 5MB "File size exceeds"');
        manualCheck('QA makes Submit fail, customer submits ("Failed to submit withdrawal"), QA restores and customer submits again');
      }
    );
  });

  describe('03 · Withdrawal Details', () => {
    test(
      '[12017] Customer App / Customer / Withdrawal Details_ Rejected withdrawal shows the rejection reason and amounts',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.withdrawal,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12017' },
      async ({ app, data, bottomNav, morePage, withdrawalPage }) => {
        const r = data.seed('rejectedWithdrawals');
        await app.ensureLoggedIn(data.seedCustomer('rejectedWithdrawals'));
        for (const lang of ['en', 'ar'] as const) {
          await app.switchLanguage(lang);
          await bottomNav.goToMore();
          await morePage.clickOnWithdrawRequestsItem();
          for (const req of [r.rejected, r.rejectedByMadarak]) {
            await withdrawalPage.clickOnRequest(req.requestNumber);
            expect(await withdrawalPage.isDetailsVisible()).toBe(true);
            expect(await withdrawalPage.isRequestInformationVisible()).toBe(true);
            expect(await withdrawalPage.isRejectionReasonVisible(lang === 'ar' ? req.reasonAr : req.reasonEn)).toBe(true);
            await app.goBack();
          }
        }
        await app.switchLanguage(data.language);
      }
    );
  });

  describe('04 · Withdrawal Status', () => {
    test(
      '[12015] Customer App / Customer / Withdrawal Status_ Each withdrawal status shows the right label in English and Arabic',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.withdrawal,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12015' },
      async ({ app, data, bottomNav, morePage, withdrawalPage }) => {
        const st = data.seed('withdrawalStatuses');
        await app.ensureLoggedIn(data.seedCustomer('withdrawalStatuses'));
        for (const lang of ['en', 'ar'] as const) {
          await app.switchLanguage(lang);
          await bottomNav.goToMore();
          await morePage.clickOnWithdrawRequestsItem();
          for (const r of st.requests) {
            expect(await withdrawalPage.isStatusVisible(lang === 'ar' ? r.statusAr : r.statusEn)).toBe(true);
            await withdrawalPage.clickOnRequest(r.requestNumber);
            expect(await withdrawalPage.isDetailsVisible()).toBe(true);
            await app.goBack();
          }
        }
        await app.switchLanguage(data.language);
      }
    );
  });

  describe('05 · Withdrawal Payment', () => {
    test(
      '[12016] Customer App / Customer / Withdrawal Payment_ Pending Customer Payment withdrawal is paid and the receipt is shown',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.withdrawal,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12016' },
      async ({ app, data, bottomNav, morePage, withdrawalPage, paymentGatewayPage, paymentResultPage }) => {
        const w = data.seed('pendingPaymentWithdrawal');
        await app.ensureLoggedIn(data.seedCustomer('pendingPaymentWithdrawal'));
        await bottomNav.goToMore();
        await morePage.clickOnWithdrawRequestsItem();
        await withdrawalPage.clickOnRequest(w.requestNumber);
        expect(await withdrawalPage.isFinancialSummaryVisible()).toBe(true);
        await withdrawalPage.clickOnPayOutstandingButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        await paymentResultPage.clickOnViewReceiptButton();
        await app.goBack();
        await withdrawalPage.clickOnBackToWithdrawalsButton();
        await withdrawalPage.clickOnRequest(w.requestNumber);
        expect(await withdrawalPage.isDetailsVisible()).toBe(true);
      }
    );
  });
});
