import 'tsconfig-paths/register';
import path from 'node:path';
import dotenv from 'dotenv';
import type { Options } from '@wdio/types';
import { connection } from '@madark/config/appium';
import { resolveCapabilities } from '@madark/config/capabilities';
import { envName } from '@madark/environment';
import { I18n } from '@madark/i18n/i18n';
import { TestdataHelper } from '@madark/environment/testdata/helpers/testdata.helper';
import { AppSetup } from '@madark/utils/app-setup';
import { writeRunMetadata, refreshSessionMetadata } from '@madark/utils/report-metadata';

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const ALLURE_RESULTS = path.resolve(__dirname, 'allure-results');

export const config: Options.Testrunner = {
  runner: 'local',
  ...connection(),
  specs: ['./specs/**/*.spec.ts'],
  maxInstances: 1,
  capabilities: [resolveCapabilities()],
  logLevel: (process.env.WDIO_LOG_LEVEL as Options.WebDriverLogTypes) || 'error',
  outputDir: path.resolve(__dirname, 'logs'),
  waitforTimeout: 20000,
  connectionRetryTimeout: 300000,
  connectionRetryCount: 1,
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: ALLURE_RESULTS,
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: path.resolve(__dirname, 'tsconfig.json'),
    },
  },
  mochaOpts: { ui: 'bdd', timeout: 300000 },
  onPrepare() {
    TestdataHelper.generate(envName());
    writeRunMetadata(ALLURE_RESULTS);
  },
  async before() {
    I18n.load(process.env.E2E_LANG || 'en');
    AppSetup.resetSession();
    await refreshSessionMetadata(ALLURE_RESULTS);
  },
  async afterTest(_test, _context, { passed }) {
    if (!passed) await driver.takeScreenshot().catch(() => undefined);
  },
};
