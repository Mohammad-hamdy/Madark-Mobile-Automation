import path from 'node:path';
import { lazyPages, type Pages } from '@madark/pages/index';
import { TestdataHelper, type TestData } from '@madark/environment/testdata/helpers/testdata.helper';
import { loadEnv } from '@madark/environment';
import type { EnvConfig } from '@madark/environment/types';
import { ApiClient } from '@madark/api/client';
import { AppSetup } from '@madark/utils/app-setup';
import { Data } from '@madark/utils/test-data';
import { Visual } from '@madark/utils/visual';
import { annotateCase } from '@madark/utils/report';
import { setTestContext } from '@madark/utils/test-context';
import { MobileActions } from '@madark/utils/mobile-actions';
import { matchesFilter, parseCaseId, tag, type CaseTags } from '@madark/utils/tag';

export type AppFixtures = Pages & {
  env: EnvConfig;
  testdata: TestData;
  data: Data;
  api: ApiClient;
  mobile: typeof MobileActions;
  visual: typeof Visual;
  app: AppSetup;
};

export type CaseMeta = { blocked?: string; adoUrl?: string };

type Body = (fixtures: AppFixtures) => Promise<void>;
type Token = string | CaseTags | CaseMeta;

function build(): AppFixtures {
  const pages = lazyPages();
  const testdata = TestdataHelper.load();
  const base = {
    env: loadEnv(),
    testdata,
    data: new Data(testdata),
    api: ApiClient.instance,
    mobile: MobileActions,
    visual: Visual,
    app: new AppSetup(pages),
  };
  return Object.defineProperties(base, Object.getOwnPropertyDescriptors(pages)) as AppFixtures;
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
    const module = path.basename(path.dirname(file)).replace(/^\d+-/, '');
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
