import { BasePage } from '@madark/pages/00-common/BasePage';

export class SessionExpiredPage extends BasePage {
  private readonly title: string;
  private readonly hint: string;
  private readonly loginButton: string;

  constructor() {
    super();
    this.title = this.byTextContains('session_expired_title');
    this.hint = this.byTextContains('session_expired_hint');
    this.loginButton = this.byText('login_account_title');
  }

  async isSessionExpiredVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isSessionExpiredVisible', async () =>
      (await this.isElementDisplayed(this.title, timeout)) && (await this.isElementDisplayed(this.hint))
    );
  }

  async clickOnLoginButton(): Promise<void> {
    return this.when('clickOnLoginButton', () => this.tap(this.loginButton));
  }
}
