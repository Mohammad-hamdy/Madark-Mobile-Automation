import { BasePage } from '@madark/pages/BasePage';

export class BottomNavPage extends BasePage {
  private readonly homeTab: string;
  private readonly requestsTab: string;
  private readonly paymentsTab: string;
  private readonly moreTab: string;

  constructor() {
    super();
    this.homeTab = this.byTextContains('bnb_home_title');
    this.requestsTab = this.byTextContains('bnb_my_requests_title');
    this.paymentsTab = this.byTextContains('bnb_my_payments_title');
    this.moreTab = this.byTextContains('bnb_more_title');
  }

  async isBottomNavigationVisible(): Promise<boolean> {
    return this.then('isBottomNavigationVisible', async () => {
      for (const tab of [this.homeTab, this.requestsTab, this.paymentsTab, this.moreTab]) {
        if (!(await this.isElementDisplayed(tab))) return false;
      }
      return true;
    });
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
