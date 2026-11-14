import path from 'node:path';
import dotenv from 'dotenv';
import { dev } from '@madark/environment/dev';
import { preprod } from '@madark/environment/preprod';
import type { EnvConfig, EnvName } from '@madark/environment/types';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

export function envName(): EnvName {
  return (process.env.E2E_ENV || 'dev').toLowerCase() === 'preprod' ? 'preprod' : 'dev';
}

export function loadEnv(): EnvConfig {
  return envName() === 'preprod' ? preprod() : dev();
}
