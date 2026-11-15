import { BasePage } from '@madark/pages/00-common/BasePage';
import { devLiteral } from '@madark/i18n/literals';

export class OnboardingPage extends BasePage {
  private readonly skipButton: string;
  private readonly letsStartButton: string;
  private readonly continueNowButton: string;
  private readonly firstSlideTitle: string;
  private readonly firstSlideDescription: string;
  private readonly secondSlideTitle: string;
  private readonly thirdSlideTitle: string;
  private readonly englishToggle: string;
  private readonly arabicToggle: string;

  constructor() {
    super();
    this.skipButton = this.byText('skip');
    this.letsStartButton = this.byTextContains('onboarding_lets_start_button_title');
    this.continueNowButton = this.byTextContains('onboarding_continue_now_button_title');
    this.firstSlideTitle = this.byTextContains('Onboarding_Screen1Description1_Hint');
    this.firstSlideDescription = this.byTextContains('Onboarding_Screen1Description2_Hint');
    this.secondSlideTitle = this.byTextContains('Onboarding_Screen2Description1_Hint');
    this.thirdSlideTitle = this.byTextContains('Onboarding_Screen3Description1_Hint');
    this.englishToggle = this.byLiteral(devLiteral('newOnboarding.toggle.english'));
    this.arabicToggle = this.byLiteral(devLiteral('newOnboarding.toggle.arabic'));
  }

  async isSecondSlideVisible(): Promise<boolean> {
    return this.then('isSecondSlideVisible', () => this.isElementDisplayed(this.secondSlideTitle));
  }

  async isThirdSlideVisible(): Promise<boolean> {
    return this.then('isThirdSlideVisible', () => this.isElementDisplayed(this.thirdSlideTitle));
  }

  async isShownInArabic(): Promise<boolean> {
    return this.then('isShownInArabic', () => this.isElementDisplayed(this.englishToggle));
  }

  async isShownInEnglish(): Promise<boolean> {
    return this.then('isShownInEnglish', () => this.isElementDisplayed(this.arabicToggle));
  }

  async clickOnEnglishToggle(): Promise<void> {
    return this.when('clickOnEnglishToggle', () => this.tap(this.englishToggle));
  }

  async clickOnArabicToggle(): Promise<void> {
    return this.when('clickOnArabicToggle', () => this.tap(this.arabicToggle));
  }

  async isOnboardingVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isOnboardingVisible', () => this.isElementDisplayed(this.skipButton, timeout));
  }

  async isFirstSlideVisible(): Promise<boolean> {
    return this.then('isFirstSlideVisible', () => this.isElementDisplayed(this.firstSlideTitle));
  }

  async isFirstSlideDescriptionVisible(): Promise<boolean> {
    return this.then('isFirstSlideDescriptionVisible', () => this.isElementDisplayed(this.firstSlideDescription));
  }

  async isContinueNowButtonVisible(): Promise<boolean> {
    return this.then('isContinueNowButtonVisible', () => this.isElementDisplayed(this.continueNowButton));
  }

  async isLetsStartButtonVisible(): Promise<boolean> {
    return this.then('isLetsStartButtonVisible', () => this.isElementDisplayed(this.letsStartButton));
  }

  /** RTL check: in Arabic 'تخطي' and the 'English' toggle swap sides compared with English. */
  async isSkipLeftOfLanguageToggle(): Promise<boolean> {
    return this.then('isSkipLeftOfLanguageToggle', async () => {
      const toggle = (await this.isElementDisplayed(this.englishToggle)) ? this.englishToggle : this.arabicToggle;
      return (await this.getBounds(this.skipButton)).x < (await this.getBounds(toggle)).x;
    });
  }

  async getCurrentSlide(): Promise<number> {
    return this.then('getCurrentSlide', async () => {
      if (await this.isElementDisplayed(this.thirdSlideTitle, this.timeouts.short)) return 3;
      if (await this.isElementDisplayed(this.secondSlideTitle, this.timeouts.short)) return 2;
      if (await this.isElementDisplayed(this.firstSlideTitle, this.timeouts.short)) return 1;
      return 0;
    });
  }

  async clickOnSkipButton(): Promise<void> {
    return this.when('clickOnSkipButton', () => this.tap(this.skipButton));
  }

  async clickOnLetsStartButton(): Promise<void> {
    return this.when('clickOnLetsStartButton', () => this.tap(this.letsStartButton));
  }

  async clickOnContinueNowButton(): Promise<void> {
    return this.when('clickOnContinueNowButton', () => this.tap(this.continueNowButton));
  }
}
