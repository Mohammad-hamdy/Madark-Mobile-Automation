import { BasePage } from '@madark/pages/BasePage';
import { BottomNavPage } from '@madark/pages/common/BottomNavPage';

export class HomePage extends BasePage {
  readonly bottomNav: BottomNavPage;

  private readonly greeting: string;
  private readonly heroSubtitle: string;
  private readonly whatLookingForTitle: string;

  constructor({ bottomNav }: { bottomNav?: BottomNavPage } = {}) {
    super();
    this.bottomNav = bottomNav ?? new BottomNavPage();
    this.greeting = this.byTextContains('home_hello_title');
    this.heroSubtitle = this.byTextContains('home_hero_subtitle');
    this.whatLookingForTitle = this.byTextContains('home_what_looking_for_title');
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
}
