import { BasePage } from '@madark/pages/BasePage';
import { EnvSetupPage } from '@madark/pages/common/EnvSetupPage';

export class LoginPage extends BasePage {
  readonly envSetupPage: EnvSetupPage;

  private readonly title: string;
  private readonly subtitle: string;
  private readonly phoneNumberField: string;
  private readonly phoneNumberError: string;
  private readonly loginButton: string;
  private readonly faceIdButton: string;
  private readonly createAccountButton: string;
  private readonly changeMobileNumberLink: string;

  constructor({ envSetupPage }: { envSetupPage?: EnvSetupPage } = {}) {
    super();
    this.envSetupPage = envSetupPage ?? new EnvSetupPage();
    this.title = this.byTextContains('login_Title_label');
    this.subtitle = this.byTextContains('login_sub_title_label');
    this.phoneNumberField = this.byHint('login_phoneNumber_label');
    this.phoneNumberError = this.byTextContains('login_phoneNumber_validation_error');
    this.loginButton = this.byText('login_account_title');
    this.faceIdButton = this.byTextContains('login_face_id_button_title');
    this.createAccountButton = this.byTextContains('login_create_account_title');
    this.changeMobileNumberLink = this.byTextContains('change_mobile_number_button');
  }

  async isLoginScreenVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isLoginScreenVisible', () => this.isElementDisplayed(this.title, timeout));
  }

  async isSubtitleVisible(): Promise<boolean> {
    return this.then('isSubtitleVisible', () => this.isElementDisplayed(this.subtitle));
  }

  async isPhoneNumberErrorVisible(): Promise<boolean> {
    return this.then('isPhoneNumberErrorVisible', () => this.isElementDisplayed(this.phoneNumberError));
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return this.then('isLoginButtonEnabled', () => this.isElementEnabled(this.loginButton));
  }

  async getPhoneNumber(): Promise<string> {
    return this.then('getPhoneNumber', async () => (await this.getFieldValue(this.phoneNumberField)).replace(/\D/g, ''));
  }

  async getInputFieldCount(): Promise<number> {
    return this.then('getInputFieldCount', () => this.countOf('textField'));
  }

  async clickOnLoginButton(): Promise<void> {
    return this.when('clickOnLoginButton', () => this.tap(this.loginButton));
  }

  async clickOnFaceIdButton(): Promise<void> {
    return this.when('clickOnFaceIdButton', () => this.tap(this.faceIdButton));
  }

  async clickOnCreateAccountButton(): Promise<void> {
    return this.when('clickOnCreateAccountButton', () => this.tap(this.createAccountButton));
  }

  async clickOnChangeMobileNumberLink(): Promise<void> {
    return this.when('clickOnChangeMobileNumberLink', () => this.tap(this.changeMobileNumberLink));
  }

  async enterPhoneNumber(phone: string): Promise<void> {
    return this.when('enterPhoneNumber', () => this.typeInto(this.phoneNumberField, phone));
  }

  async enterExtraPhoneCharacters(chars: string): Promise<void> {
    return this.when('enterExtraPhoneCharacters', () => this.typeKeys(this.phoneNumberField, chars));
  }
}
