import { BasePage } from '@madark/pages/00-common/BasePage';

/** SignupPhoneScreen: "Create account" phone entry (also reached from guest CTAs). */
export class SignupPhonePage extends BasePage {
  private readonly title: string;
  private readonly subtitle: string;
  private readonly phoneNumberField: string;
  private readonly phoneNumberError: string;
  private readonly otpNotice: string;
  private readonly nextButton: string;

  constructor() {
    super();
    this.title = this.byTextContains('signUp_Title_label');
    this.subtitle = this.byTextContains('signup_sub_title_label');
    this.phoneNumberField = this.byHint('login_phoneNumber_label');
    this.phoneNumberError = this.byTextContains('invalid_saudi_number');
    this.otpNotice = this.byTextContains('login_otp_notice');
    this.nextButton = this.byText('next_button_title');
  }

  async isSignupPhoneScreenVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isSignupPhoneScreenVisible', async () =>
      (await this.isElementDisplayed(this.subtitle, timeout)) && (await this.isElementDisplayed(this.title, this.timeouts.short))
    );
  }

  async isOtpNoticeVisible(): Promise<boolean> {
    return this.then('isOtpNoticeVisible', () => this.isElementDisplayed(this.otpNotice));
  }

  async isPhoneNumberErrorVisible(): Promise<boolean> {
    return this.then('isPhoneNumberErrorVisible', () => this.isElementDisplayed(this.phoneNumberError));
  }

  async isNextButtonEnabled(): Promise<boolean> {
    return this.then('isNextButtonEnabled', () => this.isElementEnabled(this.nextButton));
  }

  async getPhoneNumber(): Promise<string> {
    return this.then('getPhoneNumber', async () => (await this.getFieldValue(this.phoneNumberField)).replace(/\D/g, ''));
  }

  async getPhoneNumberShown(): Promise<string> {
    return this.then('getPhoneNumberShown', () => this.getFieldValue(this.phoneNumberField));
  }

  async isPhoneFieldLeftToRight(): Promise<boolean> {
    return this.then('isPhoneFieldLeftToRight', async () => {
      const shown = (await this.getFieldValue(this.phoneNumberField)).replace(/[\s‎‏]/g, '');
      return /^\d+$/.test(shown);
    });
  }

  async clickOnNextButton(): Promise<void> {
    return this.when('clickOnNextButton', () => this.tap(this.nextButton));
  }

  async enterPhoneNumber(phone: string): Promise<void> {
    return this.when('enterPhoneNumber', () => this.typeInto(this.phoneNumberField, phone));
  }

  async enterExtraPhoneCharacters(chars: string): Promise<void> {
    return this.when('enterExtraPhoneCharacters', () => this.typeKeys(this.phoneNumberField, chars));
  }

  async pastePhoneNumber(text: string): Promise<void> {
    return this.when('pastePhoneNumber', async () => {
      await driver.setClipboard(Buffer.from(text, 'utf8').toString('base64'), 'plaintext');
      const el = await this.waitForDisplayed(this.phoneNumberField);
      await el.click();
      await el.clearValue().catch(() => undefined);
      await driver.execute('mobile: shell', { command: 'input', args: ['keyevent', '279'] }).catch(async () => {
        await el.setValue(text);
      });
    });
  }
}
