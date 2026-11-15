import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('15 · Payment', () => {
  describe('01 · My Payments', () => {
    test(
      '[11983] Customer App / Customer / My Payments_ My Payments screen matches Figma (title ExtraBold 18/27, subtitle Regular 12/18 #7D8795, All Installments Bold 15/22.5 #0F2340)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.payment,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11983' },
      async ({ app, data, bottomNav, myPaymentsPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        expect(await myPaymentsPage.isMyPaymentsVisible()).toBe(true);
        expect(await myPaymentsPage.isLoanCardVisible()).toBe(true);
        expect(await myPaymentsPage.isInstallmentsListVisible()).toBe(true);
        expect(await visual.matchesBaseline('15-my-payments')).toBe(true);
        manualCheck('Figma 1335:3982 — title ExtraBold 18/27, subtitle Regular 12/18 #7D8795, All Installments');
      }
    );

    test(
      '[11990] Customer App / Customer / My Payments_ Payments Completed state matches Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.payment,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11990' },
      async ({ app, data, bottomNav, myPaymentsPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('fullyPaidCustomer'));
        await bottomNav.goToPayments();
        expect(await myPaymentsPage.isMyPaymentsVisible()).toBe(true);
        expect(await myPaymentsPage.isPayNowVisible(3000)).toBe(false);
        expect(await visual.matchesBaseline('15-payments-completed-top')).toBe(true);
        await myPaymentsPage.scrollToEnd();
        expect(await visual.matchesBaseline('15-payments-completed-bottom')).toBe(true);
        manualCheck('Figma 1335:3026 — Payments Completed state');
      }
    );

    test(
      '[11991] Customer App / Customer / My Payments_ Arabic RTL payments with SAR amount format',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11991' },
      async ({ app, data, bottomNav, myPaymentsPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await app.switchLanguage('ar');
        await bottomNav.goToPayments();
        expect(await myPaymentsPage.isMyPaymentsVisible()).toBe(true);
        expect(await visual.matchesBaseline('15-my-payments-rtl')).toBe(true);
        manualCheck('Arabic Conversion frames — mirrored layout, "مدفوعاتي", amounts with ر.س; payment method sheet not in build');
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[12000] Customer App / Customer / My Payments_ Choosing another loan shows its installments',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12000' },
      async ({ app, data, bottomNav, myPaymentsPage }) => {
        const loans = data.seed('customerWithTwoLoans');
        await app.ensureLoggedIn(data.seedCustomer('customerWithTwoLoans'));
        await bottomNav.goToPayments();
        const first = await myPaymentsPage.getLoanCardText();
        await myPaymentsPage.clickOnSelectLoanDropdown();
        await myPaymentsPage.selectLoanOption(loans.secondLoanNumber);
        const second = await myPaymentsPage.getLoanCardText();
        expect(second).not.toBe(first);
        await myPaymentsPage.clickOnSelectLoanDropdown();
        await myPaymentsPage.selectLoanOption(loans.firstLoanNumber);
        expect(await myPaymentsPage.getLoanCardText()).toBe(first);
      }
    );
  });

  describe('02 · Installment Amount', () => {
    test(
      '[11998] Customer App / Customer / Installment Amount_ Amounts with halalas are charged and shown exactly',
      Tag.Corner,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.functional,
      Tag.type.boundary,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11998' },
      async ({ app, data, bottomNav, myPaymentsPage, paymentGatewayPage, paymentResultPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('halalaInstallmentCustomer'));
        await bottomNav.goToPayments();
        const amount = await myPaymentsPage.getFirstDueAmount();
        expect(amount).toMatch(/\.\d{2}$/);
        await myPaymentsPage.clickOnPayNowButton();
        expect((await paymentGatewayPage.getShownAmount()).replace(/,/g, '')).toBe(amount.replace(/,/g, ''));
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        expect(await paymentResultPage.isPaidAmountShown(amount)).toBe(true);
        await paymentResultPage.clickOnViewReceiptButton();
        manualCheck('receipt PDF shows the same amount to the halala');
      }
    );
  });

  describe('03 · Pay Now', () => {
    test(
      '[11984] Customer App / Customer / Pay Now_ Payment method screen matches Figma (title ExtraBold 20/26, Pay 345x60 radius 16 Bold 18/27 ls 0.2, Pay with Card Bold 16/24 #0CB5BE)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11984', blocked: 'not in build fbb2d4a0 — "Pay now" opens the card checkout directly; there is no "Choose payment method suits you" sheet' },
      async () => {}
    );

    test(
      '[11992] Customer App / Customer / Pay Now_ Pay a due installment by card through AlinmaPay and it becomes Paid with a receipt',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.payment,
      Tag.type.functional,
      Tag.type.integration,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11992' },
      async ({ app, data, bottomNav, myPaymentsPage, paymentGatewayPage, paymentResultPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        const amount = await myPaymentsPage.getFirstDueAmount();
        const paidBefore = await myPaymentsPage.getPaidInstallmentsCount();
        await myPaymentsPage.clickOnPayNowButton();
        expect(await paymentGatewayPage.isGatewayOpen()).toBe(true);
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        expect(await paymentResultPage.isPaidAmountShown(amount)).toBe(true);
        await paymentResultPage.clickOnViewReceiptButton();
        await app.goBack();
        await paymentResultPage.clickOnBackToMyPaymentsButton().catch(() => bottomNav.goToPayments());
        expect(await myPaymentsPage.getPaidInstallmentsCount()).toBeGreaterThan(paidBefore);
      }
    );
  });

  describe('04 · Pay Ahead', () => {
    test(
      '[11988] Customer App / Customer / Pay Ahead_ Multiple installments success matches Figma (View & Share Receipt 295.67x55 radius 16 Bold 15/22.5)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.payment,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11988' },
      async ({ app, data, bottomNav, myPaymentsPage, payAheadPage, paymentGatewayPage, paymentResultPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayAheadButton();
        await payAheadPage.clickOnInstallment(1);
        await payAheadPage.clickOnInstallment(2);
        await payAheadPage.clickOnPayButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        expect(await visual.matchesBaseline('15-pay-ahead-success')).toBe(true);
        manualCheck('Figma 1335:2609 — View & Share Receipt 295.67x55 radius 16 Bold 15/22.5');
      }
    );

    test(
      '[11994] Customer App / Customer / Pay Ahead_ Paying several installments charges their exact sum',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.payment,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11994' },
      async ({ app, data, bottomNav, myPaymentsPage, payAheadPage, paymentGatewayPage, paymentResultPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayAheadButton();
        expect(await payAheadPage.isPayAheadVisible()).toBe(true);
        const amounts = (await payAheadPage.getInstallmentAmounts()).slice(0, 3);
        for (const n of [1, 2, 3]) await payAheadPage.clickOnInstallment(n);
        expect(await payAheadPage.getSelectedCount()).toBe(3);
        const total = Math.round(amounts.reduce((a, b) => a + b, 0) * 100) / 100;
        expect(await payAheadPage.getTotalPayment()).toBe(total);
        await payAheadPage.clickOnPayButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        expect(await paymentResultPage.isPaidAmountShown(data.money(total))).toBe(true);
      }
    );
  });

  describe('05 · Payment Gateway', () => {
    test(
      '[11993] Customer App / Customer / Payment Gateway_ AlinmaPay failure falls back to Geidea automatically',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.payment,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11993', blocked: 'needs QA to make AlinmaPay unavailable in Test and check the backend fallback logs' },
      async () => {}
    );

    test(
      '[11995] Customer App / Customer / Payment Gateway_ Cancelling at the gateway returns without charge and the installment stays unpaid',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.payment,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11995' },
      async ({ app, data, bottomNav, myPaymentsPage, paymentGatewayPage, paymentResultPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        const paidBefore = await myPaymentsPage.getPaidInstallmentsCount();
        await myPaymentsPage.clickOnPayNowButton();
        expect(await paymentGatewayPage.isGatewayOpen()).toBe(true);
        await paymentGatewayPage.cancelPayment();
        expect(await paymentResultPage.isPaymentFailedVisible(60_000)).toBe(true);
        await paymentResultPage.clickOnBackToMyPaymentsButton();
        expect(await myPaymentsPage.getPaidInstallmentsCount()).toBe(paidBefore);
      }
    );

    test(
      '[11996] Customer App / Customer / Payment Gateway_ Gateway failure shows Payment Failed and Retry Payment works',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.payment,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11996' },
      async ({ app, data, bottomNav, myPaymentsPage, paymentGatewayPage, paymentResultPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayNowButton();
        await paymentGatewayPage.payWithCard(data.seed('declinedCard'));
        expect(await paymentResultPage.isPaymentFailedVisible()).toBe(true);
        await paymentResultPage.clickOnRetryPaymentButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        await paymentResultPage.clickOnBackToMyPaymentsButton();
        expect(await myPaymentsPage.isMyPaymentsVisible()).toBe(true);
      }
    );
  });

  describe('06 · Payment', () => {
    test(
      '[11999] Customer App / Customer / Payment_ Double tap on Pay creates one payment only',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.functional,
      Tag.type.security,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11999' },
      async ({ app, data, bottomNav, myPaymentsPage, payAheadPage, paymentGatewayPage, paymentResultPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayAheadButton();
        await payAheadPage.clickOnInstallment(1);
        await payAheadPage.doubleTapPayButton();
        expect(await paymentGatewayPage.isGatewayOpen()).toBe(true);
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        manualCheck('only one POST Payment/Create and one charge (API logs)');
      }
    );

    test(
      '[12003] Customer App / Customer / Payment_ Network loss after the gateway returns still updates the installment status',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12003' },
      async ({ app, data, mobile, bottomNav, myPaymentsPage, paymentGatewayPage, appStatesPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        const paidBefore = await myPaymentsPage.getPaidInstallmentsCount();
        await myPaymentsPage.clickOnPayNowButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        await mobile.setAirplaneMode(true);
        expect(await appStatesPage.isConnectivityErrorVisible()).toBe(true);
        await mobile.setAirplaneMode(false);
        await bottomNav.goToPayments();
        await myPaymentsPage.pullToRefresh();
        expect(await myPaymentsPage.getPaidInstallmentsCount()).toBeGreaterThan(paidBefore);
      }
    );
  });

  describe('07 · Payment Confirmed', () => {
    test(
      '[11985] Customer App / Customer / Payment Confirmed_ Payment Confirmed screen matches Figma (title ExtraBold 22/33, body Regular 14/23.1, View Receipt and Back to My Payments 337x56)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11985' },
      async ({ app, data, bottomNav, myPaymentsPage, paymentGatewayPage, paymentResultPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayNowButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        expect(await paymentResultPage.isSuccessBodyVisible()).toBe(true);
        expect(await visual.matchesBaseline('15-payment-confirmed')).toBe(true);
        manualCheck('Figma 1335:4941 — title ExtraBold 22/33 #0F2340, body Regular 14/23.1, View Receipt / Back to My Payments');
      }
    );
  });

  describe('08 · Payment Failed', () => {
    test(
      '[11986] Customer App / Customer / Payment Failed_ Payment Failed screen matches Figma (icon, title ExtraBold 22/33, Retry Payment)',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11986' },
      async ({ app, data, bottomNav, myPaymentsPage, paymentGatewayPage, paymentResultPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPayNowButton();
        await paymentGatewayPage.payWithCard(data.seed('declinedCard'));
        expect(await paymentResultPage.isPaymentFailedVisible()).toBe(true);
        expect(await visual.matchesBaseline('15-payment-failed')).toBe(true);
        manualCheck('Figma 1335:5163 — icon 64x64, title ExtraBold 22/33, Retry Payment');
      }
    );
  });

  describe('09 · Overdue', () => {
    test(
      '[11997] Customer App / Customer / Overdue_ Overdue installment is flagged and Pay Now opens payment',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11997' },
      async ({ app, data, bottomNav, myPaymentsPage, paymentGatewayPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithOverdue'));
        await bottomNav.goToPayments();
        expect(await myPaymentsPage.isOverdueStatusVisible()).toBe(true);
        expect(await myPaymentsPage.isOverduePromptVisible()).toBe(true);
        await myPaymentsPage.clickOnRemindMeLaterButton();
        expect(await myPaymentsPage.isOverduePromptVisible(3000)).toBe(false);
        await bottomNav.goToHome();
        await bottomNav.goToPayments();
        if (await myPaymentsPage.isOverduePromptVisible()) await myPaymentsPage.clickOnOverduePayNowButton();
        else await myPaymentsPage.clickOnPayNowButton();
        expect(await paymentGatewayPage.isGatewayOpen()).toBe(true);
      }
    );
  });

  describe('10 · Payment Overdue', () => {
    test(
      '[11987] Customer App / Customer / Payment Overdue_ Payment Overdue screen matches Figma (Remind Me Later and Pay Now)',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11987' },
      async ({ app, data, bottomNav, myPaymentsPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithOverdue'));
        await bottomNav.goToPayments();
        expect(await myPaymentsPage.isOverduePromptVisible()).toBe(true);
        expect(await visual.matchesBaseline('15-payment-overdue')).toBe(true);
        manualCheck('Figma 1335:4716 — title ExtraBold 22/33, Remind Me Later and Pay Now');
      }
    );
  });

  describe('11 · Invoice', () => {
    test(
      '[11989] Customer App / Customer / Invoice_ Invoice matches Figma (labels Regular 13/19.5 #7D8795, values Bold 13/19.5 #0F2340, page 1 / 2)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11989' },
      async ({ app, data, bottomNav, myPaymentsPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnInvoiceButton();
        expect(await visual.matchesBaseline('15-invoice-page1')).toBe(true);
        manualCheck('Figma 1335:1763 — page indicator "1 / 2", labels Regular 13/19.5 #7D8795, values Bold 13/19.5 #0F2340 (PDF content)');
      }
    );
  });

  describe('12 · Receipt', () => {
    test(
      '[12002] Customer App / Customer / Receipt_ Receipt can be viewed and shared',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12002' },
      async ({ app, data, bottomNav, myPaymentsPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnPaidFilter();
        await myPaymentsPage.clickOnInvoiceButton();
        manualCheck('receipt PDF shows the paid amount and transaction reference; share sheet and download are system UI');
        await app.goBack();
        expect(await myPaymentsPage.isMyPaymentsVisible()).toBe(true);
      }
    );
  });

  describe('13 · Proof of Debt', () => {
    test(
      '[12001] Customer App / Customer / Proof of Debt_ Debt Proof button is shown as in Figma and opens the proof of debt document',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payment,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12001' },
      async ({ app, data, bottomNav, myPaymentsPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnTapToViewDetails().catch(() => undefined);
        expect(await myPaymentsPage.isProofOfDebtButtonVisible()).toBe(true);
        await myPaymentsPage.clickOnProofOfDebtButton();
        manualCheck('proof of debt PDF opens for the selected loan (GET Loans/GetProofOfDebtDocument)');
        await app.goBack();
        await app.goBack().catch(() => undefined);
        await app.logout();
        await app.loginAs(data.seedCustomer('fullyPaidCustomer'));
        await bottomNav.goToPayments();
        await myPaymentsPage.clickOnTapToViewDetails().catch(() => undefined);
        expect(await myPaymentsPage.isProofOfDebtButtonVisible()).toBe(false);
      }
    );
  });
});
