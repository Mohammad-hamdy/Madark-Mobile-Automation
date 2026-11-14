import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('PayWithDiscount', () => {
  test(
    '[11738] [MRUI-UI-01] [Validation] Header, back arrow and screen title (English)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11738', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11739] [MRUI-UI-02] [Validation] Request summary block content and format',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11739', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11740] [MRUI-UI-03] [Validation] \'Pay in instalments\' card content',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11740', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11741] [MRUI-UI-04] [Validation] \'Pay in full today\' card content, SAVE badge and price breakdown',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11741', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11742] [MRUI-UI-05] [Validation] Default state: Pay in instalments selected, discount card unselected, default CTA label',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11742', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11743] [MRUI-UI-06] [Validation] Bottom CTA stays visible (sticky) and nothing is hidden on smaller screens',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11743', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11744] [MRUI-UI-07] [Validation] Screen renders correctly across devices, OS versions and font scaling',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11744', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11745] [MRUI-UI-08] [Boundary] Very long institution name and student name are wrapped/truncated gracefully',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11745', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11746] [MRUI-CALC-01] [Functional] Discount calculation for the design example (SAR 200.00 at 10%)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11746', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11747] [MRUI-CALC-02] [Boundary] Rounding of the discount for fees that produce more than 2 decimals (SAR 199.99)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11747', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11748] [MRUI-CALC-03] [Boundary] Minimum amounts: Education fees SAR 0.01 / SAR 1.00 / SAR 5.00',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11748', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11749] [MRUI-CALC-04] [Boundary] Large amounts: thousands separator and layout (SAR 40,000.00 and SAR 40,000.01)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11749', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11750] [MRUI-CALC-05] [Functional] Discount percentage shown in badge, description and breakdown is consistent with the configured percentage',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11750', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11751] [MRUI-CALC-06] [Functional] Education fees and discount values remain unchanged when switching between the cards',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11751', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11752] [MRUI-SEL-01] [Functional] Selecting \'Pay in full today\' changes the CTA label to \'Pay now\' (English)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11752', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11753] [MRUI-SEL-02] [Functional] Selecting \'Pay in full today\' changes the CTA label to \'ادفع الآن\' (Arabic)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11753', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11754] [MRUI-SEL-03] [Functional] Switching back to \'Pay in instalments\' restores the original CTA label',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11754', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11755] [MRUI-SEL-04] [Functional] Only one option can be selected at any time (mutual exclusion)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11755', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11756] [MRUI-SEL-05] [Functional] Tapping anywhere on a card (title, description, breakdown area) selects it',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11756', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11757] [MRUI-SEL-06] [Functional] Rapid toggling between the two cards keeps the UI state consistent',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11757', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11758] [MRUI-SEL-07] [Functional] Selection is reset to the default (instalments) when the screen is reopened',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11758', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11759] [MRUI-INT-01] [Integration] \'Continue financing application\' starts the financing application for the same request',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11759', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11760] [MRUI-INT-02] [Integration] \'Pay now\' opens the payment gateway with the discounted amount (SAR 180.00)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11760', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11761] [MRUI-INT-03] [Integration] Successful full payment with discount updates the request status and removes it from Pending',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11761', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11762] [MRUI-INT-04] [Integration] Failed or cancelled payment returns the customer to the screen with the request still pending',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11762', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11763] [MRUI-INT-05] [Integration] End-to-end: institution submits request -> customer logs in -> chooses discount',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11763', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11764] [MRUI-INT-06] [Integration] End-to-end: customer submits request on web -> logs in to app -> chooses instalments',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11764', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11765] [MRUI-INT-07] [Integration] Discount availability follows each institution\'s configuration (mixed institutions)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11765', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11766] [MRUI-DIS-01] [Negative] Discount card is not rendered at all and CTA keeps the financing label when discount is disabled',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11766', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11767] [MRUI-DIS-02] [Negative] Discount disabled by the admin while the customer has the screen open',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11767', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11768] [MRUI-DIS-03] [Functional] Discount enabled after the customer first viewed the screen without it',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11768', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11769] [MRUI-DIS-04] [Negative] Institution branch deactivated or payment configuration removed after the screen is loaded',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11769', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11770] [MRUI-NEG-01] [Negative] Request already paid from another channel while the screen is open',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11770', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11771] [MRUI-NEG-02] [Negative] Request cancelled/withdrawn by the institution while the screen is open',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11771', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11772] [MRUI-NEG-03] [Negative] Education fees edited by the institution after the customer loaded the screen',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11772', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11773] [MRUI-NEG-04] [Negative] Network connection lost while loading the screen',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11773', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11774] [MRUI-NEG-05] [Negative] Network connection lost after tapping \'Pay now\'',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11774', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11775] [MRUI-NEG-06] [Negative] Double/multiple taps on \'Pay now\' and \'Continue financing application\' create only one action',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11775', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11776] [MRUI-NEG-07] [Negative] Session timeout while the screen is open',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11776', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11777] [MRUI-NEG-08] [Negative] App sent to background/killed while on the screen and then reopened',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11777', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11778] [MRUI-SEC-01] [Security] Customer can only see his own pending requests (no cross-customer data exposure)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11778', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11779] [MRUI-SEC-02] [Security] Screen is protected by authentication after logout',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11779', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11780] [MRUI-SEC-03] [Security] Amount fields are read-only and the gateway amount cannot be altered by the customer',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11780', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11781] [MRUI-SEC-04] [Security] Sensitive request data is hidden in the app-switcher/screenshot preview (if applicable to the app policy)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11781', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11782] [MRUI-AR-01] [Validation] Full screen verification in Arabic (RTL) against the Arabic design',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11782', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11783] [MRUI-AR-02] [Validation] Arabic screen when discount is not enabled',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11783', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11784] [MRUI-AR-03] [Functional] Switching app language while on the screen keeps selection and refreshes the texts',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11784', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11785] [MRUI-AR-04] [Validation] Mixed-language content renders correctly (Arabic names inside the English UI and vice versa)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11785', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11786] [MRUI-REG-01] [Regression] Existing financing application flow is unchanged after selecting instalments',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11786', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11787] [MRUI-REG-02] [Regression] Login flow is unaffected for customers with no pending requests and for biometric/OTP logins',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11787', blocked: 'manual/device case (C-Manual/device)' },
    async () => {}
  );

  test(
    '[11789] [MRUI-REG-04] [Regression] Existing \'Pay with Discount\' behaviour on the Request Finance screen is unaffected',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11789', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11790] [MRUI-REG-05] [Regression] Paid request appears in the existing paid-fees section with the correct data after a discount payment',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11790', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11950', blocked: 'not implemented yet' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11951', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11952] Customer App / Customer / Pay with Discount Receipt_ Receipt shows tuition, discount and total paid after discount',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11952', blocked: 'not implemented yet' },
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11953', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11954] Customer App / Customer / Pay with Discount_ Failed discount payment shows the failure message in English and Arabic and nothing is charged',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payWithDiscount,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11954', blocked: 'not implemented yet' },
    async () => {}
  );
});
