import { BasePage } from '@madark/pages/00-common/BasePage';

/** Registration result screens: AML ineligible (AmlErrorScreen) and phone/ID mismatch (TahakokErrorScreen). */
export class RegistrationResultPage extends BasePage {
  private readonly amlTitle: string;
  private readonly amlMessage: string;
  private readonly backToLoginButton: string;
  private readonly mismatchMessage: string;
  private readonly editPhoneButton: string;
  private readonly attemptsExceededTitle: string;

  constructor() {
    super();
    this.amlTitle = this.byTextContains('aml_error_title');
    this.amlMessage = this.byTextContains('aml_error_sub_title');
    this.backToLoginButton = this.byTextContains('aml_error_button_title');
    this.mismatchMessage = this.byTextContains('nafath_error_sub_title');
    this.editPhoneButton = this.byTextContains('nafath_error_button_title');
    this.attemptsExceededTitle = this.byTextContains('edit_pn_validation_max_attempts_title');
  }

  async isAmlErrorVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isAmlErrorVisible', async () =>
      (await this.isElementDisplayed(this.backToLoginButton, timeout)) && (await this.isElementDisplayed(this.amlTitle))
    );
  }

  async isAmlMessageVisible(): Promise<boolean> {
    return this.then('isAmlMessageVisible', () => this.isElementDisplayed(this.amlMessage));
  }

  async isNotEligibleVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isNotEligibleVisible', () => this.isElementDisplayed(this.editPhoneButton, timeout));
  }

  async isMismatchMessageVisible(): Promise<boolean> {
    return this.then('isMismatchMessageVisible', () => this.isElementDisplayed(this.mismatchMessage));
  }

  async isAttemptsExceededVisible(): Promise<boolean> {
    return this.then('isAttemptsExceededVisible', () => this.isElementDisplayed(this.attemptsExceededTitle, this.timeouts.medium));
  }

  async clickOnBackToLoginButton(): Promise<void> {
    return this.when('clickOnBackToLoginButton', () => this.tap(this.backToLoginButton));
  }

  async clickOnEditPhoneButton(): Promise<void> {
    return this.when('clickOnEditPhoneButton', () => this.tap(this.editPhoneButton));
  }
}
