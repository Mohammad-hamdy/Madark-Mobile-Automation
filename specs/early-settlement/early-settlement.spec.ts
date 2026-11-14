import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('EarlySettlement', () => {
  test(
    '[12004] Customer App / Customer / Early Settlement_ Early Settlement screen matches Figma (title Bold 17/25.5 #0F2340, loan card 353 wide radius 24 fill #FFFFFF 88%)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.earlySettlement,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12004', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12005] Customer App / Customer / Early Settlement_ Early Settlement Failed screen matches Figma (title ExtraBold 22/33, Retry Settlement and Back to My Payments 345x56)',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.earlySettlement,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12005', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12006] Customer App / Customer / Early Settlement_ Pay Early button text size matches Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.earlySettlement,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12006', blocked: 'not implemented yet' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12007', blocked: 'not implemented yet' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12008', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[12009] Customer App / Customer / Early Settlement_ Settlement failure shows the failed screen and retry works',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.earlySettlement,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12009', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12010] Customer App / Customer / Early Settlement_ Cancelling at the gateway leaves the loan unchanged',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.earlySettlement,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12010', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12011] Customer App / Customer / Early Settlement_ Early settlement is not offered for a fully paid loan',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.earlySettlement,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12011', blocked: 'not implemented yet' },
    async () => {}
  );
});
