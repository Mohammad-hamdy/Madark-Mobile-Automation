import { BasePage } from '@madark/pages/BasePage';

export class OtpPage extends BasePage {
  private readonly smsSentTitle: string;
  private readonly sentToLabel: string;
  private readonly otpField: string;
  private readonly verifyButton: string;
  private readonly resendLink: string;

  constructor() {
    super();
    this.smsSentTitle = this.byTextContains('otp_send_sms_title');
    this.sentToLabel = this.byTextContains('otp_send_verification_code_title');
    this.otpField = this.structural(
      'otpField',
      'textField',
      'PinCodeTextField in base_otp_widget.dart has no key/Semantics/label; it is the only input on LoginOtpScreen'
    );
    this.verifyButton = this.byTextContains('otp_verify');
    this.resendLink = this.byTextContains('otp_not_receive_code_title');
  }

  async isOtpScreenVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isOtpScreenVisible', () => this.isElementDisplayed(this.smsSentTitle, timeout));
  }

  async getSentToText(): Promise<string> {
    return this.then('getSentToText', () => this.getText(this.sentToLabel));
  }

  async isVerifyButtonEnabled(): Promise<boolean> {
    return this.then('isVerifyButtonEnabled', () => this.isElementEnabled(this.verifyButton));
  }

  async clickOnVerifyButton(): Promise<void> {
    return this.when('clickOnVerifyButton', () => this.tap(this.verifyButton));
  }

  async clickOnResendLink(): Promise<void> {
    return this.when('clickOnResendLink', () => this.tap(this.resendLink));
  }

  async enterOtp(otp: string): Promise<void> {
    return this.when('enterOtp', () => this.typeKeys(this.otpField, otp));
  }
}
