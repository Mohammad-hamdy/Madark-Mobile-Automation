import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('Institutions', () => {
  test(
    '[11896] Customer App / Customer / Universities_ All Universities list matches Figma (filter chip All 104.89x36 radius 12, Governmental / Private Medium 13/19.5 #6B7280)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.institutions,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11896', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11897] Customer App / Customer / Universities_ Filter state matches Figma (active chip, count badge, filter icon)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.institutions,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11897', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11898] Customer App / Customer / Universities_ University card matches Figma (173x178.1, radius 16, #FFFFFF, shadow #000000 7%)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.institutions,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11898', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11899] Customer App / Customer / University Details_ University details screen matches Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.institutions,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11899', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11900] Customer App / Customer / Schools_ All Schools list matches Figma and the Financing Request button text is readable',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.institutions,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11900', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11901] Customer App / Customer / Institutions_ Empty list and empty search states match the design system',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.institutions,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11901', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11902] Customer App / Customer / Institutions_ List loads by education type and All / Governmental / Private filters return the right institutions',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.institutions,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11902', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11903] Customer App / Customer / Institutions_ Search returns matching institutions and no match shows the empty search state',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.institutions,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11903', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11904] Customer App / Customer / Institutions_ City filter limits the list to the selected city',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.institutions,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11904', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11905] Customer App / Customer / Institution Details_ Details opens from the list and starts a financing request for that branch',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.institutions,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11905', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11906] Customer App / Customer / Institutions_ Refresh works when no institutions are available',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.institutions,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11906', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );
});
