import { BasePage } from '@madark/pages/00-common/BasePage';

/** PayWithDiscountScreen: branch, students and fees, total tuition, discount, total after discount, pay. */
export class PayWithDiscountPage extends BasePage {
  private readonly title: string;
  private readonly branchLabel: string;
  private readonly studentLabel: string;
  private readonly tuitionFeesLabel: string;
  private readonly totalTuitionLabel: string;
  private readonly discountLabel: string;
  private readonly totalAfterDiscountLabel: string;
  private readonly payButton: string;

  constructor() {
    super();
    this.title = this.byText('pay_with_discount');
    this.branchLabel = this.byText('branch_name_label');
    this.studentLabel = this.byTextContains('student_label');
    this.tuitionFeesLabel = this.byText('tuition_fees_label');
    this.totalTuitionLabel = this.byTextContains('total_tuition_fees_label');
    this.discountLabel = this.byText('discount_label');
    this.totalAfterDiscountLabel = this.byTextContains('total_payable_after_discount_label');
    this.payButton = this.nth(this.byText('pay_with_discount'), 2);
  }

  async isPayWithDiscountVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isPayWithDiscountVisible', async () =>
      (await this.isElementDisplayed(this.totalAfterDiscountLabel, timeout)) && (await this.isElementDisplayed(this.discountLabel, this.timeouts.short))
    );
  }

  async areBreakdownRowsVisible(): Promise<boolean> {
    return this.then('areBreakdownRowsVisible', async () => {
      for (const l of [this.branchLabel, this.studentLabel, this.tuitionFeesLabel, this.totalTuitionLabel, this.discountLabel, this.totalAfterDiscountLabel]) {
        await this.scrollTo(l).catch(() => undefined);
        if (!(await this.isElementDisplayed(l))) return false;
      }
      return true;
    });
  }

  /** Numbers shown on the screen in order: tuition rows..., total tuition, discount, total after discount. */
  async getAmounts(): Promise<number[]> {
    return this.then('getAmounts', async () =>
      (await this.screenTexts()).map((t) => /(\d[\d,]*(?:\.\d{1,2})?)/.exec(t.replace(/SAR|ر\.س/g, ''))?.[1]).filter((v): v is string => Boolean(v)).map((v) => Number(v.replace(/,/g, '')))
    );
  }

  async isTitleVisible(): Promise<boolean> {
    return this.then('isTitleVisible', () => this.isElementDisplayed(this.title));
  }

  async clickOnPayButton(): Promise<void> {
    return this.when('clickOnPayButton', async () => {
      if (await this.isElementDisplayed(this.payButton, this.timeouts.short)) await this.tap(this.payButton);
      else await this.tap(`(${this.title})[last()]`);
    });
  }
}
