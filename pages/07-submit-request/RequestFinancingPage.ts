import { BasePage } from '@madark/pages/00-common/BasePage';
import { I18n } from '@madark/i18n/i18n';
import { isIos } from '@madark/config/capabilities';
import { xpathLiteral } from '@madark/utils/xpath';

/** StudentRequestFinanceScreen: branch, auto academic year, instalment duration, students, plan estimate. */
export class RequestFinancingPage extends BasePage {
  private readonly title: string;
  private readonly branchLabel: string;
  private readonly academicYearLabel: string;
  private readonly durationDropdown: string;
  private readonly noTenorMessage: string;
  private readonly addedStudentsLabel: string;
  private readonly addAnotherStudentButton: string;
  private readonly totalTuitionLabel: string;
  private readonly pendingFeesLabel: string;
  private readonly tuitionFeesLabel: string;
  private readonly monthlyInstallmentLabel: string;
  private readonly continueButton: string;
  private readonly payWithDiscountButton: string;
  private readonly someBlockedTitle: string;
  private readonly allBlockedTitle: string;
  private readonly verifyFailedTitle: string;
  private readonly discountUnavailable: string;
  private readonly okButton: string;

  constructor() {
    super();
    this.title = this.byTextContains('choose_student_title');
    this.branchLabel = this.byTextContains('branch_name_label');
    this.academicYearLabel = this.byTextContains('academic_year');
    this.durationDropdown = this.byTextContains('choose_nationality');
    this.noTenorMessage = this.byTextContains('tenor_none');
    this.addedStudentsLabel = this.byTextContains('added_students_label');
    this.addAnotherStudentButton = this.byTextContains('add_another_student');
    this.totalTuitionLabel = this.byTextContains('total_tuition_fees_label');
    this.pendingFeesLabel = this.byTextContains('pending_fees');
    this.tuitionFeesLabel = this.byTextContains('tuition_fees');
    this.monthlyInstallmentLabel = this.byTextContains('expected_monthly_installment');
    this.continueButton = this.byTextContains('continue_to_next_step');
    this.payWithDiscountButton = this.byText('pay_with_discount');
    this.someBlockedTitle = this.byTextContains('some_students_blocked_title');
    this.allBlockedTitle = this.byTextContains('all_students_blocked_title');
    this.verifyFailedTitle = this.byTextContains('layer2_check_failed_title');
    this.discountUnavailable = this.byTextContains('discount_no_longer_available');
    this.okButton = this.byText('ok_title');
  }

  private durationOption(months: number): string {
    const attr = isIos() ? '@name' : '@content-desc';
    const words = I18n.texts('MONTHS').concat(I18n.texts('MONTH'));
    return `//*[starts-with(normalize-space(${attr}),${xpathLiteral(String(months))}) and (${words.map((w) => `contains(${attr},${xpathLiteral(w)})`).join(' or ')})]`;
  }

  private anyDurationOption(): string {
    const attr = isIos() ? '@name' : '@content-desc';
    const words = I18n.texts('MONTHS').concat(I18n.texts('MONTH'));
    return `//*[${words.map((w) => `contains(${attr},${xpathLiteral(w)})`).join(' or ')}]`;
  }

  async isRequestFinancingVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isRequestFinancingVisible', async () =>
      (await this.isElementDisplayed(this.title, timeout)) && (await this.isElementDisplayed(this.continueButton, this.timeouts.short))
    );
  }

  async isBranchNameVisible(name: string): Promise<boolean> {
    return this.then('isBranchNameVisible', async () =>
      (await this.isElementDisplayed(this.branchLabel)) && (await this.isElementDisplayed(this.byDynamicText(name)))
    );
  }

  async isAcademicYearSelected(): Promise<boolean> {
    return this.then('isAcademicYearSelected', async () => {
      if (!(await this.isElementDisplayed(this.academicYearLabel))) return false;
      return (await this.screenTexts()).some((t) => /\b20\d{2}\b/.test(t));
    });
  }

  async isStudentVisible(name: string): Promise<boolean> {
    return this.then('isStudentVisible', () => this.isElementDisplayed(this.byDynamicText(name), this.timeouts.medium));
  }

  async getAddedStudentsCount(): Promise<number> {
    return this.then('getAddedStudentsCount', async () => {
      const t = await this.readText(this.addedStudentsLabel).catch(() => '');
      return Number(/\((\d+)\)/.exec(t)?.[1] ?? 0);
    });
  }

  async isNoTenorMessageVisible(): Promise<boolean> {
    return this.then('isNoTenorMessageVisible', () => this.isElementDisplayed(this.noTenorMessage));
  }

  async isPlanEstimateVisible(): Promise<boolean> {
    return this.then('isPlanEstimateVisible', async () => {
      await this.scrollTo(this.monthlyInstallmentLabel).catch(() => undefined);
      return this.isElementDisplayed(this.monthlyInstallmentLabel);
    });
  }

  async getPlanEstimateText(): Promise<string> {
    return this.then('getPlanEstimateText', async () => (await this.screenTexts()).filter((t) => /\d/.test(t) && /SAR|ر\.س|﷼/.test(t)).join(' | '));
  }

  async areFeesVisible(): Promise<boolean> {
    return this.then('areFeesVisible', async () =>
      (await this.isElementDisplayed(this.tuitionFeesLabel)) || (await this.isElementDisplayed(this.pendingFeesLabel, this.timeouts.short)) || (await this.isElementDisplayed(this.totalTuitionLabel, this.timeouts.short))
    );
  }

  async isContinueButtonEnabled(): Promise<boolean> {
    return this.then('isContinueButtonEnabled', async () => {
      await this.scrollTo(this.continueButton).catch(() => undefined);
      return this.isElementEnabled(this.continueButton);
    });
  }

  async isPayWithDiscountButtonVisible(timeout = this.timeouts.short): Promise<boolean> {
    return this.then('isPayWithDiscountButtonVisible', () => this.isElementDisplayed(this.payWithDiscountButton, timeout));
  }

  async isStudentsBlockedMessageVisible(): Promise<boolean> {
    return this.then('isStudentsBlockedMessageVisible', async () =>
      (await this.isElementDisplayed(this.someBlockedTitle, this.timeouts.medium)) ||
      (await this.isElementDisplayed(this.allBlockedTitle, this.timeouts.short)) ||
      (await this.isElementDisplayed(this.verifyFailedTitle, this.timeouts.short))
    );
  }

  async isDiscountUnavailableVisible(): Promise<boolean> {
    return this.then('isDiscountUnavailableVisible', () => this.isElementDisplayed(this.discountUnavailable, this.timeouts.medium));
  }

  async getDurationOptions(): Promise<number[]> {
    return this.then('getDurationOptions', async () =>
      (await this.screenTexts()).map((t) => /^\s*(\d+)/.exec(t)?.[1]).filter((v): v is string => Boolean(v)).map(Number).filter((n) => n > 0 && n <= 60)
    );
  }

  async clickOnStudent(name: string): Promise<void> {
    return this.when('clickOnStudent', () => this.tap(this.byDynamicText(name)));
  }

  async clickOnDurationDropdown(): Promise<void> {
    return this.when('clickOnDurationDropdown', async () => {
      await this.scrollTo(this.durationDropdown).catch(() => undefined);
      const open = (await this.isElementDisplayed(this.durationDropdown, this.timeouts.short)) ? this.durationDropdown : this.nth(this.anyDurationOption(), 1);
      await this.tap(open);
    });
  }

  async selectDurationOption(months: number): Promise<void> {
    return this.when('selectDurationOption', () => this.tap(this.nth(this.durationOption(months), 1)));
  }

  async selectFirstDurationOption(): Promise<void> {
    return this.when('selectFirstDurationOption', () => this.tap(this.nth(this.anyDurationOption(), 1)));
  }

  async clickOnAddAnotherStudentButton(): Promise<void> {
    return this.when('clickOnAddAnotherStudentButton', () => this.tap(this.addAnotherStudentButton));
  }

  async clickOnContinueButton(): Promise<void> {
    return this.when('clickOnContinueButton', () => this.tap(this.continueButton));
  }

  async clickOnPayWithDiscountButton(): Promise<void> {
    return this.when('clickOnPayWithDiscountButton', () => this.tap(this.payWithDiscountButton));
  }

  async clickOnOkButton(): Promise<void> {
    return this.when('clickOnOkButton', () => this.tap(this.okButton));
  }
}
