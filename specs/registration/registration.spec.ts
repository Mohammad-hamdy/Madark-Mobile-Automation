import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('Registration', () => {
  test(
    '[11845] Customer App / Customer / Sign Up_ Create Account screen matches Figma (title ExtraBold 26/31.2 ls -0.62 #0B1736, subtitle Regular 14/23.1 #6B7280, labels SemiBold 13.5/20.25 #0B1736)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.registration,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11845', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11846] Customer App / Customer / Sign Up_ ID number error state matches Figma (error text SemiBold 12/17.4 #DC2626, error border #DC2626)',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.registration,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11846', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11847] Customer App / Customer / Sign Up_ All fields filled state enables Continue (gradient #38D0D0 to #018281, 299.79x53.99, radius 16, shadow 0/3/8 #0B8BA3 14%)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.registration,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11847', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11848] Customer App / Customer / Sign Up_ Continue is disabled until required data is valid (fill #E4E7EA, label #9DA2AF)',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.registration,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11848', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11849] Customer App / Customer / Sign Up Terms_ Terms & Conditions screen matches Figma (title Bold 17/25.5, section Bold 14/21, body Regular 13.5/23.22 #6B7280, Accept & Continue 350x53.99)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.registration,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11849', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11850] Customer App / Customer / Sign Up SIMAH_ SIMAH consent screen matches Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.registration,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11850', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11851] Customer App / Customer / Sign Up_ Arabic RTL Create Account layout (+966 prefix position, error alignment, mirrored icons)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.registration,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11851', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11852', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11853', blocked: 'not implemented yet' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11854', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11855] Customer App / Customer / Sign Up_ Already registered phone number cannot register again',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.registration,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11855', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11856', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11857] Customer App / Customer / Sign Up_ Invalid email shows the email format error and spaces are blocked',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.registration,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11857', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11858] Customer App / Customer / Sign Up Terms_ Account cannot be created without accepting Terms & Conditions',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.registration,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11858', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11859', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11860] Customer App / Customer / Sign Up Nafath_ Nafath success continues registration and Nafath failure shows the error with resend',
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.registration,
    Tag.type.functional,
    Tag.type.integration,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11860', blocked: 'needs seeded data/mocks: External-service, Backend-state' },
    async () => {}
  );

  test(
    '[11861] Customer App / Customer / Sign Up AML_ AML check failure shows the AML error screen with return to login',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.registration,
    Tag.type.functional,
    Tag.type.integration,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11861', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11862] Customer App / Customer / Sign Up_ Phone not matching the national ID shows the Not Eligible screen in the Figma style with the current message',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.registration,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11862', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

  test(
    '[11863] Customer App / Customer / Sign Up_ Network loss on submit shows connection error and retry does not create a duplicate account',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.registration,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11863', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );
});
