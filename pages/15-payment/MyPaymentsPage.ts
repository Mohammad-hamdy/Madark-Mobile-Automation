import { BasePage } from '@madark/pages/00-common/BasePage';
import { MobileGestures } from '@madark/utils/mobile-gestures';

/** My Payments tab: loan selector, loan card, installments list, pay now / ahead / full, overdue prompt. */
export class MyPaymentsPage extends BasePage {
  private readonly title: string;
  private readonly subtitle: string;
  private readonly selectLoanDropdown: string;
  private readonly tapToViewDetails: string;
  private readonly totalAmountLabel: string;
  private readonly totalBalanceDue: string;
  private readonly allInstallmentsTitle: string;
  private readonly filterAll: string;
  private readonly filterPaid: string;
  private readonly filterUpcoming: string;
  private readonly payNowButton: string;
  private readonly invoiceButton: string;
  private readonly paidStatus: string;
  private readonly overdueStatus: string;
  private readonly upcomingStatus: string;
  private readonly upNextStatus: string;
  private readonly payAheadButton: string;
  private readonly payEarlyMultipleButton: string;
  private readonly payFullButton: string;
  private readonly viewAllInstallments: string;
  private readonly showLess: string;
  private readonly noPayments: string;
  private readonly proofOfDebtButton: string;
  private readonly overdueTitle: string;
  private readonly remindMeLaterButton: string;

  constructor() {
    super();
    this.title = this.byTextContains('my_payments_page_title');
    this.subtitle = this.byTextContains('my_payments_subtitle');
    this.selectLoanDropdown = this.byTextContains('choose_loan_title');
    this.tapToViewDetails = this.byTextContains('tap_to_view_details_title');
    this.totalAmountLabel = this.byTextContains('loan_total_amount_title');
    this.totalBalanceDue = this.byTextContains('payment_total_due_title');
    this.allInstallmentsTitle = this.byTextContains('all_installments_title');
    this.filterAll = this.byText('filter_all_title');
    this.filterPaid = this.byText('filter_paid_title');
    this.filterUpcoming = this.byText('filter_upcoming_title');
    this.payNowButton = this.byText('loan_installment_pay_now_title');
    this.invoiceButton = this.byText('loan_installment_invoice_title');
    this.paidStatus = this.byTextContains('loan_installment_paid_title');
    this.overdueStatus = this.byTextContains('loan_installment_overdue_title');
    this.upcomingStatus = this.byTextContains('loan_installment_upcoming_title');
    this.upNextStatus = this.byTextContains('loan_installment_up_next_title');
    this.payAheadButton = this.byTextContains('pay_early_button_title');
    this.payEarlyMultipleButton = this.byTextContains('pay_early_multiple_button_title');
    this.payFullButton = this.byTextContains('loan_full_settlement_button');
    this.viewAllInstallments = this.byTextContains('view_all_installments_title');
    this.showLess = this.byTextContains('show_less_installments_title');
    this.noPayments = this.byTextContains('no_payments_available_title');
    this.proofOfDebtButton = this.byTextContains('verify_debt');
    this.overdueTitle = this.byTextContains('payment_overdue_title');
    this.remindMeLaterButton = this.byTextContains('remind_me_later_title');
  }

  async isMyPaymentsVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isMyPaymentsVisible', async () =>
      (await this.isElementDisplayed(this.title, timeout)) && (await this.isElementDisplayed(this.subtitle, this.timeouts.short))
    );
  }

  async isLoanCardVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isLoanCardVisible', async () =>
      (await this.isElementDisplayed(this.totalAmountLabel, timeout)) || (await this.isElementDisplayed(this.totalBalanceDue, this.timeouts.short))
    );
  }

  async isInstallmentsListVisible(): Promise<boolean> {
    return this.then('isInstallmentsListVisible', async () => {
      await this.scrollTo(this.allInstallmentsTitle).catch(() => undefined);
      return this.isElementDisplayed(this.allInstallmentsTitle);
    });
  }

  async areFiltersVisible(): Promise<boolean> {
    return this.then('areFiltersVisible', async () =>
      (await this.isElementDisplayed(this.filterAll)) && (await this.isElementDisplayed(this.filterPaid)) && (await this.isElementDisplayed(this.filterUpcoming))
    );
  }

  async isPayNowVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isPayNowVisible', () => this.isElementDisplayed(this.payNowButton, timeout));
  }

  async isOverdueStatusVisible(): Promise<boolean> {
    return this.then('isOverdueStatusVisible', () => this.isElementDisplayed(this.overdueStatus, this.timeouts.medium));
  }

  async isPaidStatusVisible(): Promise<boolean> {
    return this.then('isPaidStatusVisible', () => this.isElementDisplayed(this.paidStatus, this.timeouts.medium));
  }

  async getPaidInstallmentsCount(): Promise<number> {
    return this.then('getPaidInstallmentsCount', () => this.countMatches(this.paidStatus));
  }

  async isNoPaymentsVisible(): Promise<boolean> {
    return this.then('isNoPaymentsVisible', () => this.isElementDisplayed(this.noPayments, this.timeouts.medium));
  }

  async isOverduePromptVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isOverduePromptVisible', async () =>
      (await this.isElementDisplayed(this.overdueTitle, timeout)) && (await this.isElementDisplayed(this.remindMeLaterButton, this.timeouts.short))
    );
  }

  async isProofOfDebtButtonVisible(): Promise<boolean> {
    return this.then('isProofOfDebtButtonVisible', async () => {
      await this.scrollTo(this.proofOfDebtButton).catch(() => undefined);
      return this.isElementDisplayed(this.proofOfDebtButton, this.timeouts.short);
    });
  }

  async isPayFullVisible(): Promise<boolean> {
    return this.then('isPayFullVisible', () => this.isElementDisplayed(this.payFullButton));
  }

  async isUpcomingVisible(): Promise<boolean> {
    return this.then('isUpcomingVisible', async () =>
      (await this.isElementDisplayed(this.upcomingStatus, this.timeouts.short)) || (await this.isElementDisplayed(this.upNextStatus, this.timeouts.short))
    );
  }

  /** First installment row amount (as shown, e.g. "1,250.50 SAR"). */
  async getFirstDueAmount(): Promise<string> {
    return this.then('getFirstDueAmount', async () => (await this.screenTexts()).find((t) => /\d[\d,]*\.\d{2}/.test(t))?.match(/\d[\d,]*\.\d{2}/)?.[0] ?? '');
  }

  async getLoanCardText(): Promise<string> {
    return this.then('getLoanCardText', async () => (await this.screenTexts()).filter((t) => /\d/.test(t)).slice(0, 8).join(' | '));
  }

  async clickOnSelectLoanDropdown(): Promise<void> {
    return this.when('clickOnSelectLoanDropdown', () => this.tap(this.selectLoanDropdown));
  }

  async selectLoanOption(loanNumber: string): Promise<void> {
    return this.when('selectLoanOption', () => this.tap(this.nth(this.byDynamicText(loanNumber), 1)));
  }

  async clickOnTapToViewDetails(): Promise<void> {
    return this.when('clickOnTapToViewDetails', () => this.tap(this.tapToViewDetails));
  }

  async clickOnPayNowButton(): Promise<void> {
    return this.when('clickOnPayNowButton', () => this.tap(this.nth(this.payNowButton, 1)));
  }

  async clickOnInvoiceButton(): Promise<void> {
    return this.when('clickOnInvoiceButton', () => this.tap(this.nth(this.invoiceButton, 1)));
  }

  async clickOnPayAheadButton(): Promise<void> {
    return this.when('clickOnPayAheadButton', async () => {
      if (await this.isElementDisplayed(this.payEarlyMultipleButton, this.timeouts.short)) await this.tap(this.payEarlyMultipleButton);
      else await this.tap(this.nth(this.payAheadButton, 1));
    });
  }

  async clickOnPayFullButton(): Promise<void> {
    return this.when('clickOnPayFullButton', () => this.tap(this.payFullButton));
  }

  async clickOnViewAllInstallments(): Promise<void> {
    return this.when('clickOnViewAllInstallments', () => this.tap(this.viewAllInstallments));
  }

  async clickOnShowLess(): Promise<void> {
    return this.when('clickOnShowLess', () => this.tap(this.showLess));
  }

  async clickOnPaidFilter(): Promise<void> {
    return this.when('clickOnPaidFilter', () => this.tap(this.filterPaid));
  }

  async clickOnUpcomingFilter(): Promise<void> {
    return this.when('clickOnUpcomingFilter', () => this.tap(this.filterUpcoming));
  }

  async clickOnAllFilter(): Promise<void> {
    return this.when('clickOnAllFilter', () => this.tap(this.filterAll));
  }

  async clickOnProofOfDebtButton(): Promise<void> {
    return this.when('clickOnProofOfDebtButton', () => this.tap(this.proofOfDebtButton));
  }

  async clickOnRemindMeLaterButton(): Promise<void> {
    return this.when('clickOnRemindMeLaterButton', () => this.tap(this.remindMeLaterButton));
  }

  async clickOnOverduePayNowButton(): Promise<void> {
    return this.when('clickOnOverduePayNowButton', () => this.tap(`(${this.payNowButton})[last()]`));
  }

  async pullToRefresh(): Promise<void> {
    return this.when('pullToRefresh', () => MobileGestures.swipeDown({ distance: 0.5 }));
  }

  async scrollToEnd(): Promise<void> {
    return this.when('scrollToEnd', async () => {
      for (let i = 0; i < 4; i++) await MobileGestures.swipeUp();
    });
  }
}
