import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('Payment', () => {
  test(
    '[11983] Customer App / Customer / My Payments_ My Payments screen matches Figma (title ExtraBold 18/27, subtitle Regular 12/18 #7D8795, All Installments Bold 15/22.5 #0F2340)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.payment,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11983', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11984] Customer App / Customer / Pay Now_ Payment method screen matches Figma (title ExtraBold 20/26, Pay 345x60 radius 16 Bold 18/27 ls 0.2, Pay with Card Bold 16/24 #0CB5BE)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11984', blocked: 'manual/device case (C-Manual/device)' },
    async () => {}
  );

  test(
    '[11985] Customer App / Customer / Payment Confirmed_ Payment Confirmed screen matches Figma (title ExtraBold 22/33, body Regular 14/23.1, View Receipt and Back to My Payments 337x56)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11985', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11986] Customer App / Customer / Payment Failed_ Payment Failed screen matches Figma (icon, title ExtraBold 22/33, Retry Payment)',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11986', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11987] Customer App / Customer / Payment Overdue_ Payment Overdue screen matches Figma (Remind Me Later and Pay Now)',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11987', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11988] Customer App / Customer / Pay Ahead_ Multiple installments success matches Figma (View & Share Receipt 295.67x55 radius 16 Bold 15/22.5)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.payment,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11988', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11989] Customer App / Customer / Invoice_ Invoice matches Figma (labels Regular 13/19.5 #7D8795, values Bold 13/19.5 #0F2340, page 1 / 2)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11989', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11990] Customer App / Customer / My Payments_ Payments Completed state matches Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.payment,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11990', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11991] Customer App / Customer / My Payments_ Arabic RTL payments with SAR amount format',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11991', blocked: 'not implemented yet' },
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11992', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11993] Customer App / Customer / Payment Gateway_ AlinmaPay failure falls back to Geidea automatically',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.payment,
    Tag.type.functional,
    Tag.type.integration,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11993', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11994', blocked: 'not implemented yet' },
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11995', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11996] Customer App / Customer / Payment Gateway_ Gateway failure shows Payment Failed and Retry Payment works',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.payment,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11996', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11997] Customer App / Customer / Overdue_ Overdue installment is flagged and Pay Now opens payment',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11997', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11998] Customer App / Customer / Installment Amount_ Amounts with halalas are charged and shown exactly',
    Tag.Corner,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.functional,
    Tag.type.boundary,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11998', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11999] Customer App / Customer / Payment_ Double tap on Pay creates one payment only',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.functional,
    Tag.type.security,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11999', blocked: 'not implemented yet' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12000', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12001] Customer App / Customer / Proof of Debt_ Debt Proof button is shown as in Figma and opens the proof of debt document',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12001', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12002] Customer App / Customer / Receipt_ Receipt can be viewed and shared',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12002', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12003] Customer App / Customer / Payment_ Network loss after the gateway returns still updates the installment status',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.payment,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12003', blocked: 'not implemented yet' },
    async () => {}
  );
});
