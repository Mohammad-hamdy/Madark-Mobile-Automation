import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('Withdrawal', () => {
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12012', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12013] Customer App / Customer / Withdrawal_ Submit without students shows the select student message',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.withdrawal,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12013', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12014] Customer App / Customer / Withdrawal_ Existing pending withdrawal blocks a new one',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.withdrawal,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12014', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[12015] Customer App / Customer / Withdrawal Status_ Each withdrawal status shows the right label in English and Arabic',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.withdrawal,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12015', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12016', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12017] Customer App / Customer / Withdrawal Details_ Rejected withdrawal shows the rejection reason and amounts',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.withdrawal,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12017', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[12018] Customer App / Customer / Withdrawal Attachment_ Attachment upload works and failed submit shows the error',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.withdrawal,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12018', blocked: 'not implemented yet' },
    async () => {}
  );
});
