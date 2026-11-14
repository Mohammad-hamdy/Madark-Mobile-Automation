import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(ROOT, '.env.local') });

const SOURCE = path.resolve(
  process.env.SUITE_SOURCE || path.join(ROOT, '..', 'madark-ai-runner', 'data', 'mobile_regression_cases.json')
);
const ADO_URL = process.env.ADO_WORKITEM_URL || 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/';

type AdoCase = {
  id: number;
  title: string;
  state: string;
  tags: string[];
  priority: number;
  steps: { action: string; expected: string }[];
  feasibility: string;
  dependencies: string[];
  module: string;
};

type SuiteCase = {
  id: string;
  code: string | null;
  title: string;
  module: string;
  moduleTag: string;
  folder: string;
  scenario: 'Happy' | 'Negative' | 'Corner' | null;
  types: string[];
  priority: 'p0' | 'p1' | 'p2' | 'p3';
  suites: string[];
  feasibility: string;
  dependencies: string[];
  preconditions: string[];
  steps: { action: string; expected: string }[];
  status: 'ready' | 'blocked-manual' | 'needs-testdata' | 'not-implemented';
  adoUrl: string;
};

const TYPE_TAGS = ['Functional', 'UI', 'Security', 'Integration', 'Regression', 'Boundary', 'Validation'] as const;

function camel(s: string): string {
  return s.replace(/^Mobile-/, '').replace(/^./, (c) => c.toLowerCase());
}

function kebab(s: string): string {
  return s.replace(/^Mobile-/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function normalize(c: AdoCase): SuiteCase {
  const first = c.steps[0]?.action ?? '';
  const hasPre = /^preconditions?\s*:/i.test(first);
  const steps = hasPre ? c.steps.slice(1) : c.steps;
  const scenario = c.tags.includes('Negative') ? 'Negative' : c.tags.includes('Boundary') ? 'Corner' : c.tags.includes('Positive') ? 'Happy' : null;
  const priority = (['p0', 'p1', 'p2', 'p3'] as const)[Math.min(Math.max(c.priority, 1), 4) - 1];
  const feasibility = c.feasibility.charAt(0);
  const suites = ['regression', 'e2e'];
  if (priority === 'p0' && feasibility === 'A') suites.push('smoke');
  return {
    id: String(c.id),
    code: /^\[(MRUI-[A-Z]+-\d+)\]/.exec(c.title)?.[1] ?? null,
    title: c.title.replace(/\s+/g, ' ').trim(),
    module: c.module,
    moduleTag: camel(c.module),
    folder: kebab(c.module),
    scenario,
    types: TYPE_TAGS.filter((t) => c.tags.includes(t)).map((t) => t.toLowerCase()),
    priority,
    suites,
    feasibility: c.feasibility,
    dependencies: c.dependencies,
    preconditions: hasPre ? [first.replace(/^preconditions?\s*:\s*/i, '')] : [],
    steps,
    status: feasibility === 'C' ? 'blocked-manual' : feasibility === 'B' ? 'needs-testdata' : 'not-implemented',
    adoUrl: `${ADO_URL}${c.id}`,
  };
}

function existingTests(file: string): Map<string, boolean> {
  const out = new Map<string, boolean>();
  if (!fs.existsSync(file)) return out;
  const src = fs.readFileSync(file, 'utf8');
  const starts = [...src.matchAll(/test\(\s*\n?\s*(['"`])\[(\d+)\]/g)];
  starts.forEach((m, i) => {
    const block = src.slice(m.index, starts[i + 1]?.index ?? src.length);
    out.set(m[2], /blocked:\s*['"`]/.test(block));
  });
  return out;
}

function tsString(s: string): string {
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function stub(c: SuiteCase): string {
  const tags = [
    c.scenario ? `Tag.${c.scenario}` : undefined,
    ...c.suites.map((s) => `Tag.${s}`),
    `Tag.${c.priority}`,
    `Tag.module.${c.moduleTag}`,
    ...c.types.map((t) => `Tag.type.${t}`),
  ].filter(Boolean);
  const reason =
    c.status === 'blocked-manual'
      ? `manual/device case (${c.feasibility})`
      : c.status === 'needs-testdata'
        ? `needs seeded data/mocks: ${c.dependencies.join(', ') || c.feasibility}`
        : 'not implemented yet';
  return [
    `  test(`,
    `    ${tsString(`[${c.id}] ${c.title}`)},`,
    ...tags.map((t) => `    ${t},`),
    `    { adoUrl: ${tsString(c.adoUrl)}, blocked: ${tsString(reason)} },`,
    `    async () => {}`,
    `  );`,
  ].join('\n');
}

function header(module: string): string {
  return [
    `import { test } from '@madark/fixtures/test.fixture';`,
    `import { Tag } from '@madark/utils/tag';`,
    ``,
    `describe(${tsString(module.replace(/^Mobile-/, ''))}, () => {`,
    `});`,
    ``,
  ].join('\n');
}

function main(): void {
  const cases = (JSON.parse(fs.readFileSync(SOURCE, 'utf8')) as AdoCase[]).map(normalize);
  const byModule = new Map<string, SuiteCase[]>();
  for (const c of cases) byModule.set(c.module, [...(byModule.get(c.module) ?? []), c]);

  const genDir = path.join(ROOT, 'generated');
  fs.mkdirSync(genDir, { recursive: true });

  const moduleTags = Object.fromEntries([...byModule.keys()].map((m) => [camel(m), camel(m)]));
  const typeTags = Object.fromEntries(TYPE_TAGS.map((t) => [t.toLowerCase(), t.toLowerCase()]));
  const appMap = JSON.parse(fs.readFileSync(path.join(genDir, 'app-map.json'), 'utf8')) as { screens: { feature: string }[] };
  const features = [...new Set(appMap.screens.map((s) => s.feature))].sort();
  const featureTags = Object.fromEntries(features.map((f) => [camel(f.replace(/[_-]([a-z])/gi, (_, c: string) => c.toUpperCase())), f]));
  fs.writeFileSync(
    path.join(genDir, 'tag-catalog.ts'),
    [
      `export const ModuleTags = ${JSON.stringify(moduleTags, null, 2)} as const;`,
      ``,
      `export const FeatureTags = ${JSON.stringify(featureTags, null, 2)} as const;`,
      ``,
      `export const TypeTags = ${JSON.stringify(typeTags, null, 2)} as const;`,
      ``,
    ].join('\n')
  );

  let added = 0;
  let kept = 0;
  for (const [module, list] of byModule) {
    const folder = path.join(ROOT, 'specs', list[0].folder);
    const file = path.join(folder, `${list[0].folder}.spec.ts`);
    fs.mkdirSync(folder, { recursive: true });
    const have = existingTests(file);
    const missing = list.filter((c) => !have.has(c.id));
    for (const c of list) if (have.get(c.id) === false) c.status = 'ready';
    kept += list.length - missing.length;
    if (!missing.length) continue;
    const src = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : header(module);
    const end = src.lastIndexOf('});');
    const body = `${src.slice(0, end).replace(/\n*$/, '\n')}${src.slice(0, end).trimEnd().endsWith('{') ? '' : '\n'}${missing.map(stub).join('\n\n')}\n${src.slice(end)}`;
    fs.writeFileSync(file, body);
    added += missing.length;
  }

  fs.writeFileSync(path.join(genDir, 'suite.json'), `${JSON.stringify(cases, null, 2)}\n`);
  const status = cases.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.status]: (acc[c.status] ?? 0) + 1 }), {});
  process.stdout.write(
    `cases: ${cases.length} in ${byModule.size} modules\nimplemented kept: ${kept}, stubs added: ${added}\nstatus: ${JSON.stringify(status)}\n`
  );
}

main();
