import { BasePage } from '@madark/pages/BasePage';

export class TrustDevicePage extends BasePage {
  private readonly title: string;
  private readonly allowButton: string;
  private readonly notAllowButton: string;

  constructor() {
    super();
    this.title = this.byTextContains('trusted_device_title');
    this.allowButton = this.byText('allow');
    this.notAllowButton = this.byText('not_allow');
  }

  async isTrustDevicePromptVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isTrustDevicePromptVisible', () => this.isElementDisplayed(this.title, timeout));
  }

  async clickOnAllowButton(): Promise<void> {
    return this.when('clickOnAllowButton', () => this.tap(this.allowButton));
  }

  async clickOnNotAllowButton(): Promise<void> {
    return this.when('clickOnNotAllowButton', () => this.tap(this.notAllowButton));
  }
}
