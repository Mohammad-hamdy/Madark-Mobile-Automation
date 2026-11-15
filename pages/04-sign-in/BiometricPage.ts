import { BasePage } from '@madark/pages/00-common/BasePage';

/** "Enable Biometrics" sheet after login and the biometric error sheet on Login. */
export class BiometricPage extends BasePage {
  private readonly enableTitle: string;
  private readonly useItButton: string;
  private readonly dismissButton: string;
  private readonly errorFirstTime: string;
  private readonly errorOkButton: string;

  constructor() {
    super();
    this.enableTitle = this.byTextContains('enable_biometric_title');
    this.useItButton = this.byTextContains('enable_biometric_use_button_title');
    this.dismissButton = this.byTextContains('alert_voting_dialog_btn2');
    this.errorFirstTime = this.byTextContains('biometric_error_message_first_time_hint');
    this.errorOkButton = this.byText('bottom_sheet_button_title');
  }

  async isEnableBiometricsSheetVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isEnableBiometricsSheetVisible', () => this.isElementDisplayed(this.enableTitle, timeout));
  }

  async isBiometricNotSetUpMessageVisible(): Promise<boolean> {
    return this.then('isBiometricNotSetUpMessageVisible', () => this.isElementDisplayed(this.errorFirstTime, this.timeouts.medium));
  }

  async clickOnUseItButton(): Promise<void> {
    return this.when('clickOnUseItButton', () => this.tap(this.useItButton));
  }

  async clickOnDismissButton(): Promise<void> {
    return this.when('clickOnDismissButton', () => this.tap(this.dismissButton));
  }

  async clickOnErrorOkButton(): Promise<void> {
    return this.when('clickOnErrorOkButton', () => this.tap(this.errorOkButton));
  }
}
