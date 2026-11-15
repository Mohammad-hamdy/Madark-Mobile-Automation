import { logger } from '@madark/utils/logger';
import { isIos } from '@madark/config/capabilities';
import { Timeouts } from '@madark/utils/timeouts';

export class Wait {
  static timeouts = {
    short: Timeouts.short,
    medium: Timeouts.medium,
    long: Timeouts.long,
    probe: Timeouts.probe,
  };

  static async visible(locator: string, timeout = this.timeouts.medium) {
    const el = await $(locator);
    await el.waitForDisplayed({ timeout });
    return el;
  }

  static async gone(locator: string, timeout = this.timeouts.medium): Promise<void> {
    const el = await $(locator);
    await el.waitForDisplayed({ timeout, reverse: true });
  }

  static async enabled(locator: string, timeout = this.timeouts.medium) {
    const el = await this.visible(locator, timeout);
    await el.waitForEnabled({ timeout });
    return el;
  }

  static async until(
    predicate: () => Promise<boolean>,
    { timeout = this.timeouts.medium, interval = 250, message = 'condition' } = {}
  ): Promise<void> {
    await driver.waitUntil(predicate, { timeout, interval, timeoutMsg: message });
  }

  static async textContains(locator: string, expected: string, timeout = this.timeouts.medium): Promise<void> {
    await this.until(
      async () => {
        const el = await $(locator);
        const attr = isIos() ? 'value' : 'text';
        const actual = (await el.getAttribute(attr)) || (await el.getText()) || '';
        return actual.includes(expected);
      },
      { timeout, message: `text contains ${expected}` }
    );
  }

  static async loadingGone(timeout = this.timeouts.short): Promise<void> {
    const progress = isIos() ? '//XCUIElementTypeActivityIndicator' : '//android.widget.ProgressBar';
    await this.gone(progress, timeout).catch(() => logger.debug('progress indicator still visible'));
  }

  /** Cheap settle: skip page-source polling in CI/fast (each dump can take seconds). */
  static async settled(timeout = Timeouts.settled): Promise<void> {
    if (Timeouts.fast) return;
    const need = Timeouts.settledHits;
    let last = '';
    let hits = 0;
    await this.until(
      async () => {
        const src = await driver.getPageSource();
        if (src === last) hits += 1;
        else {
          last = src;
          hits = 0;
        }
        return hits >= need;
      },
      { timeout, interval: 250, message: 'ui settled' }
    ).catch(() => logger.debug('ui settle timed out — continuing'));
  }
}
