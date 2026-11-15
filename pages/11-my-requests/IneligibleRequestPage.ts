import { BasePage } from '@madark/pages/00-common/BasePage';

/** Ineligible screen / rejection and cancellation reason sheets. */
export class IneligibleRequestPage extends BasePage {
  private readonly rejectedTitle: string;
  private readonly rejectedDescription: string;
  private readonly rejectionReasonsTitle: string;
  private readonly cancelledTitle: string;
  private readonly cancelledDescription: string;
  private readonly cancellationReasonsTitle: string;
  private readonly backToRequestsButton: string;

  constructor() {
    super();
    this.rejectedTitle = this.byText('my_request_reject_reason_title');
    this.rejectedDescription = this.byTextContains('my_request_reject_reason_desc2');
    this.rejectionReasonsTitle = this.byTextContains('reasons_for_rejection_title');
    this.cancelledTitle = this.byText('my_request_cancel_reason_title');
    this.cancelledDescription = this.byTextContains('my_request_cancel_reason_desc2');
    this.cancellationReasonsTitle = this.byTextContains('reasons_for_cancellation_title');
    this.backToRequestsButton = this.byTextContains('my_request_back_btn_title');
  }

  async isIneligibleVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isIneligibleVisible', async () =>
      (await this.isElementDisplayed(this.rejectionReasonsTitle, timeout)) && (await this.isElementDisplayed(this.rejectedTitle, this.timeouts.short))
    );
  }

  async isCancellationReasonVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isCancellationReasonVisible', async () =>
      (await this.isElementDisplayed(this.cancellationReasonsTitle, timeout)) && (await this.isElementDisplayed(this.cancelledTitle, this.timeouts.short))
    );
  }

  async isRequestNumberVisible(requestNumber: string): Promise<boolean> {
    return this.then('isRequestNumberVisible', () => this.isElementDisplayed(this.byDynamicText(requestNumber)));
  }

  async isReasonTextVisible(reason: string): Promise<boolean> {
    return this.then('isReasonTextVisible', () => this.isElementDisplayed(this.byDynamicText(reason), this.timeouts.medium));
  }

  async isDescriptionVisible(): Promise<boolean> {
    return this.then('isDescriptionVisible', async () =>
      (await this.isElementDisplayed(this.rejectedDescription, this.timeouts.short)) || (await this.isElementDisplayed(this.cancelledDescription, this.timeouts.short))
    );
  }

  async clickOnBackToRequestsButton(): Promise<void> {
    return this.when('clickOnBackToRequestsButton', () => this.tap(this.backToRequestsButton));
  }
}
