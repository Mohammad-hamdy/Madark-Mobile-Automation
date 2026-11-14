import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('ContractActivation', () => {
  test(
    '[11966] Customer App / Customer / Contract_ PDF contract reader matches Figma (background #525659, header #323639, I accept Contract terms Bold 16 #FFFFFF, Reject Contract Regular 16 #1C1C1C)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.contractActivation,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11966', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11967] Customer App / Customer / Contract OTP_ Contract OTP screen matches Figma (6 boxes 46x61 radius 16, Verify OTP disabled #E4E7EA)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.contractActivation,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11967', blocked: 'not implemented yet' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11968', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11969', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11970', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11971] Customer App / Customer / Activation_ First installment step is required when the request needs first payment',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.contractActivation,
    Tag.type.functional,
    Tag.type.integration,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11971', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11972] Customer App / Customer / Nafith_ Nafith promissory note step completes through callback and handles rejection',
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.contractActivation,
    Tag.type.functional,
    Tag.type.integration,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11972', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11973] Customer App / Customer / Activation_ Activation resumes from the last incomplete step after app kill',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.contractActivation,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11973', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11974', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );
});
