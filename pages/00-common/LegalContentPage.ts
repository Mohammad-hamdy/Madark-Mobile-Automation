import { BasePage } from '@madark/pages/00-common/BasePage';

/** Terms & Conditions, Privacy Policy, Terms of Use, Shariah compliance, About: title + server-rendered content. */
export class LegalContentPage extends BasePage {
  private readonly termsTitle: string;
  private readonly privacyTitle: string;
  private readonly termsOfUseTitle: string;
  private readonly shariahTitle: string;
  private readonly aboutTitle: string;

  constructor() {
    super();
    this.termsTitle = this.byTextContains('more_section_terms_and_conditions');
    this.privacyTitle = this.byTextContains('more_section_privacy_policy');
    this.termsOfUseTitle = this.byTextContains('more_section_terms_of_use');
    this.shariahTitle = this.byTextContains('more_section_compliance_with_islamic_law');
    this.aboutTitle = this.byTextContains('more_section_about_madark');
  }

  async isTermsVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isTermsVisible', () => this.isElementDisplayed(this.termsTitle, timeout));
  }

  async isPrivacyVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isPrivacyVisible', () => this.isElementDisplayed(this.privacyTitle, timeout));
  }

  async isTermsOfUseVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isTermsOfUseVisible', () => this.isElementDisplayed(this.termsOfUseTitle, timeout));
  }

  async isShariahVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isShariahVisible', () => this.isElementDisplayed(this.shariahTitle, timeout));
  }

  async isAboutVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isAboutVisible', () => this.isElementDisplayed(this.aboutTitle, timeout));
  }

  async hasContent(): Promise<boolean> {
    return this.then('hasContent', async () => (await this.screenTexts()).filter((t) => t.trim().length > 30).length > 0);
  }
}
