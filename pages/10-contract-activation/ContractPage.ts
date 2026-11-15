import { BasePage } from '@madark/pages/00-common/BasePage';
import { MobileGestures } from '@madark/utils/mobile-gestures';

/** RequestContractScreen: contract PDF, terms checkbox, Confirm / Cancel. */
export class ContractPage extends BasePage {
  private readonly termsText: string;
  private readonly termsCheckbox: string;
  private readonly confirmButton: string;
  private readonly cancelButton: string;

  constructor() {
    super();
    this.termsText = this.byTextContains('contract_terms_acceptance_text');
    this.termsCheckbox = this.structural('termsCheckbox', 'checkbox', 'contract terms checkbox has no key; it is the only checkbox on the contract screen');
    this.confirmButton = this.byText('contract_confirm_button_title');
    this.cancelButton = this.byText('cancel_request_title');
  }

  async isContractVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isContractVisible', () => this.isElementDisplayed(this.termsText, timeout));
  }

  async isConfirmButtonEnabled(): Promise<boolean> {
    return this.then('isConfirmButtonEnabled', () => this.isElementEnabled(this.confirmButton));
  }

  async isTermsChecked(): Promise<boolean> {
    return this.then('isTermsChecked', () => this.isChecked(this.termsCheckbox));
  }

  async scrollContractToEnd(): Promise<void> {
    return this.when('scrollContractToEnd', async () => {
      for (let i = 0; i < 8; i++) await MobileGestures.swipeUp();
    });
  }

  async checkTerms(): Promise<void> {
    return this.when('checkTerms', async () => {
      if (!(await this.isChecked(this.termsCheckbox))) await this.tap(this.termsCheckbox);
    });
  }

  async clickOnConfirmButton(): Promise<void> {
    return this.when('clickOnConfirmButton', () => this.tap(this.confirmButton));
  }

  async clickOnCancelButton(): Promise<void> {
    return this.when('clickOnCancelButton', () => this.tap(this.cancelButton));
  }
}
