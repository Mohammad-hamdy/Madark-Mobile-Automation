import { BasePage } from '@madark/pages/00-common/BasePage';

/** SignupRegistrationFormScreen: ID number, email, Terms & Privacy and SIMAH consents. */
export class SignupFormPage extends BasePage {
  private readonly title: string;
  private readonly subtitle: string;
  private readonly idField: string;
  private readonly emailField: string;
  private readonly idFormatError: string;
  private readonly emailFormatError: string;
  private readonly genericError: string;
  private readonly termsCheckbox: string;
  private readonly simahCheckbox: string;
  private readonly termsLink: string;
  private readonly privacyLink: string;
  private readonly simahLink: string;
  private readonly createAccountButton: string;
  private readonly connectionError: string;

  constructor() {
    super();
    this.title = this.byTextContains('signup_form_title');
    this.subtitle = this.byTextContains('signup_form_sub_title');
    this.idField = this.byHint('signup_form_id_hint');
    this.emailField = this.byHint('signup_form_email_hint');
    this.idFormatError = this.byTextContains('invalid_saudi_id_number');
    this.emailFormatError = this.byTextContains('invalid_email');
    this.genericError = this.byTextContains('generic_field_validation_error');
    this.termsCheckbox = this.structural('termsCheckbox', 'checkbox', 'BaseAuthCheckBoxWidget has no key; Terms & Privacy is the 1st checkbox on the form', 1);
    this.simahCheckbox = this.structural('simahCheckbox', 'checkbox', 'BaseAuthCheckBoxWidget has no key; SIMAH consent is the 2nd checkbox on the form', 2);
    this.termsLink = this.byTextContains('signup_form_terms_link');
    this.privacyLink = this.byTextContains('signup_form_privacy_link');
    this.simahLink = this.byTextContains('simah_consent_link');
    this.createAccountButton = this.byText('create_account_title');
    this.connectionError = this.byTextContains('connection_error');
  }

  async isRegistrationFormVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isRegistrationFormVisible', () => this.isElementDisplayed(this.subtitle, timeout));
  }

  async isTitleVisible(): Promise<boolean> {
    return this.then('isTitleVisible', () => this.isElementDisplayed(this.title));
  }

  async isIdFormatErrorVisible(): Promise<boolean> {
    return this.then('isIdFormatErrorVisible', () => this.isElementDisplayed(this.idFormatError));
  }

  async isEmailFormatErrorVisible(): Promise<boolean> {
    return this.then('isEmailFormatErrorVisible', () => this.isElementDisplayed(this.emailFormatError));
  }

  async isGenericErrorVisible(): Promise<boolean> {
    return this.then('isGenericErrorVisible', () => this.isElementDisplayed(this.genericError, this.timeouts.medium));
  }

  async isConnectionErrorVisible(): Promise<boolean> {
    return this.then('isConnectionErrorVisible', () => this.isElementDisplayed(this.connectionError, this.timeouts.medium));
  }

  async isCreateAccountButtonEnabled(): Promise<boolean> {
    return this.then('isCreateAccountButtonEnabled', () => this.isElementEnabled(this.createAccountButton));
  }

  async isTermsChecked(): Promise<boolean> {
    return this.then('isTermsChecked', () => this.isChecked(this.termsCheckbox));
  }

  async isSimahChecked(): Promise<boolean> {
    return this.then('isSimahChecked', () => this.isChecked(this.simahCheckbox));
  }

  async getIdNumber(): Promise<string> {
    return this.then('getIdNumber', async () => (await this.getFieldValue(this.idField)).replace(/\D/g, ''));
  }

  async getEmail(): Promise<string> {
    return this.then('getEmail', async () => (await this.getFieldValue(this.emailField)).trim());
  }

  async clickOnTermsCheckbox(): Promise<void> {
    return this.when('clickOnTermsCheckbox', () => this.tap(this.termsCheckbox));
  }

  async clickOnSimahCheckbox(): Promise<void> {
    return this.when('clickOnSimahCheckbox', () => this.tap(this.simahCheckbox));
  }

  async checkTerms(): Promise<void> {
    return this.when('checkTerms', async () => {
      if (!(await this.isChecked(this.termsCheckbox))) await this.tap(this.termsCheckbox);
    });
  }

  async uncheckTerms(): Promise<void> {
    return this.when('uncheckTerms', async () => {
      if (await this.isChecked(this.termsCheckbox)) await this.tap(this.termsCheckbox);
    });
  }

  async checkSimah(): Promise<void> {
    return this.when('checkSimah', async () => {
      if (!(await this.isChecked(this.simahCheckbox))) await this.tap(this.simahCheckbox);
    });
  }

  async uncheckSimah(): Promise<void> {
    return this.when('uncheckSimah', async () => {
      if (await this.isChecked(this.simahCheckbox)) await this.tap(this.simahCheckbox);
    });
  }

  async clickOnTermsLink(): Promise<void> {
    return this.when('clickOnTermsLink', () => this.tap(this.termsLink));
  }

  async clickOnPrivacyLink(): Promise<void> {
    return this.when('clickOnPrivacyLink', () => this.tap(this.privacyLink));
  }

  async clickOnSimahLink(): Promise<void> {
    return this.when('clickOnSimahLink', () => this.tap(this.simahLink));
  }

  async clickOnCreateAccountButton(): Promise<void> {
    return this.when('clickOnCreateAccountButton', () => this.tap(this.createAccountButton));
  }

  async enterIdNumber(id: string): Promise<void> {
    return this.when('enterIdNumber', () => this.typeInto(this.idField, id));
  }

  async enterExtraIdCharacters(chars: string): Promise<void> {
    return this.when('enterExtraIdCharacters', () => this.typeKeys(this.idField, chars));
  }

  async enterEmail(email: string): Promise<void> {
    return this.when('enterEmail', () => this.typeInto(this.emailField, email));
  }

  async enterEmailKeys(chars: string): Promise<void> {
    return this.when('enterEmailKeys', () => this.typeKeys(this.emailField, chars));
  }

  async clearEmail(): Promise<void> {
    return this.when('clearEmail', async () => {
      const el = await this.waitForDisplayed(this.emailField);
      await el.click();
      await el.clearValue();
    });
  }
}
