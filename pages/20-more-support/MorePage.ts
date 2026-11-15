import { BasePage } from '@madark/pages/00-common/BasePage';

export class MorePage extends BasePage {
  private readonly loginButton: string;
  private readonly registerNowButton: string;
  private readonly editProfileLink: string;
  private readonly personalInfoItem: string;
  private readonly changePhoneItem: string;
  private readonly notificationsItem: string;
  private readonly languageItem: string;
  private readonly appearanceItem: string;
  private readonly helpFaqItem: string;
  private readonly contactUsItem: string;
  private readonly aboutAppItem: string;
  private readonly termsItem: string;
  private readonly privacyItem: string;
  private readonly shareAppItem: string;
  private readonly withdrawRequestsItem: string;
  private readonly versionLabel: string;
  private readonly logoutButton: string;
  private readonly logoutConfirmTitle: string;
  private readonly logoutYesButton: string;
  private readonly logoutNoButton: string;

  constructor() {
    super();
    this.loginButton = this.byText('login_account_title');
    this.registerNowButton = this.byTextContains('guest_register_now_title');
    this.editProfileLink = this.byTextContains('edit_profile_title');
    this.personalInfoItem = this.byTextContains('more_personal_info_title');
    this.changePhoneItem = this.byTextContains('more_change_phone_title');
    this.notificationsItem = this.byText('notification_title');
    this.languageItem = this.byTextContains('more_language_title');
    this.appearanceItem = this.byTextContains('more_section_theme');
    this.helpFaqItem = this.byTextContains('more_help_faq_title');
    this.contactUsItem = this.byTextContains('more_section_contact_us');
    this.aboutAppItem = this.byTextContains('more_about_app_title');
    this.termsItem = this.byTextContains('more_section_terms_and_conditions');
    this.privacyItem = this.byTextContains('more_section_privacy_policy');
    this.shareAppItem = this.byTextContains('share_app');
    this.withdrawRequestsItem = this.byTextContains('withdraw_requests');
    this.versionLabel = this.byTextContains('version');
    this.logoutButton = this.byTextContains('more_section_logout');
    this.logoutConfirmTitle = this.byTextContains('logout_title');
    this.logoutYesButton = this.byText('yes');
    this.logoutNoButton = this.byText('no');
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return this.then('isLoginButtonVisible', async () => {
      await this.scrollTo(this.loginButton).catch(() => undefined);
      return this.isElementDisplayed(this.loginButton);
    });
  }

  async isRegisterNowButtonVisible(): Promise<boolean> {
    return this.then('isRegisterNowButtonVisible', () => this.isElementDisplayed(this.registerNowButton));
  }

  async isLogoutButtonVisible(): Promise<boolean> {
    return this.then('isLogoutButtonVisible', async () => {
      await this.scrollTo(this.logoutButton).catch(() => undefined);
      return this.isElementDisplayed(this.logoutButton);
    });
  }

  async isLogoutConfirmationVisible(): Promise<boolean> {
    return this.then('isLogoutConfirmationVisible', () => this.isElementDisplayed(this.logoutConfirmTitle, this.timeouts.medium));
  }

  async isAccountSectionVisible(): Promise<boolean> {
    return this.then('isAccountSectionVisible', () => this.isElementDisplayed(this.personalInfoItem));
  }

  async isVersionVisible(): Promise<boolean> {
    return this.then('isVersionVisible', async () => {
      await this.scrollTo(this.versionLabel).catch(() => undefined);
      return this.isElementDisplayed(this.versionLabel);
    });
  }

  async areMenuItemsVisible(): Promise<boolean> {
    return this.then('areMenuItemsVisible', async () => {
      for (const item of [this.languageItem, this.helpFaqItem, this.contactUsItem, this.termsItem, this.privacyItem]) {
        await this.scrollTo(item).catch(() => undefined);
        if (!(await this.isElementDisplayed(item))) return false;
      }
      return true;
    });
  }

  async clickOnLoginButton(): Promise<void> {
    return this.when('clickOnLoginButton', () => this.tap(this.loginButton));
  }

  async clickOnRegisterNowButton(): Promise<void> {
    return this.when('clickOnRegisterNowButton', () => this.tap(this.registerNowButton));
  }

  async clickOnEditProfileLink(): Promise<void> {
    return this.when('clickOnEditProfileLink', () => this.tap(this.editProfileLink));
  }

  async clickOnPersonalInfoItem(): Promise<void> {
    return this.when('clickOnPersonalInfoItem', () => this.tap(this.personalInfoItem));
  }

  async clickOnChangePhoneItem(): Promise<void> {
    return this.when('clickOnChangePhoneItem', () => this.tap(this.changePhoneItem));
  }

  async clickOnNotificationsItem(): Promise<void> {
    return this.when('clickOnNotificationsItem', () => this.tap(this.notificationsItem));
  }

  async clickOnLanguageItem(): Promise<void> {
    return this.when('clickOnLanguageItem', () => this.tap(this.languageItem));
  }

  async clickOnAppearanceItem(): Promise<void> {
    return this.when('clickOnAppearanceItem', () => this.tap(this.appearanceItem));
  }

  async clickOnHelpFaqItem(): Promise<void> {
    return this.when('clickOnHelpFaqItem', () => this.tap(this.helpFaqItem));
  }

  async clickOnContactUsItem(): Promise<void> {
    return this.when('clickOnContactUsItem', () => this.tap(this.contactUsItem));
  }

  async clickOnAboutAppItem(): Promise<void> {
    return this.when('clickOnAboutAppItem', () => this.tap(this.aboutAppItem));
  }

  async clickOnTermsItem(): Promise<void> {
    return this.when('clickOnTermsItem', () => this.tap(this.termsItem));
  }

  async clickOnPrivacyItem(): Promise<void> {
    return this.when('clickOnPrivacyItem', () => this.tap(this.privacyItem));
  }

  async clickOnShariahItem(): Promise<void> {
    return this.when('clickOnShariahItem', () => this.tap(this.byTextContains('more_section_compliance_with_islamic_law')));
  }

  async clickOnTermsOfUseItem(): Promise<void> {
    return this.when('clickOnTermsOfUseItem', () => this.tap(this.byTextContains('more_section_terms_of_use')));
  }

  async clickOnShareAppItem(): Promise<void> {
    return this.when('clickOnShareAppItem', () => this.tap(this.shareAppItem));
  }

  async clickOnWithdrawRequestsItem(): Promise<void> {
    return this.when('clickOnWithdrawRequestsItem', () => this.tap(this.withdrawRequestsItem));
  }

  async clickOnLogoutButton(): Promise<void> {
    return this.when('clickOnLogoutButton', () => this.tap(this.logoutButton));
  }

  async clickOnLogoutYesButton(): Promise<void> {
    return this.when('clickOnLogoutYesButton', () => this.tap(this.logoutYesButton));
  }

  async clickOnLogoutNoButton(): Promise<void> {
    return this.when('clickOnLogoutNoButton', () => this.tap(this.logoutNoButton));
  }
}
