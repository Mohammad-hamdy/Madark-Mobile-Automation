import { BasePage } from '@madark/pages/00-common/BasePage';

/** PayEarlyInstallmentsScreen ("Advance Payment"): select upcoming installments and pay their sum. */
export class PayAheadPage extends BasePage {
  private readonly title: string;
  private readonly hint: string;
  private readonly selectAllButton: string;
  private readonly deselectAllButton: string;
  private readonly selectedCount: string;
  private readonly totalPaymentLabel: string;
  private readonly payButton: string;
  private readonly duePrefix: string;

  constructor() {
    super();
    this.title = this.byTextContains('pay_early_installments_title');
    this.hint = this.byTextContains('pay_early_installments_hint');
    this.selectAllButton = this.byTextContains('select_all_title');
    this.deselectAllButton = this.byTextContains('deselect_all_title');
    this.selectedCount = this.byTextContains('selected_installments_count_title');
    this.totalPaymentLabel = this.byTextContains('total_payment_title');
    this.payButton = this.byText('pay_selected_amount_button_title');
    this.duePrefix = this.byTextContains('installment_due_date_prefix');
  }

  async isPayAheadVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isPayAheadVisible', async () => (await this.isElementDisplayed(this.title, timeout)) && (await this.isElementDisplayed(this.hint)));
  }

  async getSelectedCount(): Promise<number> {
    return this.then('getSelectedCount', async () => Number(/(\d+)/.exec(await this.readText(this.selectedCount).catch(() => ''))?.[1] ?? 0));
  }

  async getInstallmentAmounts(): Promise<number[]> {
    return this.then('getInstallmentAmounts', async () =>
      (await this.screenTexts()).map((t) => /(\d[\d,]*\.\d{2})/.exec(t)?.[1]).filter((v): v is string => Boolean(v)).map((v) => Number(v.replace(/,/g, '')))
    );
  }

  async getTotalPayment(): Promise<number> {
    return this.then('getTotalPayment', async () => {
      const texts = await this.screenTexts();
      const label = (await this.readText(this.totalPaymentLabel).catch(() => '')) || '\u0000';
      const i = texts.findIndex((t) => t.includes(label));
      const near = texts.slice(Math.max(0, i), i + 3).join(' ');
      return Number((/(\d[\d,]*\.\d{2})/.exec(near)?.[1] ?? '0').replace(/,/g, ''));
    });
  }

  async clickOnInstallment(n: number): Promise<void> {
    return this.when('clickOnInstallment', () => this.tap(this.nth(this.duePrefix, n)));
  }

  async clickOnSelectAllButton(): Promise<void> {
    return this.when('clickOnSelectAllButton', () => this.tap(this.selectAllButton));
  }

  async clickOnDeselectAllButton(): Promise<void> {
    return this.when('clickOnDeselectAllButton', () => this.tap(this.deselectAllButton));
  }

  async clickOnPayButton(): Promise<void> {
    return this.when('clickOnPayButton', () => this.tap(this.payButton));
  }

  async doubleTapPayButton(): Promise<void> {
    return this.when('doubleTapPayButton', async () => {
      const el = await this.waitForDisplayed(this.payButton);
      await el.click();
      await el.click().catch(() => undefined);
    });
  }
}
