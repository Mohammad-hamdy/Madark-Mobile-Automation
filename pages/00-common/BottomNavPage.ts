import { BasePage } from '@madark/pages/00-common/BasePage';
import { I18n } from '@madark/i18n/i18n';

export class BottomNavPage extends BasePage {
  private readonly homeTab: string;
  private readonly requestsTab: string;
  private readonly paymentsTab: string;
  private readonly moreTab: string;
  private readonly homeTabArabic: string;

  constructor() {
    super();
    this.homeTab = this.byTextContains('bnb_home_title');
    this.requestsTab = this.byTextContains('bnb_my_requests_title');
    this.paymentsTab = this.byTextContains('bnb_my_payments_title');
    this.moreTab = this.byTextContains('bnb_more_title');
    this.homeTabArabic = this.byLiteral(I18n.textIn('ar', 'bnb_home_title'));
  }

  async isBottomNavigationVisible(): Promise<boolean> {
    return this.then('isBottomNavigationVisible', async () => {
      for (const tab of [this.homeTab, this.requestsTab, this.paymentsTab, this.moreTab]) {
        if (!(await this.isElementDisplayed(tab))) return false;
      }
      return true;
    });
  }

  /** Language the app is showing now (from the Home tab label). */
  async getUiLanguage(): Promise<'ar' | 'en'> {
    return this.then('getUiLanguage', async () => ((await this.isElementDisplayed(this.homeTabArabic, this.timeouts.short)) ? 'ar' : 'en'));
  }

  /** Tabs run right to left in Arabic: Home is the right-most tab. */
  async isHomeTabRightMost(): Promise<boolean> {
    return this.then('isHomeTabRightMost', async () => (await this.getBounds(this.homeTab)).x > (await this.getBounds(this.moreTab)).x);
  }

  async goToHome(): Promise<void> {
    return this.when('goToHome', () => this.tap(this.homeTab));
  }

  async goToRequests(): Promise<void> {
    return this.when('goToRequests', () => this.tap(this.requestsTab));
  }

  async goToPayments(): Promise<void> {
    return this.when('goToPayments', () => this.tap(this.paymentsTab));
  }

  async goToMore(): Promise<void> {
    return this.when('goToMore', () => this.tap(this.moreTab));
  }
}
