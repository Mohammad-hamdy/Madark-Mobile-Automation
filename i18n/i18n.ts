import fs from 'node:fs';
import path from 'node:path';

const LANGS = ['en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];

export class I18n {
  static maps: Record<string, Record<string, string>> = {};
  static lang: Lang = 'en';

  static load(langOrAuto: string = process.env.E2E_LANG || 'en'): void {
    this.lang = langOrAuto === 'ar' ? 'ar' : 'en';
    for (const lang of LANGS) {
      const file = path.resolve(__dirname, '..', 'generated', 'i18n', `${lang}.json`);
      this.maps[lang] = fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, string>) : {};
    }
  }

  static get isAr(): boolean {
    return this.lang === 'ar';
  }

  static t(key: string, ...args: Array<string | number>): string {
    this.ensureLoaded();
    const v = this.maps[this.lang]?.[key];
    if (v == null) throw new Error(`missing i18n ${key} (${this.lang})`);
    return format(v, args);
  }

  /** Text of a key in a specific language, independent of the run language. */
  static textIn(lang: Lang, key: string): string {
    this.ensureLoaded();
    const v = this.maps[lang]?.[key];
    if (v == null) throw new Error(`missing i18n ${key} (${lang})`);
    return v;
  }

  static texts(key: string): string[] {
    this.ensureLoaded();
    const order: Lang[] = this.lang === 'ar' ? ['ar', 'en'] : ['en', 'ar'];
    const out = order.map((lang) => this.maps[lang]?.[key]).filter((v): v is string => Boolean(v));
    const unique = [...new Set(out)];
    if (!unique.length) throw new Error(`missing i18n ${key}`);
    return unique;
  }

  private static ensureLoaded(): void {
    if (!Object.keys(this.maps).length) this.load();
  }
}

function format(template: string, args: Array<string | number>): string {
  let i = 0;
  return template.replace(/%s/g, () => (i < args.length ? String(args[i++]) : '%s'));
}
