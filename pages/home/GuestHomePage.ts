import { BasePage } from '@madark/pages/BasePage';
import { BottomNavPage } from '@madark/pages/common/BottomNavPage';

export class GuestHomePage extends BasePage {
  readonly bottomNav: BottomNavPage;

  private readonly eligibilityTitle: string;
  private readonly eligibilityDescription: string;
  private readonly getStartedButton: string;
  private readonly whyMadarkTitle: string;

  constructor({ bottomNav }: { bottomNav?: BottomNavPage } = {}) {
    super();
    this.bottomNav = bottomNav ?? new BottomNavPage();
    this.eligibilityTitle = this.byTextContains('guest_home_eligibility_title');
    this.eligibilityDescription = this.byTextContains('guest_home_eligibility_desc');
    this.getStartedButton = this.byTextContains('guest_home_get_started');
    this.whyMadarkTitle = this.byTextContains('why_madark_title');
  }

  async isGuestHomeVisible(timeout = this.timeouts.long): Promise<boolean> {
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

  async clickOnGetStartedButton(): Promise<void> {
    return this.when('clickOnGetStartedButton', () => this.tap(this.getStartedButton));
  }
}
