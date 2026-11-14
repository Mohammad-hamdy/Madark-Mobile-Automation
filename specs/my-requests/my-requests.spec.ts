import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('MyRequests', () => {
  test(
    '[11734] [MRUI-MYR-01] [Functional] Open \'Choose how to pay\' from My Requests > Pending requests (discount enabled)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11734', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11735] [MRUI-MYR-02] [Functional] Open \'Choose how to pay\' from My Requests > Pending requests (discount not enabled)',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11735', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11736] [MRUI-MYR-03] [Negative] Requests in non-pending tabs do not open the \'Choose how to pay\' screen',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11736', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11737] [MRUI-MYR-04] [Functional] Consistency - same request shows identical data from the post-login screen and from My Requests',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11737', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11788] [MRUI-REG-03] [Regression] My Requests tabs, filters and list items still work as before',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11788', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11955] Customer App / Customer / My Requests_ My Requests header and tabs match Figma (title ExtraBold 22/33 #0F2340, active tab Bold 13/19.5 #0CB5BE with 2.5px #0DB4BE underline, inactive Medium #7D8795)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.myRequests,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11955', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11956] Customer App / Customer / My Requests_ Request card matches Figma (353 wide, radius 20, fill #FFFFFF 90%, border #0CB5BE 12%, label Regular 11/16.5 #7D8795, value Bold 14/21 #0F2340)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11956', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11957] Customer App / Customer / My Requests_ All 7 status tabs of the current app use the Figma tab style (active Bold 13/19.5 #0CB5BE, inactive Medium 13/19.5 #7D8795)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11957', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11958] Customer App / Customer / My Requests_ Empty tab state matches the design system',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.myRequests,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11958', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11959] Customer App / Customer / My Requests_ Arabic RTL tabs are mirrored',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11959', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11960] Customer App / Customer / My Requests_ Each status tab lists only requests in that status',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.myRequests,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11960', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11961] Customer App / Customer / Request Details_ Request card opens details with steps',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.myRequests,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11961', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11962] Customer App / Customer / My Requests_ Approved request Proceed opens completion',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.myRequests,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11962', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11963] Customer App / Customer / My Requests_ Rejected or cancelled request shows the reason in the app language',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11963', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11964] Customer App / Customer / Paid Tuition Fees_ Paid tuition fees tab opens the receipt',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11964', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11965] Customer App / Customer / My Requests_ Status refreshes after an action or reopening the app',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.myRequests,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11965', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );
});
