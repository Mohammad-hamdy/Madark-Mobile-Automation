import { BasePage } from '@madark/pages/BasePage';

export class MorePage extends BasePage {
  private readonly loginButton: string;

  constructor() {
    super();
    this.loginButton = this.byText('login_account_title');
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return this.then('isLoginButtonVisible', async () => {
      await this.scrollTo(this.loginButton).catch(() => undefined);
      return this.isElementDisplayed(this.loginButton);
    });
  }

  async clickOnLoginButton(): Promise<void> {
    return this.when('clickOnLoginButton', () => this.tap(this.loginButton));
  }
}
