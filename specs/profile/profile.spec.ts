import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('Profile', () => {
  test(
    '[12024] Customer App / Customer / Change Mobile Number_ Not Eligible change-mobile screen matches Figma (title ExtraBold 28/33.6 ls -0.73 #0B1736, body Regular 14.5/24.94 #6B7280)',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.profile,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12024', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12025] Customer App / Customer / Edit Profile_ Profile shows the customer data',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.profile,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12025', blocked: 'manual/device case (C-Manual/device)' },
    async () => {}
  );

  test(
    '[12026] Customer App / Customer / Edit Email_ Email change needs OTP and rejects an invalid email',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.profile,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12026', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[12027] Customer App / Customer / Edit Phone Number_ Phone change needs OTP and identity verification',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.profile,
    Tag.type.functional,
    Tag.type.integration,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12027', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12028] Customer App / Customer / Change Password_ Password change enforces the rules and shows Passwords do not match. Please try again.',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.profile,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12028', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12029] Customer App / Customer / Biometric Login_ Enable and disable biometric login from profile',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.profile,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12029', blocked: 'manual/device case (C-Manual/device)' },
    async () => {}
  );

  test(
    '[12030] Customer App / Customer / Close Account_ Close account with OTP succeeds and is blocked while a loan is active',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.profile,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12030', blocked: 'not implemented yet' },
    async () => {}
  );
});
