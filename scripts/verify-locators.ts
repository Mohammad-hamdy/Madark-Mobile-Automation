import 'tsconfig-paths/register';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const gen = (f: string) => JSON.parse(fs.readFileSync(path.join(ROOT, 'generated', f), 'utf8'));
const en = gen('i18n/en.json') as Record<string, string>;
const ar = gen('i18n/ar.json') as Record<string, string>;
const literals = gen('literals.json') as Record<string, string>;
const appMap = gen('app-map.json') as { screens: { id: string; i18nKeys: string[] }[] };
const usage = gen('i18n-usage.json') as Record<string, string[]>;
const usedBy = new Map<string, string[]>(Object.entries(usage));
for (const s of appMap.screens) for (const k of s.i18nKeys) usedBy.set(k, [...(usedBy.get(k) ?? []), s.id]);

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.ts') && e.name !== 'BasePage.ts') acc.push(p);
  }
  return acc;
}

let problems = 0;
for (const file of walk(path.join(ROOT, 'pages'))) {
  const src = fs.readFileSync(file, 'utf8');
  const rows: string[] = [];
  for (const m of src.matchAll(/this\.by(?:Text|TextContains|Hint|Desc|DescPrefix|Role)\((?:'[a-zA-Z]+',\s*)?'([^']+)'\)/g)) {
    const key = m[1];
    const issues = [
      en[key] == null ? 'missing EN' : '',
      ar[key] == null ? 'missing AR' : '',
      usedBy.has(key) ? '' : 'not used anywhere in the scanned app',
    ].filter(Boolean);
    if (issues.length) {
      problems++;
      rows.push(`  ✗ ${key}: ${issues.join(', ')}`);
    }
  }
  for (const m of src.matchAll(/devLiteral\('([^']+)'\)/g)) {
    if (literals[m[1]] == null) {
      problems++;
      rows.push(`  ✗ literal ${m[1]}: not in generated/literals.json`);
    }
  }
  process.stdout.write(`${path.relative(ROOT, file)}${rows.length ? `\n${rows.join('\n')}` : ' ✓'}\n`);
}
for (const file of walk(path.join(ROOT, 'pages'))) {
  const mod = require(file) as Record<string, unknown>;
  for (const Page of Object.values(mod)) if (typeof Page === 'function') new (Page as new () => unknown)();
}
const gapFile = path.join(ROOT, 'generated', 'missing.locator');
const gaps = (fs.existsSync(gapFile) ? JSON.parse(fs.readFileSync(gapFile, 'utf8')) : []) as { screen: string; element: string; status: string }[];
if (gaps.length) process.stdout.write(`\nknown gaps (generated/missing.locator):\n${gaps.map((g) => `  ! ${g.status} ${g.screen}.${g.element}`).join('\n')}\n`);

process.stdout.write(`\n${problems ? `${problems} locator problem(s)` : 'all locators resolve against the scanned build'}\n`);
process.exit(problems ? 1 : 0);
