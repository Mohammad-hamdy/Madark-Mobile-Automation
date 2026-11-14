import { randomBytes, randomInt } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { envName, loadEnv } from '@madark/environment';
import type { EnvName } from '@madark/environment/types';
import { logger } from '@madark/utils/logger';

export type Customer = { phone: string; otp: string };

export type TestData = {
  env: EnvName;
  generatedAt: string;
  customers: { existing: Customer };
  newCustomer: { phone: string; email: string; fullName: string };
  invalid: { phoneTooShort: string; phoneWrongPrefix: string; otpWrong: string };
};

export class TestdataHelper {
  static unique(prefix: string): string {
    return `${prefix}-${Date.now()}-${randomBytes(3).toString('hex')}`;
  }

  static saudiMobile(): string {
    return `5${String(randomInt(0, 100_000_000)).padStart(8, '0')}`;
  }

  static dir(env: EnvName): string {
    return path.resolve(__dirname, '..', env);
  }

  static generate(env: EnvName = envName()): TestData {
    const config = loadEnv();
    const otp = process.env[config.secretKeys.customerOtp] || '';
    const wrongOtp = otp ? String((Number(otp) + 1) % 10 ** otp.length).padStart(otp.length, '0') : '000000';
    const payload: TestData = {
      env,
      generatedAt: new Date().toISOString(),
      customers: {
        existing: {
          phone: process.env[config.secretKeys.customerPhone] || '',
          otp,
        },
      },
      newCustomer: {
        phone: this.saudiMobile(),
        email: `${this.unique('e2e').toLowerCase()}@example.com`,
        fullName: `E2E ${randomBytes(2).toString('hex')}`,
      },
      invalid: {
        phoneTooShort: this.saudiMobile().slice(0, 6),
        phoneWrongPrefix: `4${this.saudiMobile().slice(1)}`,
        otpWrong: wrongOtp,
      },
    };
    const dir = this.dir(env);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'current.json'), JSON.stringify(payload, null, 2));
    if (!payload.customers.existing.phone) logger.warn(`${config.secretKeys.customerPhone} is not set in .env.local`);
    logger.info(`generated testdata for ${env}`);
    return payload;
  }

  static load(env: EnvName = envName()): TestData {
    const file = path.join(this.dir(env), 'current.json');
    if (!fs.existsSync(file)) return this.generate(env);
    return JSON.parse(fs.readFileSync(file, 'utf8')) as TestData;
  }

  static requireExisting(data: TestData): Customer {
    const c = data.customers.existing;
    if (!c.phone || !c.otp) throw new Error('E2E_CUSTOMER_PHONE / E2E_CUSTOMER_OTP missing in .env.local');
    return c;
  }
}
