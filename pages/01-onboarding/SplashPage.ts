import { BasePage } from '@madark/pages/00-common/BasePage';

export class SplashPage extends BasePage {
  private readonly preparingStatus: string;
  private readonly loadingConfigStatus: string;
  private readonly securityCheckStatus: string;
  private readonly loadingSessionStatus: string;

  constructor() {
    super();
    this.preparingStatus = this.byTextContains('splash_status_preparing');
    this.loadingConfigStatus = this.byTextContains('splash_status_loading_config');
    this.securityCheckStatus = this.byTextContains('splash_status_security_check');
    this.loadingSessionStatus = this.byTextContains('splash_status_loading_session');
  }

  private get anyStatus(): string {
    return [this.preparingStatus, this.loadingConfigStatus, this.securityCheckStatus, this.loadingSessionStatus].join(' | ');
  }

  async isSplashVisible(timeout = this.timeouts.short): Promise<boolean> {
    return this.then('isSplashVisible', () => this.isElementDisplayed(this.anyStatus, timeout));
  }

  async isSplashGone(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isSplashGone', async () => {
      try {
        await (await $(this.anyStatus)).waitForDisplayed({ timeout, reverse: true });
        return true;
      } catch {
        return false;
      }
    });
  }
}
