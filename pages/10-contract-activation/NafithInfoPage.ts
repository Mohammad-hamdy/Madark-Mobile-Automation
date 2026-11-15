import { BasePage } from '@madark/pages/00-common/BasePage';

/** NafithInfoScreen ("Accepting Contract") and the verification call screen (Yaster). */
export class NafithInfoPage extends BasePage {
  private readonly title: string;
  private readonly subtitle: string;
  private readonly goToNafithButton: string;
  private readonly connecting: string;
  private readonly waitingResult: string;
  private readonly backWarningTitle: string;
  private readonly backWarningCancel: string;
  private readonly backWarningConfirm: string;
  private readonly callTitle: string;
  private readonly initiateCallButton: string;

  constructor() {
    super();
    this.title = this.byTextContains('nafith_info_title');
    this.subtitle = this.byTextContains('nafith_info_sub_title');
    this.goToNafithButton = this.byTextContains('nafith_info_button_title');
    this.connecting = this.byTextContains('hub_connecting');
    this.waitingResult = this.byTextContains('hub_connected_waiting');
    this.backWarningTitle = this.byTextContains('nafith_back_warning_title');
    this.backWarningCancel = this.byText('cancel');
    this.backWarningConfirm = this.byText('confirm');
    this.callTitle = this.byTextContains('yaster_call_confirmation_title');
    this.initiateCallButton = this.byTextContains('yaster_call_initiate_button');
  }

  async isAcceptingContractVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isAcceptingContractVisible', async () =>
      (await this.isElementDisplayed(this.title, timeout)) && (await this.isElementDisplayed(this.subtitle))
    );
  }

  async isHubStatusVisible(): Promise<boolean> {
    return this.then('isHubStatusVisible', async () =>
      (await this.isElementDisplayed(this.connecting, this.timeouts.short)) || (await this.isElementDisplayed(this.waitingResult, this.timeouts.medium))
    );
  }

  async isBackWarningVisible(): Promise<boolean> {
    return this.then('isBackWarningVisible', () => this.isElementDisplayed(this.backWarningTitle, this.timeouts.medium));
  }

  async isVerificationCallVisible(): Promise<boolean> {
    return this.then('isVerificationCallVisible', () => this.isElementDisplayed(this.callTitle, this.timeouts.long));
  }

  async clickOnGoToNafithButton(): Promise<void> {
    return this.when('clickOnGoToNafithButton', () => this.tap(this.goToNafithButton));
  }

  async clickOnBackWarningCancelButton(): Promise<void> {
    return this.when('clickOnBackWarningCancelButton', () => this.tap(this.backWarningCancel));
  }

  async clickOnBackWarningConfirmButton(): Promise<void> {
    return this.when('clickOnBackWarningConfirmButton', () => this.tap(this.backWarningConfirm));
  }

  async clickOnInitiateCallButton(): Promise<void> {
    return this.when('clickOnInitiateCallButton', () => this.tap(this.initiateCallButton));
  }
}
