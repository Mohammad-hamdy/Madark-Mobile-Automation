import { BasePage } from '@madark/pages/00-common/BasePage';

/** Withdraw Requests list, active loans, Select Student (create), and withdrawal details. */
export class WithdrawalPage extends BasePage {
  private readonly listTitle: string;
  private readonly addButton: string;
  private readonly activeLoanStatus: string;
  private readonly continueButton: string;
  private readonly selectStudentTitle: string;
  private readonly selectStudentMessage: string;
  private readonly timingLabel: string;
  private readonly timingFirstWeek: string;
  private readonly attachmentsTitle: string;
  private readonly addImageButton: string;
  private readonly maxAttachments: string;
  private readonly fileTooLarge: string;
  private readonly noStudents: string;
  private readonly submitButton: string;
  private readonly submitFailed: string;
  private readonly submittedSuccessfully: string;
  private readonly requestNumberLabel: string;
  private readonly currentStatusLabel: string;
  private readonly loanInformation: string;
  private readonly requestInformation: string;
  private readonly financialSummary: string;
  private readonly outstandingAmount: string;
  private readonly payOutstandingButton: string;
  private readonly rejectionReason: string;
  private readonly reviewMessage: string;
  private readonly backToWithdrawalsButton: string;

  constructor() {
    super();
    this.listTitle = this.byTextContains('withdraw_requests');
    this.addButton = `(${this.structural('addWithdrawalButton', 'button', 'FloatingActionButton(Icon(Icons.add)) has no key/Semantics/text; it is the last button on Withdraw Requests')})`.replace(/\[1\]\)$/, '[last()])');
    this.activeLoanStatus = this.byText('withdrawal_loan_status_active');
    this.continueButton = this.byText('continue');
    this.selectStudentTitle = this.byText('select_withdraw_student');
    this.selectStudentMessage = this.byTextContains('select_withdraw_student_msg');
    this.timingLabel = this.byTextContains('withdrawal_timing');
    this.timingFirstWeek = this.byText('Week1');
    this.attachmentsTitle = this.byTextContains('attachments_optional');
    this.addImageButton = this.byTextContains('add_image');
    this.maxAttachments = this.byTextContains('max_attachments_reached');
    this.fileTooLarge = this.byTextContains('file_size_too_large');
    this.noStudents = this.byTextContains('no_students');
    this.submitButton = this.byText('submit');
    this.submitFailed = this.byTextContains('failed_to_submit_withdrawal');
    this.submittedSuccessfully = this.byTextContains('withdraw_submitted_successfully');
    this.requestNumberLabel = this.byTextContains('my_request_request_number_title');
    this.currentStatusLabel = this.byTextContains('current_status');
    this.loanInformation = this.byTextContains('loan_information');
    this.requestInformation = this.byTextContains('request_information');
    this.financialSummary = this.byTextContains('financial_summary');
    this.outstandingAmount = this.byTextContains('outstanding_amount');
    this.payOutstandingButton = this.byTextContains('pay_outstanding');
    this.rejectionReason = this.byTextContains('rejection_reason');
    this.reviewMessage = this.byTextContains('withdrawal_review_message');
    this.backToWithdrawalsButton = this.byTextContains('back_to_my_withdrawal_title');
  }

  async isWithdrawRequestsVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isWithdrawRequestsVisible', () => this.isElementDisplayed(this.listTitle, timeout));
  }

  async isRequestVisible(requestNumber: string): Promise<boolean> {
    return this.then('isRequestVisible', () => this.isElementDisplayed(this.byDynamicText(requestNumber), this.timeouts.medium));
  }

  async getRequestCount(): Promise<number> {
    return this.then('getRequestCount', () => this.countMatches(this.requestNumberLabel));
  }

  async isSelectStudentVisible(): Promise<boolean> {
    return this.then('isSelectStudentVisible', () => this.isElementDisplayed(this.selectStudentTitle, this.timeouts.long));
  }

  async isSelectStudentMessageVisible(): Promise<boolean> {
    return this.then('isSelectStudentMessageVisible', () => this.isElementDisplayed(this.selectStudentMessage, this.timeouts.medium));
  }

  async isNoStudentsVisible(): Promise<boolean> {
    return this.then('isNoStudentsVisible', () => this.isElementDisplayed(this.noStudents, this.timeouts.medium));
  }

  async isAttachmentsSectionVisible(): Promise<boolean> {
    return this.then('isAttachmentsSectionVisible', () => this.isElementDisplayed(this.attachmentsTitle));
  }

  async isMaxAttachmentsVisible(): Promise<boolean> {
    return this.then('isMaxAttachmentsVisible', () => this.isElementDisplayed(this.maxAttachments, this.timeouts.medium));
  }

  async isFileTooLargeVisible(): Promise<boolean> {
    return this.then('isFileTooLargeVisible', () => this.isElementDisplayed(this.fileTooLarge, this.timeouts.medium));
  }

  async isSubmitFailedVisible(): Promise<boolean> {
    return this.then('isSubmitFailedVisible', () => this.isElementDisplayed(this.submitFailed, this.timeouts.medium));
  }

  async isSubmittedVisible(): Promise<boolean> {
    return this.then('isSubmittedVisible', () => this.isElementDisplayed(this.submittedSuccessfully, this.timeouts.long));
  }

  async isDetailsVisible(): Promise<boolean> {
    return this.then('isDetailsVisible', async () =>
      (await this.isElementDisplayed(this.currentStatusLabel, this.timeouts.long)) && (await this.isElementDisplayed(this.loanInformation, this.timeouts.short))
    );
  }

  async isStatusVisible(label: string): Promise<boolean> {
    return this.then('isStatusVisible', () => this.isElementDisplayed(this.byDynamicText(label), this.timeouts.medium));
  }

  async isRequestInformationVisible(): Promise<boolean> {
    return this.then('isRequestInformationVisible', async () => {
      await this.scrollTo(this.requestInformation).catch(() => undefined);
      return this.isElementDisplayed(this.requestInformation);
    });
  }

  async isFinancialSummaryVisible(): Promise<boolean> {
    return this.then('isFinancialSummaryVisible', async () => {
      await this.scrollTo(this.outstandingAmount).catch(() => undefined);
      return (await this.isElementDisplayed(this.financialSummary)) && (await this.isElementDisplayed(this.outstandingAmount));
    });
  }

  async isRejectionReasonVisible(reason?: string): Promise<boolean> {
    return this.then('isRejectionReasonVisible', async () => {
      await this.scrollTo(this.rejectionReason).catch(() => undefined);
      if (!(await this.isElementDisplayed(this.rejectionReason))) return false;
      return reason ? this.isTextOnScreen(reason) : true;
    });
  }

  async isReviewMessageVisible(): Promise<boolean> {
    return this.then('isReviewMessageVisible', () => this.isElementDisplayed(this.reviewMessage));
  }

  async clickOnAddButton(): Promise<void> {
    return this.when('clickOnAddButton', () => this.tap(this.addButton));
  }

  async clickOnLoan(loanNumber: string): Promise<void> {
    return this.when('clickOnLoan', () => this.tap(this.byDynamicText(loanNumber)));
  }

  async clickOnFirstActiveLoan(): Promise<void> {
    return this.when('clickOnFirstActiveLoan', () => this.tap(this.nth(this.activeLoanStatus, 1)));
  }

  async clickOnContinueButton(): Promise<void> {
    return this.when('clickOnContinueButton', () => this.tap(this.continueButton));
  }

  async clickOnStudent(name: string): Promise<void> {
    return this.when('clickOnStudent', () => this.tap(this.byDynamicText(name)));
  }

  async clickOnTimingDropdown(): Promise<void> {
    return this.when('clickOnTimingDropdown', () => this.tap(this.timingLabel));
  }

  async selectFirstWeekOption(): Promise<void> {
    return this.when('selectFirstWeekOption', () => this.tap(this.timingFirstWeek));
  }

  async clickOnAddImageButton(n = 1): Promise<void> {
    return this.when('clickOnAddImageButton', () => this.tap(this.nth(this.addImageButton, n)));
  }

  async clickOnSubmitButton(): Promise<void> {
    return this.when('clickOnSubmitButton', () => this.tap(this.submitButton));
  }

  async clickOnRequest(requestNumber: string): Promise<void> {
    return this.when('clickOnRequest', () => this.tap(this.byDynamicText(requestNumber)));
  }

  async clickOnPayOutstandingButton(): Promise<void> {
    return this.when('clickOnPayOutstandingButton', () => this.tap(this.payOutstandingButton));
  }

  async clickOnBackToWithdrawalsButton(): Promise<void> {
    return this.when('clickOnBackToWithdrawalsButton', () => this.tap(this.backToWithdrawalsButton));
  }
}
