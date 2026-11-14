import path from 'node:path';
import { OnboardingPage } from '@madark/pages/onboarding/OnboardingPage';
import { GuestHomePage } from '@madark/pages/home/GuestHomePage';
import { LoginPage } from '@madark/pages/auth/LoginPage';
import { OtpPage } from '@madark/pages/auth/OtpPage';
import { HomePage } from '@madark/pages/home/HomePage';
import { MorePage } from '@madark/pages/more/MorePage';
import { TrustDevicePage } from '@madark/pages/auth/TrustDevicePage';
import { BottomNavPage } from '@madark/pages/common/BottomNavPage';
import { TestdataHelper, type TestData } from '@madark/environment/testdata/helpers/testdata.helper';
import { loadEnv } from '@madark/environment';
import type { EnvConfig } from '@madark/environment/types';
import { ApiClient } from '@madark/api/client';
import { AppSetup } from '@madark/utils/app-setup';
import { annotateCase } from '@madark/utils/report';
import { setTestContext } from '@madark/utils/test-context';
import { MobileActions } from '@madark/utils/mobile-actions';
import { matchesFilter, parseCaseId, tag, type CaseTags } from '@madark/utils/tag';

export type AppFixtures = {
  env: EnvConfig;
  testdata: TestData;
  api: ApiClient;
  mobile: typeof MobileActions;
  app: AppSetup;
  onboardingPage: OnboardingPage;
  guestHomePage: GuestHomePage;
  loginPage: LoginPage;
  otpPage: OtpPage;
  homePage: HomePage;
  morePage: MorePage;
  trustDevicePage: TrustDevicePage;
  bottomNav: BottomNavPage;
};

export type CaseMeta = { blocked?: string; adoUrl?: string };

type Body = (fixtures: AppFixtures) => Promise<void>;
type Token = string | CaseTags | CaseMeta;

function build(): AppFixtures {
  const bottomNav = new BottomNavPage();
  const pages = {
    onboardingPage: new OnboardingPage(),
    guestHomePage: new GuestHomePage({ bottomNav }),
    loginPage: new LoginPage(),
    otpPage: new OtpPage(),
    homePage: new HomePage({ bottomNav }),
    morePage: new MorePage(),
    trustDevicePage: new TrustDevicePage(),
  };
  return {
    env: loadEnv(),
    testdata: TestdataHelper.load(),
    api: ApiClient.instance,
    mobile: MobileActions,
    app: new AppSetup(pages),
    bottomNav,
    ...pages,
  };
}

function isMeta(t: Token): t is CaseMeta {
  return typeof t === 'object' && ('blocked' in t || 'adoUrl' in t);
}

export function test(name: string, ...rest: Array<Token | Body>): void {
  const fn = rest[rest.length - 1];
  if (typeof fn !== 'function') throw new Error(`missing body for ${name}`);
  const tokens = rest.slice(0, -1) as Token[];
  const meta = Object.assign({}, ...tokens.filter(isMeta)) as CaseMeta;
  const raw = tokens.filter((t): t is string | CaseTags => !isMeta(t));

  it(name, async function () {
    setTestContext(this);
    const file = this.test?.file || 'specs/unknown/unknown.spec.ts';
    const specFile = path.basename(file);
    const module = path.basename(path.dirname(file));
    const tags = tag({ id: parseCaseId(name), module }, ...raw);
    if (!matchesFilter(tags, process.env.E2E_TAGS)) {
      this.skip();
      return;
    }
    annotateCase({ title: name, specFile, tags, adoUrl: meta.adoUrl });
    if (meta.blocked) {
      annotateBlocked(meta.blocked);
      this.skip();
      return;
    }
    await fn(build());
  });
}

function annotateBlocked(reason: string): void {
  process.stdout.write(`[info] blocked: ${reason}\n`);
}
