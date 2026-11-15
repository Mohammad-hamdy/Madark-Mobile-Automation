import { BasePage } from '@madark/pages/00-common/BasePage';
import { MobileGestures } from '@madark/utils/mobile-gestures';

/** KYCQuestionsScreen: question categories (stepper), question types, confirmation tab and success screen. */
export class KycPage extends BasePage {
  private readonly nextButton: string;
  private readonly confirmButton: string;
  private readonly textAnswerField: string;
  private readonly informationAnswerField: string;
  private readonly singleChoiceField: string;
  private readonly dateField: string;
  private readonly uploadFileButton: string;
  private readonly mustAnswerAll: string;
  private readonly simahTitle: string;
  private readonly simahText: string;
  private readonly simahCheckbox: string;
  private readonly successTitle: string;
  private readonly successSubtitle: string;
  private readonly backToRequestsButton: string;
  private readonly firstSheetOption: string;
  private readonly connectionError: string;

  constructor() {
    super();
    this.nextButton = this.byText('kyc_next_button_title');
    this.confirmButton = this.byText('kyc_confirm_button_title');
    this.textAnswerField = this.byHint('kyc_enter_your_answer');
    this.informationAnswerField = this.byHint('KYC_INFORMATION_QUESTION_HINT');
    this.singleChoiceField = this.byTextContains('kyc_single_choice_hint');
    this.dateField = this.byTextContains('RegisterPage_DateOfBirth_hint');
    this.uploadFileButton = this.byTextContains('UPLOAD_FILE_BUTTON_TITLE');
    this.mustAnswerAll = this.byTextContains('kyc_must_answer_all_questions');
    this.simahTitle = this.byTextContains('KYCFAQPage_Section3Title_Hint');
    this.simahText = this.byTextContains('kyc_simah_verification_text');
    this.simahCheckbox = this.structural('simahCheckbox', 'checkbox', 'KYC confirmation tab checkbox has no key; it is the only checkbox on the tab');
    this.successTitle = this.byTextContains('kyc_success_title');
    this.successSubtitle = this.byTextContains('kyc_success_sub_title');
    this.backToRequestsButton = this.byTextContains('kyc_success_back_to_my_requests');
    this.firstSheetOption = this.structural('singleChoiceOption', 'view', 'single-choice sheet options come from the API; the first selectable row is used', 2);
    this.connectionError = this.byTextContains('connection_error');
  }

  async isKycVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isKycVisible', async () =>
      (await this.isElementDisplayed(this.nextButton, timeout)) || (await this.isElementDisplayed(this.confirmButton, this.timeouts.short))
    );
  }

  async isConfirmationTabVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isConfirmationTabVisible', () => this.isElementDisplayed(this.simahText, timeout));
  }

  async isSimahTitleVisible(): Promise<boolean> {
    return this.then('isSimahTitleVisible', () => this.isElementDisplayed(this.simahTitle));
  }

  async isSimahChecked(): Promise<boolean> {
    return this.then('isSimahChecked', () => this.isChecked(this.simahCheckbox));
  }

  async isConfirmButtonEnabled(): Promise<boolean> {
    return this.then('isConfirmButtonEnabled', () => this.isElementEnabled(this.confirmButton));
  }

  async isMustAnswerAllVisible(): Promise<boolean> {
    return this.then('isMustAnswerAllVisible', () => this.isElementDisplayed(this.mustAnswerAll, this.timeouts.medium));
  }

  async isConnectionErrorVisible(): Promise<boolean> {
    return this.then('isConnectionErrorVisible', () => this.isElementDisplayed(this.connectionError, this.timeouts.medium));
  }

  async isSuccessVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isSuccessVisible', async () =>
      (await this.isElementDisplayed(this.successTitle, timeout)) && (await this.isElementDisplayed(this.successSubtitle))
    );
  }

  async hasUnansweredSingleChoice(): Promise<boolean> {
    return this.then('hasUnansweredSingleChoice', () => this.isElementDisplayed(this.singleChoiceField, this.timeouts.short));
  }

  async hasTextQuestion(): Promise<boolean> {
    return this.then('hasTextQuestion', () => this.isElementDisplayed(this.textAnswerField, this.timeouts.short));
  }

  async hasDateQuestion(): Promise<boolean> {
    return this.then('hasDateQuestion', () => this.isElementDisplayed(this.dateField, this.timeouts.short));
  }

  async hasUploadQuestion(): Promise<boolean> {
    return this.then('hasUploadQuestion', () => this.isElementDisplayed(this.uploadFileButton, this.timeouts.short));
  }

  async isQuestionVisible(text: string): Promise<boolean> {
    return this.then('isQuestionVisible', () => this.isElementDisplayed(this.byDynamicText(text), this.timeouts.medium));
  }

  async getCategoryTitles(): Promise<string[]> {
    return this.then('getCategoryTitles', async () => (await this.screenTexts()).slice(0, 8));
  }

  /** Answers every unanswered question on the current category (text, information, single choice, date). */
  async answerCurrentCategory(answer = 'E2E answer'): Promise<void> {
    return this.when('answerCurrentCategory', async () => {
      for (let pass = 0; pass < 6; pass++) {
        let acted = false;
        for (const field of [this.textAnswerField, this.informationAnswerField]) {
          const els = await $$(field);
          for (const el of els) {
            const value = (await el.getAttribute('text').catch(() => '')) || '';
            if (!value || value.includes(answer) === false) {
              await el.click();
              await el.setValue(answer).catch(() => driver.keys([...answer]));
              acted = true;
            }
          }
        }
        if (await this.isElementDisplayed(this.singleChoiceField, this.timeouts.short)) {
          await this.tap(this.nth(this.singleChoiceField, 1));
          await this.tap(this.firstSheetOption);
          acted = true;
        }
        if (await this.isElementDisplayed(this.dateField, this.timeouts.short)) {
          await this.tap(this.nth(this.dateField, 1));
          await this.tap(this.byText('ok_title')).catch(() => this.tap(this.byText('bottom_sheet_button_title')));
          acted = true;
        }
        if (!acted) {
          if (await this.isElementDisplayed(this.nextButton, this.timeouts.short)) return;
          await MobileGestures.swipeUp();
        }
      }
    });
  }

  async clickOnQuestion(text: string): Promise<void> {
    return this.when('clickOnQuestion', async () => {
      const q = this.byDynamicText(text);
      await this.scrollTo(q).catch(() => undefined);
      await this.tap(q);
    });
  }

  async clickOnOption(text: string): Promise<void> {
    return this.when('clickOnOption', () => this.tap(`(${this.byDynamicText(text)})[last()]`));
  }

  async clickOnFirstOption(): Promise<void> {
    return this.when('clickOnFirstOption', () => this.tap(this.firstSheetOption));
  }

  async clickOnNextButton(): Promise<void> {
    return this.when('clickOnNextButton', () => this.tap(this.nextButton));
  }

  /** Next through every category (answering what is empty) until the confirmation tab. */
  async completeAllCategories(maxCategories = 10): Promise<void> {
    return this.when('completeAllCategories', async () => {
      for (let i = 0; i < maxCategories; i++) {
        if (await this.isElementDisplayed(this.simahText, this.timeouts.short)) return;
        await this.answerCurrentCategory();
        await this.tap(this.nextButton);
      }
      if (!(await this.isElementDisplayed(this.simahText, this.timeouts.medium))) throw new Error('KYC confirmation tab not reached');
    });
  }

  async checkSimah(): Promise<void> {
    return this.when('checkSimah', async () => {
      if (!(await this.isChecked(this.simahCheckbox))) await this.tap(this.simahCheckbox);
    });
  }

  async uncheckSimah(): Promise<void> {
    return this.when('uncheckSimah', async () => {
      if (await this.isChecked(this.simahCheckbox)) await this.tap(this.simahCheckbox);
    });
  }

  async clickOnConfirmButton(): Promise<void> {
    return this.when('clickOnConfirmButton', () => this.tap(this.confirmButton));
  }

  async clickOnBackToRequestsButton(): Promise<void> {
    return this.when('clickOnBackToRequestsButton', () => this.tap(this.backToRequestsButton));
  }

  async clickOnUploadFileButton(): Promise<void> {
    return this.when('clickOnUploadFileButton', () => this.tap(this.uploadFileButton));
  }
}
