import fs from 'node:fs';
import path from 'node:path';
import { envName } from '@madark/environment';

/**
 * Backend-state test data ("seeds") for cases that need an existing request, loan, institution setup, etc.
 * Values are environment specific and never committed: put them in environment/testdata/<env>/seed.json
 * (gitignored) — start from environment/testdata/seed.example.json. A case that needs a missing seed is
 * skipped with the seed name, so the run stays green-or-skipped instead of failing on absent data.
 * Customers sign in with phone + the Dev OTP; "otp" defaults to E2E_CUSTOMER_OTP when omitted.
 */
type Cust = { phone: string; otp?: string };
type Req = Cust & { requestNumber: string };
type Card = { number: string; expiry: string; cvv: string; holder: string };

/** An institution/branch as the customer finds it: Home → education type → search → name. */
export type InstitutionRef = {
  educationType: string;
  educationTypeAr?: string;
  searchText: string;
  name: string;
  nameAr?: string;
  branch?: string;
  studentName?: string;
};

export type SeedCatalog = {
  /** Registered customer, no active request, KYC answered, eligible to apply */
  eligibleCustomer: Cust;
  /** Registered customer who has not answered KYC yet */
  kycIncompleteCustomer: Cust;
  /** Customer not yet registered at the seed institution's branch (gets "Are you registered?") */
  newBranchCustomer: Cust;
  /** Customer failing eligibility */
  ineligibleCustomer: Cust;
  /** Customer with an active request (duplicate request block) */
  openRequestCustomer: Cust;
  /** Customer at the rejection cap */
  rejectionCapCustomer: Cust;
  /** Locked / deactivated account */
  lockedAccount: Cust;
  /** Account with no loan and no request, safe to close */
  closableAccount: Cust;
  /** Profile data shown on Edit Profile */
  profileCustomer: Cust & { nationalId: string; email?: string };
  /** Customer whose phone can be changed to newPhone (linked to the same national ID) */
  phoneChangeTarget: Cust & { newPhone: string };

  /** Education types, an institution and its branch as returned by the Dev backend */
  institution: InstitutionRef & {
    secondEducationType?: string;
    emptyEducationType?: string;
    universitiesType?: string;
    universityName?: string;
    schoolsType?: string;
    specialBranch?: string;
    city?: string;
    otherCityInstitution?: string;
    categoryChips?: string[];
    secondBranch?: InstitutionRef;
  };
  /** Branch with Pay with Discount enabled */
  discountBranch: InstitutionRef;
  /** Inactive branch / institution */
  inactiveBranch: InstitutionRef;

  /** Registration: IDs already registered / AML-flagged / not matching the phone (Dev sandbox) */
  registration: { registeredNationalId: string; amlNationalId?: string; mismatchNationalId?: string };

  /** KYC question texts from the server template (for selection-sheet and related-question cases) */
  kycQuestions: {
    nationality?: string;
    maritalStatus?: string;
    workSector?: string;
    parentQuestion?: string;
    triggeringAnswer?: string;
    nonTriggeringAnswer?: string;
    childQuestion?: string;
  };
  /** Files pushed to the device for upload cases (local path → device path) */
  kycFiles: { validPdf: string; devicePath: string };

  /** Requests in My Requests */
  approvedIncompleteRequest: Req;
  rejectedRequest: Req & { reasonEn?: string; reasonAr?: string };
  cancellableRequest: Req;
  requestStatusesCustomer: Cust & { expiredRequestNumber?: string };
  salaryCertificateRequest: Req;
  paidTuitionCustomer: Cust;

  /** Contract & activation */
  contractPending: Req;
  rescheduledRequest: Req;
  firstInstallmentRequest: Req & { noFirstPaymentRequestNumber?: string };
  nafithRequest: Req;
  activatedRequest: Req;

  /** Institution-created pending requests (Choose how to pay / Pay with Discount) */
  pendingInstitutionRequestDiscount: Req & { institution: string; student: string; amount: string; discountPercent: number };
  pendingInstitutionRequestNoDiscount: Req & { amount: string; student?: string };
  webPageRequestDiscount: Req;
  webRequestLink: { url: string; requestNumber: string };
  paidInstitutionRequest: Req;
  multiplePendingRequests: Cust & { requestNumbers: string[] };
  longNamesRequest: Req;
  /** Pending discount requests of pendingInstitutionRequestDiscount's customer with other fees / percentages */
  discountFeeVariants: Array<{ requestNumber: string; fees: number; percent: number }>;
  /** A discount request that may be paid by the run (consumed) */
  payableDiscountRequest: Req;
  mixedDiscountRequests: Cust & { discountRequestNumber: string; noDiscountRequestNumber: string };
  paidDiscountRequest: Req & { amountPaid: string };

  /** Loans and payments */
  customerWithLoan: Cust & { loanNumber?: string };
  customerWithTwoLoans: Cust & { firstLoanNumber: string; secondLoanNumber: string };
  customerWithOverdue: Cust;
  halalaInstallmentCustomer: Cust;
  fullyPaidCustomer: Cust;
  earlySettlementLoan: Cust & { loanNumber?: string };
  sandboxCard: Card;
  declinedCard: Card;

  /** Withdrawal */
  withdrawalLoan: Cust & { loanNumber: string; students?: string[]; loanWithoutStudents?: string };
  pendingWithdrawal: Cust & { loanNumber: string };
  pendingPaymentWithdrawal: Req;
  withdrawalStatuses: Cust & { requests: Array<{ requestNumber: string; statusEn: string; statusAr: string }> };
  rejectedWithdrawals: Cust & {
    rejected: { requestNumber: string; reasonEn: string; reasonAr: string };
    rejectedByMadarak: { requestNumber: string; reasonEn: string; reasonAr: string };
  };

  /** Notifications and support */
  customerWithNotifications: Cust & { notificationTitle?: string };
  contactChannels: { phone: string; email: string };
};

export type SeedName = keyof SeedCatalog;

let cache: Partial<SeedCatalog> | undefined;

export function loadSeeds(): Partial<SeedCatalog> {
  if (cache) return cache;
  const file = process.env.E2E_SEED_FILE
    ? path.resolve(process.env.E2E_SEED_FILE)
    : path.resolve(__dirname, envName(), 'seed.json');
  cache = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as Partial<SeedCatalog>) : {};
  if (process.env.E2E_SEED_JSON) cache = { ...cache, ...(JSON.parse(process.env.E2E_SEED_JSON) as Partial<SeedCatalog>) };
  return cache;
}
