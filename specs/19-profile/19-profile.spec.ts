import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('19 · Profile', () => {
  describe('01 · Edit Profile', () => {
    test(
      '[12025] Customer App / Customer / Edit Profile_ Profile shows the customer data',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.profile,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12025' },
      async ({ app, data, bottomNav, morePage, editProfilePage }) => {
        const p = data.seed('profileCustomer');
        await app.ensureLoggedIn(data.seedCustomer('profileCustomer'));
        await bottomNav.goToMore();
        await morePage.clickOnEditProfileLink();
        expect(await editProfilePage.isEditProfileVisible()).toBe(true);
        expect(await editProfilePage.areProfileFieldsVisible()).toBe(true);
        expect(await editProfilePage.isValueShown(p.nationalId)).toBe(true);
        expect(await editProfilePage.isValueShown(data.local(p.phone))).toBe(true);
        if (p.email) expect(await editProfilePage.isValueShown(p.email)).toBe(true);
        expect(await editProfilePage.isEmailVerificationStateVisible()).toBe(true);
      }
    );
  });

  describe('02 · Edit Email', () => {
    test(
      '[12026] Customer App / Customer / Edit Email_ Email change needs OTP and rejects an invalid email',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.profile,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12026' },
      async ({ app, data, bottomNav, morePage, editProfilePage, changeContactPage, otpPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('profileCustomer'));
        await bottomNav.goToMore();
        await morePage.clickOnEditProfileLink();
        await editProfilePage.clickOnEmailRow();
        expect(await changeContactPage.isChangeEmailVisible()).toBe(true);
        await changeContactPage.enterNewEmail('customer@test');
        expect(await changeContactPage.isEmailErrorVisible()).toBe(true);
        await changeContactPage.enterNewEmail(data.newCustomer.email);
        await changeContactPage.clickOnConfirmButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        await otpPage.enterOtp(data.invalid.otpWrong);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        await otpPage.enterOtp(data.devOtp());
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await changeContactPage.isEmailChangedVisible()).toBe(true);
        await changeContactPage.clickOnBackToProfileButton();
        expect(await editProfilePage.isValueShown(data.newCustomer.email)).toBe(true);
      }
    );
  });

  describe('03 · Edit Phone Number', () => {
    test(
      '[12027] Customer App / Customer / Edit Phone Number_ Phone change needs OTP and identity verification',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.profile,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12027' },
      async ({ app, data, bottomNav, morePage, editProfilePage, changeContactPage, otpPage }) => {
        const target = data.seed('phoneChangeTarget');
        await app.ensureLoggedIn(data.seedCustomer('phoneChangeTarget'));
        await bottomNav.goToMore();
        await morePage.clickOnEditProfileLink();
        await editProfilePage.clickOnChangeMobileButton();
        expect(await changeContactPage.isChangePhoneVisible()).toBe(true);
        await changeContactPage.enterNewPhone(data.invalid.phoneWrongPrefix);
        expect(await changeContactPage.isPhoneErrorVisible()).toBe(true);
        await changeContactPage.enterNewPhone(target.newPhone);
        await changeContactPage.clickOnPhoneConfirmButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        await otpPage.enterOtp(data.devOtp());
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        manualCheck('identity verification via Nafath sandbox when the build asks for it');
        expect(await changeContactPage.isPhoneChangedVisible()).toBe(true);
        app.markSignedOut();
        await app.loginAs({ phone: target.newPhone, otp: data.devOtp() });
      }
    );
  });

  describe('04 · Change Mobile Number', () => {
    test(
      '[12024] Customer App / Customer / Change Mobile Number_ Not Eligible change-mobile screen matches Figma (title ExtraBold 28/33.6 ls -0.73 #0B1736, body Regular 14.5/24.94 #6B7280)',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.profile,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12024' },
      async ({ app, data, bottomNav, morePage, editProfilePage, changeContactPage, otpPage, changePhoneByIdPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('eligibleCustomer'));
        await bottomNav.goToMore();
        await morePage.clickOnEditProfileLink();
        await editProfilePage.clickOnChangeMobileButton();
        await changeContactPage.enterNewPhone(data.newCustomer.phone);
        await changeContactPage.clickOnPhoneConfirmButton();
        if (await otpPage.isOtpScreenVisible()) {
          await otpPage.enterOtp(data.devOtp());
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        }
        expect(await changePhoneByIdPage.isNotEligibleVisible()).toBe(true);
        expect(await visual.matchesBaseline('19-change-mobile-not-eligible')).toBe(true);
        manualCheck('Figma 998:11030 — title ExtraBold 28/33.6 #0B1736');
      }
    );
  });

  describe('05 · Change Password', () => {
    test(
      '[12028] Customer App / Customer / Change Password_ Password change enforces the rules and shows Passwords do not match. Please try again.',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.profile,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12028', blocked: 'not in build fbb2d4a0 — Change Password is not reachable (login is phone + OTP; edit_profile_change_password_title is unused)' },
      async () => {}
    );
  });

  describe('06 · Biometric Login', () => {
    test(
      '[12029] Customer App / Customer / Biometric Login_ Enable and disable biometric login from profile',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.profile,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12029' },
      async ({ app, data, mobile, bottomNav, morePage, editProfilePage, loginPage, homePage }) => {
        const c = data.customer();
        await mobile.require('biometric');
        await mobile.enrollBiometric();
        await app.ensureLoggedIn(c);
        await bottomNav.goToMore();
        await morePage.clickOnEditProfileLink();
        if (!(await editProfilePage.isBiometricEnabled())) await editProfilePage.clickOnBiometricSwitch();
        await mobile.matchBiometric();
        expect(await editProfilePage.isBiometricEnabled()).toBe(true);
        await app.logout();
        await app.openVerifiedLoginScreen();
        await loginPage.clickOnFaceIdButton();
        await mobile.matchBiometric();
        expect(await homePage.isHomeVisible()).toBe(true);
        await bottomNav.goToMore();
        await morePage.clickOnEditProfileLink();
        await editProfilePage.clickOnBiometricSwitch();
        expect(await editProfilePage.isBiometricEnabled()).toBe(false);
        await app.logout();
      }
    );
  });

  describe('07 · Close Account', () => {
    test(
      '[12030] Customer App / Customer / Close Account_ Close account with OTP succeeds and is blocked while a loan is active',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.profile,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12030' },
      async ({ app, data, bottomNav, morePage, editProfilePage, otpPage, loginPage, homePage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToMore();
        await morePage.clickOnEditProfileLink();
        await editProfilePage.clickOnCloseAccountButton();
        expect(await editProfilePage.isCloseAccountConfirmationVisible()).toBe(true);
        await editProfilePage.clickOnCloseAccountProceedButton();
        expect(await editProfilePage.isCloseAccountBlockedVisible()).toBe(true);
        await editProfilePage.clickOnBackToManageProfileButton();
        await app.logout();

        const a = data.seedCustomer('closableAccount');
        await app.loginAs(a);
        await bottomNav.goToMore();
        await morePage.clickOnEditProfileLink();
        await editProfilePage.clickOnCloseAccountButton();
        await editProfilePage.clickOnCloseAccountProceedButton();
        if (await otpPage.isOtpScreenVisible()) {
          await otpPage.enterOtp(a.otp);
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        }
        expect(await editProfilePage.isCloseAccountSuccessVisible()).toBe(true);
        app.markSignedOut();
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber(data.local(a.phone));
        await loginPage.clickOnLoginButton();
        expect(await homePage.isHomeVisible(8000)).toBe(false);
      }
    );
  });
});
