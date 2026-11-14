import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('Notifications', () => {
  test(
    '[12019] Customer App / Customer / Notifications_ Notifications list loads with type filters',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.notifications,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12019', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12020] Customer App / Customer / Notifications_ Mark all as read clears the unread state',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.notifications,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12020', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12021] Customer App / Customer / Notifications_ Tapping a notification opens its details',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.notifications,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12021', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12022] Customer App / Customer / Notifications_ Empty notifications state is shown',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.notifications,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12022', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12023] Customer App / Customer / Push Notification_ Push notification opens the app and refreshes the notifications list',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.notifications,
    Tag.type.functional,
    Tag.type.integration,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12023', blocked: 'manual/device case (C-Manual/device)' },
    async () => {}
  );
});
