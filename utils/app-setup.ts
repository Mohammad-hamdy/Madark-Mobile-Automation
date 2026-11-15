import { loadEnv } from '@madark/environment';
import type { Customer } from '@madark/environment/testdata/helpers/testdata.helper';
import { toLocal } from '@madark/api/builders/auth.requests';
import type { Pages } from '@madark/pages/index';
import { MobileActions } from '@madark/utils/mobile-actions';
import { given } from '@madark/utils/report';
import { Wait } from '@madark/utils/wait';
import { I18n } from '@madark/i18n/i18n';

let verifiedThisSession = false;
let signedInAs: string | null = null;

/** UI workflows used as Given steps: reach a starting state, enforce env/encryption, sign in/out. */
export class AppSetup {
  constructor(private readonly pages: Pages) {}

  static resetSession(): void {
    verifiedThisSession = false;
    signedInAs = null;
  }

  /** Clean install state: app data cleared, onboarding page 1 on screen. */
  async freshStart(): Promise<void> {
    await given('freshStart', async () => {
      await MobileActions.clearAppData();
      verifiedThisSession = false;
      signedInAs = null;
      if (!(await this.pages.onboardingPage.isOnboardingVisible(Wait.timeouts.long))) {
        throw new Error('onboarding not shown after clearing app data');
      }
    });
  }

  /** Guest home on screen (skips onboarding, signs out if needed). */
  async ensureGuest(): Promise<void> {
    await given('ensureGuest', async () => {
      const { onboardingPage, guestHomePage, homePage } = this.pages;
      const probe = Wait.timeouts.short;
      if (await guestHomePage.isGuestHomeVisible(probe)) return;
      if (await onboardingPage.isOnboardingVisible(probe)) {
        await this.matchLanguage();
        await onboardingPage.clickOnSkipButton();
      } else if (await homePage.isHomeVisible(probe)) {
        await this.logout();
      } else {
        await MobileActions.restartApp();
        if (await onboardingPage.isOnboardingVisible(probe)) {
          await this.matchLanguage();
          await onboardingPage.clickOnSkipButton();
        } else if (await homePage.isHomeVisible(probe)) {
          await this.logout();
        }
      }
      await this.pages.bottomNav.goToHome().catch(() => undefined);
      if (!(await guestHomePage.isGuestHomeVisible(Wait.timeouts.long))) throw new Error('guest home not reached');
    });
  }

  async openLoginScreen(): Promise<void> {
    await given('openLoginScreen', async () => {
      const { onboardingPage, guestHomePage, morePage, loginPage } = this.pages;
      const probe = Wait.timeouts.short;
      if (await loginPage.isLoginScreenVisible(probe)) return;
      if (await onboardingPage.isOnboardingVisible(probe)) {
        await this.matchLanguage();
        await onboardingPage.clickOnSkipButton();
      }
      if (await this.pages.homePage.isHomeVisible(probe)) await this.logout();
      if (await guestHomePage.isGuestHomeVisible(probe)) {
        await guestHomePage.bottomNav.goToMore();
        await morePage.clickOnLoginButton();
      }
      if (!(await loginPage.isLoginScreenVisible(Wait.timeouts.medium))) {
        throw new Error('login screen not reached from launch');
      }
    });
  }

  async matchLanguage(): Promise<void> {
    await given('matchLanguage', async () => {
      const { onboardingPage } = this.pages;
      if (I18n.isAr && (await onboardingPage.isShownInEnglish())) await onboardingPage.clickOnArabicToggle();
      if (!I18n.isAr && (await onboardingPage.isShownInArabic())) await onboardingPage.clickOnEnglishToggle();
    });
  }

  async ensureEnvironment(): Promise<void> {
    if (verifiedThisSession) return;
    await given('ensureEnvironment', async () => {
      const env = loadEnv();
      const setup = this.pages.loginPage.envSetupPage;
      if (!(await setup.isEnvironmentPickerVisible())) {
        throw new Error('QA environment picker not visible — is this the QA flavor build (com.madark.institution.qa)?');
      }
      if ((await setup.getSelectedEnvironment()) !== env.appEnvLabel) {
        await setup.clickOnEnvironmentDropdown();
        await setup.clickOnEnvironmentOption(env.appEnvLabel);
      }
      if ((await setup.isEncryptionOn()) !== env.encryption) {
        await setup.clickOnEncryptionDropdown();
        await setup.clickOnEncryptionOption(env.encryption);
      }
      const selected = await setup.getSelectedEnvironment();
      const encryption = await setup.isEncryptionOn();
      if (selected !== env.appEnvLabel || encryption !== env.encryption) {
        throw new Error(`app is on ${selected}/encryption=${encryption}, expected ${env.appEnvLabel}/encryption=${env.encryption}`);
      }
      verifiedThisSession = true;
    });
  }

  /** Login screen with Dev + encryption enforced — the starting point of every sign-in case. */
  async openVerifiedLoginScreen(): Promise<void> {
    await this.openLoginScreen();
    await this.ensureEnvironment();
  }

  /**
   * Phone + OTP sign-in. Ends on Home; a pending institution request opens "Choose how to pay" first —
   * kept on screen with { keepPostLoginScreen: true }, otherwise left for later with back (as the app intends).
   */
  async loginAs(customer: Customer, { keepPostLoginScreen = false }: { keepPostLoginScreen?: boolean } = {}): Promise<void> {
    await given('loginAs', async () => {
      const { loginPage, otpPage, homePage, chooseHowToPayPage } = this.pages;
      await this.openVerifiedLoginScreen();
      await loginPage.enterPhoneNumber(toLocal(customer.phone));
      await loginPage.clickOnLoginButton();
      if (!(await otpPage.isOtpScreenVisible())) throw new Error('OTP screen not shown after login');
      await otpPage.enterOtp(customer.otp);
      if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
      await this.completePostLoginPrompts();
      signedInAs = toLocal(customer.phone);
      if (await chooseHowToPayPage.isChooseHowToPayVisible(Wait.timeouts.medium)) {
        if (keepPostLoginScreen) return;
        await MobileActions.navigateBack();
      }
      if (!(await homePage.isHomeVisible())) throw new Error('home not shown after OTP');
    });
  }

  /** Signed in as this customer, on Home. Re-uses the session when the same customer is already signed in. */
  async ensureLoggedIn(customer: Customer): Promise<void> {
    await given('ensureLoggedIn', async () => {
      const { homePage, bottomNav } = this.pages;
      const wanted = toLocal(customer.phone);
      if (signedInAs === wanted) {
        await bottomNav.goToHome().catch(() => undefined);
        if (await homePage.isHomeVisible(Wait.timeouts.medium)) return;
      }
      if (signedInAs && signedInAs !== wanted) await this.logout();
      await this.loginAs(customer);
    });
  }

  /** Fresh sign-in that stops on the post-login "Choose how to pay" screen (MRUI cases). */
  async loginToPostLoginScreen(customer: Customer): Promise<void> {
    await given('loginToPostLoginScreen', async () => {
      if (signedInAs) await this.logout();
      await this.loginAs(customer, { keepPostLoginScreen: true });
    });
  }

  /** "Choose how to pay" for a pending request opened from My Requests > Pending Requests. */
  async openChooseHowToPayFromRequests(customer: Customer, requestNumber: string): Promise<void> {
    await given('openChooseHowToPayFromRequests', async () => {
      const { bottomNav, myRequestsPage, chooseHowToPayPage } = this.pages;
      await this.ensureLoggedIn(customer);
      await bottomNav.goToRequests();
      await myRequestsPage.clickOnPendingTab();
      await myRequestsPage.clickOnRequest(requestNumber);
      if (!(await chooseHowToPayPage.isChooseHowToPayVisible())) throw new Error(`Choose how to pay not opened for ${requestNumber}`);
    });
  }

  async logout(): Promise<void> {
    await given('logout', async () => {
      const { bottomNav, morePage, guestHomePage } = this.pages;
      await bottomNav.goToMore();
      await morePage.clickOnLogoutButton();
      await morePage.clickOnLogoutYesButton();
      signedInAs = null;
      if (!(await guestHomePage.isGuestHomeVisible(Wait.timeouts.long))) {
        await bottomNav.goToHome().catch(() => undefined);
      }
    });
  }

  /** Create account phone screen, opened from Login (Dev + encryption enforced first). */
  async openSignupPhone(): Promise<void> {
    await given('openSignupPhone', async () => {
      const { loginPage, signupPhonePage } = this.pages;
      if (await signupPhonePage.isSignupPhoneScreenVisible(Wait.timeouts.short)) return;
      await this.openVerifiedLoginScreen();
      await loginPage.clickOnCreateAccountButton();
      if (!(await signupPhonePage.isSignupPhoneScreenVisible())) throw new Error('Create account screen not opened');
    });
  }

  /** Registration form for a new (unregistered) phone: phone → Next → Dev OTP → form. */
  async openSignupForm(phone: string, otp: string): Promise<void> {
    await given('openSignupForm', async () => {
      const { signupPhonePage, otpPage, signupFormPage } = this.pages;
      await this.openSignupPhone();
      await signupPhonePage.enterPhoneNumber(toLocal(phone));
      await signupPhonePage.clickOnNextButton();
      if (!(await otpPage.isOtpScreenVisible())) throw new Error('OTP screen not shown after Next');
      await otpPage.enterOtp(otp);
      if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
      if (!(await signupFormPage.isRegistrationFormVisible())) throw new Error('registration form not shown after OTP');
    });
  }

  /** Institution details of the seed institution, opened from Home → education type → search. */
  async openInstitutionDetails(inst: { educationType: string; educationTypeAr?: string; searchText: string; name: string; nameAr?: string }): Promise<void> {
    await given('openInstitutionDetails', async () => {
      const { homePage, institutionsPage, institutionDetailsPage, bottomNav } = this.pages;
      const ar = I18n.isAr;
      await bottomNav.goToHome().catch(() => undefined);
      await homePage.clickOnEducationType(ar && inst.educationTypeAr ? inst.educationTypeAr : inst.educationType);
      await institutionsPage.enterSearchText(inst.searchText);
      await institutionsPage.clickOnInstitution(ar && inst.nameAr ? inst.nameAr : inst.name);
      if (!(await institutionDetailsPage.isDetailsVisible())) throw new Error('institution details not opened');
    });
  }

  /** Request Financing for the seed institution as this customer (answers "registered? Yes" when asked). */
  async openRequestFinancing(
    customer: Customer,
    inst: { educationType: string; educationTypeAr?: string; searchText: string; name: string; nameAr?: string }
  ): Promise<void> {
    await given('openRequestFinancing', async () => {
      const { institutionDetailsPage, eligibilityPage, requestFinancingPage } = this.pages;
      await this.ensureLoggedIn(customer);
      await this.openInstitutionDetails(inst);
      await institutionDetailsPage.clickOnFinancingRequestButton();
      if (await eligibilityPage.isAreYouRegisteredVisible(Wait.timeouts.medium)) await eligibilityPage.clickOnYesButton();
      if (!(await requestFinancingPage.isRequestFinancingVisible())) throw new Error('Request Financing not opened');
    });
  }

  /** Request Financing filled (first listed student, first duration) and continued to the KYC questions. */
  async continueToKyc(studentName?: string): Promise<void> {
    await given('continueToKyc', async () => {
      const { requestFinancingPage, kycPage } = this.pages;
      if (studentName) await requestFinancingPage.clickOnStudent(studentName).catch(() => undefined);
      await requestFinancingPage.clickOnDurationDropdown();
      await requestFinancingPage.selectFirstDurationOption();
      await requestFinancingPage.clickOnContinueButton();
      if (!(await kycPage.isKycVisible())) throw new Error('KYC questions not opened');
    });
  }

  /** Completion screen (steps) of an approved request: My Requests → Approved → Proceed on that request. */
  async openApprovedRequest(customer: Customer, requestNumber: string): Promise<void> {
    await given('openApprovedRequest', async () => {
      const { bottomNav, myRequestsPage, requestDetailsPage } = this.pages;
      await this.ensureLoggedIn(customer);
      await bottomNav.goToRequests();
      await myRequestsPage.clickOnApprovedTab();
      if (!(await myRequestsPage.isRequestVisible(requestNumber))) throw new Error(`approved request ${requestNumber} not listed`);
      await myRequestsPage.clickOnProceedButton();
      if (!(await requestDetailsPage.isRequestDetailsVisible())) throw new Error('request completion screen not opened');
    });
  }

  /** Contract screen from the completion steps ("Sign contract"). */
  async openContract(): Promise<void> {
    await given('openContract', async () => {
      await this.pages.requestDetailsPage.clickOnSignContractButton();
      if (!(await this.pages.contractPage.isContractVisible())) throw new Error('contract not opened');
    });
  }

  /** Switch the app language from More (the row toggles EN ↔ AR). Works for guest and signed-in. */
  async switchLanguage(lang: 'ar' | 'en'): Promise<void> {
    await given('switchLanguage', async () => {
      const { bottomNav, morePage } = this.pages;
      await bottomNav.goToMore();
      if ((await bottomNav.getUiLanguage()) !== lang) await morePage.clickOnLanguageItem();
      await Wait.until(async () => (await bottomNav.getUiLanguage()) === lang, { timeout: Wait.timeouts.long, message: `app language ${lang}` });
    });
  }

  /** Light / Dark / System from More > Appearance. */
  async setTheme(mode: 'light' | 'dark' | 'system'): Promise<void> {
    await given('setTheme', async () => {
      const { bottomNav, morePage, themePickerPage } = this.pages;
      await bottomNav.goToMore();
      await morePage.clickOnAppearanceItem();
      if (mode === 'dark') await themePickerPage.clickOnDarkOption();
      else if (mode === 'light') await themePickerPage.clickOnLightOption();
      else await themePickerPage.clickOnSystemOption();
    });
  }

  /** After OTP: accept "Trust This Device" and dismiss "Enable Biometrics" when they appear. */
  async completePostLoginPrompts(): Promise<void> {
    await given('completePostLoginPrompts', async () => {
      const { trustDevicePage, biometricPage } = this.pages;
      if (await trustDevicePage.isTrustDevicePromptVisible()) await trustDevicePage.clickOnAllowButton();
      if (await biometricPage.isEnableBiometricsSheetVisible(Wait.timeouts.short)) await biometricPage.clickOnDismissButton();
    });
  }

  /** The spec signed out through the UI itself (e.g. the Sign Out case). */
  markSignedOut(): void {
    signedInAs = null;
  }

  /** Back one screen (Android system back / iOS edge swipe). */
  async goBack(): Promise<void> {
    await MobileActions.navigateBack();
  }

  /** Close the app completely and open it again. */
  async relaunch(): Promise<void> {
    await MobileActions.restartApp();
  }
}
