import { BasePage } from '@madark/pages/00-common/BasePage';

/** EarlySettlementScreen + success / failure screens. */
export class EarlySettlementPage extends BasePage {
  private readonly title: string;
  private readonly remainingInstallmentsLabel: string;
  private readonly amountPerEachLabel: string;
  private readonly totalRemainingLabel: string;
  private readonly paymentDateLabel: string;
  private readonly payNowButton: string;
  private readonly successTitle: string;
  private readonly successBody: string;
  private readonly viewReceiptButton: string;
  private readonly failureTitle: string;
  private readonly retryButton: string;
  private readonly backToPaymentsButton: string;

  constructor() {
    super();
    this.title = this.byTextContains('loan_early_settlement_title');
    this.remainingInstallmentsLabel = this.byTextContains('loan_remaining_installments_title');
    this.amountPerEachLabel = this.byTextContains('loan_amount_per_each_title');
    this.totalRemainingLabel = this.byTextContains('total_remaining_installments_title');
    this.paymentDateLabel = this.byTextContains('loan_early_settlement_payment_date');
    this.payNowButton = this.byText('loan_installment_pay_now_title');
    this.successTitle = this.byTextContains('early_settlement_success_title');
    this.successBody = this.byTextContains('early_settlement_success_sub_title2');
    this.viewReceiptButton = this.byTextContains('view_settlement_receipt_button_title');
    this.failureTitle = this.byTextContains('early_settlement_failure_title');
    this.retryButton = this.byTextContains('retry_settlement_title');
    this.backToPaymentsButton = this.byTextContains('back_to_my_payments_title');
  }

  async isEarlySettlementVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isEarlySettlementVisible', async () =>
      (await this.isElementDisplayed(this.totalRemainingLabel, timeout)) && (await this.isElementDisplayed(this.title, this.timeouts.short))
    );
  }

  async areSummaryRowsVisible(): Promise<boolean> {
    return this.then('areSummaryRowsVisible', async () => {
      for (const l of [this.remainingInstallmentsLabel, this.amountPerEachLabel, this.totalRemainingLabel, this.paymentDateLabel]) if (!(await this.isElementDisplayed(l))) return false;
      return true;
    });
  }

  async getTotalRemaining(): Promise<string> {
    return this.then('getTotalRemaining', async () => (await this.screenTexts()).filter((t) => /\d[\d,]*\.\d{2}/.test(t)).slice(-1)[0]?.match(/\d[\d,]*\.\d{2}/)?.[0] ?? '');
  }

  async isSuccessVisible(timeout = 180_000): Promise<boolean> {
    return this.then('isSuccessVisible', async () => (await this.isElementDisplayed(this.successTitle, timeout)) && (await this.isElementDisplayed(this.successBody)));
  }

  async isFailureVisible(timeout = 180_000): Promise<boolean> {
    return this.then('isFailureVisible', () => this.isElementDisplayed(this.failureTitle, timeout));
  }

  async clickOnPayNowButton(): Promise<void> {
    return this.when('clickOnPayNowButton', () => this.tap(this.payNowButton));
  }

  async clickOnViewReceiptButton(): Promise<void> {
    return this.when('clickOnViewReceiptButton', () => this.tap(this.viewReceiptButton));
  }

  async clickOnRetryButton(): Promise<void> {
    return this.when('clickOnRetryButton', () => this.tap(this.retryButton));
  }

  async clickOnBackToMyPaymentsButton(): Promise<void> {
    return this.when('clickOnBackToMyPaymentsButton', () => this.tap(this.backToPaymentsButton));
  }
}
