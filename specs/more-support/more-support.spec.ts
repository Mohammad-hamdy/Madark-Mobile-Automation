import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('MoreSupport', () => {
  test(
    '[12031] Customer App / Customer / More_ More menu matches Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.moreSupport,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12031', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12032] Customer App / Customer / More_ More items open About, Sharia, FAQ, Privacy, Terms and Contact Us',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.moreSupport,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12032', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[12033] Customer App / Customer / Contact Us_ Contact channels open phone, email and social links',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.moreSupport,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12033', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[12034] Customer App / Customer / Complaint_ Complaint needs a category and returns a complaint code',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.moreSupport,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12034', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12035] Customer App / Customer / Complaint_ Complaint categories failure shows Failed to load complaint categories',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.moreSupport,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12035', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12036] Customer App / Customer / Share App_ Share app opens the share sheet',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p3,
    Tag.module.moreSupport,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12036', blocked: 'not implemented yet' },
    async () => {}
  );
});
