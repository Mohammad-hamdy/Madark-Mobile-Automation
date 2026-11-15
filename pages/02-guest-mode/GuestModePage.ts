import { BasePage } from '@madark/pages/00-common/BasePage';

/** GuestModeWidget: the guest bottom sheet (Get Started / Financing request) and the guest card on Requests/Payments. */
export class GuestModePage extends BasePage {
  private readonly paymentsTitle: string;
  private readonly requestsTitle: string;
  private readonly installmentsBenefit: string;
  private readonly receiptsBenefit: string;
  private readonly historyBenefit: string;
  private readonly createAccountButton: string;

  constructor() {
    super();
    this.paymentsTitle = this.byTextContains('guest_mode_bottom_sheet_title');
    this.requestsTitle = this.byTextContains('guest_mode_requests_card_title');
    this.installmentsBenefit = this.byTextContains('guest_mode_bottom_sheet_benefit_installments');
    this.receiptsBenefit = this.byTextContains('guest_mode_bottom_sheet_benefit_receipts');
    this.historyBenefit = this.byTextContains('guest_mode_bottom_sheet_benefit_history');
    this.createAccountButton = this.byTextContains('guest_mode_bottom_sheet_button_title');
  }

  async isGuestSheetVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isGuestSheetVisible', () => this.isElementDisplayed(this.paymentsTitle, timeout));
  }

  async isGuestRequestsCardVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isGuestRequestsCardVisible', () => this.isElementDisplayed(this.requestsTitle, timeout));
  }

  async areBenefitsVisible(): Promise<boolean> {
    return this.then('areBenefitsVisible', async () => {
      for (const b of [this.installmentsBenefit, this.receiptsBenefit, this.historyBenefit]) {
        if (!(await this.isElementDisplayed(b))) return false;
      }
      return true;
    });
  }

  async isCreateAccountButtonVisible(): Promise<boolean> {
    return this.then('isCreateAccountButtonVisible', () => this.isElementDisplayed(this.createAccountButton));
  }

  async clickOnCreateAccountButton(): Promise<void> {
    return this.when('clickOnCreateAccountButton', () => this.tap(this.createAccountButton));
  }
}
