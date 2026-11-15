import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('03 · Registration', () => {
  describe('01 · Sign Up', () => {
    test(
      '[11845] Customer App / Customer / Sign Up_ Create Account screen matches Figma (title ExtraBold 26/31.2 ls -0.62 #0B1736, subtitle Regular 14/23.1 #6B7280, labels SemiBold 13.5/20.25 #0B1736)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11845' },
      async ({ app, data, signupFormPage, visual }) => {
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        expect(await signupFormPage.isTitleVisible()).toBe(true);
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(false);
        expect(await visual.matchesBaseline('03-signup-form-empty')).toBe(true);
        manualCheck('Figma 1333:22060 — title ExtraBold 26/31.2 #0B1736, subtitle Regular 14/23.1 #6B7280, labels SemiBold 13.5/20.25');
      }
    );

    test(
      '[11846] Customer App / Customer / Sign Up_ ID number error state matches Figma (error text SemiBold 12/17.4 #DC2626, error border #DC2626)',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11846' },
      async ({ app, data, signupFormPage, visual }) => {
        const reg = data.seed('registration');
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.enterIdNumber(`3${data.nationalId().slice(1)}`);
        expect(await signupFormPage.isIdFormatErrorVisible()).toBe(true);
        expect(await visual.matchesBaseline('03-signup-id-format-error')).toBe(true);

        await signupFormPage.enterIdNumber(reg.registeredNationalId);
        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();
        await signupFormPage.clickOnCreateAccountButton();
        expect(await signupFormPage.isGenericErrorVisible()).toBe(true);
        expect(await visual.matchesBaseline('03-signup-id-registered-error')).toBe(true);
        manualCheck('Figma 1333:22252 — error SemiBold 12/17.4 #DC2626, border #DC2626');
      }
    );

    test(
      '[11847] Customer App / Customer / Sign Up_ All fields filled state enables Continue (gradient #38D0D0 to #018281, 299.79x53.99, radius 16, shadow 0/3/8 #0B8BA3 14%)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11847' },
      async ({ app, data, signupFormPage, visual }) => {
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.enterIdNumber(data.nationalId());
        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(true);
        expect(await signupFormPage.isIdFormatErrorVisible()).toBe(false);
        expect(await signupFormPage.isEmailFormatErrorVisible()).toBe(false);
        expect(await visual.matchesBaseline('03-signup-form-filled')).toBe(true);
        manualCheck('Figma 1333:22764 — enabled gradient button 299.79x53.99 radius 16');
      }
    );

    test(
      '[11848] Customer App / Customer / Sign Up_ Continue is disabled until required data is valid (fill #E4E7EA, label #9DA2AF)',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11848' },
      async ({ app, data, signupFormPage, visual }) => {
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(false);
        expect(await visual.matchesBaseline('03-signup-button-disabled')).toBe(true);

        await signupFormPage.enterIdNumber(data.nationalId().slice(0, 9));
        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(false);

        await signupFormPage.enterIdNumber(data.nationalId());
        await signupFormPage.clearEmail();
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(false);

        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.uncheckSimah();
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(false);

        await signupFormPage.clickOnCreateAccountButton();
        expect(await signupFormPage.isRegistrationFormVisible()).toBe(true);
      }
    );

    test(
      '[11851] Customer App / Customer / Sign Up_ Arabic RTL Create Account layout (+966 prefix position, error alignment, mirrored icons)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11851' },
      async ({ app, data, loginPage, signupPhonePage, signupFormPage, visual }) => {
        await app.openVerifiedLoginScreen();
        await loginPage.clickOnCreateAccountButton();
        await signupPhonePage.enterPhoneNumber(data.invalid.phoneWrongPrefix);
        expect(await signupPhonePage.isPhoneNumberErrorVisible()).toBe(true);
        expect(await signupPhonePage.isPhoneFieldLeftToRight()).toBe(true);
        expect(await visual.matchesBaseline('03-signup-phone-error-rtl')).toBe(true);

        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.enterIdNumber(`3${data.nationalId().slice(1)}`);
        await signupFormPage.enterEmail('madark.com');
        expect(await signupFormPage.isIdFormatErrorVisible()).toBe(true);
        expect(await signupFormPage.isEmailFormatErrorVisible()).toBe(true);
        expect(await visual.matchesBaseline('03-signup-form-errors-rtl')).toBe(true);
        manualCheck('Arabic Conversion frames — mirrored layout, right-aligned errors, +966 stays LTR (run with E2E_LANG=ar)');
      }
    );

    test(
      '[11852] Customer App / Customer / Sign Up_ New customer registers end to end (phone, OTP, ID, email, terms, SIMAH, Nafath) and logs in',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.registration,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11852' },
      async ({ app, data, signupFormPage, nafathPage, loginPage, homePage }) => {
        const phone = data.newCustomer.phone;
        await app.openSignupForm(phone, data.devOtp());
        await signupFormPage.enterIdNumber(data.nationalId());
        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();
        await signupFormPage.clickOnCreateAccountButton();
        expect(await nafathPage.isVerifyAccountVisible()).toBe(true);
        expect(await nafathPage.isExpiryCountdownVisible()).toBe(true);
        manualCheck('approve the shown code in the Nafath sandbox app (external service)');
        expect(await nafathPage.isSuccessVisible()).toBe(true);
        if (await nafathPage.isActivateEmailSheetVisible()) await nafathPage.clickOnSkipEmailButton();
        await nafathPage.clickOnGoToLoginButton();
        expect(await loginPage.isLoginScreenVisible()).toBe(true);
        await app.loginAs({ phone, otp: data.devOtp() });
        expect(await homePage.isHomeVisible()).toBe(true);
      }
    );

    test(
      '[11853] Customer App / Customer / Sign Up_ Phone not starting with 5 shows Mobile number must start with 5',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.registration,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11853' },
      async ({ app, data, signupPhonePage }) => {
        await app.openSignupPhone();
        await signupPhonePage.enterPhoneNumber(data.invalid.phoneWrongPrefix.slice(0, 8));
        expect(await signupPhonePage.isPhoneNumberErrorVisible()).toBe(false);
        expect(await signupPhonePage.isNextButtonEnabled()).toBe(false);

        await signupPhonePage.enterPhoneNumber(data.invalid.phoneWrongPrefix);
        expect(await signupPhonePage.isPhoneNumberErrorVisible()).toBe(true);
        expect(await signupPhonePage.isNextButtonEnabled()).toBe(false);

        await signupPhonePage.clickOnNextButton();
        expect(await signupPhonePage.isSignupPhoneScreenVisible()).toBe(true);

        await signupPhonePage.enterPhoneNumber(data.newCustomer.phone);
        expect(await signupPhonePage.isPhoneNumberErrorVisible()).toBe(false);
        expect(await signupPhonePage.isNextButtonEnabled()).toBe(true);
        manualCheck('repeat step 3 with E2E_LANG=ar — error reads "رقم الجوال يجب أن يبدأ بالرقم 5" (asserted via i18n on the AR run)');
      }
    );

    test(
      '[11854] Customer App / Customer / Sign Up_ Phone accepts only 9 digits after +966 (8, 9 and 10 digits, letters and symbols)',
      Tag.Corner,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.functional,
      Tag.type.boundary,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11854' },
      async ({ app, data, signupPhonePage }) => {
        const valid = data.newCustomer.phone;
        await app.openSignupPhone();
        await signupPhonePage.enterPhoneNumber(valid.slice(0, 8));
        expect(await signupPhonePage.isNextButtonEnabled()).toBe(false);
        expect(await signupPhonePage.isPhoneNumberErrorVisible()).toBe(false);

        await signupPhonePage.enterPhoneNumber(valid);
        expect(await signupPhonePage.isNextButtonEnabled()).toBe(true);
        expect(await signupPhonePage.getPhoneNumberShown()).toMatch(/\d{2}\s\d{3}\s\d{4}/);
        await signupPhonePage.enterExtraPhoneCharacters('1');
        expect(await signupPhonePage.getPhoneNumber()).toBe(valid);

        await signupPhonePage.enterExtraPhoneCharacters('a+- ');
        expect(await signupPhonePage.getPhoneNumber()).toBe(valid);

        await signupPhonePage.pastePhoneNumber('5a1b2c3d4');
        expect(await signupPhonePage.getPhoneNumber()).toMatch(/^\d*$/);
        await signupPhonePage.pastePhoneNumber('55-123-4567');
        expect(await signupPhonePage.getPhoneNumber()).toMatch(/^\d*$/);
      }
    );

    test(
      '[11855] Customer App / Customer / Sign Up_ Already registered phone number cannot register again',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.registration,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11855' },
      async ({ app, data, signupPhonePage, otpPage, signupFormPage, trustDevicePage, homePage }) => {
        const customer = data.customer();
        await app.openSignupPhone();
        await signupPhonePage.enterPhoneNumber(data.local(customer.phone));
        await signupPhonePage.clickOnNextButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);
        await otpPage.enterOtp(customer.otp);
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await signupFormPage.isRegistrationFormVisible(8000)).toBe(false);
        if (await trustDevicePage.isTrustDevicePromptVisible()) await trustDevicePage.clickOnAllowButton();
        expect(await homePage.isHomeVisible()).toBe(true);
        manualCheck('back office: one customer for this phone, no new registration request');
      }
    );

    test(
      '[11856] Customer App / Customer / Sign Up_ National ID must be 10 digits starting with 1 or 2',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.registration,
      Tag.type.functional,
      Tag.type.boundary,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11856' },
      async ({ app, data, signupFormPage, nafathPage }) => {
        const reg = data.seed('registration');
        const id = data.nationalId();
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();

        await signupFormPage.enterIdNumber(id.slice(0, 9));
        expect(await signupFormPage.isIdFormatErrorVisible()).toBe(false);
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(false);

        await signupFormPage.enterIdNumber(id);
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(true);
        await signupFormPage.enterExtraIdCharacters('9');
        expect(await signupFormPage.getIdNumber()).toBe(id);

        await signupFormPage.enterIdNumber(`3${id.slice(1)}`);
        expect(await signupFormPage.isIdFormatErrorVisible()).toBe(true);
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(false);
        await signupFormPage.enterIdNumber(`2${id.slice(1)}`);
        expect(await signupFormPage.isIdFormatErrorVisible()).toBe(false);

        await signupFormPage.enterExtraIdCharacters('ab#');
        expect(await signupFormPage.getIdNumber()).toBe(`2${id.slice(1)}`);

        await signupFormPage.enterIdNumber(reg.registeredNationalId);
        await signupFormPage.clickOnCreateAccountButton();
        expect(await signupFormPage.isGenericErrorVisible()).toBe(true);
        expect(await nafathPage.isVerifyAccountVisible(5000)).toBe(false);
      }
    );

    test(
      '[11857] Customer App / Customer / Sign Up_ Invalid email shows the email format error and spaces are blocked',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11857' },
      async ({ app, data, signupFormPage }) => {
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.enterIdNumber(data.nationalId());

        await signupFormPage.enterEmail('madark.com');
        expect(await signupFormPage.isEmailFormatErrorVisible()).toBe(true);
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(false);

        await signupFormPage.enterEmail('madark@');
        expect(await signupFormPage.isEmailFormatErrorVisible()).toBe(true);
        await signupFormPage.enterEmail('madark@madark');
        expect(await signupFormPage.isEmailFormatErrorVisible()).toBe(true);

        await signupFormPage.clearEmail();
        await signupFormPage.enterEmailKeys('mad ark@madark.com');
        expect(await signupFormPage.getEmail()).not.toContain(' ');

        await signupFormPage.enterEmail('madark@madark.com');
        expect(await signupFormPage.isEmailFormatErrorVisible()).toBe(false);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(true);
      }
    );

    test(
      '[11862] Customer App / Customer / Sign Up_ Phone not matching the national ID shows the Not Eligible screen in the Figma style with the current message',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11862' },
      async ({ app, data, signupFormPage, registrationResultPage, signupPhonePage, visual }) => {
        const reg = data.seed('registration');
        const phone = data.newCustomer.phone;
        await app.openSignupForm(phone, data.devOtp());
        await signupFormPage.enterIdNumber(String(reg.mismatchNationalId ?? reg.registeredNationalId));
        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();
        await signupFormPage.clickOnCreateAccountButton();
        expect(await registrationResultPage.isNotEligibleVisible(150_000)).toBe(true);
        expect(await visual.matchesBaseline('03-signup-not-eligible')).toBe(true);
        manualCheck('Figma 998:11030 — title ExtraBold 28/33.6 #0B1736, body Regular 14.5/24.94 #6B7280');

        await registrationResultPage.clickOnEditPhoneButton();
        expect(await signupPhonePage.isSignupPhoneScreenVisible()).toBe(true);
        expect(await signupPhonePage.getPhoneNumber()).toBe(phone);

        manualCheck('repeat the mismatch until the attempts limit — "Attempts Exceeded" screen (limit is backend config)');
      }
    );

    test(
      '[11863] Customer App / Customer / Sign Up_ Network loss on submit shows connection error and retry does not create a duplicate account',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11863' },
      async ({ app, data, mobile, signupFormPage, nafathPage }) => {
        const id = data.nationalId();
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.enterIdNumber(id);
        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();

        await mobile.setAirplaneMode(true);
        await signupFormPage.clickOnCreateAccountButton();
        expect(await signupFormPage.isConnectionErrorVisible()).toBe(true);
        expect(await signupFormPage.getIdNumber()).toBe(id);
        expect(await signupFormPage.isTermsChecked()).toBe(true);
        expect(await signupFormPage.isSimahChecked()).toBe(true);

        await mobile.setAirplaneMode(false);
        await signupFormPage.clickOnCreateAccountButton();
        expect(await nafathPage.isVerifyAccountVisible()).toBe(true);
        manualCheck('approve in the Nafath sandbox app; back office shows exactly one customer for this phone and ID');
      }
    );
  });

  describe('02 · Sign Up OTP', () => {
    test(
      '[11859] Customer App / Customer / Sign Up OTP_ 5 wrong OTP attempts block input for 180 seconds and resend works after the countdown',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.registration,
      Tag.type.functional,
      Tag.type.security,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11859' },
      async ({ app, data, signupPhonePage, otpPage, signupFormPage }) => {
        await app.openSignupPhone();
        await signupPhonePage.enterPhoneNumber(data.newCustomer.phone);
        await signupPhonePage.clickOnNextButton();
        expect(await otpPage.isOtpScreenVisible()).toBe(true);

        for (let attempt = 1; attempt <= 5; attempt++) {
          await otpPage.enterOtp(data.invalid.otpWrong);
          if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
          expect(await otpPage.isOtpScreenVisible()).toBe(true);
        }
        expect(await otpPage.isBlockedCountdownVisible()).toBe(true);

        expect(await otpPage.isVerifyButtonEnabled()).toBe(false);

        expect(await otpPage.waitForBlockToEnd()).toBe(true);

        expect(await otpPage.waitForResendEnabled()).toBe(true);
        await otpPage.clickOnResendLink();
        await otpPage.enterOtp(data.devOtp());
        if (await otpPage.isVerifyButtonEnabled()) await otpPage.clickOnVerifyButton();
        expect(await signupFormPage.isRegistrationFormVisible()).toBe(true);
      }
    );
  });

  describe('03 · Sign Up Terms', () => {
    test(
      '[11849] Customer App / Customer / Sign Up Terms_ Terms & Conditions screen matches Figma (title Bold 17/25.5, section Bold 14/21, body Regular 13.5/23.22 #6B7280, Accept & Continue 350x53.99)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.registration,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11849' },
      async ({ app, data, signupFormPage, legalContentPage, visual }) => {
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.clickOnTermsLink();
        expect(await legalContentPage.isTermsVisible()).toBe(true);
        expect(await legalContentPage.hasContent()).toBe(true);
        expect(await visual.matchesBaseline('03-terms-top')).toBe(true);
        manualCheck('Figma 1333:21795 — title Bold 17/25.5, sections Bold 14/21, body Regular 13.5/23.22 #6B7280, Accept & Continue 350x53.99');
      }
    );

    test(
      '[11858] Customer App / Customer / Sign Up Terms_ Account cannot be created without accepting Terms & Conditions',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11858' },
      async ({ app, data, signupFormPage, legalContentPage }) => {
        const id = data.nationalId();
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.enterIdNumber(id);
        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.checkSimah();
        expect(await signupFormPage.isTermsChecked()).toBe(false);

        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(false);
        await signupFormPage.clickOnCreateAccountButton();
        expect(await signupFormPage.isRegistrationFormVisible()).toBe(true);

        await signupFormPage.clickOnTermsLink();
        expect(await legalContentPage.isTermsVisible()).toBe(true);
        await app.goBack();
        expect(await signupFormPage.getIdNumber()).toBe(id);
        expect(await signupFormPage.getEmail()).toBe(data.newCustomer.email);

        await signupFormPage.checkTerms();
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(true);

        await signupFormPage.uncheckTerms();
        expect(await signupFormPage.isCreateAccountButtonEnabled()).toBe(false);
      }
    );
  });

  describe('04 · Sign Up Nafath', () => {
    test(
      '[11860] Customer App / Customer / Sign Up Nafath_ Nafath success continues registration and Nafath failure shows the error with resend',
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.registration,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11860' },
      async ({ app, data, signupFormPage, nafathPage }) => {
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.enterIdNumber(data.nationalId());
        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();
        await signupFormPage.clickOnCreateAccountButton();
        expect(await nafathPage.isVerifyAccountVisible()).toBe(true);
        expect(await nafathPage.isExpiryCountdownVisible()).toBe(true);

        manualCheck('approve the code in the Nafath sandbox app (customer 1)');
        expect(await nafathPage.isSuccessVisible()).toBe(true);

        manualCheck('customer 2: reject the code in the Nafath sandbox app or let it expire, then Resend and approve');
        await app.openSignupForm(data.randomPhone(), data.devOtp());
        await signupFormPage.enterIdNumber(data.nationalId('2'));
        await signupFormPage.enterEmail(`n${data.newCustomer.email}`);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();
        await signupFormPage.clickOnCreateAccountButton();
        expect(await nafathPage.isVerifyAccountVisible()).toBe(true);
        await nafathPage.clickOnResendButton().catch(() => undefined);

        await app.goBack();
        expect(await nafathPage.isCancelWaitingDialogVisible()).toBe(true);
        await nafathPage.clickOnContinueWaitingButton();
        expect(await nafathPage.isVerifyAccountVisible()).toBe(true);
      }
    );
  });

  describe('05 · Sign Up SIMAH', () => {
    test(
      '[11850] Customer App / Customer / Sign Up SIMAH_ SIMAH consent screen matches Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.registration,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11850' },
      async ({ app, data, signupFormPage, simahConsentPage, visual }) => {
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.clickOnSimahLink();
        expect(await simahConsentPage.isSimahConsentVisible()).toBe(true);
        expect(await simahConsentPage.isIntroVisible()).toBe(true);
        expect(await simahConsentPage.areSectionsInOrder()).toBe(true);
        expect(await visual.matchesBaseline('03-simah-consent')).toBe(true);
        manualCheck('Figma 1333:21936 — title/intro/sections typography and frame shadow');
      }
    );
  });

  describe('06 · Sign Up AML', () => {
    test(
      '[11861] Customer App / Customer / Sign Up AML_ AML check failure shows the AML error screen with return to login',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.registration,
      Tag.type.functional,
      Tag.type.integration,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11861' },
      async ({ app, data, signupFormPage, registrationResultPage, loginPage, homePage }) => {
        const reg = data.seed('registration');
        const amlId = data.need(reg.amlNationalId, 'registration.amlNationalId');
        await app.openSignupForm(data.newCustomer.phone, data.devOtp());
        await signupFormPage.enterIdNumber(amlId);
        await signupFormPage.enterEmail(data.newCustomer.email);
        await signupFormPage.checkTerms();
        await signupFormPage.checkSimah();
        await signupFormPage.clickOnCreateAccountButton();
        manualCheck('complete Nafath in the sandbox app if the build asks for it');

        expect(await registrationResultPage.isAmlErrorVisible(150_000)).toBe(true);
        expect(await registrationResultPage.isAmlMessageVisible()).toBe(true);
        expect(await homePage.isHomeVisible(3000)).toBe(false);
        await registrationResultPage.clickOnBackToLoginButton();
        expect(await loginPage.isLoginScreenVisible()).toBe(true);
        manualCheck('back office: no active customer for the AML-flagged ID');
      }
    );
  });
});
