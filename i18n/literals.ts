import fs from 'node:fs';
import path from 'node:path';

let catalog: Record<string, string> | undefined;

export function devLiteral(id: string): string {
  if (!catalog) {
    const file = path.resolve(__dirname, '..', 'generated', 'literals.json');
    catalog = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, string>) : {};
  }
  const v = catalog[id];
  if (v == null) throw new Error(`missing DEV literal ${id} — run npm run scan`);
  return v;
}
