import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('16 · Early Settlement', () => {
  describe('01 · Early Settlement', () => {
    test(
      '[12004] Customer App / Customer / Early Settlement_ Early Settlement screen matches Figma (title Bold 17/25.5 #0F2340, loan card 353 wide radius 24 fill #FFFFFF 88%)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.earlySettlement,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12004' },
      async ({ app, data, bottomNav, myPaymentsPage, earlySettlementPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('earlySettlementLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayFullButton();
        expect(await earlySettlementPage.isEarlySettlementVisible()).toBe(true);
        expect(await visual.matchesBaseline('16-early-settlement')).toBe(true);
        manualCheck('Figma 1335:3827 — title Bold 17/25.5 #0F2340, loan card 353 wide; entry is "Pay Full" (no "Manage Payments" menu in build)');
      }
    );

    test(
      '[12005] Customer App / Customer / Early Settlement_ Early Settlement Failed screen matches Figma (title ExtraBold 22/33, Retry Settlement and Back to My Payments 345x56)',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.earlySettlement,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12005' },
      async ({ app, data, bottomNav, myPaymentsPage, earlySettlementPage, paymentGatewayPage, visual }) => {
        for (const lang of ['en', 'ar'] as const) {
          await app.ensureLoggedIn(data.seedCustomer('earlySettlementLoan'));
          await app.switchLanguage(lang);
          await bottomNav.goToPayments();
          await myPaymentsPage.clickOnPayFullButton();
          await earlySettlementPage.clickOnPayNowButton();
          await paymentGatewayPage.payWithCard(data.seed('declinedCard'));
          expect(await earlySettlementPage.isFailureVisible()).toBe(true);
          expect(await visual.matchesBaseline(`16-settlement-failed-${lang}`)).toBe(true);
          await earlySettlementPage.clickOnBackToMyPaymentsButton();
        }
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[12006] Customer App / Customer / Early Settlement_ Pay Early button text size matches Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.earlySettlement,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12006' },
      async ({ app, data, bottomNav, myPaymentsPage, earlySettlementPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('earlySettlementLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayFullButton();
        expect(await visual.matchesBaseline('16-pay-button')).toBe(true);
        await app.goBack();
        await app.switchLanguage('ar');
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayFullButton();
        expect(await earlySettlementPage.isEarlySettlementVisible()).toBe(true);
        expect(await visual.matchesBaseline('16-pay-button-ar')).toBe(true);
        manualCheck('pay label Bold 16/24 ls 0.08 #FFFFFF on one line in both languages');
        await app.goBack();
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[12007] Customer App / Customer / Early Settlement_ Settling the remaining balance pays all installments and closes the loan',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.earlySettlement,
      Tag.type.functional,
      Tag.type.integration,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12007' },
      async ({ app, data, bottomNav, myPaymentsPage, earlySettlementPage, paymentGatewayPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('earlySettlementLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayFullButton();
        expect(await earlySettlementPage.areSummaryRowsVisible()).toBe(true);
        await earlySettlementPage.clickOnPayNowButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await earlySettlementPage.isSuccessVisible()).toBe(true);
        await earlySettlementPage.clickOnViewReceiptButton();
        await app.goBack();
        await earlySettlementPage.clickOnBackToMyPaymentsButton();
        expect(await myPaymentsPage.isPayNowVisible(3000)).toBe(false);
      }
    );

    test(
      '[12008] Customer App / Customer / Early Settlement_ Settlement amount equals the remaining unpaid installments',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.earlySettlement,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12008' },
      async ({ app, data, bottomNav, myPaymentsPage, earlySettlementPage, paymentGatewayPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('earlySettlementLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayFullButton();
        expect(await earlySettlementPage.areSummaryRowsVisible()).toBe(true);
        const total = await earlySettlementPage.getTotalRemaining();
        manualCheck(`remaining installments and amount per each equal the admin portal (total ${total})`);
        await earlySettlementPage.clickOnPayNowButton();
        expect((await paymentGatewayPage.getShownAmount()).replace(/,/g, '')).toBe(total.replace(/,/g, ''));
      }
    );

    test(
      '[12009] Customer App / Customer / Early Settlement_ Settlement failure shows the failed screen and retry works',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.earlySettlement,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12009' },
      async ({ app, data, bottomNav, myPaymentsPage, earlySettlementPage, paymentGatewayPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('earlySettlementLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayFullButton();
        await earlySettlementPage.clickOnPayNowButton();
        await paymentGatewayPage.payWithCard(data.seed('declinedCard'));
        expect(await earlySettlementPage.isFailureVisible()).toBe(true);
        await earlySettlementPage.clickOnRetryButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await earlySettlementPage.isSuccessVisible()).toBe(true);
        manualCheck('payment records: one failed and one successful settlement');
      }
    );

    test(
      '[12010] Customer App / Customer / Early Settlement_ Cancelling at the gateway leaves the loan unchanged',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.earlySettlement,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12010' },
      async ({ app, data, bottomNav, myPaymentsPage, earlySettlementPage, paymentGatewayPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('earlySettlementLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayFullButton();
        await earlySettlementPage.clickOnPayNowButton();
        await paymentGatewayPage.cancelPayment();
        expect(await earlySettlementPage.isSuccessVisible(10_000)).toBe(false);
        await earlySettlementPage.clickOnBackToMyPaymentsButton().catch(() => bottomNav.goToPayments());
        expect(await myPaymentsPage.isPayFullVisible()).toBe(true);
        manualCheck('no amount charged (payment records)');
      }
    );

    test(
      '[12011] Customer App / Customer / Early Settlement_ Early settlement is not offered for a fully paid loan',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.earlySettlement,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12011' },
      async ({ app, data, bottomNav, myPaymentsPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('fullyPaidCustomer'));
        await bottomNav.goToPayments();
        expect(await myPaymentsPage.isPayNowVisible(3000)).toBe(false);
        expect(await myPaymentsPage.isPayFullVisible()).toBe(false);
      }
    );
  });
});
