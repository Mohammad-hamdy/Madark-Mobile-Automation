import { BasePage } from '@madark/pages/00-common/BasePage';

/** Account Deactivated / login failure (locked device) screens shown instead of Home. */
export class AccountStatusPage extends BasePage {
  private readonly deactivatedTitle: string;
  private readonly deactivatedMessage: string;
  private readonly lockedTitle: string;
  private readonly lockedMessage: string;
  private readonly backToLoginButton: string;
  private readonly contactSupportButton: string;

  constructor() {
    super();
    this.deactivatedTitle = this.byTextContains('deActive_account_error_title');
    this.deactivatedMessage = this.byTextContains('deActive_account_error_sub_title');
    this.lockedTitle = this.byTextContains('locked_account_title');
    this.lockedMessage = this.byTextContains('locked_account_sub_title');
    this.backToLoginButton = this.byTextContains('deActive_account_button_title');
    this.contactSupportButton = this.byTextContains('contact_support_title');
  }

  async isAccountStatusVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isAccountStatusVisible', async () =>
      (await this.isElementDisplayed(this.deactivatedTitle, timeout)) || (await this.isElementDisplayed(this.lockedTitle, this.timeouts.short))
    );
  }

  async isStatusMessageVisible(): Promise<boolean> {
    return this.then('isStatusMessageVisible', async () =>
      (await this.isElementDisplayed(this.deactivatedMessage)) || (await this.isElementDisplayed(this.lockedMessage, this.timeouts.short))
    );
  }

  async isContactSupportButtonVisible(): Promise<boolean> {
    return this.then('isContactSupportButtonVisible', () => this.isElementDisplayed(this.contactSupportButton));
  }

  async clickOnBackToLoginButton(): Promise<void> {
    return this.when('clickOnBackToLoginButton', () => this.tap(this.backToLoginButton));
  }

  async clickOnContactSupportButton(): Promise<void> {
    return this.when('clickOnContactSupportButton', () => this.tap(this.contactSupportButton));
  }
}
