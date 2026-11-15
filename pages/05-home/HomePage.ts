import { BasePage } from '@madark/pages/00-common/BasePage';
import { BottomNavPage } from '@madark/pages/00-common/BottomNavPage';
import { MobileGestures } from '@madark/utils/mobile-gestures';

/** Home tab (logged-in and the browse sections shared with guest home). */
export class HomePage extends BasePage {
  readonly bottomNav: BottomNavPage;

  private readonly greeting: string;
  private readonly heroSubtitle: string;
  private readonly whatLookingForTitle: string;
  private readonly seeAllLink: string;
  private readonly educationTypesEmpty: string;
  private readonly recommendedTitle: string;
  private readonly featuredBadge: string;
  private readonly financingRequestButton: string;
  private readonly followUpCard: string;
  private readonly completeDataCard: string;
  private readonly completeDataMessage: string;
  private readonly totalRequestedLabel: string;
  private readonly paidLabel: string;
  private readonly remainingLabel: string;
  private readonly overdueLabel: string;
  private readonly goToPaymentsButton: string;
  private readonly completeNextInstallmentButton: string;
  private readonly exitDialogTitle: string;
  private readonly exitConfirmButton: string;
  private readonly exitCancelButton: string;
  private readonly settlementFailedTitle: string;

  constructor({ bottomNav }: { bottomNav?: BottomNavPage } = {}) {
    super();
    this.bottomNav = bottomNav ?? new BottomNavPage();
    this.greeting = this.byTextContains('home_hello_title');
    this.heroSubtitle = this.byTextContains('home_hero_subtitle');
    this.whatLookingForTitle = this.byTextContains('home_what_looking_for_title');
    this.seeAllLink = this.byTextContains('see_all_label');
    this.educationTypesEmpty = this.byTextContains('not_found_education_types');
    this.recommendedTitle = this.byTextContains('home_recommended_title');
    this.featuredBadge = this.byTextContains('educational_institution_featured_title');
    this.financingRequestButton = this.byTextContains('educational_details_financing_request_button');
    this.followUpCard = this.byTextContains('follow_approved_request_title');
    this.completeDataCard = this.byTextContains('complete_your_data');
    this.completeDataMessage = this.byTextContains('complete_your_data_message');
    this.totalRequestedLabel = this.byTextContains('home_total_requested_label');
    this.paidLabel = this.byTextContains('home_paid_label');
    this.remainingLabel = this.byTextContains('home_remaining_label');
    this.overdueLabel = this.byTextContains('home_overdue_payment_label');
    this.goToPaymentsButton = this.byTextContains('go_to_payments_button');
    this.completeNextInstallmentButton = this.byTextContains('pay_your_next_installment_title');
    this.exitDialogTitle = this.byTextContains('Are_you_sure_you_want_to_Exit');
    this.exitConfirmButton = this.byText('confirm');
    this.exitCancelButton = this.byText('cancel');
    this.settlementFailedTitle = this.byTextContains('early_settlement_failure_title');
  }

  async isHomeVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isHomeVisible', () => this.isElementDisplayed(this.heroSubtitle, timeout));
  }

  async isGreetingVisible(): Promise<boolean> {
    return this.then('isGreetingVisible', () => this.isElementDisplayed(this.greeting));
  }

  async isWhatLookingForSectionVisible(): Promise<boolean> {
    return this.then('isWhatLookingForSectionVisible', async () => {
      await this.scrollTo(this.whatLookingForTitle);
      return this.isElementDisplayed(this.whatLookingForTitle);
    });
  }

  async isEducationTypesEmptyVisible(): Promise<boolean> {
    return this.then('isEducationTypesEmptyVisible', () => this.isElementDisplayed(this.educationTypesEmpty));
  }

  async isEducationTypeVisible(name: string): Promise<boolean> {
    return this.then('isEducationTypeVisible', async () => {
      await this.scrollTo(this.whatLookingForTitle).catch(() => undefined);
      return this.isElementDisplayed(this.byDynamicText(name));
    });
  }

  async isRecommendedSectionVisible(): Promise<boolean> {
    return this.then('isRecommendedSectionVisible', async () => {
      await this.scrollTo(this.recommendedTitle).catch(() => undefined);
      return this.isElementDisplayed(this.recommendedTitle);
    });
  }

  async isFeaturedInstitutionVisible(): Promise<boolean> {
    return this.then('isFeaturedInstitutionVisible', async () => {
      await this.scrollTo(this.featuredBadge).catch(() => undefined);
      return this.isElementDisplayed(this.featuredBadge);
    });
  }

  async isFollowUpCardVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isFollowUpCardVisible', () => this.isElementDisplayed(this.followUpCard, timeout));
  }

  async isCompleteDataCardVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isCompleteDataCardVisible', async () =>
      (await this.isElementDisplayed(this.completeDataCard, timeout)) && (await this.isElementDisplayed(this.completeDataMessage))
    );
  }

  async isLoanSummaryCardVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isLoanSummaryCardVisible', () => this.isElementDisplayed(this.totalRequestedLabel, timeout));
  }

  async areLoanSummaryLabelsVisible(): Promise<boolean> {
    return this.then('areLoanSummaryLabelsVisible', async () => {
      for (const l of [this.totalRequestedLabel, this.paidLabel, this.remainingLabel]) if (!(await this.isElementDisplayed(l))) return false;
      return true;
    });
  }

  async isOverdueLabelVisible(): Promise<boolean> {
    return this.then('isOverdueLabelVisible', () => this.isElementDisplayed(this.overdueLabel));
  }

  async isCompleteNextInstallmentVisible(): Promise<boolean> {
    return this.then('isCompleteNextInstallmentVisible', () => this.isElementDisplayed(this.completeNextInstallmentButton));
  }

  async isExitDialogVisible(): Promise<boolean> {
    return this.then('isExitDialogVisible', () => this.isElementDisplayed(this.exitDialogTitle, this.timeouts.medium));
  }

  async isSettlementFailedVisible(): Promise<boolean> {
    return this.then('isSettlementFailedVisible', () => this.isElementDisplayed(this.settlementFailedTitle, this.timeouts.medium));
  }

  async isGreetingRightOfBell(): Promise<boolean> {
    return this.then('isGreetingRightOfBell', async () => {
      const { width } = await driver.getWindowSize();
      return (await this.getBounds(this.greeting)).x > width / 2;
    });
  }

  async clickOnEducationType(name: string): Promise<void> {
    return this.when('clickOnEducationType', async () => {
      await this.scrollTo(this.whatLookingForTitle).catch(() => undefined);
      await this.tap(this.byDynamicText(name));
    });
  }

  async clickOnSeeAllLink(): Promise<void> {
    return this.when('clickOnSeeAllLink', () => this.tap(this.nth(this.seeAllLink, 1)));
  }

  async clickOnInstitutionCard(name: string): Promise<void> {
    return this.when('clickOnInstitutionCard', () => this.tap(this.byDynamicText(name)));
  }

  async clickOnFirstFinancingRequestButton(): Promise<void> {
    return this.when('clickOnFirstFinancingRequestButton', () => this.tap(this.nth(this.financingRequestButton, 1)));
  }

  async clickOnFollowUpCard(): Promise<void> {
    return this.when('clickOnFollowUpCard', () => this.tap(this.followUpCard));
  }

  async clickOnCompleteDataCard(): Promise<void> {
    return this.when('clickOnCompleteDataCard', () => this.tap(this.completeDataCard));
  }

  async clickOnGoToPaymentsButton(): Promise<void> {
    return this.when('clickOnGoToPaymentsButton', () => this.tap(this.goToPaymentsButton));
  }

  async clickOnCompleteNextInstallmentButton(): Promise<void> {
    return this.when('clickOnCompleteNextInstallmentButton', () => this.tap(this.completeNextInstallmentButton));
  }

  async clickOnExitConfirmButton(): Promise<void> {
    return this.when('clickOnExitConfirmButton', () => this.tap(this.exitConfirmButton));
  }

  async clickOnExitCancelButton(): Promise<void> {
    return this.when('clickOnExitCancelButton', () => this.tap(this.exitCancelButton));
  }

  async swipeAdBannerLeft(): Promise<void> {
    return this.when('swipeAdBannerLeft', () => MobileGestures.swipeLeft({ distance: 0.5 }));
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
