import { BasePage } from '@madark/pages/00-common/BasePage';

/** Results of "Financing request" (request_eligibility_controller): registered? dialog, blocks and errors. */
export class EligibilityPage extends BasePage {
  private readonly areYouRegistered: string;
  private readonly yesButton: string;
  private readonly noButton: string;
  private readonly registrationRequired: string;
  private readonly activeRequestExists: string;
  private readonly existingRequestError: string;
  private readonly dismissButton: string;

  constructor() {
    super();
    this.areYouRegistered = this.byTextContains('are_you_registered');
    this.yesButton = this.byText('yes');
    this.noButton = this.byText('no');
    this.registrationRequired = this.byTextContains('registration_required');
    this.activeRequestExists = this.byTextContains('active_request_exists');
    this.existingRequestError = this.byTextContains('eligibility_error_title');
    this.dismissButton = this.byTextContains('alert_voting_dialog_btn2');
  }

  async isAreYouRegisteredVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isAreYouRegisteredVisible', () => this.isElementDisplayed(this.areYouRegistered, timeout));
  }

  async isRegistrationRequiredVisible(): Promise<boolean> {
    return this.then('isRegistrationRequiredVisible', () => this.isElementDisplayed(this.registrationRequired, this.timeouts.medium));
  }

  async isActiveRequestBlockVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isActiveRequestBlockVisible', async () =>
      (await this.isElementDisplayed(this.activeRequestExists, timeout)) || (await this.isElementDisplayed(this.existingRequestError, this.timeouts.short))
    );
  }

  /** Any blocking result sheet (server message or default) shown instead of Request Financing. */
  async isBlockingResultVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isBlockingResultVisible', async () =>
      (await this.isElementDisplayed(this.dismissButton, timeout)) ||
      (await this.isElementDisplayed(this.activeRequestExists, this.timeouts.short)) ||
      (await this.isElementDisplayed(this.registrationRequired, this.timeouts.short))
    );
  }

  async clickOnYesButton(): Promise<void> {
    return this.when('clickOnYesButton', () => this.tap(this.yesButton));
  }

  async clickOnNoButton(): Promise<void> {
    return this.when('clickOnNoButton', () => this.tap(this.noButton));
  }

  async clickOnDismissButton(): Promise<void> {
    return this.when('clickOnDismissButton', () => this.tap(this.dismissButton));
  }
}
