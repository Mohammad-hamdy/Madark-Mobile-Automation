import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { TestdataHelper } from '@madark/environment/testdata/helpers/testdata.helper';
import { toLocal } from '@madark/api/builders/auth.requests';
import { manualCheck } from '@madark/utils/report';

describe('04 · Sign In', () => {
  describe('01 · Login', () => {
    test(
      '[11864] Customer App / Customer / Login_ Welcome Back screen matches Figma (title ExtraBold 28/33.04 ls -0.73 #0B1736, subtitle Regular 14.5/23.2 #6B7280, +966 Bold 14.5, input Medium 15/22.5)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.signIn,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11864' },
      async ({ app, loginPage, visual }) => {
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber('551234567');
        expect(await loginPage.isLoginScreenVisible()).toBe(true);
        expect(await loginPage.isSubtitleVisible()).toBe(true);
        expect(await visual.matchesBaseline('04-login-filled')).toBe(true);
        manualCheck('Figma 1333:21290 — title ExtraBold 28/33.04 #0B1736, subtitle Regular 14.5/23.2 #6B7280, +966 Bold 14.5, value Medium 15/22.5');
      }
    );

    test(
      '[11865] Customer App / Customer / Login_ Invalid phone error state matches Figma (Invalid phone number. SemiBold 12/17.4 #DC2626)',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.signIn,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11865' },
      async ({ app, data, loginPage, visual }) => {
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber(data.invalid.phoneWrongPrefix);
        expect(await loginPage.isPhoneNumberErrorVisible()).toBe(true);
        expect(await loginPage.isLoginButtonEnabled()).toBe(false);
        expect(await visual.matchesBaseline('04-login-phone-error')).toBe(true);
        manualCheck('Figma copy "Invalid phone number." vs app text "Mobile number must start with 5" (deviation logged); error SemiBold 12/17.4 #DC2626');
      }
    );

    test(
      '[11866] Customer App / Customer / Login_ Change Phone Number link (Regular 12/18 #0FAEC4) and helper text (Regular 12/18 #6B7280) match Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.signIn,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11866' },
      async ({ app, loginPage, visual }) => {
        await app.openVerifiedLoginScreen();
        expect(await loginPage.isChangeMobileNumberLinkVisible()).toBe(true);
        expect(await loginPage.isOtpNoticeVisible()).toBe(true);
        expect(await visual.matchesBaseline('04-login-empty-helper-link')).toBe(true);
        manualCheck('Figma 1333:21219 — link Regular 12/18 #0FAEC4, helper Regular 12/18 #6B7280, placeholder 5X XXX XXXX');
      }
    );

    test(
      '[11867] Customer App / Customer / Login_ Continue button default and disabled states match Figma (gradient / #E4E7EA with #9DA2AF label)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.signIn,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11867' },
      async ({ app, loginPage, otpPage, visual }) => {
        await app.openVerifiedLoginScreen();
        expect(await loginPage.isLoginButtonEnabled()).toBe(false);
        expect(await visual.matchesBaseline('04-login-button-empty')).toBe(true);

        await loginPage.enterPhoneNumber('55123456');
        expect(await loginPage.isLoginButtonEnabled()).toBe(false);
        await loginPage.clickOnLoginButton().catch(() => undefined);
        expect(await otpPage.isOtpScreenVisible(3000)).toBe(false);
        expect(await visual.matchesBaseline('04-login-button-8-digits')).toBe(true);

        await loginPage.enterPhoneNumber('551234567');
        expect(await loginPage.isLoginButtonEnabled()).toBe(true);
        expect(await visual.matchesBaseline('04-login-button-enabled')).toBe(true);
        manualCheck('Figma — disabled #E4E7EA / #9DA2AF, enabled gradient #38D0D0→#018281, 299.79x53.99 radius 16');
      }
    );

    test(
      '[11872] Customer App / Customer / Login_ Arabic RTL login layout with left-to-right digit entry',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.signIn,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11872' },
      async ({ app, data, loginPage, otpPage, visual }) => {
        const customer = data.customer();
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber('551234567');
        expect(await loginPage.isPhoneFieldLeftToRight()).toBe(true);
        expect(await visual.matchesBaseline('04-login-rtl-filled')).toBe(true);

        await loginPage.enterPhoneNumber(data.invalid.phoneWrongPrefix);
        expect(await loginPage.isPhoneNumberErrorVisible()).toBe(true);
        expect(await visual.matchesBaseline('04-login-rtl-error')).toBe(true);

        await loginPage.enterPhoneNumber(data.local(customer.phone));
        await loginPage.clickOnLoginButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        for (const digit of customer.otp) await otpPage.enterOtp(digit);
        expect(await otpPage.isVerifyButtonEnabled()).toBe(true);
        manualCheck('Arabic Conversion frames — mirrored layout, digits LTR, OTP fills left to right (run with E2E_LANG=ar)');
      }
    );

    test(
      '[11873] Customer App / Customer / Login_ Registered customer logs in with phone and OTP and lands on home',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.signIn,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11873' },
      async ({ app, data, loginPage, otpPage, trustDevicePage, biometricPage, homePage, bottomNav, guestModePage }) => {
        const customer = data.customer();
        await app.openVerifiedLoginScreen();

        await loginPage.enterPhoneNumber(data.local(customer.phone));
        await loginPage.clickOnLoginButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        expect(await otpPage.isPhoneShownInSentTo(data.local(customer.phone))).toBe(true);

        await otpPage.enterOtp(customer.otp);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();

        if (await trustDevicePage.isTrustDevicePromptVisible()) {
          expect(await trustDevicePage.isTrustDeviceMessageVisible()).toBe(true);
          await trustDevicePage.clickOnAllowButton();
        }
        if (await biometricPage.isEnableBiometricsSheetVisible()) await biometricPage.clickOnDismissButton();

        expect(await homePage.isHomeVisible()).toBe(true);
        await bottomNav.goToRequests();
        expect(await guestModePage.isGuestRequestsCardVisible(3000)).toBe(false);
        await bottomNav.goToPayments();
        expect(await guestModePage.isGuestSheetVisible(3000)).toBe(false);
      }
    );

    test(
      '[11874] Customer App / Customer / Login_ Phone validation requires 9 digits starting with 5 and stays silent while typing',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.signIn,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11874' },
      async ({ app, loginPage, testdata }) => {
        await app.openLoginScreen();
        await app.ensureEnvironment();

        await loginPage.enterPhoneNumber(testdata.invalid.phoneWrongPrefix.slice(0, 8));
        expect(await loginPage.isPhoneNumberErrorVisible()).toBe(false);
        expect(await loginPage.isLoginButtonEnabled()).toBe(false);

        await loginPage.enterPhoneNumber(testdata.invalid.phoneWrongPrefix);
        expect(await loginPage.isPhoneNumberErrorVisible()).toBe(true);
        expect(await loginPage.isLoginButtonEnabled()).toBe(false);

        await loginPage.enterPhoneNumber(testdata.newCustomer.phone);
        await loginPage.enterExtraPhoneCharacters('1');
        expect(await loginPage.getPhoneNumber()).toBe(testdata.newCustomer.phone);
        expect(await loginPage.isPhoneNumberErrorVisible()).toBe(false);
        expect(await loginPage.isLoginButtonEnabled()).toBe(true);

        await loginPage.enterExtraPhoneCharacters('ab#');
        expect(await loginPage.getPhoneNumber()).toBe(testdata.newCustomer.phone);
      }
    );

    test(
      '[11875] Customer App / Customer / Login_ Wrong OTP keeps the customer on the OTP screen and no session is created',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.signIn,
      Tag.type.functional,
      Tag.type.security,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11875' },
      async ({ app, loginPage, otpPage, homePage, testdata }) => {
        const customer = TestdataHelper.requireExisting(testdata);
        await app.openLoginScreen();
        await app.ensureEnvironment();
        expect(await loginPage.getInputFieldCount()).toBe(1);

        await loginPage.enterPhoneNumber(toLocal(customer.phone));
        await loginPage.clickOnLoginButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);

        await otpPage.enterOtp(testdata.invalid.otpWrong);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);

        expect(await homePage.isHomeVisible(5000)).toBe(false);
      }
    );

    test(
      '[11876] Customer App / Customer / Login_ Unregistered phone number cannot log in',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.signIn,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11876' },
      async ({ app, data, loginPage, otpPage, homePage, signupFormPage, bottomNav, guestModePage }) => {
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber(data.newCustomer.phone);
        await loginPage.clickOnLoginButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);

        await otpPage.enterOtp(data.devOtp());
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await homePage.isHomeVisible(5000)).toBe(false);
        expect(await signupFormPage.isRegistrationFormVisible()).toBe(true);

        await app.goBack();
        expect(await loginPage.isLoginScreenVisible()).toBe(true);
        await app.goBack();
        await bottomNav.goToRequests().catch(() => undefined);
        expect(await guestModePage.isGuestRequestsCardVisible()).toBe(true);
      }
    );
  });

  describe('02 · Login OTP', () => {
    test(
      '[11868] Customer App / Customer / Login OTP_ Enter Verification Code screen matches Figma (6 boxes 46x61 radius 16 fill #F9FAFB border #D9F3F5, Verify OTP disabled until 6 digits)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.signIn,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11868' },
      async ({ app, data, loginPage, otpPage, visual }) => {
        const customer = data.customer();
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber(data.local(customer.phone));
        await loginPage.clickOnLoginButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        expect(await otpPage.isPhoneShownInSentTo(data.local(customer.phone))).toBe(true);
        expect(await visual.matchesBaseline('04-login-otp-empty')).toBe(true);

        await otpPage.enterOtp(customer.otp.slice(0, 5));
        expect(await otpPage.isVerifyButtonEnabled()).toBe(false);
        expect(await visual.matchesBaseline('04-login-otp-5-digits')).toBe(true);
        await otpPage.enterOtp(customer.otp.slice(5));
        expect(await otpPage.isVerifyButtonEnabled()).toBe(true);
        expect(await visual.matchesBaseline('04-login-otp-6-digits')).toBe(true);
        manualCheck('Figma 1333:21059 — 6 boxes 46x61 radius 16 fill #F9FAFB border #D9F3F5');
      }
    );

    test(
      '[11869] Customer App / Customer / Login OTP_ Wrong OTP error state matches Figma (box border #DC2626, error text #DC2626)',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.signIn,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11869' },
      async ({ app, data, loginPage, otpPage, visual }) => {
        const customer = data.customer();
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber(data.local(customer.phone));
        await loginPage.clickOnLoginButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        await otpPage.enterOtp(data.invalid.otpWrong);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        expect(await visual.matchesBaseline('04-login-otp-error')).toBe(true);
        manualCheck('Figma 1333:21546 — boxes border #DC2626, server error text #DC2626 under the boxes');
      }
    );

    test(
      '[11877] Customer App / Customer / Login OTP_ 5 wrong OTP attempts block input for 180 seconds and the counter resets after the block',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.signIn,
      Tag.type.functional,
      Tag.type.security,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11877' },
      async ({ app, data, loginPage, otpPage, homePage }) => {
        const customer = data.customer();
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber(data.local(customer.phone));
        await loginPage.clickOnLoginButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);

        for (let attempt = 1; attempt <= 4; attempt++) {
          await otpPage.enterOtp(data.invalid.otpWrong);
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
          expect(await otpPage.isBlockedCountdownVisible()).toBe(false);
        }

        await otpPage.enterOtp(data.invalid.otpWrong);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await otpPage.isBlockedCountdownVisible()).toBe(true);

        expect(await otpPage.isVerifyButtonEnabled()).toBe(false);

        expect(await otpPage.waitForBlockToEnd()).toBe(true);
        await otpPage.enterOtp(data.invalid.otpWrong);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await otpPage.isBlockedCountdownVisible()).toBe(false);
        if (await otpPage.waitForResendEnabled(1000)) await otpPage.clickOnResendLink().catch(() => undefined);
        await otpPage.enterOtp(customer.otp);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        await app.completePostLoginPrompts();
        expect(await homePage.isHomeVisible()).toBe(true);
      }
    );

    test(
      '[11878] Customer App / Customer / Login OTP_ Resend is enabled only after the countdown and the new code replaces the old one',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.signIn,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11878' },
      async ({ app, data, loginPage, otpPage, homePage }) => {
        const customer = data.customer();
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber(data.local(customer.phone));
        await loginPage.clickOnLoginButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        expect(await otpPage.getCountdown()).toMatch(/^0[01]:\d{2}$/);

        await otpPage.clickOnResendLink();
        expect(await otpPage.getCountdown()).not.toBe('00:00');

        expect(await otpPage.waitForResendEnabled()).toBe(true);
        await otpPage.clickOnResendLink();
        expect(await otpPage.getCountdown()).toMatch(/^0[01]:\d{2}$/);

        manualCheck('the old OTP is rejected — on Dev the mock OTP is the same for every send, so old/new cannot be told apart');

        await otpPage.enterOtp(customer.otp);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        await app.completePostLoginPrompts();
        expect(await homePage.isHomeVisible()).toBe(true);
      }
    );
  });

  describe('03 · Biometric Login', () => {
    test(
      '[11880] Customer App / Customer / Biometric Login_ Biometric login works on a trusted device and failure falls back to phone and OTP',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.signIn,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11880' },
      async ({ app, data, mobile, loginPage, biometricPage, homePage }) => {
        const customer = data.customer();
        await mobile.require('biometric');
        await mobile.enrollBiometric();
        await app.loginAs(customer);
        await app.logout();
        await app.openVerifiedLoginScreen();
        await loginPage.clickOnFaceIdButton();
        await mobile.matchBiometric();
        expect(await homePage.isHomeVisible()).toBe(true);

        await app.logout();
        await app.openVerifiedLoginScreen();
        await loginPage.clickOnFaceIdButton();
        await mobile.failBiometric();
        expect(await loginPage.isLoginScreenVisible()).toBe(true);
        expect(await homePage.isHomeVisible(3000)).toBe(false);

        await app.loginAs(customer);
        expect(await homePage.isHomeVisible()).toBe(true);

        await app.freshStart();
        await app.openVerifiedLoginScreen();
        await loginPage.clickOnFaceIdButton();
        expect(await biometricPage.isBiometricNotSetUpMessageVisible()).toBe(true);
        expect(await homePage.isHomeVisible(3000)).toBe(false);
      }
    );
  });

  describe('04 · Forgot Password', () => {
    test(
      '[11881] Customer App / Customer / Forgot Password_ Password reset by phone and OTP enforces password rules and match',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.signIn,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11881', blocked: 'revamp login is phone + OTP only — there is no password and no "Forgot your password?" entry point on Login (login_screen.dart)' },
      async () => {}
    );
  });

  describe('05 · Change Phone Number', () => {
    test(
      '[11882] Customer App / Customer / Change Phone Number_ Change phone number from login by national ID and new phone number',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.signIn,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11882' },
      async ({ app, data, loginPage, changePhoneByIdPage, otpPage, homePage }) => {
        const customer = data.seedCustomer('eligibleCustomer');
        const reg = data.seed('registration');
        const nationalId = data.need(reg.registeredNationalId, 'registration.registeredNationalId');
        await app.openVerifiedLoginScreen();
        await loginPage.clickOnChangeMobileNumberLink();
        expect(await changePhoneByIdPage.isChangePhoneScreenVisible()).toBe(true);

        await changePhoneByIdPage.enterNationalId(`3${nationalId.slice(1)}`);
        expect(await changePhoneByIdPage.isIdErrorVisible()).toBe(true);
        await changePhoneByIdPage.enterPhoneNumber(data.invalid.phoneWrongPrefix);
        expect(await changePhoneByIdPage.isPhoneErrorVisible()).toBe(true);

        await changePhoneByIdPage.enterNationalId(nationalId);
        await changePhoneByIdPage.enterPhoneNumber(data.newCustomer.phone);
        await changePhoneByIdPage.clickOnConfirmButton();
        expect(await changePhoneByIdPage.isNotEligibleVisible()).toBe(true);

        await changePhoneByIdPage.clickOnEditPhoneButton();
        await changePhoneByIdPage.enterPhoneNumber(data.local(customer.phone));
        await changePhoneByIdPage.clickOnConfirmButton();
        if (await otpPage.isOtpScreenVisible()) {
          await otpPage.enterOtp(customer.otp);
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        }
        expect(await changePhoneByIdPage.isSuccessVisible()).toBe(true);

        await changePhoneByIdPage.clickOnLoginButton();
        await app.loginAs(customer);
        expect(await homePage.isHomeVisible()).toBe(true);
      }
    );
  });

  describe('06 · Account Locked', () => {
    test(
      '[11870] Customer App / Customer / Account Locked_ Account Locked screen matches Figma (title ExtraBold 27/32.4, Contact Support 342x56, Back to Login SemiBold 15/22.5 #0B8BA3)',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.signIn,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11870' },
      async ({ app, data, loginPage, otpPage, accountStatusPage, visual }) => {
        const locked = data.seedCustomer('lockedAccount');
        await app.openVerifiedLoginScreen();
        manualCheck('biometric sign-in on the trusted device (falls back to phone + OTP on this target)');
        await loginPage.enterPhoneNumber(data.local(locked.phone));
        await loginPage.clickOnLoginButton();
        if (await otpPage.isOtpScreenVisible()) {
          await otpPage.enterOtp(locked.otp);
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        }
        expect(await accountStatusPage.isAccountStatusVisible()).toBe(true);
        expect(await visual.matchesBaseline('04-account-locked')).toBe(true);
        manualCheck('Figma 1333:21643 — title ExtraBold 27/32.4, Contact Support 342x56, Back to Login SemiBold 15/22.5 #0B8BA3');
      }
    );

    test(
      '[11879] Customer App / Customer / Account Locked_ Locked account shows Account Locked and its buttons navigate correctly',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.signIn,
      Tag.type.functional,
      Tag.type.security,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11879' },
      async ({ app, data, mobile, loginPage, otpPage, accountStatusPage, homePage, bottomNav, guestModePage }) => {
        const locked = data.seedCustomer('lockedAccount');
        await app.openVerifiedLoginScreen();
        manualCheck('biometric sign-in on the trusted device (phone + OTP used on this target)');
        await loginPage.enterPhoneNumber(data.local(locked.phone));
        await loginPage.clickOnLoginButton();
        if (await otpPage.isOtpScreenVisible()) {
          await otpPage.enterOtp(locked.otp);
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        }
        expect(await accountStatusPage.isAccountStatusVisible()).toBe(true);
        expect(await homePage.isHomeVisible(3000)).toBe(false);

        await mobile.navigateBack();
        expect(await accountStatusPage.isAccountStatusVisible()).toBe(true);

        if (await accountStatusPage.isContactSupportButtonVisible()) {
          await accountStatusPage.clickOnContactSupportButton();
          await app.goBack();
        }

        await accountStatusPage.clickOnBackToLoginButton();
        expect(await loginPage.isLoginScreenVisible()).toBe(true);

        await loginPage.enterPhoneNumber(data.local(locked.phone));
        await loginPage.clickOnLoginButton();
        if (await otpPage.isOtpScreenVisible()) {
          await otpPage.enterOtp(locked.otp);
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        }
        expect(await homePage.isHomeVisible(5000)).toBe(false);
        await app.ensureGuest().catch(() => undefined);
        await bottomNav.goToRequests();
        expect(await guestModePage.isGuestRequestsCardVisible()).toBe(true);
      }
    );
  });

  describe('07 · Contact Support', () => {
    test(
      '[11871] Customer App / Customer / Contact Support_ Contact Support screen matches Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.signIn,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11871' },
      async ({ app, data, loginPage, otpPage, accountStatusPage, visual }) => {
        const locked = data.seedCustomer('lockedAccount');
        await app.openVerifiedLoginScreen();
        await loginPage.enterPhoneNumber(data.local(locked.phone));
        await loginPage.clickOnLoginButton();
        if (await otpPage.isOtpScreenVisible()) {
          await otpPage.enterOtp(locked.otp);
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        }
        expect(await accountStatusPage.isAccountStatusVisible()).toBe(true);
        expect(await accountStatusPage.isContactSupportButtonVisible()).toBe(true);
        await accountStatusPage.clickOnContactSupportButton();
        expect(await visual.matchesBaseline('04-contact-support')).toBe(true);
        manualCheck('Figma 1333:21720 — title Bold 24/32 #0F172B (Plus Jakarta Sans), Call Support option, Continue 345x54');
      }
    );
  });

  describe('08 · Session', () => {
    test(
      '[11883] Customer App / Customer / Session_ Expired session refreshes the token silently or returns to login',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.signIn,
      Tag.type.functional,
      Tag.type.security,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11883', blocked: 'needs the backend team to expire the access token, then access + refresh tokens, during the session' },
      async () => {}
    );
  });

  describe('09 · Sign Out', () => {
    test(
      '[11884] Customer App / Customer / Sign Out_ Sign out clears the session and back does not reopen logged-in screens',
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.signIn,
      Tag.type.functional,
      Tag.type.security,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11884' },
      async ({ app, data, mobile, morePage, loginPage, guestHomePage, bottomNav, guestModePage }) => {
        const customer = data.customer();
        await app.ensureLoggedIn(customer);
        await bottomNav.goToMore();
        await morePage.clickOnLogoutButton();
        expect(await morePage.isLogoutConfirmationVisible()).toBe(true);

        await morePage.clickOnLogoutNoButton();
        expect(await morePage.isLogoutButtonVisible()).toBe(true);

        await morePage.clickOnLogoutButton();
        await morePage.clickOnLogoutYesButton();
        app.markSignedOut();

        for (let i = 0; i < 3; i++) await mobile.navigateBack().catch(() => undefined);
        await mobile.activateApp();
        const guestOrLogin = (await guestHomePage.isGuestHomeVisible()) || (await loginPage.isLoginScreenVisible());
        expect(guestOrLogin).toBe(true);

        await mobile.restartApp();
        await bottomNav.goToRequests();
        expect(await guestModePage.isGuestRequestsCardVisible()).toBe(true);
      }
    );
  });
});
