import { test } from '@madark/fixtures/test.fixture';
import { TestdataHelper } from '@madark/environment/testdata/helpers/testdata.helper';
import { toLocal } from '@madark/api/builders/auth.requests';
import { Tag } from '@madark/utils/tag';

describe('SignIn', () => {
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
    '[11864] Customer App / Customer / Login_ Welcome Back screen matches Figma (title ExtraBold 28/33.04 ls -0.73 #0B1736, subtitle Regular 14.5/23.2 #6B7280, +966 Bold 14.5, input Medium 15/22.5)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.signIn,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11864', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11865] Customer App / Customer / Login_ Invalid phone error state matches Figma (Invalid phone number. SemiBold 12/17.4 #DC2626)',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.signIn,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11865', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11866] Customer App / Customer / Login_ Change Phone Number link (Regular 12/18 #0FAEC4) and helper text (Regular 12/18 #6B7280) match Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.signIn,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11866', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11867] Customer App / Customer / Login_ Continue button default and disabled states match Figma (gradient / #E4E7EA with #9DA2AF label)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.signIn,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11867', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11868] Customer App / Customer / Login OTP_ Enter Verification Code screen matches Figma (6 boxes 46x61 radius 16 fill #F9FAFB border #D9F3F5, Verify OTP disabled until 6 digits)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.signIn,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11868', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11869] Customer App / Customer / Login OTP_ Wrong OTP error state matches Figma (box border #DC2626, error text #DC2626)',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.signIn,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11869', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11870] Customer App / Customer / Account Locked_ Account Locked screen matches Figma (title ExtraBold 27/32.4, Contact Support 342x56, Back to Login SemiBold 15/22.5 #0B8BA3)',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.signIn,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11870', blocked: 'manual/device case (C-Manual/device)' },
    async () => {}
  );

  test(
    '[11871] Customer App / Customer / Contact Support_ Contact Support screen matches Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.signIn,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11871', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11872] Customer App / Customer / Login_ Arabic RTL login layout with left-to-right digit entry',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.signIn,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11872', blocked: 'not implemented yet' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11873', blocked: 'manual/device case (C-Manual/device)' },
    async () => {}
  );

  test(
    '[11876] Customer App / Customer / Login_ Unregistered phone number cannot log in',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.signIn,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11876', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11877', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11878] Customer App / Customer / Login OTP_ Resend is enabled only after the countdown and the new code replaces the old one',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.signIn,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11878', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11879', blocked: 'manual/device case (C-Manual/device)' },
    async () => {}
  );

  test(
    '[11880] Customer App / Customer / Biometric Login_ Biometric login works on a trusted device and failure falls back to phone and OTP',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.signIn,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11880', blocked: 'manual/device case (C-Manual/device)' },
    async () => {}
  );

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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11881', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11882] Customer App / Customer / Change Phone Number_ Change phone number from login by national ID and new phone number',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.signIn,
    Tag.type.functional,
    Tag.type.integration,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11882', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11883] Customer App / Customer / Session_ Expired session refreshes the token silently or returns to login',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.signIn,
    Tag.type.functional,
    Tag.type.security,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11883', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11884] Customer App / Customer / Sign Out_ Sign out clears the session and back does not reopen logged-in screens',
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.signIn,
    Tag.type.functional,
    Tag.type.security,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11884', blocked: 'manual/device case (C-Manual/device)' },
    async () => {}
  );
});
