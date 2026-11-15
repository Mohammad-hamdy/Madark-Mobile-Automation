import { BasePage } from '@madark/pages/00-common/BasePage';

/** NafathScreen ("Verify Account"), success screen and the cancel-waiting dialog. */
export class NafathPage extends BasePage {
  private readonly verifyTitle: string;
  private readonly verifySubtitle: string;
  private readonly expiryLabel: string;
  private readonly resendButton: string;
  private readonly cancelBackTitle: string;
  private readonly cancelBackConfirmButton: string;
  private readonly continueWaitingButton: string;
  private readonly successTitle: string;
  private readonly successSubtitle: string;
  private readonly goToLoginButton: string;
  private readonly activateEmailTitle: string;
  private readonly skipEmailButton: string;

  constructor() {
    super();
    this.verifyTitle = this.byTextContains('nafath_verify_account_title');
    this.verifySubtitle = this.byTextContains('nafath_verify_account_sub_title');
    this.expiryLabel = this.byTextContains('nafath_resend_code_title');
    this.resendButton = this.byTextContains('nafath_resend_code_button_title');
    this.cancelBackTitle = this.byTextContains('nafath_cancel_back_title');
    this.cancelBackConfirmButton = this.byTextContains('nafath_cancel_back_confirm_button');
    this.continueWaitingButton = this.byTextContains('nafath_cancel_back_dismiss_button');
    this.successTitle = this.byTextContains('kyc_status_title');
    this.successSubtitle = this.byTextContains('nafath_success_sub_title');
    this.goToLoginButton = this.byTextContains('nafath_success_button_title');
    this.activateEmailTitle = this.byTextContains('activate_email_title');
    this.skipEmailButton = this.byText('skip');
  }

  async isVerifyAccountVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isVerifyAccountVisible', async () =>
      (await this.isElementDisplayed(this.verifyTitle, timeout)) && (await this.isElementDisplayed(this.verifySubtitle))
    );
  }

  async isExpiryCountdownVisible(): Promise<boolean> {
    return this.then('isExpiryCountdownVisible', () => this.isElementDisplayed(this.expiryLabel));
  }

  async isResendEnabled(): Promise<boolean> {
    return this.then('isResendEnabled', () => this.isElementEnabled(this.resendButton));
  }

  async isCancelWaitingDialogVisible(): Promise<boolean> {
    return this.then('isCancelWaitingDialogVisible', () => this.isElementDisplayed(this.cancelBackTitle, this.timeouts.medium));
  }

  async isSuccessVisible(timeout = 150_000): Promise<boolean> {
    return this.then('isSuccessVisible', async () =>
      (await this.isElementDisplayed(this.successSubtitle, timeout)) && (await this.isElementDisplayed(this.successTitle))
    );
  }

  async isActivateEmailSheetVisible(): Promise<boolean> {
    return this.then('isActivateEmailSheetVisible', () => this.isElementDisplayed(this.activateEmailTitle, this.timeouts.medium));
  }

  async clickOnResendButton(): Promise<void> {
    return this.when('clickOnResendButton', () => this.tap(this.resendButton));
  }

  async clickOnContinueWaitingButton(): Promise<void> {
    return this.when('clickOnContinueWaitingButton', () => this.tap(this.continueWaitingButton));
  }

  async clickOnCancelWaitingConfirmButton(): Promise<void> {
    return this.when('clickOnCancelWaitingConfirmButton', () => this.tap(this.cancelBackConfirmButton));
  }

  async clickOnSkipEmailButton(): Promise<void> {
    return this.when('clickOnSkipEmailButton', () => this.tap(this.skipEmailButton));
  }

  async clickOnGoToLoginButton(): Promise<void> {
    return this.when('clickOnGoToLoginButton', () => this.tap(this.goToLoginButton));
  }
}
