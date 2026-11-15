import { BasePage } from '@madark/pages/00-common/BasePage';

/** ChooseHowToPayScreen: post-login (and My Requests > Pending) choice between instalments and pay-in-full with discount. */
export class ChooseHowToPayPage extends BasePage {
  private readonly title: string;
  private readonly subtitle: string;
  private readonly question: string;
  private readonly requestLabel: string;
  private readonly studentLabel: string;
  private readonly educationFeesLabel: string;
  private readonly installmentsTitle: string;
  private readonly installmentsDescription: string;
  private readonly installmentsNote: string;
  private readonly fullTitle: string;
  private readonly fullDescription: string;
  private readonly saveBadge: string;
  private readonly yourDiscountLabel: string;
  private readonly payTodayLabel: string;
  private readonly payNowButton: string;
  private readonly continueFinancingButton: string;
  private readonly installmentsRadio: string;
  private readonly payInFullRadio: string;

  constructor() {
    super();
    this.title = this.byTextContains('choose_how_to_pay_title');
    this.subtitle = this.byTextContains('choose_pay_subtitle');
    this.question = this.byTextContains('choose_pay_question');
    this.requestLabel = this.byTextContains('choose_pay_request_label');
    this.studentLabel = this.byTextContains('choose_pay_student_label');
    this.educationFeesLabel = this.byTextContains('choose_pay_education_fees');
    this.installmentsTitle = this.byTextContains('choose_pay_installments_title');
    this.installmentsDescription = this.byTextContains('choose_pay_installments_desc');
    this.installmentsNote = this.byTextContains('choose_pay_installments_note');
    this.fullTitle = this.byTextContains('choose_pay_full_title');
    this.fullDescription = this.byTextContains('choose_pay_full_desc');
    this.saveBadge = this.byTextContains('choose_pay_save_badge');
    this.yourDiscountLabel = this.byTextContains('choose_pay_your_discount');
    this.payTodayLabel = this.byTextContains('choose_pay_pay_today');
    this.payNowButton = this.byText('choose_pay_pay_now');
    this.continueFinancingButton = this.byTextContains('choose_pay_continue_financing');
    this.installmentsRadio = this.structural('installmentsRadio', 'checkbox', 'option cards use Radio without key; instalments is the 1st radio', 1).replace(
      /CheckBox|XCUIElementTypeSwitch/,
      (m) => (m === 'CheckBox' ? 'RadioButton' : 'XCUIElementTypeButton')
    );
    this.payInFullRadio = this.structural('payInFullRadio', 'checkbox', 'option cards use Radio without key; pay in full is the 2nd radio', 2).replace(
      /CheckBox|XCUIElementTypeSwitch/,
      (m) => (m === 'CheckBox' ? 'RadioButton' : 'XCUIElementTypeButton')
    );
  }

  async isChooseHowToPayVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isChooseHowToPayVisible', async () =>
      (await this.isElementDisplayed(this.title, timeout)) && (await this.isElementDisplayed(this.installmentsTitle, this.timeouts.short))
    );
  }

  async isHeaderVisible(): Promise<boolean> {
    return this.then('isHeaderVisible', async () => (await this.isElementDisplayed(this.subtitle)) && (await this.isElementDisplayed(this.question)));
  }

  async isRequestNumberVisible(requestNumber: string): Promise<boolean> {
    return this.then('isRequestNumberVisible', async () =>
      (await this.isElementDisplayed(this.requestLabel)) && (await this.isElementDisplayed(this.byDynamicText(requestNumber)))
    );
  }

  async isStudentVisible(student: string): Promise<boolean> {
    return this.then('isStudentVisible', async () => (await this.isElementDisplayed(this.studentLabel)) && (await this.isTextOnScreen(student)));
  }

  async isInstitutionVisible(name: string): Promise<boolean> {
    return this.then('isInstitutionVisible', () => this.isTextOnScreen(name));
  }

  async isEducationFeesVisible(): Promise<boolean> {
    return this.then('isEducationFeesVisible', () => this.isElementDisplayed(this.educationFeesLabel));
  }

  async isInstallmentsCardVisible(): Promise<boolean> {
    return this.then('isInstallmentsCardVisible', async () =>
      (await this.isElementDisplayed(this.installmentsTitle)) && (await this.isElementDisplayed(this.installmentsDescription))
    );
  }

  async isInstallmentsNoteVisible(): Promise<boolean> {
    return this.then('isInstallmentsNoteVisible', () => this.isElementDisplayed(this.installmentsNote));
  }

  async isPayInFullCardVisible(timeout = this.timeouts.short): Promise<boolean> {
    return this.then('isPayInFullCardVisible', async () => {
      await this.scrollTo(this.fullTitle).catch(() => undefined);
      return this.isElementDisplayed(this.fullTitle, timeout);
    });
  }

  async isSaveBadgeVisible(): Promise<boolean> {
    return this.then('isSaveBadgeVisible', () => this.isElementDisplayed(this.saveBadge));
  }

  async isDiscountBreakdownVisible(): Promise<boolean> {
    return this.then('isDiscountBreakdownVisible', async () => {
      await this.scrollTo(this.payTodayLabel).catch(() => undefined);
      return (await this.isElementDisplayed(this.yourDiscountLabel)) && (await this.isElementDisplayed(this.payTodayLabel));
    });
  }

  async isFullDescriptionVisible(): Promise<boolean> {
    return this.then('isFullDescriptionVisible', () => this.isElementDisplayed(this.fullDescription));
  }

  async isPayNowButtonVisible(timeout = this.timeouts.short): Promise<boolean> {
    return this.then('isPayNowButtonVisible', () => this.isElementDisplayed(this.payNowButton, timeout));
  }

  async isContinueFinancingButtonVisible(): Promise<boolean> {
    return this.then('isContinueFinancingButtonVisible', async () => {
      await this.scrollTo(this.continueFinancingButton).catch(() => undefined);
      return this.isElementDisplayed(this.continueFinancingButton);
    });
  }

  async isAmountOnScreen(amount: string): Promise<boolean> {
    return this.then('isAmountOnScreen', async () => (await this.screenTexts()).some((t) => t.replace(/[,\s]/g, '').includes(amount.replace(/[,\s]/g, ''))));
  }

  /** Every number shown with an amount, for consistency checks between entry points. */
  async getShownValues(): Promise<string[]> {
    return this.then('getShownValues', async () => (await this.screenTexts()).filter((t) => /\d/.test(t)).map((t) => t.trim()).sort());
  }

  async isSaveBadgeInsideFullCard(): Promise<boolean> {
    return this.then('isSaveBadgeInsideFullCard', async () => {
      const card = await this.getBounds(this.fullTitle);
      const badge = await this.getBounds(this.saveBadge);
      return Math.abs(badge.y - card.y) < 250;
    });
  }

  async isInstallmentsSelected(): Promise<boolean> {
    return this.then('isInstallmentsSelected', () => this.isChecked(this.installmentsRadio));
  }

  async isPayInFullSelected(): Promise<boolean> {
    return this.then('isPayInFullSelected', () => this.isChecked(this.payInFullRadio));
  }

  /** Exactly one option selected and the CTA label matches it. */
  async isSelectionConsistent(): Promise<boolean> {
    return this.then('isSelectionConsistent', async () => {
      const inst = await this.isChecked(this.installmentsRadio);
      const full = (await this.isElementDisplayed(this.payInFullRadio, this.timeouts.short)) ? await this.isChecked(this.payInFullRadio) : false;
      if (inst === full) return false;
      return inst ? this.isElementDisplayed(this.continueFinancingButton) : this.isElementDisplayed(this.payNowButton);
    });
  }

  async getCtaLabel(): Promise<'continue' | 'payNow' | 'none'> {
    return this.then('getCtaLabel', async () => {
      if (await this.isElementDisplayed(this.payNowButton, this.timeouts.short)) return 'payNow';
      if (await this.isElementDisplayed(this.continueFinancingButton, this.timeouts.short)) return 'continue';
      return 'none';
    });
  }

  async clickOnInstallmentsNote(): Promise<void> {
    return this.when('clickOnInstallmentsNote', () => this.tap(this.installmentsNote));
  }

  async clickOnFullDescription(): Promise<void> {
    return this.when('clickOnFullDescription', () => this.tap(this.fullDescription));
  }

  async clickOnPayTodayRow(): Promise<void> {
    return this.when('clickOnPayTodayRow', () => this.tap(this.payTodayLabel));
  }

  async doubleTapPayNowButton(): Promise<void> {
    return this.when('doubleTapPayNowButton', async () => {
      const el = await this.waitForDisplayed(this.payNowButton);
      await el.click();
      await el.click().catch(() => undefined);
    });
  }

  async doubleTapContinueFinancingButton(): Promise<void> {
    return this.when('doubleTapContinueFinancingButton', async () => {
      await this.scrollTo(this.continueFinancingButton).catch(() => undefined);
      const el = await this.waitForDisplayed(this.continueFinancingButton);
      await el.click();
      await el.click().catch(() => undefined);
    });
  }

  async clickOnInstallmentsCard(): Promise<void> {
    return this.when('clickOnInstallmentsCard', () => this.tap(this.installmentsTitle));
  }

  async clickOnPayInFullCard(): Promise<void> {
    return this.when('clickOnPayInFullCard', () => this.tap(this.fullTitle));
  }

  async clickOnPayNowButton(): Promise<void> {
    return this.when('clickOnPayNowButton', () => this.tap(this.payNowButton));
  }

  async clickOnContinueFinancingButton(): Promise<void> {
    return this.when('clickOnContinueFinancingButton', () => this.tap(this.continueFinancingButton));
  }
}
