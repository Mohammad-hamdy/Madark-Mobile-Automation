import { BasePage } from '@madark/pages/00-common/BasePage';

/** No Internet screen, connection error message, force update screen/dialog, maintenance screen. */
export class AppStatesPage extends BasePage {
  private readonly noInternetTitle: string;
  private readonly noInternetSubtitle: string;
  private readonly tryAgainButton: string;
  private readonly connectionError: string;
  private readonly forceUpdateTitle: string;
  private readonly forceUpdateButton: string;
  private readonly optionalUpdateTitle: string;
  private readonly optionalUpdateSkip: string;
  private readonly updateNationalIdItem: string;

  constructor() {
    super();
    this.noInternetTitle = this.byTextContains('no_internet_connection_title');
    this.noInternetSubtitle = this.byTextContains('no_internet_connection_subtitle');
    this.tryAgainButton = this.byTextContains('try_again');
    this.connectionError = this.byTextContains('connection_error');
    this.forceUpdateTitle = this.byTextContains('force_update_title');
    this.forceUpdateButton = this.byTextContains('force_update_button_title');
    this.optionalUpdateTitle = this.byTextContains('force_update_optional_title');
    this.optionalUpdateSkip = this.byText('force_update_dismiss_button_title');
    this.updateNationalIdItem = this.byTextContains('update_national_id_title');
  }

  async isNoInternetVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isNoInternetVisible', async () =>
      (await this.isElementDisplayed(this.noInternetTitle, timeout)) && (await this.isElementDisplayed(this.noInternetSubtitle, this.timeouts.short))
    );
  }

  /** No-internet screen or the connection error message (either is the current offline behaviour). */
  async isConnectivityErrorVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isConnectivityErrorVisible', async () =>
      (await this.isElementDisplayed(this.noInternetTitle, timeout)) || (await this.isElementDisplayed(this.connectionError, this.timeouts.short))
    );
  }

  async isConnectionErrorVisible(): Promise<boolean> {
    return this.then('isConnectionErrorVisible', () => this.isElementDisplayed(this.connectionError, this.timeouts.medium));
  }

  async isForceUpdateVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isForceUpdateVisible', async () =>
      (await this.isElementDisplayed(this.forceUpdateTitle, timeout)) && (await this.isElementDisplayed(this.forceUpdateButton, this.timeouts.short))
    );
  }

  async isOptionalUpdateVisible(): Promise<boolean> {
    return this.then('isOptionalUpdateVisible', () => this.isElementDisplayed(this.optionalUpdateTitle, this.timeouts.medium));
  }

  async isMaintenanceMessageVisible(message: string): Promise<boolean> {
    return this.then('isMaintenanceMessageVisible', () => this.isTextOnScreen(message, this.timeouts.long));
  }

  async clickOnRetryButton(): Promise<void> {
    return this.when('clickOnRetryButton', () => this.tap(this.tryAgainButton));
  }

  async clickOnUpdateNowButton(): Promise<void> {
    return this.when('clickOnUpdateNowButton', () => this.tap(this.forceUpdateButton));
  }

  async clickOnSkipUpdateButton(): Promise<void> {
    return this.when('clickOnSkipUpdateButton', () => this.tap(this.optionalUpdateSkip));
  }

  async clickOnUpdateNationalIdItem(): Promise<void> {
    return this.when('clickOnUpdateNationalIdItem', () => this.tap(this.updateNationalIdItem));
  }
}
