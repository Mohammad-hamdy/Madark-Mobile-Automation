import fs from 'node:fs';
import path from 'node:path';
import allure from '@wdio/allure-reporter';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { currentPlatform } from '@madark/config/capabilities';
import { I18n } from '@madark/i18n/i18n';
import { logger } from '@madark/utils/logger';
import { then } from '@madark/utils/report';
import { Wait } from '@madark/utils/wait';

const BASELINES = path.resolve(__dirname, '..', 'baselines');
const OUTPUT = path.resolve(__dirname, '..', 'logs', 'visual');

export type VisualResult = { name: string; ratio: number; baseline: 'compared' | 'created'; diffPath?: string };

/**
 * Screenshot-vs-baseline check for the "matches Figma" cases.
 * Baselines live in baselines/<platform>/<lang>/<WxH>/<name>.png and are approved by QA (export the Figma frame
 * at device size, or approve the first run's screenshot). Missing baseline: the screenshot is saved as the new
 * baseline and the check passes, unless E2E_STRICT_VISUAL=1. E2E_UPDATE_BASELINES=1 re-records every baseline.
 */
export class Visual {
  static threshold = Number(process.env.VISUAL_DIFF_THRESHOLD || 0.03);

  static async matchesBaseline(name: string, { threshold = this.threshold, maskTopPx = 0 }: { threshold?: number; maskTopPx?: number } = {}): Promise<boolean> {
    const result = await this.compare(name, { maskTopPx });
    return result.ratio <= threshold;
  }

  static async compare(name: string, { maskTopPx = 0 }: { maskTopPx?: number } = {}): Promise<VisualResult> {
    return then(`matchesBaseline ${name}`, async () => {
      await Wait.settled().catch(() => undefined);
      const shot = PNG.sync.read(Buffer.from(await driver.takeScreenshot(), 'base64'));
      const dir = path.join(BASELINES, currentPlatform(), I18n.lang, `${shot.width}x${shot.height}`);
      const file = path.join(dir, `${name}.png`);
      fs.mkdirSync(OUTPUT, { recursive: true });
      const actualPath = path.join(OUTPUT, `${name}.actual.png`);
      fs.writeFileSync(actualPath, PNG.sync.write(shot));
      allure.addAttachment(`${name} (actual)`, fs.readFileSync(actualPath), 'image/png');

      if (!fs.existsSync(file) || process.env.E2E_UPDATE_BASELINES === '1') {
        if (process.env.E2E_STRICT_VISUAL === '1' && !fs.existsSync(file)) throw new Error(`no approved baseline for ${name} at ${file}`);
        fs.mkdirSync(dir, { recursive: true });
        fs.copyFileSync(actualPath, file);
        logger.warn(`visual baseline recorded: ${path.relative(BASELINES, file)} — review and commit it`);
        return { name, ratio: 0, baseline: 'created' };
      }

      const base = PNG.sync.read(fs.readFileSync(file));
      if (base.width !== shot.width || base.height !== shot.height) {
        throw new Error(`baseline ${name} is ${base.width}x${base.height}, screen is ${shot.width}x${shot.height}`);
      }
      const mask = (img: PNG) => {
        for (let i = 0; i < Math.min(maskTopPx, img.height) * img.width * 4; i++) img.data[i] = 0;
      };
      mask(base);
      mask(shot);
      const diff = new PNG({ width: shot.width, height: shot.height });
      const changed = pixelmatch(base.data, shot.data, diff.data, shot.width, shot.height, { threshold: 0.1 });
      const ratio = changed / (shot.width * shot.height);
      const diffPath = path.join(OUTPUT, `${name}.diff.png`);
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
      allure.addAttachment(`${name} (diff ${(ratio * 100).toFixed(2)}%)`, fs.readFileSync(diffPath), 'image/png');
      return { name, ratio, baseline: 'compared', diffPath };
    });
  }
}
