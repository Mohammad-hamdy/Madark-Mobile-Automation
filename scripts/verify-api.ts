import 'tsconfig-paths/register';
import { ApiClient } from '@madark/api/client';
import { AuthWorkflow } from '@madark/api/workflows/auth.workflow';
import { loadEnv } from '@madark/environment';
import { TestdataHelper } from '@madark/environment/testdata/helpers/testdata.helper';

async function main(): Promise<void> {
  const env = loadEnv();
  process.stdout.write(`env=${env.name} base=${env.apiBaseUrl} encryption=${env.encryption}\n`);
  const customer = TestdataHelper.requireExisting(TestdataHelper.generate(env.name));
  const client = new ApiClient(env);
  const token = await AuthWorkflow.performLogin(customer, client);
  process.stdout.write(`login OK via GenerateLoginOrRegisterOtp + CheckMobileRegistration, token length ${token.length}\n`);
}

main().catch((err: Error) => {
  process.stderr.write(`API check failed: ${err.message}\n`);
  process.exit(1);
});
