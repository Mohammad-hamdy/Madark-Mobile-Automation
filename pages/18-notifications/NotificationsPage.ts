import { BasePage } from '@madark/pages/00-common/BasePage';

/** NotificationsScreen: type filters with counts, mark all as read, list, details sheet, empty state. */
export class NotificationsPage extends BasePage {
  private readonly title: string;
  private readonly filterAll: string;
  private readonly filterRead: string;
  private readonly filterUnread: string;
  private readonly markAllReadButton: string;
  private readonly emptyMessage: string;
  private readonly okButton: string;
  private readonly firstNotification: string;

  constructor() {
    super();
    this.title = this.byText('notification_title');
    this.filterAll = this.byTextContains('notification_type_all_title');
    this.filterRead = this.byTextContains('notification_type_read_title');
    this.filterUnread = this.byTextContains('notification_type_unread_title');
    this.markAllReadButton = this.byTextContains('notifications_mark_all_read_title');
    this.emptyMessage = this.byTextContains('no_notifications_title');
    this.okButton = this.byText('notification_ok_button_title');
    this.firstNotification = this.structural('firstNotification', 'view', 'notification rows have no key; titles come from the server — the first row under the filters is used', 6);
  }

  async isNotificationsVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isNotificationsVisible', async () =>
      (await this.isElementDisplayed(this.filterUnread, timeout)) || (await this.isElementDisplayed(this.emptyMessage, this.timeouts.short))
    );
  }

  async areFiltersVisible(): Promise<boolean> {
    return this.then('areFiltersVisible', async () =>
      (await this.isElementDisplayed(this.filterAll)) && (await this.isElementDisplayed(this.filterRead)) && (await this.isElementDisplayed(this.filterUnread))
    );
  }

  async getUnreadCount(): Promise<number> {
    return this.then('getUnreadCount', async () => {
      const t = await this.readText(this.filterUnread).catch(() => '');
      return Number(/(\d+)/.exec(t)?.[1] ?? 0);
    });
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return this.then('isEmptyStateVisible', () => this.isElementDisplayed(this.emptyMessage, this.timeouts.medium));
  }

  async isDetailsSheetVisible(): Promise<boolean> {
    return this.then('isDetailsSheetVisible', () => this.isElementDisplayed(this.okButton, this.timeouts.medium));
  }

  async isNotificationVisible(title: string): Promise<boolean> {
    return this.then('isNotificationVisible', () => this.isElementDisplayed(this.byDynamicText(title), this.timeouts.medium));
  }

  async clickOnAllFilter(): Promise<void> {
    return this.when('clickOnAllFilter', () => this.tap(this.filterAll));
  }

  async clickOnReadFilter(): Promise<void> {
    return this.when('clickOnReadFilter', () => this.tap(this.filterRead));
  }

  async clickOnUnreadFilter(): Promise<void> {
    return this.when('clickOnUnreadFilter', () => this.tap(this.filterUnread));
  }

  async clickOnMarkAllReadButton(): Promise<void> {
    return this.when('clickOnMarkAllReadButton', () => this.tap(this.markAllReadButton));
  }

  async clickOnNotification(title?: string): Promise<void> {
    return this.when('clickOnNotification', () => this.tap(title ? this.byDynamicText(title) : this.firstNotification));
  }

  async clickOnOkButton(): Promise<void> {
    return this.when('clickOnOkButton', () => this.tap(this.okButton));
  }
}
