import { logger } from '@madark/utils/logger';
import { I18n } from '@madark/i18n/i18n';
import { when } from '@madark/utils/report';
import { Wait } from '@madark/utils/wait';

export type SwipeDir = 'up' | 'down' | 'left' | 'right';

type SwipeOpts = {
  distance?: number;
  start?: { x: number; y: number };
};

const HEADER = 0.14;
const FOOTER = 0.16;
const EDGE = 0.08;

export class MobileGestures {
  static async size(): Promise<{ width: number; height: number }> {
    return driver.getWindowSize();
  }

  static async safeBand(): Promise<{
    x: number;
    yTop: number;
    yBottom: number;
    xLeft: number;
    xRight: number;
    width: number;
    height: number;
  }> {
    const { width, height } = await this.size();
    return {
      x: Math.round(width / 2),
      yTop: Math.round(height * HEADER),
      yBottom: Math.round(height * (1 - FOOTER)),
      xLeft: Math.round(width * EDGE),
      xRight: Math.round(width * (1 - EDGE)),
      width,
      height,
    };
  }

  static swipeUp(opts?: SwipeOpts): Promise<void> {
    return this.swipe('up', opts);
  }

  static swipeDown(opts?: SwipeOpts): Promise<void> {
    return this.swipe('down', opts);
  }

  static swipeLeft(opts?: SwipeOpts): Promise<void> {
    return this.swipe('left', opts);
  }

  static swipeRight(opts?: SwipeOpts): Promise<void> {
    return this.swipe('right', opts);
  }

  static async swipe(dir: SwipeDir, opts: SwipeOpts = {}): Promise<void> {
    const method = `swipe${dir.charAt(0).toUpperCase()}${dir.slice(1)}`;
    return when(method, () => this.performSwipe(dir, opts));
  }

  private static async performSwipe(dir: SwipeDir, opts: SwipeOpts = {}): Promise<void> {
    const band = await this.safeBand();
    const rtl = I18n.lang === 'ar';
    const distance = opts.distance ?? 0.44;
    const midY = Math.round((band.yTop + band.yBottom) / 2);
    const dy = Math.round((band.yBottom - band.yTop) * distance);
    const dx = Math.round((band.xRight - band.xLeft) * distance);
    let startX = opts.start?.x ?? band.x;
    let startY = opts.start?.y ?? midY;
    let endX = startX;
    let endY = startY;

    if (dir === 'up') {
      startY = opts.start?.y ?? band.yBottom - 8;
      endY = startY - dy;
    } else if (dir === 'down') {
      startY = opts.start?.y ?? band.yTop + 8;
      endY = startY + dy;
    } else if (dir === 'left') {
      startX = opts.start?.x ?? (rtl ? band.xLeft + 8 : band.xRight - 8);
      endX = rtl ? startX + dx : startX - dx;
    } else {
      startX = opts.start?.x ?? (rtl ? band.xRight - 8 : band.xLeft + 8);
      endX = rtl ? startX - dx : startX + dx;
    }

    startX = clamp(startX, band.xLeft, band.xRight);
    endX = clamp(endX, band.xLeft, band.xRight);
    startY = clamp(startY, band.yTop, band.yBottom);
    endY = clamp(endY, band.yTop, band.yBottom);

    await this.drag(startX, startY, endX, endY);
    logger.debug(`swipe ${dir} ${band.width}x${band.height}`);
  }

  static async swipeOnElement(locator: string, dir: SwipeDir, opts: SwipeOpts = {}): Promise<void> {
    return when(`swipeOnElement ${dir}`, async () => {
      const el = await $(locator);
      await el.waitForDisplayed({ timeout: 15000 });
      const loc = await el.getLocation();
      const size = await el.getSize();
      await this.performSwipe(dir, {
        ...opts,
        start: { x: Math.round(loc.x + size.width / 2), y: Math.round(loc.y + size.height / 2) },
      });
    });
  }

  static async swipeUntilVisible(
    locator: string,
    dir: SwipeDir,
    { maxSwipes = 8, timeout = 2000 }: { maxSwipes?: number; timeout?: number } = {}
  ): Promise<boolean> {
    // Header/footer chrome (language toggle, Skip, nav) is on-screen but outside the
    // content safe band — accept it for taps; only swipe when the element is missing.
    if (await this.isOnScreen(locator, timeout)) return true;
    if (await this.inSafeArea(locator, timeout)) return true;
    if (await this.healHeaderOrFooter(locator)) return true;
    for (let i = 0; i < maxSwipes; i += 1) {
      await this.swipe(dir);
      if (await this.isOnScreen(locator, timeout)) return true;
      if (await this.inSafeArea(locator, timeout)) return true;
      if (await this.healHeaderOrFooter(locator)) return true;
    }
    return false;
  }

  static async scrollUntilVisible(
    locator: string,
    { maxSwipes = 8, timeout = 2000 }: { maxSwipes?: number; timeout?: number } = {}
  ): Promise<boolean> {
    if (await this.isOnScreen(locator, timeout)) return true;
    if (await this.swipeUntilVisible(locator, 'up', { maxSwipes, timeout })) return true;
    return this.swipeUntilVisible(locator, 'down', { maxSwipes, timeout });
  }

  static async longPress(locator: string): Promise<void> {
    const el = await $(locator);
    await el.waitForDisplayed({ timeout: 15000 });
    await el.touchAction([{ action: 'longPress' }, { action: 'release' }]);
  }

  private static async isOnScreen(locator: string, timeout: number): Promise<boolean> {
    try {
      const el = await $(locator);
      return Boolean(await el.waitForDisplayed({ timeout }));
    } catch {
      return false;
    }
  }

  private static async inSafeArea(locator: string, timeout: number): Promise<boolean> {
    try {
      const el = await $(locator);
      if (!(await el.waitForDisplayed({ timeout }))) return false;
      return this.isInSafeBand(el);
    } catch {
      return false;
    }
  }

  private static async isInSafeBand(el: WebdriverIO.Element): Promise<boolean> {
    const band = await this.safeBand();
    const rect = await el.getLocation();
    return rect.y >= band.yTop && rect.y <= band.yBottom && rect.x >= band.xLeft && rect.x <= band.xRight;
  }

  private static async healHeaderOrFooter(locator: string): Promise<boolean> {
    try {
      const el = await $(locator);
      if (!(await el.isDisplayed())) return false;
      const band = await this.safeBand();
      const { x, y } = await el.getLocation();
      // Fixed app chrome sits in the header/footer — tappable as-is; swiping moves the wrong layer.
      if (y < band.yTop || y > band.yBottom) return true;
      if (x < band.xLeft) await this.performSwipe('right', { distance: 0.22 });
      else if (x > band.xRight) await this.performSwipe('left', { distance: 0.22 });
      else return true;
      return (await this.isInSafeBand(el)) || (await el.isDisplayed());
    } catch {
      return false;
    }
  }

  private static async drag(x1: number, y1: number, x2: number, y2: number): Promise<void> {
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: x1, y: y1 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 180 },
          { type: 'pointerMove', duration: 520, x: x2, y: y2 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await driver.releaseActions().catch(() => undefined);
    await Wait.settled();
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
