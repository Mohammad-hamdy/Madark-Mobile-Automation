export type EnvName = 'dev' | 'preprod';

export type EnvConfig = {
  name: EnvName;
  appEnvLabel: string;
  apiBaseUrl: string;
  apiPrefix: string;
  encryption: boolean;
  secretKeys: { customerPhone: string; customerOtp: string };
};
