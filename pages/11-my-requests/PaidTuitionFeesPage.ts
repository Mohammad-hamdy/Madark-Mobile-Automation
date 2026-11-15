import { BasePage } from '@madark/pages/00-common/BasePage';

/** Paid Tuition Fees cards and the receipt screen (also the Pay with Discount receipt). */
export class PaidTuitionFeesPage extends BasePage {
  private readonly paidStatus: string;
  private readonly amountPaidLabel: string;
  private readonly studentCountLabel: string;
  private readonly paymentDateLabel: string;
  private readonly viewDetailsButton: string;
  private readonly branchLabel: string;
  private readonly tuitionFeesLabel: string;
  private readonly totalTuitionLabel: string;
  private readonly discountLabel: string;
  private readonly totalAfterDiscountLabel: string;
  private readonly paymentTypeLabel: string;
  private readonly transactionReferenceLabel: string;
  private readonly downloadShareButton: string;

  constructor() {
    super();
    this.paidStatus = this.byText('paid_status_label');
    this.amountPaidLabel = this.byTextContains('amount_paid_label');
    this.studentCountLabel = this.byTextContains('student_count_label');
    this.paymentDateLabel = this.byTextContains('payment_date_label');
    this.viewDetailsButton = this.byTextContains('view_details_and_receipt_label');
    this.branchLabel = this.byText('branch_name_label');
    this.tuitionFeesLabel = this.byText('tuition_fees_label');
    this.totalTuitionLabel = this.byTextContains('total_tuition_fees_label');
    this.discountLabel = this.byText('discount_label');
    this.totalAfterDiscountLabel = this.byTextContains('total_payable_after_discount_label');
    this.paymentTypeLabel = this.byTextContains('payment_type_label');
    this.transactionReferenceLabel = this.byTextContains('geidea_transaction_reference_label');
    this.downloadShareButton = this.byTextContains('download_share_receipt_label');
  }

  async isPaidCardVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isPaidCardVisible', () => this.isElementDisplayed(this.viewDetailsButton, timeout));
  }

  async areCardLabelsVisible(): Promise<boolean> {
    return this.then('areCardLabelsVisible', async () => {
      for (const l of [this.paidStatus, this.amountPaidLabel, this.studentCountLabel, this.paymentDateLabel]) if (!(await this.isElementDisplayed(l))) return false;
      return true;
    });
  }

  async getPaidCardCount(): Promise<number> {
    return this.then('getPaidCardCount', () => this.countMatches(this.viewDetailsButton));
  }

  async isReceiptVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isReceiptVisible', async () =>
      (await this.isElementDisplayed(this.totalAfterDiscountLabel, timeout)) && (await this.isElementDisplayed(this.totalTuitionLabel))
    );
  }

  async areReceiptFieldsVisible(): Promise<boolean> {
    return this.then('areReceiptFieldsVisible', async () => {
      for (const l of [this.branchLabel, this.tuitionFeesLabel, this.discountLabel, this.totalAfterDiscountLabel]) {
        await this.scrollTo(l).catch(() => undefined);
        if (!(await this.isElementDisplayed(l))) return false;
      }
      await this.scrollTo(this.paymentTypeLabel).catch(() => undefined);
      return (await this.isElementDisplayed(this.paymentTypeLabel)) && (await this.isElementDisplayed(this.transactionReferenceLabel));
    });
  }

  async isAmountOnScreen(amount: string): Promise<boolean> {
    return this.then('isAmountOnScreen', async () => (await this.screenTexts()).some((t) => t.replace(/[,\s]/g, '').includes(amount.replace(/[,\s]/g, ''))));
  }

  async clickOnViewDetailsButton(): Promise<void> {
    return this.when('clickOnViewDetailsButton', () => this.tap(this.nth(this.viewDetailsButton, 1)));
  }

  async clickOnDownloadShareButton(): Promise<void> {
    return this.when('clickOnDownloadShareButton', () => this.tap(this.downloadShareButton));
  }
}
