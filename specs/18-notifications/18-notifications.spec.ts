import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('18 · Notifications', () => {
  describe('01 · Notifications', () => {
    test(
      '[12019] Customer App / Customer / Notifications_ Notifications list loads with type filters',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.notifications,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12019' },
      async ({ app, data, bottomNav, morePage, notificationsPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithNotifications'));
        await bottomNav.goToMore();
        await morePage.clickOnNotificationsItem();
        manualCheck('Home bell icon has no key/label — opened from More > Notifications');
        expect(await notificationsPage.isNotificationsVisible()).toBe(true);
        expect(await notificationsPage.areFiltersVisible()).toBe(true);
        await notificationsPage.clickOnReadFilter();
        await notificationsPage.clickOnUnreadFilter();
        await notificationsPage.clickOnAllFilter();
        expect(await notificationsPage.isEmptyStateVisible()).toBe(false);
      }
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
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12020' },
      async ({ app, data, bottomNav, morePage, notificationsPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithNotifications'));
        await bottomNav.goToMore();
        await morePage.clickOnNotificationsItem();
        expect(await notificationsPage.isNotificationsVisible()).toBe(true);
        await notificationsPage.clickOnMarkAllReadButton();
        await notificationsPage.clickOnUnreadFilter();
        expect(await notificationsPage.getUnreadCount()).toBe(0);
      }
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
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12021' },
      async ({ app, data, bottomNav, morePage, notificationsPage }) => {
        const n = data.seed('customerWithNotifications');
        await app.ensureLoggedIn(data.seedCustomer('customerWithNotifications'));
        await bottomNav.goToMore();
        await morePage.clickOnNotificationsItem();
        const before = await notificationsPage.getUnreadCount();
        await notificationsPage.clickOnUnreadFilter();
        await notificationsPage.clickOnNotification(n.notificationTitle);
        expect(await notificationsPage.isDetailsSheetVisible()).toBe(true);
        await notificationsPage.clickOnOkButton();
        expect(await notificationsPage.getUnreadCount()).toBeLessThanOrEqual(Math.max(0, before - 1));
      }
    );

    test(
      '[12022] Customer App / Customer / Notifications_ Empty notifications state is shown',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.notifications,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12022' },
      async ({ app, data, bottomNav, morePage, notificationsPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('eligibleCustomer'));
        await bottomNav.goToMore();
        await morePage.clickOnNotificationsItem();
        expect(await notificationsPage.isEmptyStateVisible()).toBe(true);
        await app.goBack();
        await app.switchLanguage('ar');
        await bottomNav.goToMore();
        await morePage.clickOnNotificationsItem();
        expect(await notificationsPage.isEmptyStateVisible()).toBe(true);
        await app.goBack();
        await app.switchLanguage(data.language);
      }
    );
  });

  describe('02 · Push Notification', () => {
    test(
      '[12023] Customer App / Customer / Push Notification_ Push notification opens the app and refreshes the notifications list',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.notifications,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12023', blocked: 'needs QA to send a push notification to the device (FCM) and tap it in the system tray' },
      async () => {}
    );
  });
});
