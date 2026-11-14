import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('Home', () => {
  test(
    '[11885] Customer App / Customer / Home_ Logged-in home layout matches Figma (header, cards, sections, bottom navigation)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.home,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11885', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11886] Customer App / Customer / Bottom Navigation_ Bottom navigation matches Figma (active Bold 10/15 #0CB5BE, inactive Medium 10/15 #7D8795: Home, Requests, My Payments, More)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.home,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11886', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11887] Customer App / Customer / Home Summary Card_ Summary card matches Figma (Total Amount Requested, Paid, Remaining, Overdue Payment, Go to Payments)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.home,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11887', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11888] Customer App / Customer / Home_ Loading shimmer and empty sections match the design system',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.home,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11888', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11889] Customer App / Customer / Home_ Arabic RTL home layout',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.home,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11889', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11890] Customer App / Customer / Home_ Education type opens the institutions list for that type',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.home,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11890', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11891] Customer App / Customer / Home_ Special institutions are listed and open their details',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.home,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11891', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11892] Customer App / Customer / Home_ Complete your data widget for an approved, incomplete request opens completion',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.home,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11892', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11893] Customer App / Customer / Home_ Uncompleted loans widget is shown and opens the loan',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.home,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11893', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11894] Customer App / Customer / Home_ Ads and banners are shown as in the current implementation',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.home,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11894', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11895] Customer App / Customer / Home_ Back on home does not leave to login and app resume refreshes the data',
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.home,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11895', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );
});
