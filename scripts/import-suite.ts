import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { SUITE_LAYOUT, moduleFolder, pad, screenKey } from '../config/suite-layout';

const ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(ROOT, '.env.local') });

const SOURCE = path.resolve(
  process.env.SUITE_SOURCE || path.join(ROOT, 'data', 'ado', 'mobile_regression_cases.json')
);
const ADO_URL = process.env.ADO_WORKITEM_URL || 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/';
const SPECS = path.join(ROOT, 'specs');

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
  screen: string;
  screenNo: string;
  scenario: 'Happy' | 'Negative' | 'Corner' | null;
  types: string[];
  priority: 'p0' | 'p1' | 'p2' | 'p3';
  suites: string[];
  feasibility: string;
  dependencies: string[];
  preconditions: string[];
  steps: { action: string; expected: string }[];
  status: 'ready' | 'blocked-manual' | 'needs-testdata' | 'not-implemented' | 'not-in-build' | 'needs-qa-action';
  blockedReason?: string;
  adoUrl: string;
};

type Block = { id: string; text: string; blocked: boolean; imports: string[] };

/** Helpers that test bodies may use without a fixture; the import is added to a spec only when used. */
const KNOWN_IMPORTS = [`import { manualCheck } from '@madark/utils/report';`];

const TYPE_TAGS = ['Functional', 'UI', 'Security', 'Integration', 'Regression', 'Boundary', 'Validation'] as const;

function camel(s: string): string {
  return s.replace(/^Mobile-/, '').replace(/^./, (c) => c.toLowerCase());
}

function normalize(c: AdoCase): SuiteCase {
  const layoutIndex = SUITE_LAYOUT.findIndex((m) => m.ado === c.module);
  if (layoutIndex < 0) throw new Error(`module ${c.module} is not in config/suite-layout.ts`);
  const layout = SUITE_LAYOUT[layoutIndex];
  const key = screenKey(c.title);
  const screenIndex = layout.screens.findIndex((sc) => sc.match.includes(key));
  if (screenIndex < 0) throw new Error(`[${c.id}] screen "${key}" is not listed under ${c.module} in config/suite-layout.ts`);

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
    folder: moduleFolder(layoutIndex, layout.slug),
    screen: layout.screens[screenIndex].name,
    screenNo: pad(screenIndex + 1),
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

function walkSpecs(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkSpecs(p, acc);
    else if (e.name.endsWith('.spec.ts')) acc.push(p);
  }
  return acc;
}

function dedent(text: string): string {
  const lines = text.split('\n');
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => /^ */.exec(l)![0].length));
  return lines.map((l) => l.slice(indent)).join('\n');
}

function collectBlocks(): Map<string, Block> {
  const blocks = new Map<string, Block>();
  for (const file of walkSpecs(SPECS)) {
    const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const imports = [...src.matchAll(/^import [^\n]+;$/gm)]
      .map((m) => m[0])
      .filter((l) => !/from '@madark\/fixtures\/test\.fixture'|from '@madark\/utils\/tag'/.test(l));
    for (const m of src.matchAll(/^( *)test\(\s*\n\s*(['"`])\[(\d+)\]/gm)) {
      const indent = m[1];
      const start = m.index!;
      const end = src.indexOf(`\n${indent});`, start);
      if (end < 0) throw new Error(`${file}: unterminated test block for ${m[3]}`);
      const text = dedent(src.slice(start, end + indent.length + 3));
      if (blocks.has(m[3])) throw new Error(`duplicate test [${m[3]}] in ${file}`);
      blocks.set(m[3], { id: m[3], text, blocked: /blocked:\s*['"`]/.test(text), imports });
    }
  }
  return blocks;
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
    `test(`,
    `  ${tsString(`[${c.id}] ${c.title}`)},`,
    ...tags.map((t) => `  ${t},`),
    `  { adoUrl: ${tsString(c.adoUrl)}, blocked: ${tsString(reason)} },`,
    `  async () => {}`,
    `);`,
  ].join('\n');
}

function indent(text: string, by: string): string {
  return text
    .split('\n')
    .map((l) => (l.trim() ? by + l : l))
    .join('\n');
}

function usedImports(imports: string[], body: string): string[] {
  return [...new Set(imports)].filter((line) => {
    const names = /import\s+(?:type\s+)?\{([^}]+)\}/.exec(line)?.[1].split(',').map((n) => n.trim().split(/\s+as\s+/).pop()!) ?? [
      /import\s+(\w+)/.exec(line)?.[1] ?? '',
    ];
    return names.some((n) => n && new RegExp(`\\b${n}\\b`).test(body));
  });
}

function main(): void {
  const cases = (JSON.parse(fs.readFileSync(SOURCE, 'utf8')) as AdoCase[]).map(normalize);
  const blocks = collectBlocks();
  const unknown = [...blocks.keys()].filter((id) => !cases.some((c) => c.id === id));
  if (unknown.length) throw new Error(`tests not in ADO export: ${unknown.join(', ')}`);

  for (const c of cases) {
    const b = blocks.get(c.id);
    if (!b) continue;
    if (!b.blocked) {
      c.status = 'ready';
      continue;
    }
    const reason = /blocked:\s*'((?:[^'\\]|\\.)*)'/.exec(b.text)?.[1].replace(/\\'/g, "'") ?? '';
    c.blockedReason = reason;
    if (/^not in build/i.test(reason)) c.status = 'not-in-build';
    else if (/^needs (the |QA|a |an )/i.test(reason) || /^needs /i.test(reason)) c.status = reason.startsWith('needs seeded') ? 'needs-testdata' : 'needs-qa-action';
    else if (/^revamp login/i.test(reason)) c.status = 'not-in-build';
  }

  const files = new Map<string, string>();
  SUITE_LAYOUT.forEach((layout, mi) => {
    const folder = moduleFolder(mi, layout.slug);
    const mine = cases.filter((c) => c.module === layout.ado);
    if (!mine.length) return;
    const bodies: string[] = [];
    let imports: string[] = [];
    layout.screens.forEach((screen, si) => {
      const list = mine.filter((c) => c.screen === screen.name).sort((a, b) => Number(a.id) - Number(b.id));
      if (!list.length) return;
      const tests = list.map((c) => {
        const b = blocks.get(c.id);
        if (b) imports = imports.concat(b.imports);
        return indent(b ? b.text : stub(c), '    ');
      });
      bodies.push(`  describe(${tsString(`${pad(si + 1)} · ${screen.name}`)}, () => {\n${tests.join('\n\n')}\n  });`);
    });
    const body = bodies.join('\n\n');
    const header = [
      `import { test } from '@madark/fixtures/test.fixture';`,
      `import { Tag } from '@madark/utils/tag';`,
      ...usedImports([...imports, ...KNOWN_IMPORTS], body),
    ];
    files.set(
      path.join(SPECS, folder, `${folder}.spec.ts`),
      `${header.join('\n')}\n\ndescribe(${tsString(`${pad(mi + 1)} · ${layout.title}`)}, () => {\n${body}\n});\n`
    );
  });

  const written = [...files.values()].reduce((n, src) => n + (src.match(/^ {4}test\(/gm)?.length ?? 0), 0);
  if (written !== cases.length) throw new Error(`layout would write ${written} tests for ${cases.length} cases — aborting`);

  for (const old of walkSpecs(SPECS)) if (!files.has(old)) fs.rmSync(old);
  for (const dir of fs.existsSync(SPECS) ? fs.readdirSync(SPECS) : []) {
    const p = path.join(SPECS, dir);
    if (fs.statSync(p).isDirectory() && !fs.readdirSync(p).length) fs.rmdirSync(p);
  }
  for (const [file, src] of files) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, src);
  }

  const genDir = path.join(ROOT, 'generated');
  fs.mkdirSync(genDir, { recursive: true });
  const moduleTags = Object.fromEntries(SUITE_LAYOUT.map((m) => [camel(m.ado), camel(m.ado)]));
  const typeTags = Object.fromEntries(TYPE_TAGS.map((t) => [t.toLowerCase(), t.toLowerCase()]));
  const appMap = JSON.parse(fs.readFileSync(path.join(genDir, 'app-map.json'), 'utf8')) as { screens: { feature: string }[] };
  const features = [...new Set(appMap.screens.map((sc) => sc.feature))].sort();
  const featureTags = Object.fromEntries(features.map((f) => [camel(f.replace(/[_-]([a-z])/gi, (_, ch: string) => ch.toUpperCase())), f]));
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
  fs.writeFileSync(path.join(genDir, 'suite.json'), `${JSON.stringify(cases, null, 2)}\n`);

  const status = cases.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.status]: (acc[c.status] ?? 0) + 1 }), {});
  process.stdout.write(
    `cases: ${cases.length} in ${files.size} module specs (kept ${blocks.size} existing test blocks)\nstatus: ${JSON.stringify(status)}\n`
  );
}

main();
