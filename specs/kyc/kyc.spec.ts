import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('KYC', () => {
  test(
    '[11931] Customer App / Customer / KYC Stepper_ KYC stepper matches Figma (4 steps, active #3ECFCF, inactive #9CA3AF, step number SemiBold 12/16)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.kYC,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11931', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11932] Customer App / Customer / Personal Information_ Personal Information screen matches Figma (title Bold 18/27 #0B1736, subtitle Regular 12/18 #99A1AF, tiles 350 wide radius 16 border #F0F0F0)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.kYC,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11932', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11933] Customer App / Customer / KYC Selection Sheets_ Nationality, marital status and work sector sheets match Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.kYC,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11933', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11934] Customer App / Customer / Work Data_ Work Data empty state matches Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.kYC,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11934', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11935] Customer App / Customer / KYC Stepper_ Arabic RTL stepper runs right to left with mirrored back icon',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.kYC,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11935', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11936] Customer App / Customer / KYC_ Customer answers all KYC categories and submits',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.kYC,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11936', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11937] Customer App / Customer / KYC_ Required questions block moving to the next step',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.kYC,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11937', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11938] Customer App / Customer / KYC Question Types_ Text, date, single, multi, yes/no, percentage and file questions save the answer',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.kYC,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11938', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11939] Customer App / Customer / KYC Related Questions_ Child questions appear only for the triggering answer',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.kYC,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11939', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11940] Customer App / Customer / KYC Saved Answers_ Returning customer sees saved KYC answers prefilled and editable',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.kYC,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11940', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11941] Customer App / Customer / KYC File Upload_ Valid file uploads, wrong type or size is rejected and retry works',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.kYC,
    Tag.type.functional,
    Tag.type.boundary,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11941', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11942] Customer App / Customer / KYC Stepper_ Back returns to the previous step and keeps the answers',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.kYC,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11942', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11943] Customer App / Customer / KYC_ App kill during KYC resumes with saved answers',
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.kYC,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11943', blocked: 'not implemented yet' },
    async () => {}
  );
});
