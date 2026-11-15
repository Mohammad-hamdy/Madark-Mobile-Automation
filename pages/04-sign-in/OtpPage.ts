import { BasePage } from '@madark/pages/00-common/BasePage';
import { Wait } from '@madark/utils/wait';

/** BaseOtpWidget — shared by login, sign-up, change phone and contract OTP screens. */
export class OtpPage extends BasePage {
  private readonly smsSentTitle: string;
  private readonly sentToLabel: string;
  private readonly enterCodeLabel: string;
  private readonly otpField: string;
  private readonly verifyButton: string;
  private readonly resendLink: string;
  private readonly blockedLabel: string;

  constructor() {
    super();
    this.smsSentTitle = this.byTextContains('otp_send_sms_title');
    this.sentToLabel = this.byTextContains('otp_send_verification_code_title');
    this.enterCodeLabel = this.byTextContains('otp_enter_code_label');
    this.otpField = this.structural(
      'otpField',
      'textField',
      'PinCodeTextField in base_otp_widget.dart has no key/Semantics/label; it is the only input on the OTP screens'
    );
    this.verifyButton = this.byTextContains('otp_verify');
    this.resendLink = this.byTextContains('otp_not_receive_code_title');
    this.blockedLabel = this.byTextContains('otp_blocked_wait');
  }

  async isOtpScreenVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isOtpScreenVisible', () => this.isElementDisplayed(this.smsSentTitle, timeout));
  }

  async isEnterCodeLabelVisible(): Promise<boolean> {
    return this.then('isEnterCodeLabelVisible', () => this.isElementDisplayed(this.enterCodeLabel));
  }

  async getSentToText(): Promise<string> {
    return this.then('getSentToText', () => this.getText(this.sentToLabel));
  }

  async isPhoneShownInSentTo(localPhone: string): Promise<boolean> {
    return this.then('isPhoneShownInSentTo', async () => {
      const digits = (await this.screenTexts()).join(' ').replace(/[^\d]/g, '');
      return digits.includes(`966${localPhone}`) || digits.includes(localPhone);
    });
  }

  async isVerifyButtonEnabled(): Promise<boolean> {
    return this.then('isVerifyButtonEnabled', () => this.isElementEnabled(this.verifyButton));
  }

  async isBlockedCountdownVisible(): Promise<boolean> {
    return this.then('isBlockedCountdownVisible', () => this.isElementDisplayed(this.blockedLabel, this.timeouts.medium));
  }

  async getCountdown(): Promise<string> {
    return this.then('getCountdown', async () => (await this.screenTexts()).find((t) => /\b\d{2}:\d{2}\b/.test(t))?.match(/\d{2}:\d{2}/)?.[0] ?? '');
  }

  /** Waits (condition, not sleep) until the 03:00 block message disappears. */
  async waitForBlockToEnd(timeout = 200_000): Promise<boolean> {
    return this.then('waitForBlockToEnd', async () => {
      try {
        await Wait.until(async () => !(await this.isElementDisplayed(this.blockedLabel, 500)), { timeout, interval: 2000, message: 'OTP block ended' });
        return true;
      } catch {
        return false;
      }
    });
  }

  /** Waits until the resend countdown reaches 00:00 (resend link becomes active). */
  async waitForResendEnabled(timeout = 75_000): Promise<boolean> {
    return this.then('waitForResendEnabled', async () => {
      try {
        await Wait.until(async () => ['', '00:00'].includes(await this.getCountdown()), { timeout, interval: 2000, message: 'resend countdown at 00:00' });
        return true;
      } catch {
        return false;
      }
    });
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
