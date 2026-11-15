import { BasePage } from '@madark/pages/00-common/BasePage';

/** Payment Confirmed / Payment Failed sheets shared by installments, pay ahead and discount payments. */
export class PaymentResultPage extends BasePage {
  private readonly successTitle: string;
  private readonly successBodyStart: string;
  private readonly successBodyEnd: string;
  private readonly viewReceiptButton: string;
  private readonly failureTitle: string;
  private readonly failureBody: string;
  private readonly retryButton: string;
  private readonly backToPaymentsButton: string;

  constructor() {
    super();
    this.successTitle = this.byTextContains('payment_success_title');
    this.successBodyStart = this.byTextContains('payment_success_sub_title1');
    this.successBodyEnd = this.byTextContains('payment_success_sub_title2');
    this.viewReceiptButton = this.byTextContains('payment_share_view_receipt_button_title');
    this.failureTitle = this.byTextContains('payment_failure_title');
    this.failureBody = this.byTextContains('payment_failure_sub_title');
    this.retryButton = this.byTextContains('retry_payment_title');
    this.backToPaymentsButton = this.byTextContains('back_to_my_payments_title');
  }

  async isPaymentConfirmedVisible(timeout = 180_000): Promise<boolean> {
    return this.then('isPaymentConfirmedVisible', () => this.isElementDisplayed(this.successTitle, timeout));
  }

  async isPaymentFailedVisible(timeout = 180_000): Promise<boolean> {
    return this.then('isPaymentFailedVisible', async () =>
      (await this.isElementDisplayed(this.failureTitle, timeout)) && (await this.isElementDisplayed(this.failureBody, this.timeouts.short))
    );
  }

  async isPaidAmountShown(amount: string): Promise<boolean> {
    return this.then('isPaidAmountShown', async () => {
      const all = (await this.screenTexts()).join(' ').replace(/[,\s]/g, '');
      return (await this.isElementDisplayed(this.successBodyStart)) && all.includes(amount.replace(/[,\s]/g, ''));
    });
  }

  async isSuccessBodyVisible(): Promise<boolean> {
    return this.then('isSuccessBodyVisible', () => this.isElementDisplayed(this.successBodyEnd));
  }

  async clickOnViewReceiptButton(): Promise<void> {
    return this.when('clickOnViewReceiptButton', () => this.tap(this.viewReceiptButton));
  }

  async clickOnRetryPaymentButton(): Promise<void> {
    return this.when('clickOnRetryPaymentButton', () => this.tap(this.retryButton));
  }

  async clickOnBackToMyPaymentsButton(): Promise<void> {
    return this.when('clickOnBackToMyPaymentsButton', () => this.tap(this.backToPaymentsButton));
  }
}
