import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(ROOT, '.env.local') });

const repo = path.resolve(process.env.APP_REPO || path.join(ROOT, '..', 'repos', 'Madarak-UserApp', 'Madarak-UserApp'));
const ref = process.env.APP_REF || 'origin/new_design_kinan';
const git = (...args: string[]): string => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim();

const sha = git('rev-parse', '--short', ref);
const out = path.join(ROOT, '.app-snapshot', sha);
if (!fs.existsSync(path.join(out, 'pubspec.yaml'))) {
  fs.mkdirSync(out, { recursive: true });
  const tar = path.join(ROOT, '.app-snapshot', `${sha}.tar`);
  git('archive', '--format=tar', `--output=${tar}`, ref, 'lib', 'pubspec.yaml');
  execFileSync('tar', ['-xf', `${sha}.tar`, '-C', sha], { cwd: path.dirname(tar) });
  fs.rmSync(tar);
}
fs.writeFileSync(path.join(ROOT, '.app-snapshot', 'current.json'), `${JSON.stringify({ ref, sha, root: out }, null, 2)}\n`);
process.stdout.write(`snapshot ${ref} @ ${sha} -> ${out}\n`);
