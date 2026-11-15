import { BasePage } from '@madark/pages/00-common/BasePage';
import { BottomNavPage } from '@madark/pages/00-common/BottomNavPage';

export class GuestHomePage extends BasePage {
  readonly bottomNav: BottomNavPage;

  private readonly eligibilityTitle: string;
  private readonly eligibilityDescription: string;
  private readonly getStartedButton: string;
  private readonly whyMadarkTitle: string;
  private readonly flexibleFinancingCard: string;
  private readonly noHiddenFeesCard: string;
  private readonly loanSummaryLabel: string;

  constructor({ bottomNav }: { bottomNav?: BottomNavPage } = {}) {
    super();
    this.bottomNav = bottomNav ?? new BottomNavPage();
    this.eligibilityTitle = this.byTextContains('guest_home_eligibility_title');
    this.eligibilityDescription = this.byTextContains('guest_home_eligibility_desc');
    this.getStartedButton = this.byTextContains('guest_home_get_started');
    this.whyMadarkTitle = this.byTextContains('why_madark_title');
    this.flexibleFinancingCard = this.byTextContains('why_madark_flexible_financing');
    this.noHiddenFeesCard = this.byTextContains('why_madark_no_hidden_fees');
    this.loanSummaryLabel = this.byTextContains('home_total_requested_label');
  }

  async isGuestHomeVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isGuestHomeVisible', () => this.isElementDisplayed(this.eligibilityTitle, timeout));
  }

  async isEligibilityDescriptionVisible(): Promise<boolean> {
    return this.then('isEligibilityDescriptionVisible', () => this.isElementDisplayed(this.eligibilityDescription));
  }

  async isWhyMadarkSectionVisible(): Promise<boolean> {
    return this.then('isWhyMadarkSectionVisible', async () => {
      await this.scrollTo(this.whyMadarkTitle);
      return this.isElementDisplayed(this.whyMadarkTitle);
    });
  }

  async areWhyMadarkCardsVisible(): Promise<boolean> {
    return this.then('areWhyMadarkCardsVisible', async () => {
      await this.scrollTo(this.whyMadarkTitle);
      return (await this.isElementDisplayed(this.flexibleFinancingCard)) && (await this.isElementDisplayed(this.noHiddenFeesCard));
    });
  }

  async isCustomerDataHidden(): Promise<boolean> {
    return this.then('isCustomerDataHidden', async () => !(await this.isElementDisplayed(this.loanSummaryLabel, this.timeouts.short)));
  }

  async clickOnGetStartedButton(): Promise<void> {
    return this.when('clickOnGetStartedButton', () => this.tap(this.getStartedButton));
  }
}
