import { BasePage } from '@madark/pages/00-common/BasePage';

export class SimahConsentPage extends BasePage {
  private readonly heading: string;
  private readonly intro: string;
  private readonly purposeSection: string;
  private readonly informationSection: string;
  private readonly useSection: string;
  private readonly agreeButton: string;

  constructor() {
    super();
    this.heading = this.byTextContains('simah_consent_heading');
    this.intro = this.byTextContains('simah_consent_intro');
    this.purposeSection = this.byTextContains('simah_consent_s1_title');
    this.informationSection = this.byTextContains('simah_consent_s2_title');
    this.useSection = this.byTextContains('simah_consent_s3_title');
    this.agreeButton = this.byTextContains('simah_consent_agree_button');
  }

  async isSimahConsentVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isSimahConsentVisible', () => this.isElementDisplayed(this.heading, timeout));
  }

  async isIntroVisible(): Promise<boolean> {
    return this.then('isIntroVisible', () => this.isElementDisplayed(this.intro));
  }

  async areSectionsInOrder(): Promise<boolean> {
    return this.then('areSectionsInOrder', async () => {
      const y1 = (await this.getBounds(this.purposeSection)).y;
      const y2 = (await this.getBounds(this.informationSection)).y;
      await this.scrollTo(this.useSection);
      const y3 = (await this.getBounds(this.useSection)).y;
      return y1 < y2 && (y2 < y3 || y3 >= 0);
    });
  }

  async clickOnAgreeButton(): Promise<void> {
    return this.when('clickOnAgreeButton', () => this.tap(this.agreeButton));
  }
}
