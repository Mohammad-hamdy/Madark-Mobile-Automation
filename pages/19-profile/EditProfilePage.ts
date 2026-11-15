import { BasePage } from '@madark/pages/00-common/BasePage';

/** Edit Profile: national ID, phone, email (verified state), change mobile, biometric toggle, close account. */
export class EditProfilePage extends BasePage {
  private readonly title: string;
  private readonly nationalIdLabel: string;
  private readonly phoneLabel: string;
  private readonly emailLabel: string;
  private readonly emailVerified: string;
  private readonly emailNotVerified: string;
  private readonly verifyEmailButton: string;
  private readonly changeMobileButton: string;
  private readonly biometricToggleLabel: string;
  private readonly biometricSwitch: string;
  private readonly closeAccountButton: string;
  private readonly closeAccountConfirm: string;
  private readonly closeAccountProceed: string;
  private readonly closeAccountCancel: string;
  private readonly closeAccountSuccess: string;
  private readonly backToManageProfile: string;

  constructor() {
    super();
    this.title = this.byText('edit_profile_title');
    this.nationalIdLabel = this.byTextContains('edit_profile_national_id_title');
    this.phoneLabel = this.byTextContains('edit_profile_phone_number_title');
    this.emailLabel = this.byTextContains('edit_profile_email_title');
    this.emailVerified = this.byText('edit_profile_email_verified_title');
    this.emailNotVerified = this.byText('edit_profile_email_not_verified_title');
    this.verifyEmailButton = this.byTextContains('verify_email_button_title');
    this.changeMobileButton = this.byTextContains('change_mobile_number_button');
    this.biometricToggleLabel = this.byTextContains('set_biometric_login_title');
    this.biometricSwitch = this.structural('biometricSwitch', 'checkbox', 'biometric Switch has no key; it is the only switch on Edit Profile');
    this.closeAccountButton = this.byText('close_account_title');
    this.closeAccountConfirm = this.byTextContains('close_account_desc');
    this.closeAccountProceed = this.byText('close_account_proceed_title');
    this.closeAccountCancel = this.byText('cancel');
    this.closeAccountSuccess = this.byTextContains('close_account_success_title');
    this.backToManageProfile = this.byTextContains('back_to_manage_profile_title');
  }

  async isEditProfileVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isEditProfileVisible', async () =>
      (await this.isElementDisplayed(this.nationalIdLabel, timeout)) && (await this.isElementDisplayed(this.phoneLabel, this.timeouts.short))
    );
  }

  async areProfileFieldsVisible(): Promise<boolean> {
    return this.then('areProfileFieldsVisible', async () =>
      (await this.isElementDisplayed(this.nationalIdLabel)) && (await this.isElementDisplayed(this.phoneLabel)) && (await this.isElementDisplayed(this.emailLabel))
    );
  }

  async isEmailVerificationStateVisible(): Promise<boolean> {
    return this.then('isEmailVerificationStateVisible', async () =>
      (await this.isElementDisplayed(this.emailVerified, this.timeouts.short)) || (await this.isElementDisplayed(this.emailNotVerified, this.timeouts.short))
    );
  }

  async isValueShown(value: string): Promise<boolean> {
    return this.then('isValueShown', async () => (await this.screenTexts()).some((t) => t.replace(/[\s+]/g, '').includes(value.replace(/[\s+]/g, ''))));
  }

  async isBiometricEnabled(): Promise<boolean> {
    return this.then('isBiometricEnabled', async () => {
      await this.scrollTo(this.biometricToggleLabel).catch(() => undefined);
      return this.isChecked(this.biometricSwitch);
    });
  }

  async isCloseAccountConfirmationVisible(): Promise<boolean> {
    return this.then('isCloseAccountConfirmationVisible', () => this.isElementDisplayed(this.closeAccountConfirm, this.timeouts.medium));
  }

  async isCloseAccountBlockedVisible(): Promise<boolean> {
    return this.then('isCloseAccountBlockedVisible', () => this.isElementDisplayed(this.backToManageProfile, this.timeouts.long));
  }

  async isCloseAccountSuccessVisible(): Promise<boolean> {
    return this.then('isCloseAccountSuccessVisible', () => this.isElementDisplayed(this.closeAccountSuccess, this.timeouts.long));
  }

  async clickOnVerifyEmailButton(): Promise<void> {
    return this.when('clickOnVerifyEmailButton', () => this.tap(this.verifyEmailButton));
  }

  async clickOnEmailRow(): Promise<void> {
    return this.when('clickOnEmailRow', () => this.tap(this.emailLabel));
  }

  async clickOnChangeMobileButton(): Promise<void> {
    return this.when('clickOnChangeMobileButton', () => this.tap(this.changeMobileButton));
  }

  async clickOnBiometricSwitch(): Promise<void> {
    return this.when('clickOnBiometricSwitch', async () => {
      await this.scrollTo(this.biometricToggleLabel).catch(() => undefined);
      await this.tap(this.biometricSwitch);
    });
  }

  async clickOnCloseAccountButton(): Promise<void> {
    return this.when('clickOnCloseAccountButton', () => this.tap(this.closeAccountButton));
  }

  async clickOnCloseAccountProceedButton(): Promise<void> {
    return this.when('clickOnCloseAccountProceedButton', () => this.tap(this.closeAccountProceed));
  }

  async clickOnCloseAccountCancelButton(): Promise<void> {
    return this.when('clickOnCloseAccountCancelButton', () => this.tap(this.closeAccountCancel));
  }

  async clickOnBackToManageProfileButton(): Promise<void> {
    return this.when('clickOnBackToManageProfileButton', () => this.tap(this.backToManageProfile));
  }

  async isTitleVisible(): Promise<boolean> {
    return this.then('isTitleVisible', () => this.isElementDisplayed(this.title));
  }
}
