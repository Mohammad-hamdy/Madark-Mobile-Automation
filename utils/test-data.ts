import { toInternational, toLocal } from '@madark/api/builders/auth.requests';
import { TestdataHelper, type Customer, type TestData } from '@madark/environment/testdata/helpers/testdata.helper';
import { loadSeeds, type SeedCatalog, type SeedName } from '@madark/environment/testdata/seeds';
import { skipCurrentTest } from '@madark/utils/test-context';
import { I18n } from '@madark/i18n/i18n';

/** `data` fixture: generated values, the existing customer and named backend-state seeds. */
export class Data {
  constructor(readonly generated: TestData = TestdataHelper.load()) {}

  customer(): Customer {
    const c = this.generated.customers.existing;
    if (!c.phone || !c.otp) skipCurrentTest('needs E2E_CUSTOMER_PHONE / E2E_CUSTOMER_OTP in .env.local');
    return c;
  }

  seed<K extends SeedName>(name: K): SeedCatalog[K] {
    const value = loadSeeds()[name];
    if (value == null) skipCurrentTest(`needs seed "${name}" in environment/testdata/<env>/seed.json (see seed.example.json)`);
    return value as SeedCatalog[K];
  }

  hasSeed(name: SeedName): boolean {
    return loadSeeds()[name] != null;
  }

  /** Customer object from a seed that carries phone + otp. */
  seedCustomer(name: SeedName): Customer {
    const s = this.seed(name) as unknown as Partial<Customer>;
    if (!s.phone) skipCurrentTest(`seed "${name}" has no phone`);
    return { phone: String(s.phone), otp: String(s.otp ?? this.generated.customers.existing.otp) };
  }

  /** OTP accepted on Dev for numbers that are not registered yet (E2E_DEV_OTP, defaults to the customer OTP). */
  devOtp(): string {
    const otp = process.env.E2E_DEV_OTP || this.generated.customers.existing.otp;
    if (!otp) skipCurrentTest('needs E2E_DEV_OTP (fixed Dev OTP) in .env.local');
    return otp;
  }

  /** A national ID in the valid 10-digit format (starts with 1); unique per run. */
  nationalId(prefix: '1' | '2' = '1'): string {
    return `${prefix}${String(Date.now()).slice(-9)}`;
  }

  /** Optional seed field the case cannot run without: skips with the field name when it is missing. */
  need<T>(value: T | undefined | null, name: string): T {
    if (value == null || value === '') skipCurrentTest(`needs seed field "${name}" in environment/testdata/<env>/seed.json`);
    return value as T;
  }

  /** A fresh, unregistered-looking Saudi mobile (5XXXXXXXX). */
  randomPhone(): string {
    return TestdataHelper.saudiMobile();
  }

  /** Amount as the app formats it: thousands separators, 2 decimals ("40,000.00"). */
  money(value: number): string {
    return (Math.round(value * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /** Discount and pay-today for fees at a percentage, rounded to 2 decimals (platform rule). */
  discountOf(fees: number, percent: number): { discount: number; payToday: number } {
    const discount = Math.round(fees * percent) / 100;
    return { discount, payToday: Math.round((fees - discount) * 100) / 100 };
  }

  /** Pending discount request with these fees (seed discountFeeVariants). */
  discountVariant(fees: number): { requestNumber: string; fees: number; percent: number } {
    const v = (this.seed('discountFeeVariants') ?? []).find((x) => Math.abs(x.fees - fees) < 0.001);
    return this.need(v, `discountFeeVariants[fees=${fees}]`);
  }

  /** Pending discount request configured with this percentage (seed discountFeeVariants). */
  discountVariantByPercent(percent: number): { requestNumber: string; fees: number; percent: number } {
    const v = (this.seed('discountFeeVariants') ?? []).find((x) => x.percent === percent);
    return this.need(v, `discountFeeVariants[percent=${percent}]`);
  }

  /** Run language (E2E_LANG). */
  get language(): 'ar' | 'en' {
    return I18n.isAr ? 'ar' : 'en';
  }

  /** Backend text in the run language (Arabic value when E2E_LANG=ar and one is given). */
  pick(en: string, ar?: string): string {
    return I18n.isAr && ar ? ar : en;
  }

  local(phone: string): string {
    return toLocal(phone);
  }

  international(phone: string): string {
    return toInternational(phone);
  }

  get newCustomer(): TestData['newCustomer'] {
    return this.generated.newCustomer;
  }

  get invalid(): TestData['invalid'] {
    return this.generated.invalid;
  }
}
