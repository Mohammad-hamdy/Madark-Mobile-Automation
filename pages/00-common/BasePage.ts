import { xpathLiteral } from '@madark/utils/xpath';
import { logger } from '@madark/utils/logger';
import { isIos } from '@madark/config/capabilities';
import { I18n } from '@madark/i18n/i18n';
import { MissingLocator } from '@madark/utils/missing-locator';
import { MobileGestures } from '@madark/utils/mobile-gestures';
import { Timeouts } from '@madark/utils/timeouts';
import { Wait } from '@madark/utils/wait';
import { when, then } from '@madark/utils/report';

type ElementKind = 'button' | 'textField' | 'view' | 'checkbox' | 'tab' | 'link' | 'image';

const ANDROID: Record<ElementKind, string> = {
  button: 'android.widget.Button',
  textField: 'android.widget.EditText',
  view: 'android.view.View',
  checkbox: 'android.widget.CheckBox',
  tab: 'android.widget.Button',
  link: 'android.widget.Button',
  image: 'android.widget.ImageView',
};

const IOS: Record<ElementKind, string> = {
  button: 'XCUIElementTypeButton',
  textField: 'XCUIElementTypeTextField',
  view: 'XCUIElementTypeOther',
  checkbox: 'XCUIElementTypeSwitch',
  tab: 'XCUIElementTypeButton',
  link: 'XCUIElementTypeLink',
  image: 'XCUIElementTypeImage',
};

export class BasePage {
  protected timeouts = {
    short: Timeouts.short,
    medium: Timeouts.medium,
    long: Timeouts.long,
  };

  protected byDesc(i18nKey: string): string {
    const attr = isIos() ? '@name' : '@content-desc';
    return `//*[${this.orAttr(attr, I18n.texts(i18nKey))}]`;
  }

  protected byDescPrefix(i18nKey: string): string {
    const attr = isIos() ? '@name' : '@content-desc';
    return `//*[${I18n.texts(i18nKey).map((t) => `starts-with(${attr},${xpathLiteral(t)})`).join(' or ')}]`;
  }

  protected byRole(kind: ElementKind, i18nKey: string): string {
    const cls = isIos() ? IOS[kind] : ANDROID[kind];
    const attr = isIos() ? '@name' : '@content-desc';
    return `//${cls}[${this.orAttr(attr, I18n.texts(i18nKey))}]`;
  }

  protected byHint(i18nKey: string): string {
    const attrs = isIos() ? ['@name', '@label', '@value', '@placeholderValue'] : ['@hint', '@text'];
    const cls = isIos() ? '*' : ANDROID.textField;
    const parts = I18n.texts(i18nKey).flatMap((t) => attrs.map((a) => `contains(${a},${xpathLiteral(t.trim())})`));
    return `//${cls}[${parts.join(' or ')}]`;
  }

  protected byTextContains(i18nKey: string): string {
    const attrs = isIos() ? ['@name', '@label'] : ['@content-desc', '@text'];
    const parts = I18n.texts(i18nKey).flatMap((t) => attrs.map((a) => `contains(${a},${xpathLiteral(fixedFragment(t))})`));
    return `//*[${parts.join(' or ')}]`;
  }

  protected byLiteral(literal: string): string {
    const attrs = isIos() ? ['@name', '@label'] : ['@content-desc', '@text'];
    return `//*[${attrs.map((a) => `contains(${a},${xpathLiteral(literal)})`).join(' or ')}]`;
  }

  protected structural(id: string, kind: ElementKind, reason: string, nth = 1): string {
    MissingLocator.record({ screen: this.constructor.name, element: id, status: 'structural-only', reason });
    return `(//${isIos() ? IOS[kind] : ANDROID[kind]})[${nth}]`;
  }

  /** Text that comes from the backend or test data (institution names, request numbers), not from i18n. */
  protected byDynamicText(value: string): string {
    return this.byLiteral(value);
  }

  /** Same i18n key, element by visual order when the label repeats (e.g. two "Pay now" buttons). */
  protected nth(locator: string, n: number): string {
    return `(${locator})[${n}]`;
  }

  async isChecked(locator: string): Promise<boolean> {
    const el = await this.waitForDisplayed(locator);
    const v = (await el.getAttribute(isIos() ? 'value' : 'checked').catch(() => '')) || '';
    return v === 'true' || v === '1';
  }

  async getBounds(locator: string): Promise<{ x: number; y: number; width: number; height: number }> {
    const el = await this.waitForDisplayed(locator);
    const { x, y } = await el.getLocation();
    const { width, height } = await el.getSize();
    return { x, y, width, height };
  }

  async countMatches(locator: string): Promise<number> {
    this.assertLocated(locator);
    return (await $$(locator)).length;
  }

  async readText(locator: string): Promise<string> {
    const el = await this.waitForDisplayed(locator);
    if (isIos()) return (await el.getAttribute('label').catch(() => '')) || (await el.getText().catch(() => '')) || '';
    return (await el.getAttribute('content-desc').catch(() => '')) || (await el.getAttribute('text').catch(() => '')) || '';
  }

  /** All visible strings on screen (for amount / number assertions on backend data). */
  async screenTexts(): Promise<string[]> {
    const els = await $$(isIos() ? '//*[@label]' : '//*[@content-desc!="" or @text!=""]');
    const out: string[] = [];
    for (const el of els) {
      const v = isIos() ? await el.getAttribute('label').catch(() => '') : (await el.getAttribute('content-desc').catch(() => '')) || (await el.getAttribute('text').catch(() => ''));
      if (v) out.push(v);
    }
    return out;
  }

  async isTextOnScreen(value: string, timeout = this.timeouts.short): Promise<boolean> {
    return this.isElementDisplayed(this.byLiteral(value), timeout);
  }

  protected byText(i18nKey: string): string {
    const attrs = isIos()
      ? ['@name', '@label', '@value']
      : ['@content-desc', '@text', '@hint'];
    return `//*[${this.orAttrs(attrs, I18n.texts(i18nKey))}]`;
  }

  protected missing(id: string, reason = 'no ValueKey, Semantics, or i18n text in DEV'): string {
    MissingLocator.record({
      screen: this.constructor.name,
      element: id,
      status: 'cannot-be-located',
      reason,
    });
    return `missing:${id}`;
  }

  private orAttr(attr: string, texts: string[]): string {
    return texts.map((t) => `${attr}=${xpathLiteral(t)}`).join(' or ');
  }

  private orAttrs(attrs: string[], texts: string[]): string {
    return texts.flatMap((t) => attrs.map((a) => `${a}=${xpathLiteral(t)}`)).join(' or ');
  }

  async waitForDisplayed(locator: string, timeout = this.timeouts.medium) {
    this.assertLocated(locator);
    return Wait.visible(locator, timeout);
  }

  async tap(locator: string, timeout = this.timeouts.medium): Promise<void> {
    this.assertLocated(locator);
    const found = await MobileGestures.scrollUntilVisible(locator, {
      timeout,
      probe: Timeouts.probe,
      maxSwipes: Timeouts.maxSwipes,
    });
    if (!found) throw new Error(`not visible after gestures: ${locator}`);
    const el = await Wait.enabled(locator, Math.min(timeout, Timeouts.short)).catch(() =>
      Wait.visible(locator, Math.min(timeout, Timeouts.short))
    );
    await el.click();
    await Wait.loadingGone(Timeouts.probe).catch(() => undefined);
  }

  private assertLocated(locator: string): void {
    if (locator.startsWith('missing:')) {
      throw new Error(`cannot-be-located: ${locator.slice('missing:'.length)}`);
    }
  }

  protected when<T>(method: string, fn: () => Promise<T>): Promise<T> {
    return when(method, fn);
  }

  protected then<T>(method: string, fn: () => Promise<T>): Promise<T> {
    return then(method, fn);
  }

  async typeInto(locator: string, value: string): Promise<void> {
    const el = await Wait.visible(locator);
    await el.click();
    await Wait.until(async () => (await el.isDisplayed()) && (await el.isEnabled()), {
      message: `field ready ${locator}`,
    });
    await el.clearValue().catch(() => undefined);
    // Flutter EditTexts often ignore clear/keys; setValue then keys as fallback.
    try {
      await el.setValue(String(value));
    } catch {
      await driver.keys([...String(value)]);
    }
    const wanted = normalize(value);
    await Wait.until(
      async () => normalize(await this.readFieldShown(locator)).includes(wanted),
      { message: `field shows ${value}` }
    );
    logger.debug(`typed into ${locator}`);
  }

  async typeKeys(locator: string, value: string): Promise<void> {
    this.assertLocated(locator);
    const el = await Wait.visible(locator);
    await el.click();
    await driver.keys([...String(value)]);
    await Wait.settled();
  }

  async scrollTo(locator: string): Promise<void> {
    this.assertLocated(locator);
    if (!(await MobileGestures.scrollUntilVisible(locator))) throw new Error(`not visible after scrolling: ${locator}`);
  }

  async getFieldValue(locator: string): Promise<string> {
    await this.waitForDisplayed(locator);
    return this.readFieldShown(locator);
  }

  /** Flutter Android keeps typed value in content-desc more often than text. */
  private async readFieldShown(locator: string): Promise<string> {
    const el = await $(locator);
    if (isIos()) {
      return (
        (await el.getAttribute('value').catch(() => '')) ||
        (await el.getText().catch(() => '')) ||
        ''
      );
    }
    const text = (await el.getAttribute('text').catch(() => '')) || '';
    const desc = (await el.getAttribute('content-desc').catch(() => '')) || '';
    const hint = (await el.getAttribute('hint').catch(() => '')) || '';
    const raw = (await el.getText().catch(() => '')) || '';
    const candidates = [text, desc, raw].filter((v) => v && v !== hint);
    return candidates.join(' ') || text || desc || raw || '';
  }

  async countOf(kind: ElementKind): Promise<number> {
    await Wait.settled();
    return (await $$(`//${isIos() ? IOS[kind] : ANDROID[kind]}`)).length;
  }

  async isElementEnabled(locator: string, timeout = this.timeouts.short): Promise<boolean> {
    try {
      const el = await Wait.visible(locator, timeout);
      return await el.isEnabled();
    } catch {
      return false;
    }
  }

  async isElementDisplayed(locator: string, timeout = this.timeouts.short): Promise<boolean> {
    try {
      return await (await $(locator)).waitForDisplayed({ timeout });
    } catch {
      return false;
    }
  }

  async getText(locator: string): Promise<string> {
    const el = await this.waitForDisplayed(locator);
    const attr = isIos() ? 'label' : 'content-desc';
    return (await el.getAttribute(attr)) || (await el.getText());
  }
}

/** Longest fixed part of a translation that has runtime placeholders (@name, %s), trimmed. */
function fixedFragment(text: string): string {
  const pieces = text.split(/@\w+|%s/).map((p) => p.trim()).filter(Boolean);
  return (pieces.sort((a, b) => b.length - a.length)[0] ?? text).trim();
}

function normalize(s: string): string {
  return s.replace(/[\s‎‏]/g, '');
}
