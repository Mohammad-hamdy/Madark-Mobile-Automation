import type { EnvConfig } from '@madark/environment/types';
import { encryptionFlag } from '@madark/environment/flags';

export const preprod = (): EnvConfig => ({
  name: 'preprod',
  appEnvLabel: 'Pre-Prod',
  apiBaseUrl: process.env.API_BASE_URL || 'https://gateway-preprod.madark.sa/',
  apiPrefix: 'api/1',
  encryption: encryptionFlag(),
  secretKeys: {
    customerPhone: 'E2E_CUSTOMER_PHONE',
    customerOtp: 'E2E_CUSTOMER_OTP',
  },
});
