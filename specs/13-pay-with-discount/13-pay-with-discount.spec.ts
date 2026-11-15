import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('13 · Pay With Discount', () => {
  describe('01 · Choose How to Pay UI', () => {
    test(
      '[11738] [MRUI-UI-01] [Validation] Header, back arrow and screen title (English)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11738' },
      async ({ app, data, chooseHowToPayPage, visual }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        expect(await chooseHowToPayPage.isHeaderVisible()).toBe(true);
        expect(await visual.matchesBaseline('13-header')).toBe(true);
        manualCheck('green header with madark / مدارك logos and back arrow as in the design');
      }
    );

    test(
      '[11739] [MRUI-UI-02] [Validation] Request summary block content and format',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11739' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        expect(await chooseHowToPayPage.isInstitutionVisible(r.institution)).toBe(true);
        expect(await chooseHowToPayPage.isStudentVisible(r.student)).toBe(true);
        expect(await chooseHowToPayPage.isEducationFeesVisible()).toBe(true);
        expect(await chooseHowToPayPage.isAmountOnScreen(r.amount)).toBe(true);
        manualCheck('values equal the request in the Institution Portal');
      }
    );

    test(
      '[11740] [MRUI-UI-03] [Validation] \'Pay in instalments\' card content',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11740' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isInstallmentsCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isInstallmentsNoteVisible()).toBe(true);
      }
    );

    test(
      '[11741] [MRUI-UI-04] [Validation] \'Pay in full today\' card content, SAVE badge and price breakdown',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11741' },
      async ({ app, data, chooseHowToPayPage, visual }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        const fees = Number(r.amount.replace(/,/g, ''));
        const { discount, payToday } = data.discountOf(fees, r.discountPercent);
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isPayInFullCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isSaveBadgeVisible()).toBe(true);
        expect(await chooseHowToPayPage.isFullDescriptionVisible()).toBe(true);
        expect(await chooseHowToPayPage.isDiscountBreakdownVisible()).toBe(true);
        expect(await chooseHowToPayPage.isAmountOnScreen(data.money(fees))).toBe(true);
        expect(await chooseHowToPayPage.isAmountOnScreen(data.money(discount))).toBe(true);
        expect(await chooseHowToPayPage.isAmountOnScreen(data.money(payToday))).toBe(true);
        expect(await visual.matchesBaseline('13-pay-in-full-card')).toBe(true);
      }
    );

    test(
      '[11742] [MRUI-UI-05] [Validation] Default state: Pay in instalments selected, discount card unselected, default CTA label',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11742' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isInstallmentsSelected()).toBe(true);
        expect(await chooseHowToPayPage.isPayInFullSelected()).toBe(false);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('continue');
      }
    );

    test(
      '[11743] [MRUI-UI-06] [Validation] Bottom CTA stays visible (sticky) and nothing is hidden on smaller screens',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11743' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('continue');
        await chooseHowToPayPage.clickOnPayInFullCard();
        expect(await chooseHowToPayPage.isDiscountBreakdownVisible()).toBe(true);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('payNow');
      }
    );

    test(
      '[11744] [MRUI-UI-07] [Validation] Screen renders correctly across devices, OS versions and font scaling',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11744' },
      async ({ app, data, mobile, chooseHowToPayPage, visual }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await visual.matchesBaseline('13-device-layout')).toBe(true);
        manualCheck('repeat on every device and with the largest system font size');
        await mobile.setLandscape().catch(() => undefined);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        await mobile.setPortrait().catch(() => undefined);
      }
    );

    test(
      '[11745] [MRUI-UI-08] [Boundary] Very long institution name and student name are wrapped/truncated gracefully',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11745' },
      async ({ app, data, chooseHowToPayPage, visual }) => {
        const r = data.seed('longNamesRequest');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('longNamesRequest'), r.requestNumber);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        expect(await chooseHowToPayPage.isEducationFeesVisible()).toBe(true);
        expect(await visual.matchesBaseline('13-long-names')).toBe(true);
      }
    );
  });

  describe('02 · Option Selection', () => {
    test(
      '[11752] [MRUI-SEL-01] [Functional] Selecting \'Pay in full today\' changes the CTA label to \'Pay now\' (English)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11752' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        expect(await chooseHowToPayPage.isPayInFullSelected()).toBe(true);
        expect(await chooseHowToPayPage.isInstallmentsSelected()).toBe(false);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('payNow');
      }
    );

    test(
      '[11753] [MRUI-SEL-02] [Functional] Selecting \'Pay in full today\' changes the CTA label to \'ادفع الآن\' (Arabic)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11753' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.ensureLoggedIn(data.seedCustomer('pendingInstitutionRequestDiscount'));
        await app.switchLanguage('ar');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('continue');
        await chooseHowToPayPage.clickOnPayInFullCard();
        expect(await chooseHowToPayPage.isInstallmentsSelected()).toBe(false);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('payNow');
        await app.goBack();
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[11754] [MRUI-SEL-03] [Functional] Switching back to \'Pay in instalments\' restores the original CTA label',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11754' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('payNow');
        await chooseHowToPayPage.clickOnInstallmentsCard();
        expect(await chooseHowToPayPage.isInstallmentsSelected()).toBe(true);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('continue');
      }
    );

    test(
      '[11755] [MRUI-SEL-04] [Functional] Only one option can be selected at any time (mutual exclusion)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11755' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        for (const card of ['full', 'installments', 'full'] as const) {
          if (card === 'full') await chooseHowToPayPage.clickOnPayInFullCard();
          else await chooseHowToPayPage.clickOnInstallmentsCard();
          expect(await chooseHowToPayPage.isSelectionConsistent()).toBe(true);
        }
      }
    );

    test(
      '[11756] [MRUI-SEL-05] [Functional] Tapping anywhere on a card (title, description, breakdown area) selects it',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11756' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnFullDescription();
        expect(await chooseHowToPayPage.isPayInFullSelected()).toBe(true);
        await chooseHowToPayPage.clickOnInstallmentsCard();
        await chooseHowToPayPage.clickOnPayTodayRow();
        expect(await chooseHowToPayPage.isSelectionConsistent()).toBe(true);
        await chooseHowToPayPage.clickOnInstallmentsNote();
        expect(await chooseHowToPayPage.isInstallmentsSelected()).toBe(true);
      }
    );

    test(
      '[11757] [MRUI-SEL-06] [Functional] Rapid toggling between the two cards keeps the UI state consistent',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11757' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        for (let i = 0; i < 10; i++) await (i % 2 ? chooseHowToPayPage.clickOnPayInFullCard() : chooseHowToPayPage.clickOnInstallmentsCard());
        expect(await chooseHowToPayPage.isPayInFullSelected()).toBe(true);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('payNow');
        for (let i = 0; i < 10; i++) await (i % 2 ? chooseHowToPayPage.clickOnInstallmentsCard() : chooseHowToPayPage.clickOnPayInFullCard());
        expect(await chooseHowToPayPage.isInstallmentsSelected()).toBe(true);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('continue');
      }
    );

    test(
      '[11758] [MRUI-SEL-07] [Functional] Selection is reset to the default (instalments) when the screen is reopened',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11758' },
      async ({ app, data, chooseHowToPayPage, myRequestsPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        await app.goBack();
        expect(await myRequestsPage.isMyRequestsVisible()).toBe(true);
        await myRequestsPage.clickOnRequest(r.requestNumber);
        expect(await chooseHowToPayPage.isInstallmentsSelected()).toBe(true);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('continue');
      }
    );
  });

  describe('03 · Discount Calculation', () => {
    test(
      '[11746] [MRUI-CALC-01] [Functional] Discount calculation for the design example (SAR 200.00 at 10%)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11746' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        const fees = Number(r.amount.replace(/,/g, ''));
        const { discount, payToday } = data.discountOf(fees, r.discountPercent);
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isDiscountBreakdownVisible()).toBe(true);
        expect(await chooseHowToPayPage.isAmountOnScreen(data.money(discount))).toBe(true);
        expect(await chooseHowToPayPage.isAmountOnScreen(data.money(payToday))).toBe(true);
        expect(Math.round((fees - discount) * 100) / 100).toBe(payToday);
      }
    );

    test(
      '[11747] [MRUI-CALC-02] [Boundary] Rounding of the discount for fees that produce more than 2 decimals (SAR 199.99)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11747' },
      async ({ app, data, chooseHowToPayPage }) => {
        const v = data.discountVariant(199.99);
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), v.requestNumber);
        const { discount, payToday } = data.discountOf(v.fees, v.percent);
        expect(await chooseHowToPayPage.isAmountOnScreen(data.money(discount))).toBe(true);
        expect(await chooseHowToPayPage.isAmountOnScreen(data.money(payToday))).toBe(true);
      }
    );

    test(
      '[11748] [MRUI-CALC-03] [Boundary] Minimum amounts: Education fees SAR 0.01 / SAR 1.00 / SAR 5.00',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11748' },
      async ({ app, data, chooseHowToPayPage }) => {
        for (const fees of [1, 5, 0.01]) {
          const v = data.discountVariant(fees);
          await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), v.requestNumber);
          const { discount, payToday } = data.discountOf(v.fees, v.percent);
          expect(payToday).toBeGreaterThanOrEqual(0);
          expect(await chooseHowToPayPage.isAmountOnScreen(data.money(payToday))).toBe(true);
          expect(await chooseHowToPayPage.isAmountOnScreen(data.money(discount))).toBe(true);
          await app.goBack();
        }
      }
    );

    test(
      '[11749] [MRUI-CALC-04] [Boundary] Large amounts: thousands separator and layout (SAR 40,000.00 and SAR 40,000.01)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11749' },
      async ({ app, data, chooseHowToPayPage, visual }) => {
        for (const fees of [40000, 40000.01]) {
          const v = data.discountVariant(fees);
          await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), v.requestNumber);
          const { discount, payToday } = data.discountOf(v.fees, v.percent);
          expect(await chooseHowToPayPage.isAmountOnScreen(data.money(v.fees))).toBe(true);
          expect(await chooseHowToPayPage.isAmountOnScreen(data.money(discount))).toBe(true);
          expect(await chooseHowToPayPage.isAmountOnScreen(data.money(payToday))).toBe(true);
          expect(await visual.matchesBaseline(`13-large-amount-${v.fees}`)).toBe(true);
          await app.goBack();
        }
      }
    );

    test(
      '[11750] [MRUI-CALC-05] [Functional] Discount percentage shown in badge, description and breakdown is consistent with the configured percentage',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11750' },
      async ({ app, data, chooseHowToPayPage }) => {
        const v = data.discountVariantByPercent(15);
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), v.requestNumber);
        expect(await chooseHowToPayPage.isTextOnScreen(`${v.percent}%`)).toBe(true);
        const { discount, payToday } = data.discountOf(v.fees, v.percent);
        expect(await chooseHowToPayPage.isAmountOnScreen(data.money(discount))).toBe(true);
        expect(await chooseHowToPayPage.isAmountOnScreen(data.money(payToday))).toBe(true);
      }
    );

    test(
      '[11751] [MRUI-CALC-06] [Functional] Education fees and discount values remain unchanged when switching between the cards',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11751' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        const before = await chooseHowToPayPage.getShownValues();
        for (let i = 0; i < 3; i++) {
          await chooseHowToPayPage.clickOnPayInFullCard();
          await chooseHowToPayPage.clickOnInstallmentsCard();
        }
        expect(await chooseHowToPayPage.getShownValues()).toEqual(before);
      }
    );
  });

  describe('04 · Discount Disabled', () => {
    test(
      '[11766] [MRUI-DIS-01] [Negative] Discount card is not rendered at all and CTA keeps the financing label when discount is disabled',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11766' },
      async ({ app, data, chooseHowToPayPage, requestFinancingPage }) => {
        const r = data.seed('pendingInstitutionRequestNoDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestNoDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isPayInFullCardVisible(3000)).toBe(false);
        expect(await chooseHowToPayPage.isSaveBadgeVisible()).toBe(false);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('continue');
        await chooseHowToPayPage.clickOnContinueFinancingButton();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
      }
    );

    test(
      '[11767] [MRUI-DIS-02] [Negative] Discount disabled by the admin while the customer has the screen open',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11767' },
      async ({ app, data, chooseHowToPayPage, requestFinancingPage, paymentGatewayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        manualCheck('disable Pay with Discount for the institution in the admin portal now');
        await chooseHowToPayPage.clickOnPayNowButton();
        expect(await requestFinancingPage.isDiscountUnavailableVisible()).toBe(true);
        expect(await paymentGatewayPage.isGatewayOpen(5000)).toBe(false);
      }
    );

    test(
      '[11768] [MRUI-DIS-03] [Functional] Discount enabled after the customer first viewed the screen without it',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11768' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestNoDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestNoDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isPayInFullCardVisible(3000)).toBe(false);
        manualCheck('enable Pay with Discount for the institution in the admin portal now');
        await app.goBack();
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestNoDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isPayInFullCardVisible()).toBe(true);
      }
    );

    test(
      '[11769] [MRUI-DIS-04] [Negative] Institution branch deactivated or payment configuration removed after the screen is loaded',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11769' },
      async ({ app, data, chooseHowToPayPage, paymentGatewayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        manualCheck('deactivate the branch (or remove its payment configuration) in the admin portal now');
        await chooseHowToPayPage.clickOnPayNowButton();
        expect(await paymentGatewayPage.isGatewayOpen(8000)).toBe(false);
      }
    );
  });

  describe('05 · Pay with Discount', () => {
    test(
      '[11950] Customer App / Customer / Pay with Discount_ Pay with discount from a new request charges the discounted amount',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11950' },
      async ({ app, data, requestFinancingPage, payWithDiscountPage, paymentGatewayPage, paymentResultPage, bottomNav, myRequestsPage, paidTuitionFeesPage }) => {
        const inst = data.seed('discountBranch');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), inst);
        if (inst.studentName) await requestFinancingPage.clickOnStudent(inst.studentName).catch(() => undefined);
        expect(await requestFinancingPage.isAcademicYearSelected()).toBe(true);
        await requestFinancingPage.clickOnPayWithDiscountButton();
        expect(await payWithDiscountPage.isPayWithDiscountVisible()).toBe(true);
        expect(await payWithDiscountPage.areBreakdownRowsVisible()).toBe(true);
        await payWithDiscountPage.clickOnPayButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        await paymentResultPage.clickOnViewReceiptButton();
        await app.goBack().catch(() => undefined);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPaidTuitionTab();
        expect(await paidTuitionFeesPage.isPaidCardVisible()).toBe(true);
      }
    );

    test(
      '[11951] Customer App / Customer / Pay with Discount_ AlinmaPay failure falls back to Geidea automatically for discount payment',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11951', blocked: 'needs the backend team to make AlinmaPay unavailable in Test, then verifies Payment service logs' },
      async () => {}
    );

    test(
      '[11953] Customer App / Customer / Pay with Discount_ Customer at the rejection cap can still complete through pay with discount',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11953' },
      async ({ app, data, institutionDetailsPage, eligibilityPage, bottomNav, myRequestsPage, payWithDiscountPage, paymentGatewayPage, paymentResultPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('rejectionCapCustomer'));
        await app.openInstitutionDetails(data.seed('institution'));
        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await eligibilityPage.isBlockingResultVisible()).toBe(true);
        await eligibilityPage.clickOnDismissButton().catch(() => app.goBack());
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        await myRequestsPage.clickOnPayWithDiscountButton();
        expect(await payWithDiscountPage.isPayWithDiscountVisible()).toBe(true);
        await payWithDiscountPage.clickOnPayButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
      }
    );

    test(
      '[11954] Customer App / Customer / Pay with Discount_ Failed discount payment shows the failure message in English and Arabic and nothing is charged',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11954' },
      async ({ app, data, bottomNav, myRequestsPage, payWithDiscountPage, paymentGatewayPage, paymentResultPage }) => {
        const c = data.seedCustomer('pendingInstitutionRequestDiscount');
        for (const lang of ['en', 'ar'] as const) {
          await app.ensureLoggedIn(c);
          await app.switchLanguage(lang);
          await bottomNav.goToRequests();
          await myRequestsPage.clickOnPendingTab();
          await myRequestsPage.clickOnPayWithDiscountButton();
          expect(await payWithDiscountPage.isPayWithDiscountVisible()).toBe(true);
          await payWithDiscountPage.clickOnPayButton();
          await paymentGatewayPage.payWithCard(data.seed('declinedCard'));
          expect(await paymentResultPage.isPaymentFailedVisible()).toBe(true);
          await app.goBack().catch(() => undefined);
        }
        manualCheck('no amount charged for the declined attempts (payment record)');
        await app.switchLanguage(data.language);
      }
    );
  });

  describe('06 · Payment Integration', () => {
    test(
      '[11759] [MRUI-INT-01] [Integration] \'Continue financing application\' starts the financing application for the same request',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11759' },
      async ({ app, data, chooseHowToPayPage, requestFinancingPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnContinueFinancingButton();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
        expect(await requestFinancingPage.isTextOnScreen(r.student)).toBe(true);
        expect(await requestFinancingPage.isPayWithDiscountButtonVisible(2000)).toBe(true);
      }
    );

    test(
      '[11760] [MRUI-INT-02] [Integration] \'Pay now\' opens the payment gateway with the discounted amount (SAR 180.00)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11760' },
      async ({ app, data, chooseHowToPayPage, paymentGatewayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        const { payToday } = data.discountOf(Number(r.amount.replace(/,/g, '')), r.discountPercent);
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        await chooseHowToPayPage.clickOnPayNowButton();
        expect(await paymentGatewayPage.isGatewayOpen()).toBe(true);
        expect((await paymentGatewayPage.getShownAmount()).replace(/,/g, '')).toBe(data.money(payToday).replace(/,/g, ''));
      }
    );

    test(
      '[11761] [MRUI-INT-03] [Integration] Successful full payment with discount updates the request status and removes it from Pending',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11761' },
      async ({ app, data, chooseHowToPayPage, paymentGatewayPage, paymentResultPage, bottomNav, myRequestsPage, paidTuitionFeesPage }) => {
        const r = data.seed('payableDiscountRequest');
        const c = data.seedCustomer('payableDiscountRequest');
        await app.openChooseHowToPayFromRequests(c, r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        await chooseHowToPayPage.clickOnPayNowButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        await app.goBack().catch(() => undefined);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(false);
        await myRequestsPage.clickOnPaidTuitionTab();
        expect(await paidTuitionFeesPage.isPaidCardVisible()).toBe(true);
        await app.loginToPostLoginScreen(c);
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(false);
      }
    );

    test(
      '[11762] [MRUI-INT-04] [Integration] Failed or cancelled payment returns the customer to the screen with the request still pending',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11762' },
      async ({ app, data, chooseHowToPayPage, paymentGatewayPage, paymentResultPage, bottomNav, myRequestsPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        await chooseHowToPayPage.clickOnPayNowButton();
        expect(await paymentGatewayPage.isGatewayOpen()).toBe(true);
        await paymentGatewayPage.cancelPayment();
        expect((await paymentResultPage.isPaymentFailedVisible(30_000)) || (await chooseHowToPayPage.isChooseHowToPayVisible())).toBe(true);
        await app.goBack().catch(() => undefined);
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        await chooseHowToPayPage.clickOnPayNowButton();
        await paymentGatewayPage.payWithCard(data.seed('declinedCard'));
        expect(await paymentResultPage.isPaymentFailedVisible()).toBe(true);
        await app.goBack().catch(() => undefined);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(true);
      }
    );

    test(
      '[11763] [MRUI-INT-05] [Integration] End-to-end: institution submits request -> customer logs in -> chooses discount',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11763' },
      async ({ app, data, chooseHowToPayPage, paymentGatewayPage, paymentResultPage }) => {
        const r = data.seed('payableDiscountRequest');
        manualCheck('create the new SAR 200.00 request in the Institution Portal (seed payableDiscountRequest)');
        await app.loginToPostLoginScreen(data.seedCustomer('payableDiscountRequest'));
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        await chooseHowToPayPage.clickOnPayInFullCard();
        await chooseHowToPayPage.clickOnPayNowButton();
        await paymentGatewayPage.payWithCard(data.seed('sandboxCard'));
        expect(await paymentResultPage.isPaymentConfirmedVisible()).toBe(true);
        manualCheck('Institution Portal shows the request paid in full with the discounted amount');
      }
    );

    test(
      '[11764] [MRUI-INT-06] [Integration] End-to-end: customer submits request on web -> logs in to app -> chooses instalments',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11764' },
      async ({ app, data, chooseHowToPayPage, requestFinancingPage }) => {
        const r = data.seed('webPageRequestDiscount');
        await app.loginToPostLoginScreen(data.seedCustomer('webPageRequestDiscount'));
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        await chooseHowToPayPage.clickOnContinueFinancingButton();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
      }
    );

    test(
      '[11765] [MRUI-INT-07] [Integration] Discount availability follows each institution\'s configuration (mixed institutions)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11765' },
      async ({ app, data, chooseHowToPayPage }) => {
        const mixed = data.seed('mixedDiscountRequests');
        const c = data.seedCustomer('mixedDiscountRequests');
        await app.openChooseHowToPayFromRequests(c, mixed.discountRequestNumber);
        expect(await chooseHowToPayPage.isPayInFullCardVisible()).toBe(true);
        await app.goBack();
        await app.openChooseHowToPayFromRequests(c, mixed.noDiscountRequestNumber);
        expect(await chooseHowToPayPage.isPayInFullCardVisible(3000)).toBe(false);
        expect(await chooseHowToPayPage.isInstallmentsCardVisible()).toBe(true);
      }
    );
  });

  describe('07 · Pay with Discount Receipt', () => {
    test(
      '[11952] Customer App / Customer / Pay with Discount Receipt_ Receipt shows tuition, discount and total paid after discount',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11952' },
      async ({ app, data, bottomNav, myRequestsPage, paidTuitionFeesPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('paidDiscountRequest'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPaidTuitionTab();
        expect(await paidTuitionFeesPage.areCardLabelsVisible()).toBe(true);
        await paidTuitionFeesPage.clickOnViewDetailsButton();
        expect(await paidTuitionFeesPage.isReceiptVisible()).toBe(true);
        expect(await paidTuitionFeesPage.areReceiptFieldsVisible()).toBe(true);
        await paidTuitionFeesPage.clickOnDownloadShareButton();
        manualCheck('download / share sheet opens with the receipt');
      }
    );
  });

  describe('08 · Negative', () => {
    test(
      '[11770] [MRUI-NEG-01] [Negative] Request already paid from another channel while the screen is open',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11770' },
      async ({ app, data, chooseHowToPayPage, paymentGatewayPage, bottomNav, myRequestsPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        manualCheck('pay the request from a second session / mark it paid now');
        await chooseHowToPayPage.clickOnPayNowButton();
        expect(await paymentGatewayPage.isGatewayOpen(8000)).toBe(false);
        await app.goBack().catch(() => undefined);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(false);
      }
    );

    test(
      '[11771] [MRUI-NEG-02] [Negative] Request cancelled/withdrawn by the institution while the screen is open',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11771' },
      async ({ app, data, chooseHowToPayPage, requestFinancingPage, bottomNav, myRequestsPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        manualCheck('cancel/withdraw the request in the Institution Portal now');
        await chooseHowToPayPage.clickOnContinueFinancingButton();
        expect(await requestFinancingPage.isRequestFinancingVisible(5000)).toBe(false);
        await app.goBack().catch(() => undefined);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(r.requestNumber)).toBe(false);
      }
    );

    test(
      '[11772] [MRUI-NEG-03] [Negative] Education fees edited by the institution after the customer loaded the screen',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11772' },
      async ({ app, data, chooseHowToPayPage, paymentGatewayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        manualCheck('change the education fees to SAR 300.00 in the Institution Portal now');
        await chooseHowToPayPage.clickOnPayNowButton();
        const shown = await paymentGatewayPage.getShownAmount().catch(() => '');
        const stale = data.money(data.discountOf(Number(r.amount.replace(/,/g, '')), r.discountPercent).payToday);
        expect(shown.replace(/,/g, '')).not.toBe(stale.replace(/,/g, ''));
        await app.goBack().catch(() => undefined);
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        const updated = data.discountOf(300, r.discountPercent);
        expect(await chooseHowToPayPage.isAmountOnScreen(data.money(updated.payToday))).toBe(true);
      }
    );

    test(
      '[11773] [MRUI-NEG-04] [Negative] Network connection lost while loading the screen',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11773' },
      async ({ app, data, mobile, chooseHowToPayPage, appStatesPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.ensureLoggedIn(data.seedCustomer('pendingInstitutionRequestDiscount'));
        await mobile.setAirplaneMode(true);
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber).catch(() => undefined);
        expect(await appStatesPage.isConnectivityErrorVisible()).toBe(true);
        await mobile.setAirplaneMode(false);
        await appStatesPage.clickOnRetryButton();
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
      }
    );

    test(
      '[11774] [MRUI-NEG-05] [Negative] Network connection lost after tapping \'Pay now\'',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11774' },
      async ({ app, data, mobile, chooseHowToPayPage, paymentGatewayPage, appStatesPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        await mobile.setAirplaneMode(true);
        await chooseHowToPayPage.clickOnPayNowButton();
        expect(await appStatesPage.isConnectivityErrorVisible()).toBe(true);
        expect(await paymentGatewayPage.isGatewayOpen(3000)).toBe(false);
        await mobile.setAirplaneMode(false);
        await chooseHowToPayPage.clickOnPayNowButton();
        expect(await paymentGatewayPage.isGatewayOpen()).toBe(true);
      }
    );

    test(
      '[11775] [MRUI-NEG-06] [Negative] Double/multiple taps on \'Pay now\' and \'Continue financing application\' create only one action',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11775' },
      async ({ app, data, chooseHowToPayPage, paymentGatewayPage, requestFinancingPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        await chooseHowToPayPage.doubleTapPayNowButton();
        expect(await paymentGatewayPage.isGatewayOpen()).toBe(true);
        manualCheck('only one payment session created (Payment service logs)');
        await paymentGatewayPage.cancelPayment();
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.doubleTapContinueFinancingButton();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
        await app.goBack();
        expect(await requestFinancingPage.isRequestFinancingVisible(3000)).toBe(false);
      }
    );

    test(
      '[11776] [MRUI-NEG-07] [Negative] Session timeout while the screen is open',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11776', blocked: 'needs the session to time out on the backend while the screen is open (backend session timeout control)' },
      async () => {}
    );

    test(
      '[11777] [MRUI-NEG-08] [Negative] App sent to background/killed while on the screen and then reopened',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11777' },
      async ({ app, data, mobile, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        const c = data.seedCustomer('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(c, r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        await mobile.backgroundFor(120);
        expect(await chooseHowToPayPage.isSelectionConsistent()).toBe(true);
        await mobile.terminateApp();
        await mobile.activateApp();
        await app.openChooseHowToPayFromRequests(c, r.requestNumber);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
      }
    );
  });

  describe('09 · Security', () => {
    test(
      '[11778] [MRUI-SEC-01] [Security] Customer can only see his own pending requests (no cross-customer data exposure)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11778' },
      async ({ app, data, chooseHowToPayPage, bottomNav, myRequestsPage }) => {
        const a = data.seed('pendingInstitutionRequestDiscount');
        await app.loginToPostLoginScreen(data.seedCustomer('eligibleCustomer'));
        expect(await chooseHowToPayPage.isRequestNumberVisible(a.requestNumber)).toBe(false);
        await app.goBack().catch(() => undefined);
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(a.requestNumber)).toBe(false);
        expect(await myRequestsPage.isTextOnScreen(a.student)).toBe(false);
      }
    );

    test(
      '[11779] [MRUI-SEC-02] [Security] Screen is protected by authentication after logout',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11779' },
      async ({ app, data, mobile, chooseHowToPayPage, loginPage, guestHomePage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await app.goBack();
        await app.logout();
        await mobile.navigateBack().catch(() => undefined);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible(3000)).toBe(false);
        expect((await loginPage.isLoginScreenVisible(3000)) || (await guestHomePage.isGuestHomeVisible())).toBe(true);
        await app.loginToPostLoginScreen(data.seedCustomer('eligibleCustomer'));
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(false);
      }
    );

    test(
      '[11780] [MRUI-SEC-03] [Security] Amount fields are read-only and the gateway amount cannot be altered by the customer',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11780' },
      async ({ app, data, chooseHowToPayPage, paymentGatewayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        expect(await chooseHowToPayPage.countOf('textField')).toBe(0);
        await chooseHowToPayPage.clickOnPayNowButton();
        expect(await paymentGatewayPage.isGatewayOpen()).toBe(true);
        manualCheck('gateway amount field is fixed and not editable by the customer');
      }
    );

    test(
      '[11781] [MRUI-SEC-04] [Security] Sensitive request data is hidden in the app-switcher/screenshot preview (if applicable to the app policy)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11781' },
      async ({ app, data, mobile, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await mobile.pressRecent().catch(() => undefined);
        manualCheck('app-switcher preview follows the app masking policy (FLAG_SECURE on financial screens)');
        await mobile.activateApp();
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
      }
    );
  });

  describe('10 · Arabic', () => {
    test(
      '[11782] [MRUI-AR-01] [Validation] Full screen verification in Arabic (RTL) against the Arabic design',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11782' },
      async ({ app, data, chooseHowToPayPage, visual }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.ensureLoggedIn(data.seedCustomer('pendingInstitutionRequestDiscount'));
        await app.switchLanguage('ar');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isHeaderVisible()).toBe(true);
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        expect(await chooseHowToPayPage.isInstallmentsCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isPayInFullCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isSaveBadgeVisible()).toBe(true);
        expect(await chooseHowToPayPage.getCtaLabel()).toBe('continue');
        expect(await visual.matchesBaseline('13-arabic-full')).toBe(true);
        await app.goBack();
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[11783] [MRUI-AR-02] [Validation] Arabic screen when discount is not enabled',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11783' },
      async ({ app, data, chooseHowToPayPage, visual }) => {
        const r = data.seed('pendingInstitutionRequestNoDiscount');
        await app.ensureLoggedIn(data.seedCustomer('pendingInstitutionRequestNoDiscount'));
        await app.switchLanguage('ar');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestNoDiscount'), r.requestNumber);
        expect(await chooseHowToPayPage.isInstallmentsCardVisible()).toBe(true);
        expect(await chooseHowToPayPage.isPayInFullCardVisible(3000)).toBe(false);
        expect(await visual.matchesBaseline('13-arabic-no-discount')).toBe(true);
        await app.goBack();
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[11784] [MRUI-AR-03] [Functional] Switching app language while on the screen keeps selection and refreshes the texts',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11784' },
      async ({ app, data, chooseHowToPayPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        const c = data.seedCustomer('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(c, r.requestNumber);
        await chooseHowToPayPage.clickOnPayInFullCard();
        await app.goBack();
        await app.switchLanguage('ar');
        await app.openChooseHowToPayFromRequests(c, r.requestNumber);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible()).toBe(true);
        expect(await chooseHowToPayPage.isSelectionConsistent()).toBe(true);
        await app.goBack();
        await app.switchLanguage('en');
        await app.openChooseHowToPayFromRequests(c, r.requestNumber);
        expect(await chooseHowToPayPage.isSelectionConsistent()).toBe(true);
        await app.goBack();
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[11785] [MRUI-AR-04] [Validation] Mixed-language content renders correctly (Arabic names inside the English UI and vice versa)',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11785' },
      async ({ app, data, chooseHowToPayPage, visual }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        const c = data.seedCustomer('pendingInstitutionRequestDiscount');
        await app.ensureLoggedIn(c);
        await app.switchLanguage('en');
        await app.openChooseHowToPayFromRequests(c, r.requestNumber);
        expect(await chooseHowToPayPage.isStudentVisible(r.student)).toBe(true);
        expect(await visual.matchesBaseline('13-mixed-en')).toBe(true);
        await app.goBack();
        await app.switchLanguage('ar');
        await app.openChooseHowToPayFromRequests(c, r.requestNumber);
        expect(await chooseHowToPayPage.isRequestNumberVisible(r.requestNumber)).toBe(true);
        expect(await chooseHowToPayPage.isTextOnScreen(`${r.discountPercent}%`)).toBe(true);
        expect(await visual.matchesBaseline('13-mixed-ar')).toBe(true);
        await app.goBack();
        await app.switchLanguage(data.language);
      }
    );
  });

  describe('11 · Regression', () => {
    test(
      '[11786] [MRUI-REG-01] [Regression] Existing financing application flow is unchanged after selecting instalments',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11786' },
      async ({ app, data, chooseHowToPayPage, kycPage }) => {
        const r = data.seed('pendingInstitutionRequestDiscount');
        await app.openChooseHowToPayFromRequests(data.seedCustomer('pendingInstitutionRequestDiscount'), r.requestNumber);
        await chooseHowToPayPage.clickOnContinueFinancingButton();
        await app.continueToKyc();
        await kycPage.completeAllCategories();
        await kycPage.checkSimah();
        await kycPage.clickOnConfirmButton();
        expect(await kycPage.isSuccessVisible()).toBe(true);
      }
    );

    test(
      '[11787] [MRUI-REG-02] [Regression] Login flow is unaffected for customers with no pending requests and for biometric/OTP logins',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11787' },
      async ({ app, data, mobile, loginPage, homePage, chooseHowToPayPage }) => {
        const c = data.seedCustomer('eligibleCustomer');
        await app.loginToPostLoginScreen(c);
        expect(await homePage.isHomeVisible()).toBe(true);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible(3000)).toBe(false);
        await app.logout();
        await mobile.require('biometric');
        await app.openVerifiedLoginScreen();
        await loginPage.clickOnFaceIdButton();
        await mobile.matchBiometric();
        expect(await homePage.isHomeVisible()).toBe(true);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible(3000)).toBe(false);
      }
    );

    test(
      '[11789] [MRUI-REG-04] [Regression] Existing \'Pay with Discount\' behaviour on the Request Finance screen is unaffected',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11789' },
      async ({ app, data, requestFinancingPage, payWithDiscountPage, chooseHowToPayPage }) => {
        const inst = data.seed('discountBranch');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), inst);
        expect(await requestFinancingPage.isPayWithDiscountButtonVisible()).toBe(true);
        await requestFinancingPage.clickOnPayWithDiscountButton();
        expect(await payWithDiscountPage.isPayWithDiscountVisible()).toBe(true);
        const fromRequestScreen = await payWithDiscountPage.getAmounts();
        manualCheck(`same discount as Choose how to pay for the same fees (request screen amounts ${JSON.stringify(fromRequestScreen)})`);
        expect(await chooseHowToPayPage.isChooseHowToPayVisible(2000)).toBe(false);
      }
    );

    test(
      '[11790] [MRUI-REG-05] [Regression] Paid request appears in the existing paid-fees section with the correct data after a discount payment',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.payWithDiscount,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11790' },
      async ({ app, data, bottomNav, myRequestsPage, paidTuitionFeesPage }) => {
        const paid = data.seed('paidDiscountRequest');
        await app.ensureLoggedIn(data.seedCustomer('paidDiscountRequest'));
        await bottomNav.goToRequests();
        await myRequestsPage.clickOnPaidTuitionTab();
        expect(await paidTuitionFeesPage.isPaidCardVisible()).toBe(true);
        expect(await paidTuitionFeesPage.isAmountOnScreen(paid.amountPaid)).toBe(true);
        await myRequestsPage.clickOnPendingTab();
        expect(await myRequestsPage.isRequestVisible(paid.requestNumber)).toBe(false);
      }
    );
  });
});
