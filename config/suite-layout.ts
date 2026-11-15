/**
 * Order of modules (features) and their screens, following the customer journey in the app:
 * first launch → guest → account → home/browse → request financing → contract → requests → pay → account/support → app-wide.
 * Folder and describe numbers (01, 02, …) come from the position in these lists.
 * To reorder, move entries here and run `npm run import:suite`.
 */
export type ScreenLayout = { name: string; match: string[] };
export type ModuleLayout = { ado: string; slug: string; title: string; screens: ScreenLayout[] };

const s = (name: string, ...match: string[]): ScreenLayout => ({ name, match: match.length ? match : [name] });

export const SUITE_LAYOUT: ModuleLayout[] = [
  {
    ado: 'Mobile-Onboarding',
    slug: 'onboarding',
    title: 'Onboarding',
    screens: [s('Splash Screen'), s('Onboarding')],
  },
  {
    ado: 'Mobile-GuestMode',
    slug: 'guest-mode',
    title: 'Guest Mode',
    screens: [
      s('Guest Homepage'),
      s('Guest Navigation'),
      s('Guest Institutions'),
      s('Guest Request Financing'),
      s('Guest KYC'),
    ],
  },
  {
    ado: 'Mobile-Registration',
    slug: 'registration',
    title: 'Registration',
    screens: [
      s('Sign Up'),
      s('Sign Up OTP'),
      s('Sign Up Terms'),
      s('Sign Up Nafath'),
      s('Sign Up SIMAH'),
      s('Sign Up AML'),
    ],
  },
  {
    ado: 'Mobile-SignIn',
    slug: 'sign-in',
    title: 'Sign In',
    screens: [
      s('Login'),
      s('Login OTP'),
      s('Biometric Login'),
      s('Forgot Password'),
      s('Change Phone Number'),
      s('Account Locked'),
      s('Contact Support'),
      s('Session'),
      s('Sign Out'),
    ],
  },
  {
    ado: 'Mobile-Home',
    slug: 'home',
    title: 'Home',
    screens: [s('Home'), s('Home Summary Card'), s('Bottom Navigation')],
  },
  {
    ado: 'Mobile-Institutions',
    slug: 'institutions',
    title: 'Institutions',
    screens: [
      s('Institutions'),
      s('Universities'),
      s('Schools'),
      s('Institution Details'),
      s('University Details'),
    ],
  },
  {
    ado: 'Mobile-SubmitRequest',
    slug: 'submit-request',
    title: 'Submit Request',
    screens: [
      s('Request Financing'),
      s('Add Students'),
      s('Add Student'),
      s('Installment Duration'),
      s('Submit Request'),
    ],
  },
  {
    ado: 'Mobile-RequestValidation',
    slug: 'request-validation',
    title: 'Request Validation',
    screens: [
      s('Validation Messages'),
      s('Requested Amount'),
      s('Branch'),
      s('Eligibility'),
      s('Ineligible'),
      s('Duplicate Request'),
      s('Rejection Cap'),
      s('SIMAH Consent'),
      s('Salary Certificate'),
      s('Session'),
    ],
  },
  {
    ado: 'Mobile-KYC',
    slug: 'kyc',
    title: 'KYC',
    screens: [
      s('KYC Stepper'),
      s('KYC'),
      s('Personal Information'),
      s('Work Data'),
      s('KYC Selection Sheets'),
      s('KYC Question Types'),
      s('KYC Related Questions'),
      s('KYC File Upload'),
      s('KYC Saved Answers'),
    ],
  },
  {
    ado: 'Mobile-ContractActivation',
    slug: 'contract-activation',
    title: 'Contract Activation',
    screens: [s('Contract'), s('Contract OTP'), s('Nafith'), s('Activation')],
  },
  {
    ado: 'Mobile-MyRequests',
    slug: 'my-requests',
    title: 'My Requests',
    screens: [
      s('My Requests'),
      s('Request Details'),
      s('Paid Tuition Fees'),
      s('Open Choose How to Pay', 'MRUI-MYR'),
      s('Regression', 'MRUI-REG'),
    ],
  },
  {
    ado: 'Mobile-CompleteInstitutionRequest',
    slug: 'complete-institution-request',
    title: 'Complete Institution Request',
    screens: [s('Post-Login Screen', 'MRUI-SCR'), s('Institution Request'), s('Web Page Request')],
  },
  {
    ado: 'Mobile-PayWithDiscount',
    slug: 'pay-with-discount',
    title: 'Pay With Discount',
    screens: [
      s('Choose How to Pay UI', 'MRUI-UI'),
      s('Option Selection', 'MRUI-SEL'),
      s('Discount Calculation', 'MRUI-CALC'),
      s('Discount Disabled', 'MRUI-DIS'),
      s('Pay with Discount'),
      s('Payment Integration', 'MRUI-INT'),
      s('Pay with Discount Receipt'),
      s('Negative', 'MRUI-NEG'),
      s('Security', 'MRUI-SEC'),
      s('Arabic', 'MRUI-AR'),
      s('Regression', 'MRUI-REG'),
    ],
  },
  {
    ado: 'Mobile-CancelRequest',
    slug: 'cancel-request',
    title: 'Cancel Request',
    screens: [s('Cancel Request'), s('Cancel Success'), s('Cancel Failed')],
  },
  {
    ado: 'Mobile-Payment',
    slug: 'payment',
    title: 'Payment',
    screens: [
      s('My Payments'),
      s('Installment Amount'),
      s('Pay Now'),
      s('Pay Ahead'),
      s('Payment Gateway'),
      s('Payment'),
      s('Payment Confirmed'),
      s('Payment Failed'),
      s('Overdue'),
      s('Payment Overdue'),
      s('Invoice'),
      s('Receipt'),
      s('Proof of Debt'),
    ],
  },
  {
    ado: 'Mobile-EarlySettlement',
    slug: 'early-settlement',
    title: 'Early Settlement',
    screens: [s('Early Settlement')],
  },
  {
    ado: 'Mobile-Withdrawal',
    slug: 'withdrawal',
    title: 'Withdrawal',
    screens: [
      s('Withdrawal'),
      s('Withdrawal Attachment'),
      s('Withdrawal Details'),
      s('Withdrawal Status'),
      s('Withdrawal Payment'),
    ],
  },
  {
    ado: 'Mobile-Notifications',
    slug: 'notifications',
    title: 'Notifications',
    screens: [s('Notifications'), s('Push Notification')],
  },
  {
    ado: 'Mobile-Profile',
    slug: 'profile',
    title: 'Profile',
    screens: [
      s('Edit Profile'),
      s('Edit Email'),
      s('Edit Phone Number'),
      s('Change Mobile Number'),
      s('Change Password'),
      s('Biometric Login'),
      s('Close Account'),
    ],
  },
  {
    ado: 'Mobile-MoreSupport',
    slug: 'more-support',
    title: 'More & Support',
    screens: [s('More'), s('Contact Us'), s('Complaint'), s('Share App')],
  },
  {
    ado: 'Mobile-AppStates',
    slug: 'app-states',
    title: 'App States',
    screens: [
      s('App States'),
      s('No Internet'),
      s('Connection Error'),
      s('Maintenance'),
      s('Force Update'),
      s('App Lifecycle'),
    ],
  },
  {
    ado: 'Mobile-ThemeLanguage',
    slug: 'theme-language',
    title: 'Theme & Language',
    screens: [
      s('Language'),
      s('Arabic'),
      s('Typography'),
      s('Colour Palette'),
      s('Dark Mode'),
      s('Accessibility'),
      s('Touch Targets'),
      s('Screen Sizes'),
      s('Platforms'),
    ],
  },
];

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function moduleFolder(index: number, slug: string): string {
  return `${pad(index + 1)}-${slug}`;
}

/** Screen of a case: "Customer App / X / <Screen>_ …" or the MRUI category code. */
export function screenKey(title: string): string {
  const m = /^Customer App \/ [^/]+ \/ ([^_]+)_/.exec(title);
  if (m) return m[1].trim();
  const code = /^\[MRUI-([A-Z]+)-/.exec(title);
  return code ? `MRUI-${code[1]}` : '';
}
