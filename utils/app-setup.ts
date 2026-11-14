import { loadEnv } from '@madark/environment';
import type { Customer } from '@madark/environment/testdata/helpers/testdata.helper';
import { toLocal } from '@madark/api/builders/auth.requests';
import { OnboardingPage } from '@madark/pages/onboarding/OnboardingPage';
import { GuestHomePage } from '@madark/pages/home/GuestHomePage';
import { LoginPage } from '@madark/pages/auth/LoginPage';
import { OtpPage } from '@madark/pages/auth/OtpPage';
import { HomePage } from '@madark/pages/home/HomePage';
import { MorePage } from '@madark/pages/more/MorePage';
import { TrustDevicePage } from '@madark/pages/auth/TrustDevicePage';
import { given } from '@madark/utils/report';
import { Wait } from '@madark/utils/wait';
import { I18n } from '@madark/i18n/i18n';

export type AppPages = {
  onboardingPage: OnboardingPage;
  guestHomePage: GuestHomePage;
  loginPage: LoginPage;
  otpPage: OtpPage;
  homePage: HomePage;
  morePage: MorePage;
  trustDevicePage: TrustDevicePage;
};

let verifiedThisSession = false;

export class AppSetup {
  constructor(private readonly pages: AppPages) {}

  static resetSession(): void {
    verifiedThisSession = false;
  }

  async openLoginScreen(): Promise<void> {
    await given('openLoginScreen', async () => {
      const { onboardingPage, guestHomePage, morePage, loginPage } = this.pages;
      if (await loginPage.isLoginScreenVisible(Wait.timeouts.short)) return;
      if (await onboardingPage.isOnboardingVisible()) {
        await this.matchLanguage();
        await onboardingPage.clickOnSkipButton();
      }
      if (await guestHomePage.isGuestHomeVisible()) {
        await guestHomePage.bottomNav.goToMore();
        await morePage.clickOnLoginButton();
      }
      if (!(await loginPage.isLoginScreenVisible())) throw new Error('login screen not reached from launch');
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

  async loginAs(customer: Customer): Promise<void> {
    await given('loginAs', async () => {
      const { loginPage, otpPage, trustDevicePage, homePage } = this.pages;
      await this.openLoginScreen();
      await this.ensureEnvironment();
      await loginPage.enterPhoneNumber(toLocal(customer.phone));
      await loginPage.clickOnLoginButton();
      if (!(await otpPage.isOtpScreenVisible())) throw new Error('OTP screen not shown after login');
      await otpPage.enterOtp(customer.otp);
      if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
      if (await trustDevicePage.isTrustDevicePromptVisible()) await trustDevicePage.clickOnAllowButton();
      if (!(await homePage.isHomeVisible())) throw new Error('home not shown after OTP');
    });
  }
}
