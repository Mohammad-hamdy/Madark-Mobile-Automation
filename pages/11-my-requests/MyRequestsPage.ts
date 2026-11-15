import { BasePage } from '@madark/pages/00-common/BasePage';
import { MobileGestures } from '@madark/utils/mobile-gestures';

export type RequestTab = 'rescheduled' | 'pending' | 'underReview' | 'approved' | 'rejected' | 'cancelled' | 'paidTuition';

/** My Requests tab: 7 status tabs, request cards and their actions. */
export class MyRequestsPage extends BasePage {
  private readonly title: string;
  private readonly tabs: Record<RequestTab, string>;
  private readonly requestNumberLabel: string;
  private readonly pendingCardLabel: string;
  private readonly proceedButton: string;
  private readonly viewDetailsButton: string;
  private readonly continueKycButton: string;
  private readonly cancelRequestButton: string;
  private readonly payWithDiscountButton: string;
  private readonly rejectReasonButton: string;
  private readonly cancelReasonButton: string;
  private readonly emptyTitle: string;
  private readonly emptySubtitle: string;
  private readonly inactiveMessage: string;
  private readonly expiredTitle: string;
  private readonly expiredOkButton: string;
  private readonly requestForFinancingCard: string;

  constructor() {
    super();
    this.title = this.byTextContains('my_requests_title');
    this.tabs = {
      rescheduled: this.byTextContains('rescheduled_requests'),
      pending: this.byText('pending_requests'),
      underReview: this.byText('my_requests_under_review_title'),
      approved: this.byText('my_requests_approved_title'),
      rejected: this.byText('my_requests_rejected_title'),
      cancelled: this.byText('my_requests_cancelled_title'),
      paidTuition: this.byTextContains('paid_tuition_fees_tab_title'),
    };
    this.requestNumberLabel = this.byTextContains('my_request_request_number_title');
    this.pendingCardLabel = this.byTextContains('pending_card_submission_date');
    this.proceedButton = this.byTextContains('my_request_proceed_title');
    this.viewDetailsButton = this.byTextContains('my_request_view_details_title');
    this.continueKycButton = this.byTextContains('continue_kyc');
    this.cancelRequestButton = this.byText('cancel_request');
    this.payWithDiscountButton = this.byText('pay_with_discount');
    this.rejectReasonButton = this.byTextContains('my_request_check_reject_reasons_title');
    this.cancelReasonButton = this.byTextContains('my_request_check_cancel_reasons_title');
    this.emptyTitle = this.byTextContains('empty_requests_title');
    this.emptySubtitle = this.byTextContains('empty_requests_sub_title');
    this.inactiveMessage = this.byTextContains('pending_request_inactive_message');
    this.expiredTitle = this.byText('expired_request_title');
    this.expiredOkButton = this.byText('ok');
    this.requestForFinancingCard = this.byTextContains('home_request_for_financing_title');
  }

  async isMyRequestsVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isMyRequestsVisible', () => this.isElementDisplayed(this.title, timeout));
  }

  async isTabVisible(tab: RequestTab): Promise<boolean> {
    return this.then('isTabVisible', async () => {
      if (await this.isElementDisplayed(this.tabs[tab], this.timeouts.short)) return true;
      return MobileGestures.swipeUntilVisible(this.tabs[tab], 'left', { maxSwipes: 3 }).catch(() => false);
    });
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return this.then('isEmptyStateVisible', async () =>
      (await this.isElementDisplayed(this.emptyTitle, this.timeouts.medium)) && (await this.isElementDisplayed(this.emptySubtitle))
    );
  }

  async hasRequestCards(): Promise<boolean> {
    return this.then('hasRequestCards', async () => (await this.getRequestCardCount()) > 0);
  }

  async getRequestCardCount(): Promise<number> {
    return this.then('getRequestCardCount', async () => (await this.countMatches(this.requestNumberLabel)) + (await this.countMatches(this.pendingCardLabel)));
  }

  async isRequestVisible(requestNumber: string): Promise<boolean> {
    return this.then('isRequestVisible', async () => {
      const loc = this.byDynamicText(requestNumber);
      if (await this.isElementDisplayed(loc, this.timeouts.medium)) return true;
      await this.scrollTo(loc).catch(() => undefined);
      return this.isElementDisplayed(loc, this.timeouts.short);
    });
  }

  async isProceedButtonVisible(): Promise<boolean> {
    return this.then('isProceedButtonVisible', () => this.isElementDisplayed(this.proceedButton));
  }

  async isCancelRequestButtonVisible(): Promise<boolean> {
    return this.then('isCancelRequestButtonVisible', () => this.isElementDisplayed(this.cancelRequestButton));
  }

  async isInactiveMessageVisible(): Promise<boolean> {
    return this.then('isInactiveMessageVisible', () => this.isElementDisplayed(this.inactiveMessage));
  }

  async isExpiredDialogVisible(): Promise<boolean> {
    return this.then('isExpiredDialogVisible', () => this.isElementDisplayed(this.expiredTitle, this.timeouts.medium));
  }

  async isRequestForFinancingCardVisible(): Promise<boolean> {
    return this.then('isRequestForFinancingCardVisible', () => this.isElementDisplayed(this.requestForFinancingCard));
  }

  async isTabActiveRightToLeft(): Promise<boolean> {
    return this.then('isTabActiveRightToLeft', async () => {
      const { width } = await driver.getWindowSize();
      return (await this.getBounds(this.tabs.rescheduled)).x > width / 2;
    });
  }

  async clickOnTab(tab: RequestTab): Promise<void> {
    return this.when('clickOnTab', async () => {
      if (!(await this.isElementDisplayed(this.tabs[tab], this.timeouts.short))) {
        const found = await MobileGestures.swipeUntilVisible(this.tabs[tab], 'left', { maxSwipes: 3 }).catch(() => false);
        if (!found) await MobileGestures.swipeUntilVisible(this.tabs[tab], 'right', { maxSwipes: 3 });
      }
      await this.tap(this.tabs[tab]);
    });
  }

  async clickOnRescheduledTab(): Promise<void> {
    return this.clickOnTab('rescheduled');
  }

  async clickOnPendingTab(): Promise<void> {
    return this.clickOnTab('pending');
  }

  async clickOnUnderReviewTab(): Promise<void> {
    return this.clickOnTab('underReview');
  }

  async clickOnApprovedTab(): Promise<void> {
    return this.clickOnTab('approved');
  }

  async clickOnRejectedTab(): Promise<void> {
    return this.clickOnTab('rejected');
  }

  async clickOnCancelledTab(): Promise<void> {
    return this.clickOnTab('cancelled');
  }

  async clickOnPaidTuitionTab(): Promise<void> {
    return this.clickOnTab('paidTuition');
  }

  async clickOnRequest(requestNumber: string): Promise<void> {
    return this.when('clickOnRequest', () => this.tap(this.byDynamicText(requestNumber)));
  }

  async clickOnProceedButton(): Promise<void> {
    return this.when('clickOnProceedButton', () => this.tap(this.nth(this.proceedButton, 1)));
  }

  async clickOnViewDetailsButton(): Promise<void> {
    return this.when('clickOnViewDetailsButton', () => this.tap(this.nth(this.viewDetailsButton, 1)));
  }

  async clickOnContinueKycButton(): Promise<void> {
    return this.when('clickOnContinueKycButton', () => this.tap(this.nth(this.continueKycButton, 1)));
  }

  async clickOnPayWithDiscountButton(): Promise<void> {
    return this.when('clickOnPayWithDiscountButton', () => this.tap(this.nth(this.payWithDiscountButton, 1)));
  }

  async clickOnCancelRequestButton(): Promise<void> {
    return this.when('clickOnCancelRequestButton', () => this.tap(this.nth(this.cancelRequestButton, 1)));
  }

  async clickOnRejectionReason(requestNumber?: string): Promise<void> {
    return this.when('clickOnRejectionReason', async () => {
      if (requestNumber) await this.scrollTo(this.byDynamicText(requestNumber)).catch(() => undefined);
      await this.tap(this.nth(this.rejectReasonButton, 1));
    });
  }

  async clickOnCancellationReason(): Promise<void> {
    return this.when('clickOnCancellationReason', () => this.tap(this.nth(this.cancelReasonButton, 1)));
  }

  async clickOnExpiredOkButton(): Promise<void> {
    return this.when('clickOnExpiredOkButton', () => this.tap(this.expiredOkButton));
  }

  async pullToRefresh(): Promise<void> {
    return this.when('pullToRefresh', () => MobileGestures.swipeDown({ distance: 0.5 }));
  }
}
