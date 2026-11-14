import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const E2E = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(E2E, '.env.local') });
const SNAPSHOT = path.join(E2E, '.app-snapshot', 'current.json');
const APP_ROOT = path.resolve(
  process.env.APP_ROOT ||
    (fs.existsSync(SNAPSHOT) ? (JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8')) as { root: string }).root : '') ||
    path.join(E2E, '..', 'repos', 'Madarak-UserApp', 'Madarak-UserApp')
);
const LIB = path.join(APP_ROOT, 'lib');
const OUT = path.join(E2E, 'generated');
const LANG_DIR = path.join(LIB, 'common', 'Services', 'Lang');
const I18N_SOURCES = [
  { lang: 'en', file: 'en_US.dart', locale: 'en_US' },
  { lang: 'ar', file: 'ar_EG.dart', locale: 'ar_AE' },
];

type Token = { kind: 'str'; value: string } | { kind: 'punct'; value: string };

function decodeEscapes(body: string): string {
  return body.replace(/\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|.)/gs, (_, esc: string) => {
    if (esc.startsWith('u{')) return String.fromCodePoint(parseInt(esc.slice(2, -1), 16));
    if (esc[0] === 'u' || esc[0] === 'x') return String.fromCharCode(parseInt(esc.slice(1), 16));
    const simple: Record<string, string> = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v' };
    return simple[esc] ?? esc;
  });
}

function tokenizeMap(src: string, start: number, file: string): Token[] {
  const tokens: Token[] = [];
  let i = start;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (src.startsWith('//', i)) { i = src.indexOf('\n', i); if (i < 0) i = src.length; continue; }
    if (src.startsWith('/*', i)) { i = src.indexOf('*/', i) + 2; continue; }
    if (ch === '}') return tokens;
    if (ch === ':' || ch === ',') { tokens.push({ kind: 'punct', value: ch }); i++; continue; }
    const raw = ch === 'r' && (src[i + 1] === "'" || src[i + 1] === '"');
    const q = raw ? i + 1 : i;
    if (src[q] === "'" || src[q] === '"') {
      const quote = src.startsWith(src[q].repeat(3), q) ? src[q].repeat(3) : src[q];
      let j = q + quote.length;
      let body = '';
      while (!src.startsWith(quote, j)) {
        if (j >= src.length) throw new Error(`${file}: unterminated string at ${q}`);
        if (!raw && src[j] === '\\') { body += src.slice(j, j + 2); j += 2; continue; }
        body += src[j++];
      }
      let value = raw ? body : decodeEscapes(body);
      if (quote.length === 3) value = value.replace(/^[ \t]*\r?\n/, '');
      tokens.push({ kind: 'str', value });
      i = j + quote.length;
      continue;
    }
    throw new Error(`${file}: unexpected token ${JSON.stringify(src.slice(i, i + 30))}`);
  }
  throw new Error(`${file}: map literal not closed`);
}

function parseDartStringMap(file: string): Record<string, string> {
  const src = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const header = /const\s+Map\s*<\s*String\s*,\s*String\s*>\s+\w+\s*=\s*\{/.exec(src);
  if (!header) throw new Error(`${file}: no const Map<String, String> found`);
  const tokens = tokenizeMap(src, header.index + header[0].length, file);
  const out: Record<string, string> = {};
  let i = 0;
  const concat = (): string => {
    let s = '';
    let n = 0;
    while (tokens[i]?.kind === 'str') { s += tokens[i++].value; n++; }
    if (!n) throw new Error(`${file}: expected string near entry ${Object.keys(out).length + 1}`);
    return s;
  };
  while (i < tokens.length) {
    const key = concat();
    if (tokens[i]?.value !== ':') throw new Error(`${file}: expected ':' after ${key}`);
    i++;
    out[key] = concat();
    if (tokens[i]?.value === ',') i++;
  }
  return out;
}

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.dart')) acc.push(p);
  }
  return acc;
}

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"])\/\/.*$/gm, '$1');
}

function literals(src: string): string[] {
  const out: string[] = [];
  const re = /(['"])((?:\\.|(?!\1)[^\\\n])*)\1/g;
  for (let m = re.exec(src); m; m = re.exec(src)) out.push(m[2]);
  for (const m of src.matchAll(/['"]([A-Za-z0-9_]+)['"]\s*\.tr(?:Params)?\b/g)) out.push(m[1]);
  return out;
}

function rel(p: string): string {
  return path.relative(APP_ROOT, p).split(path.sep).join('/');
}

function screenId(file: string): string {
  return path.basename(file, '.dart').replace(/_screen$|_view$|_page$/, '').replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function localImports(src: string, from: string): string[] {
  const out: string[] = [];
  const re = /import\s+'(package:madark\/[^']+|[^':]+\.dart)'/g;
  for (let m = re.exec(src); m; m = re.exec(src)) {
    const spec = m[1];
    const target = spec.startsWith('package:madark/')
      ? path.join(LIB, spec.slice('package:madark/'.length))
      : path.resolve(path.dirname(from), spec);
    if (/[\\/](features|common[\\/]widgets)[\\/]/.test(target) && fs.existsSync(target)) out.push(target);
  }
  return out;
}

function main(): void {
  fs.mkdirSync(path.join(OUT, 'i18n'), { recursive: true });

  const maps: Record<string, Record<string, string>> = {};
  for (const s of I18N_SOURCES) {
    maps[s.lang] = parseDartStringMap(path.join(LANG_DIR, s.file));
    fs.writeFileSync(path.join(OUT, 'i18n', `${s.lang}.json`), `${JSON.stringify(maps[s.lang], null, 2)}\n`);
  }
  const keys = new Set([...Object.keys(maps.en), ...Object.keys(maps.ar)]);

  const files = walk(path.join(LIB, 'features'));
  const screenFiles = files.filter((f) => /[\\/](screens|Screens)[\\/]/.test(f));
  const cleaned = new Map<string, string>();
  const read = (f: string): string => {
    if (!cleaned.has(f)) cleaned.set(f, stripComments(fs.readFileSync(f, 'utf8')));
    return cleaned.get(f) as string;
  };

  const literalCatalog: Record<string, string> = {};
  const screens = screenFiles
    .map((file) => {
      const src = read(file);
      if (!/extends\s+(StatelessWidget|StatefulWidget|GetView)/.test(src)) return undefined;
      const deps = localImports(src, file).filter((d) => !screenFiles.includes(d));
      const own = literals(src);
      const all = [...own, ...deps.flatMap((d) => literals(read(d)))];
      const i18nKeys = [...new Set(all.filter((l) => keys.has(l)))].sort();
      const valueKeys = [...new Set([...src.matchAll(/ValueKey\(\s*['"]([^'"]+)['"]/g)].map((m) => m[1]))];
      const semantics = [...new Set([...src.matchAll(/identifier:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]))];
      const id = screenId(file);
      for (const m of src.matchAll(/key:\s*[\w.]+\s*\?\s*'([^'$\n]+)'\s*:\s*'([^'$\n]+)'/g)) {
        for (const v of [m[1], m[2]]) if (!keys.has(v)) literalCatalog[`${id}.toggle.${v === 'English' ? 'english' : v === 'العربية' ? 'arabic' : v}`] = v;
      }
      for (const m of src.matchAll(/Environment\.(\w+):\s*'([^'$\n]+)'/g)) {
        literalCatalog[`${id}.env.${m[1]}`] = m[2];
      }
      for (const m of src.matchAll(/\bText\(\s*'([^'$\n]{2,})'/g)) {
        if (keys.has(m[1])) continue;
        literalCatalog[`${id}.${m[1].replace(/[^A-Za-z0-9]+(.)?/g, (_, c?: string) => (c ? c.toUpperCase() : '')).replace(/^./, (c) => c.toLowerCase())}`] = m[1];
      }
      return {
        id,
        feature: rel(file).split('/')[2],
        file: rel(file),
        components: deps.map(rel),
        keys: [...valueKeys, ...semantics],
        i18nKeys,
      };
    })
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .sort((a, b) => a.file.localeCompare(b.file));

  const apiSrc = fs.readFileSync(path.join(LIB, 'common', 'network', 'api_key.dart'), 'utf8');
  const apis = [...stripComments(apiSrc).matchAll(/final\s+String\s+(\w+)\s*=\s*'\$prefix\/([^']+)'/g)].map((m) => ({
    id: m[1].replace(/^uR[lL]/, '').replace(/^./, (c) => c.toLowerCase()),
    path: `api/1/${m[2]}`,
  }));

  const rsaSrc = fs.readFileSync(path.join(LIB, 'common', 'encryption', 'rsa_helper.dart'), 'utf8');
  const pem = /-----BEGIN PUBLIC KEY-----[\s\S]+?-----END PUBLIC KEY-----/.exec(rsaSrc);
  if (!pem) throw new Error('server public key not found in rsa_helper.dart');
  fs.writeFileSync(path.join(OUT, 'server-public-key.pem'), `${pem[0].split(/\r?\n/).map((l) => l.trim()).join('\n')}\n`);

  const pubspec = fs.readFileSync(path.join(APP_ROOT, 'pubspec.yaml'), 'utf8');
  const appMap = {
    app: /^name:\s*(\S+)/m.exec(pubspec)?.[1] ?? 'madark',
    source: fs.existsSync(SNAPSHOT) && !process.env.APP_ROOT ? JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8')) : { root: APP_ROOT },
    version: /^version:\s*(\S+)/m.exec(pubspec)?.[1] ?? 'unknown',
    platform: {
      android: { appPackage: 'com.madark.institution.qa', appActivity: 'com.madark.institution.MainActivity' },
      ios: { bundleId: 'com.madark.institution.qa' },
    },
    i18n: { en: rel(path.join(LANG_DIR, 'en_US.dart')), ar: rel(path.join(LANG_DIR, 'ar_EG.dart')) },
    encryption: {
      request: 'AES-256-GCM body + RSA-OAEP-SHA256 wrapped key, header X-Encrypted: 1',
      source: ['lib/common/network/app_interceptors.dart', 'lib/common/encryption/aes_helper.dart', 'lib/common/encryption/rsa_helper.dart'],
    },
    screens,
    apis,
  };

  fs.writeFileSync(path.join(OUT, 'app-map.json'), `${JSON.stringify(appMap, null, 2)}\n`);
  const usage: Record<string, string[]> = {};
  for (const f of walk(LIB).filter((p) => !p.startsWith(LANG_DIR))) {
    for (const l of new Set(literals(read(f)))) if (keys.has(l)) (usage[l] ??= []).push(rel(f));
  }
  fs.writeFileSync(path.join(OUT, 'i18n-usage.json'), `${JSON.stringify(usage, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT, 'literals.json'), `${JSON.stringify(literalCatalog, null, 2)}\n`);

  const withKeys = screens.filter((s) => s.keys.length).length;
  const noText = screens.filter((s) => !s.i18nKeys.length).map((s) => s.id);
  process.stdout.write(
    [
      `i18n: en=${Object.keys(maps.en).length} ar=${Object.keys(maps.ar).length}`,
      `screens: ${screens.length} (with ValueKey/Semantics ids: ${withKeys})`,
      `screens with no i18n text: ${noText.length}${noText.length ? ` -> ${noText.join(', ')}` : ''}`,
      `apis: ${apis.length}`,
      `literals: ${Object.keys(literalCatalog).length}`,
    ].join('\n') + '\n'
  );
}

main();
