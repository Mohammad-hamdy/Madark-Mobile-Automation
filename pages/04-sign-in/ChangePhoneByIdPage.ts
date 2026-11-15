import { BasePage } from '@madark/pages/00-common/BasePage';

/** Change Mobile Number by national ID (from Login), its result screens and the success screen. */
export class ChangePhoneByIdPage extends BasePage {
  private readonly title: string;
  private readonly subtitle: string;
  private readonly idField: string;
  private readonly phoneField: string;
  private readonly idError: string;
  private readonly phoneError: string;
  private readonly confirmButton: string;
  private readonly notEligibleTitle: string;
  private readonly maxAttemptsTitle: string;
  private readonly editPhoneButton: string;
  private readonly verifiedTitle: string;
  private readonly successTitle: string;
  private readonly loginButton: string;

  constructor() {
    super();
    this.title = this.byTextContains('change_mobile_title');
    this.subtitle = this.byTextContains('change_mobile_sub_title');
    this.idField = this.byHint('national_id_hint');
    this.phoneField = this.byHint('phoneNumber_hint');
    this.idError = this.byTextContains('invalid_saudi_id_number');
    this.phoneError = this.byTextContains('invalid_saudi_number');
    this.confirmButton = this.byText('confirm');
    this.notEligibleTitle = this.byTextContains('change_pn_tahakok_validation_not_match_title');
    this.maxAttemptsTitle = this.byTextContains('change_pn_tahakok_validation_max_attempts_title');
    this.editPhoneButton = this.byTextContains('nafath_error_button_title');
    this.verifiedTitle = this.byTextContains('change_pn_verified_title');
    this.successTitle = this.byTextContains('change_phone_number_success_title');
    this.loginButton = this.byText('login_account_title');
  }

  async isChangePhoneScreenVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isChangePhoneScreenVisible', async () =>
      (await this.isElementDisplayed(this.subtitle, timeout)) && (await this.isElementDisplayed(this.title, this.timeouts.short))
    );
  }

  async isIdErrorVisible(): Promise<boolean> {
    return this.then('isIdErrorVisible', () => this.isElementDisplayed(this.idError));
  }

  async isPhoneErrorVisible(): Promise<boolean> {
    return this.then('isPhoneErrorVisible', () => this.isElementDisplayed(this.phoneError));
  }

  async isNotEligibleVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isNotEligibleVisible', async () =>
      (await this.isElementDisplayed(this.notEligibleTitle, timeout)) || (await this.isElementDisplayed(this.editPhoneButton, this.timeouts.short))
    );
  }

  async isMaxAttemptsVisible(): Promise<boolean> {
    return this.then('isMaxAttemptsVisible', () => this.isElementDisplayed(this.maxAttemptsTitle, this.timeouts.medium));
  }

  async isSuccessVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isSuccessVisible', async () =>
      (await this.isElementDisplayed(this.verifiedTitle, timeout)) || (await this.isElementDisplayed(this.successTitle, this.timeouts.short))
    );
  }

  async clickOnConfirmButton(): Promise<void> {
    return this.when('clickOnConfirmButton', () => this.tap(this.confirmButton));
  }

  async clickOnEditPhoneButton(): Promise<void> {
    return this.when('clickOnEditPhoneButton', () => this.tap(this.editPhoneButton));
  }

  async clickOnLoginButton(): Promise<void> {
    return this.when('clickOnLoginButton', () => this.tap(this.loginButton));
  }

  async enterNationalId(id: string): Promise<void> {
    return this.when('enterNationalId', () => this.typeInto(this.idField, id));
  }

  async enterPhoneNumber(phone: string): Promise<void> {
    return this.when('enterPhoneNumber', () => this.typeInto(this.phoneField, phone));
  }
}
