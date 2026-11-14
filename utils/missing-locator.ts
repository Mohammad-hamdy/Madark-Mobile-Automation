import fs from 'node:fs';
import path from 'node:path';
import { logger } from '@madark/utils/logger';

export type MissingEntry = {
  screen: string;
  element: string;
  i18nKey?: string;
  status: 'cannot-be-located' | 'structural-only';
  reason: string;
};

const FILE = path.resolve(__dirname, '..', 'generated', 'missing.locator');

export class MissingLocator {
  static record(entry: MissingEntry): void {
    const list = this.read();
    if (list.some((e) => e.screen === entry.screen && e.element === entry.element)) return;
    list.push(entry);
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, `${JSON.stringify(list, null, 2)}\n`);
    logger.warn(`${entry.status} ${entry.screen}.${entry.element}`);
  }

  static read(): MissingEntry[] {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, 'utf8')) as MissingEntry[];
  }
}
