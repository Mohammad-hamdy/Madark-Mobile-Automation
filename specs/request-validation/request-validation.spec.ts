import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('RequestValidation', () => {
  test(
    '[11921] Customer App / Customer / Ineligible_ Ineligible screen matches Figma (title ExtraBold 22/33 #0F2340, body Regular 14/23.1, Back to Requests 353x56 radius 18)',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.requestValidation,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11921', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11922] Customer App / Customer / Validation Messages_ Field and server error messages use Figma error style (SemiBold 12/17.4 #DC2626) in English and Arabic',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.requestValidation,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11922', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11923] Customer App / Customer / Eligibility_ Ineligible customer gets the Ineligible result and no request is created',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.requestValidation,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11923', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11924] Customer App / Customer / Duplicate Request_ Open request for the same student blocks a second request',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.requestValidation,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11924', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11925] Customer App / Customer / Requested Amount_ Requested amount rejects zero, negative, non-numeric and above-limit values as in the current implementation',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.requestValidation,
    Tag.type.functional,
    Tag.type.boundary,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11925', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11926] Customer App / Customer / SIMAH Consent_ Request cannot be submitted without accepting the SIMAH disclosure',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.requestValidation,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11926', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11927] Customer App / Customer / Rejection Cap_ Customer at the rejection cap cannot submit a financing request',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.requestValidation,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11927', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11928] Customer App / Customer / Salary Certificate_ Request waiting for a salary certificate stays waiting after the Day 2 reminder',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.requestValidation,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11928', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11929] Customer App / Customer / Session_ Session expiry during the request asks for login and keeps entered data safe',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.requestValidation,
    Tag.type.functional,
    Tag.type.security,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11929', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11930] Customer App / Customer / Branch_ Inactive branch or institution cannot receive a new request',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.requestValidation,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11930', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );
});
