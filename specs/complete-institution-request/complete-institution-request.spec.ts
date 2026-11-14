import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('CompleteInstitutionRequest', () => {
  test(
    '[11726] [MRUI-SCR-01] [Functional] Post-login screen is displayed for a request submitted by the institution (discount enabled)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11726', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11727] [MRUI-SCR-02] [Functional] Post-login screen is displayed for a request submitted by the customer from the web page (discount enabled)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11727', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11728] [MRUI-SCR-03] [Functional] Post-login screen shows only the instalments option when Pay with Discount is not enabled',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11728', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11729] [MRUI-SCR-04] [Negative] Screen is not displayed after login when the customer has no pending request',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11729', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11730] [MRUI-SCR-05] [Negative] Screen is not displayed for a request that is no longer Pending (already paid / financed)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11730', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11731] [MRUI-SCR-06] [Functional] Customer with multiple pending requests - each request shows its own data without mixing',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11731', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11732] [MRUI-SCR-07] [Functional] Back arrow on the post-login screen returns the customer to Home without changing the request',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11732', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11733] [MRUI-SCR-08] [Functional] Post-login screen is displayed again on the next login while the request is still pending',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11733', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11944] Customer App / Customer / Institution Request_ Pending institution request card and completion screen use revamp tokens (card radius 20, label Regular 11/16.5 #7D8795, value Bold 14/21 #0F2340)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11944', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11945] Customer App / Customer / Institution Request_ Institution-created request shows in Pending with the institution, branch and student data prefilled',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11945', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11946] Customer App / Customer / Institution Request_ Institution prefilled data cannot be edited by the customer',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    Tag.type.security,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11946', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11947] Customer App / Customer / Institution Request_ Customer completes the institution request and it moves to Under review',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    Tag.type.integration,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11947', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11948] Customer App / Customer / Web Page Request_ Customer completes a request added from the Madark web page',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    Tag.type.integration,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11948', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11949] Customer App / Customer / Institution Request_ Request cancelled by the institution during completion cannot be submitted',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.completeInstitutionRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11949', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );
});
