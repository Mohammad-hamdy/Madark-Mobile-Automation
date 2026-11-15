import { BasePage } from '@madark/pages/00-common/BasePage';
import { isIos } from '@madark/config/capabilities';
import { MissingLocator } from '@madark/utils/missing-locator';
import { Wait } from '@madark/utils/wait';

export type Card = { number: string; expiry: string; cvv: string; holder: string };

/**
 * External checkout opened by the app: Geidea SDK native card entry + 3DS, or the AlinmaPay webview.
 * These screens are third-party: fields are located by input order (Geidea) or HTML autocomplete
 * attributes (AlinmaPay webview) and recorded as structural-only in generated/missing.locator.
 */
export class PaymentGatewayPage extends BasePage {
  private readonly alinmaTitle: string;
  private readonly alinmaCancelTitle: string;
  private readonly alinmaCancelConfirm: string;
  private readonly nativeInputs: string;

  constructor() {
    super();
    this.alinmaTitle = this.byText('alinma_pay_title');
    this.alinmaCancelTitle = this.byTextContains('alinma_pay_cancel_title');
    this.alinmaCancelConfirm = this.byText('confirm');
    this.nativeInputs = this.structural('geideaCardFields', 'textField', 'Geidea SDK native card form: number, expiry, CVV, holder by input order');
    MissingLocator.record({
      screen: 'PaymentGatewayPage',
      element: 'alinmaWebviewCardFields',
      status: 'structural-only',
      reason: 'AlinmaPay hosted page in WEBVIEW context, fields by autocomplete cc-number / cc-exp / cc-csc / cc-name',
    });
  }

  async isGatewayOpen(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isGatewayOpen', async () => {
      if (await this.isElementDisplayed(this.alinmaTitle, this.timeouts.short)) return true;
      try {
        await Wait.until(async () => (await $$(this.nativeInputs.replace(/\[1\]$/, ''))).length >= 2 || (await this.webviewContext()) !== null, {
          timeout,
          interval: 1000,
          message: 'payment gateway card page',
        });
        return true;
      } catch {
        return false;
      }
    });
  }

  async isAlinmaPayOpen(): Promise<boolean> {
    return this.then('isAlinmaPayOpen', () => this.isElementDisplayed(this.alinmaTitle, this.timeouts.medium));
  }

  /** Amount text shown by the gateway (best effort: native labels or webview page text). */
  async getShownAmount(): Promise<string> {
    return this.then('getShownAmount', async () => {
      const ctx = await this.webviewContext();
      if (ctx) {
        await driver.switchContext(ctx);
        const body = await (await $('body')).getText().catch(() => '');
        await driver.switchContext('NATIVE_APP');
        return /(\d[\d,]*\.\d{2})/.exec(body)?.[1] ?? '';
      }
      return (await this.screenTexts()).find((t) => /\d[\d,]*\.\d{2}/.test(t))?.match(/\d[\d,]*\.\d{2}/)?.[0] ?? '';
    });
  }

  async payWithCard(card: Card): Promise<void> {
    return this.when('payWithCard', async () => {
      const ctx = await this.webviewContext();
      if (ctx) return this.payInWebview(ctx, card);
      const fields = await $$(this.nativeInputs.replace(/\[1\]$/, ''));
      if (fields.length < 3) throw new Error('payment gateway card fields not found on this target');
      const values = [card.number, card.expiry.replace('/', ''), card.cvv, card.holder];
      for (let i = 0; i < Math.min(fields.length, values.length); i++) {
        await fields[i].click();
        await fields[i].setValue(values[i]);
      }
      const submit = isIos() ? '//XCUIElementTypeButton[last()]' : '(//android.widget.Button)[last()]';
      await (await $(submit)).click();
    });
  }

  async cancelPayment(): Promise<void> {
    return this.when('cancelPayment', async () => {
      await driver.back();
      if (await this.isElementDisplayed(this.alinmaCancelTitle, this.timeouts.medium)) await this.tap(this.alinmaCancelConfirm);
    });
  }

  private async payInWebview(ctx: string, card: Card): Promise<void> {
    await driver.switchContext(ctx);
    try {
      const set = async (sel: string, value: string) => {
        const el = await $(sel);
        await el.waitForDisplayed({ timeout: this.timeouts.long });
        await el.setValue(value);
      };
      await set('input[autocomplete="cc-number"], input[name*="card" i][name*="number" i]', card.number);
      await set('input[autocomplete="cc-exp"], input[name*="exp" i]', card.expiry);
      await set('input[autocomplete="cc-csc"], input[name*="cvv" i], input[name*="cvc" i]', card.cvv);
      const holder = await $('input[autocomplete="cc-name"], input[name*="holder" i], input[name*="name" i]');
      if (await holder.isExisting()) await holder.setValue(card.holder);
      await (await $('button[type="submit"], input[type="submit"]')).click();
    } finally {
      await driver.switchContext('NATIVE_APP');
    }
  }

  private async webviewContext(): Promise<string | null> {
    const contexts = (await driver.getContexts().catch(() => [])) as Array<string | { id: string }>;
    const ids = contexts.map((c) => (typeof c === 'string' ? c : c.id));
    return ids.find((c) => /WEBVIEW/i.test(c)) ?? null;
  }
}
