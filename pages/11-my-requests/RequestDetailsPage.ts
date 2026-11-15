import { BasePage } from '@madark/pages/00-common/BasePage';

/** FinancingRequestCompletionScreen: payment breakdown, steps and the current step action. */
export class RequestDetailsPage extends BasePage {
  private readonly proceduresTitle: string;
  private readonly signContractStep: string;
  private readonly depositFirstInstallmentStep: string;
  private readonly signNafithStep: string;
  private readonly verificationCallStep: string;
  private readonly financingCreated: string;
  private readonly goToMyPaymentsButton: string;
  private readonly viewContractButton: string;
  private readonly firstInstallmentLabel: string;
  private readonly monthlyInstallmentLabel: string;
  private readonly installmentsCountLabel: string;
  private readonly totalFinanceLabel: string;
  private readonly approvedAmountLabel: string;
  private readonly installmentScheduleTitle: string;

  constructor() {
    super();
    this.proceduresTitle = this.byTextContains('my_request_financing_procedures');
    this.signContractStep = this.byTextContains('signing_contract_title');
    this.depositFirstInstallmentStep = this.byTextContains('deposit_first_installment_title');
    this.signNafithStep = this.byTextContains('move_to_nafith_title');
    this.verificationCallStep = this.byTextContains('proceed_to_yaster');
    this.financingCreated = this.byTextContains('financing_created_successfully');
    this.goToMyPaymentsButton = this.byTextContains('go_to_my_payments');
    this.viewContractButton = this.byTextContains('view_and_download_contract_title');
    this.firstInstallmentLabel = this.byTextContains('payment_breakdown_total_first_installment');
    this.monthlyInstallmentLabel = this.byTextContains('payment_breakdown_installment_per_month');
    this.installmentsCountLabel = this.byTextContains('payment_breakdown_no_of_installments');
    this.totalFinanceLabel = this.byTextContains('total_finance_amount_label');
    this.approvedAmountLabel = this.byTextContains('approved_amount_label');
    this.installmentScheduleTitle = this.byTextContains('loan_installment_schedule_title');
  }

  async isRequestDetailsVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isRequestDetailsVisible', async () =>
      (await this.isElementDisplayed(this.proceduresTitle, timeout)) || (await this.isElementDisplayed(this.totalFinanceLabel, this.timeouts.short))
    );
  }

  async isRequestNumberVisible(requestNumber: string): Promise<boolean> {
    return this.then('isRequestNumberVisible', () => this.isElementDisplayed(this.byDynamicText(requestNumber), this.timeouts.medium));
  }

  async isPaymentBreakdownVisible(): Promise<boolean> {
    return this.then('isPaymentBreakdownVisible', async () =>
      (await this.isElementDisplayed(this.firstInstallmentLabel)) && (await this.isElementDisplayed(this.monthlyInstallmentLabel)) && (await this.isElementDisplayed(this.installmentsCountLabel))
    );
  }

  async isApprovedAmountVisible(): Promise<boolean> {
    return this.then('isApprovedAmountVisible', () => this.isElementDisplayed(this.approvedAmountLabel));
  }

  async isSignContractStepVisible(): Promise<boolean> {
    return this.then('isSignContractStepVisible', () => this.isElementDisplayed(this.signContractStep));
  }

  async isDepositFirstInstallmentStepVisible(): Promise<boolean> {
    return this.then('isDepositFirstInstallmentStepVisible', async () => {
      await this.scrollTo(this.depositFirstInstallmentStep).catch(() => undefined);
      return this.isElementDisplayed(this.depositFirstInstallmentStep, this.timeouts.short);
    });
  }

  async isNafithStepVisible(): Promise<boolean> {
    return this.then('isNafithStepVisible', async () => {
      await this.scrollTo(this.signNafithStep).catch(() => undefined);
      return this.isElementDisplayed(this.signNafithStep, this.timeouts.short);
    });
  }

  async isVerificationCallStepVisible(): Promise<boolean> {
    return this.then('isVerificationCallStepVisible', () => this.isElementDisplayed(this.verificationCallStep, this.timeouts.short));
  }

  async isFinancingCreatedVisible(): Promise<boolean> {
    return this.then('isFinancingCreatedVisible', async () => {
      await this.scrollTo(this.financingCreated).catch(() => undefined);
      return this.isElementDisplayed(this.financingCreated);
    });
  }

  async isInstallmentScheduleVisible(): Promise<boolean> {
    return this.then('isInstallmentScheduleVisible', async () => {
      await this.scrollTo(this.installmentScheduleTitle).catch(() => undefined);
      return this.isElementDisplayed(this.installmentScheduleTitle);
    });
  }

  /** Steps top-to-bottom order check (signing before deposit before Nafith). */
  async areStepsInOrder(): Promise<boolean> {
    return this.then('areStepsInOrder', async () => {
      const ys: number[] = [];
      for (const step of [this.signContractStep, this.depositFirstInstallmentStep, this.signNafithStep]) {
        if (await this.isElementDisplayed(step, this.timeouts.short)) ys.push((await this.getBounds(step)).y);
      }
      return ys.every((y, i) => i === 0 || y >= ys[i - 1]);
    });
  }

  async clickOnSignContractButton(): Promise<void> {
    return this.when('clickOnSignContractButton', () => this.tap(`(${this.signContractStep})[last()]`));
  }

  async clickOnDepositFirstInstallmentButton(): Promise<void> {
    return this.when('clickOnDepositFirstInstallmentButton', () => this.tap(`(${this.depositFirstInstallmentStep})[last()]`));
  }

  async clickOnSignNafithButton(): Promise<void> {
    return this.when('clickOnSignNafithButton', () => this.tap(`(${this.signNafithStep})[last()]`));
  }

  async clickOnVerificationCallButton(): Promise<void> {
    return this.when('clickOnVerificationCallButton', () => this.tap(`(${this.verificationCallStep})[last()]`));
  }

  async clickOnViewContractButton(): Promise<void> {
    return this.when('clickOnViewContractButton', () => this.tap(this.viewContractButton));
  }

  async clickOnGoToMyPaymentsButton(): Promise<void> {
    return this.when('clickOnGoToMyPaymentsButton', () => this.tap(this.goToMyPaymentsButton));
  }
}
