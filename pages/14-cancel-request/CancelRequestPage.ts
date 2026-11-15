import { BasePage } from '@madark/pages/00-common/BasePage';

/** Cancel request confirmation dialog and its success / failure results. */
export class CancelRequestPage extends BasePage {
  private readonly title: string;
  private readonly message: string;
  private readonly confirmButton: string;
  private readonly backButton: string;
  private readonly successMessage: string;
  private readonly failureMessage: string;
  private readonly tryAgainButton: string;
  private readonly createNewRequestButton: string;

  constructor() {
    super();
    this.title = this.byTextContains('cancel_request_confirmation_title');
    this.message = this.byTextContains('cancel_request_confirmation_message');
    this.confirmButton = this.byText('confirm_cancel_request');
    this.backButton = this.byText('cancel_request_back');
    this.successMessage = this.byTextContains('cancel_request_success');
    this.failureMessage = this.byTextContains('failed_to_cancel_request');
    this.tryAgainButton = this.byTextContains('try_again');
    this.createNewRequestButton = this.byTextContains('home_request_for_financing_title');
  }

  async isConfirmationVisible(timeout = this.timeouts.medium): Promise<boolean> {
    return this.then('isConfirmationVisible', async () =>
      (await this.isElementDisplayed(this.title, timeout)) && (await this.isElementDisplayed(this.message, this.timeouts.short))
    );
  }

  async isSuccessVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isSuccessVisible', () => this.isElementDisplayed(this.successMessage, timeout));
  }

  async isFailureVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isFailureVisible', () => this.isElementDisplayed(this.failureMessage, timeout));
  }

  async isCreateNewRequestVisible(): Promise<boolean> {
    return this.then('isCreateNewRequestVisible', () => this.isElementDisplayed(this.createNewRequestButton));
  }

  async clickOnConfirmButton(): Promise<void> {
    return this.when('clickOnConfirmButton', () => this.tap(this.confirmButton));
  }

  async clickOnBackButton(): Promise<void> {
    return this.when('clickOnBackButton', () => this.tap(this.backButton));
  }

  async clickOnTryAgainButton(): Promise<void> {
    return this.when('clickOnTryAgainButton', () => this.tap(this.tryAgainButton));
  }

  async clickOnCreateNewRequestButton(): Promise<void> {
    return this.when('clickOnCreateNewRequestButton', () => this.tap(this.createNewRequestButton));
  }

  async tapOutside(): Promise<void> {
    return this.when('tapOutside', async () => {
      const { width } = await driver.getWindowSize();
      await driver.performActions([
        {
          type: 'pointer',
          id: 'outside',
          parameters: { pointerType: 'touch' },
          actions: [
            { type: 'pointerMove', duration: 0, x: Math.round(width / 2), y: 60 },
            { type: 'pointerDown', button: 0 },
            { type: 'pointerUp', button: 0 },
          ],
        },
      ]);
      await driver.releaseActions().catch(() => undefined);
    });
  }
}
