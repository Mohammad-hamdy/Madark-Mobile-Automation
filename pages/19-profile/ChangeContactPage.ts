import { BasePage } from '@madark/pages/00-common/BasePage';

/** Change Email and Change Phone Number (signed-in) screens with their success screens. */
export class ChangeContactPage extends BasePage {
  private readonly emailTitle: string;
  private readonly newEmailField: string;
  private readonly emailError: string;
  private readonly confirmButton: string;
  private readonly backToProfileButton: string;
  private readonly phoneTitle: string;
  private readonly newPhoneField: string;
  private readonly phoneError: string;
  private readonly phoneConfirmButton: string;
  private readonly phoneSuccessTitle: string;

  constructor() {
    super();
    this.emailTitle = this.byTextContains('change_email_title');
    this.newEmailField = this.byHint('email_hint');
    this.emailError = this.byTextContains('invalid_email');
    this.confirmButton = this.byText('confirm');
    this.backToProfileButton = this.byTextContains('back_to_my_profile_title');
    this.phoneTitle = this.byTextContains('nafath_change_phone_number_title');
    this.newPhoneField = this.byHint('phoneNumber_hint');
    this.phoneError = this.byTextContains('invalid_saudi_number');
    this.phoneConfirmButton = this.byText('nafath_change_phone_number_button_title');
    this.phoneSuccessTitle = this.byTextContains('change_phone_number_success_title');
  }

  async isChangeEmailVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isChangeEmailVisible', () => this.isElementDisplayed(this.emailTitle, timeout));
  }

  async isEmailErrorVisible(): Promise<boolean> {
    return this.then('isEmailErrorVisible', () => this.isElementDisplayed(this.emailError));
  }

  async isEmailChangedVisible(): Promise<boolean> {
    return this.then('isEmailChangedVisible', () => this.isElementDisplayed(this.backToProfileButton, this.timeouts.long));
  }

  async isChangePhoneVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isChangePhoneVisible', () => this.isElementDisplayed(this.phoneTitle, timeout));
  }

  async isPhoneErrorVisible(): Promise<boolean> {
    return this.then('isPhoneErrorVisible', () => this.isElementDisplayed(this.phoneError));
  }

  async isPhoneChangedVisible(): Promise<boolean> {
    return this.then('isPhoneChangedVisible', () => this.isElementDisplayed(this.phoneSuccessTitle, this.timeouts.long));
  }

  async clickOnConfirmButton(): Promise<void> {
    return this.when('clickOnConfirmButton', () => this.tap(this.confirmButton));
  }

  async clickOnPhoneConfirmButton(): Promise<void> {
    return this.when('clickOnPhoneConfirmButton', () => this.tap(this.phoneConfirmButton));
  }

  async clickOnBackToProfileButton(): Promise<void> {
    return this.when('clickOnBackToProfileButton', () => this.tap(this.backToProfileButton));
  }

  async enterNewEmail(email: string): Promise<void> {
    return this.when('enterNewEmail', () => this.typeInto(this.nth(this.newEmailField, 1), email));
  }

  async enterNewPhone(phone: string): Promise<void> {
    return this.when('enterNewPhone', () => this.typeInto(this.nth(this.newPhoneField, 1), phone));
  }
}
