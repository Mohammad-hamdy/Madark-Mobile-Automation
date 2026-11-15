import { BasePage } from '@madark/pages/00-common/BasePage';

/** EducationalInstitutionDetailsScreen: institution / university details with branches and the financing CTA. */
export class InstitutionDetailsPage extends BasePage {
  private readonly financingRequestButton: string;
  private readonly addressLabel: string;
  private readonly departmentsTitle: string;

  constructor() {
    super();
    this.financingRequestButton = this.byTextContains('educational_details_financing_request_button');
    this.addressLabel = this.byTextContains('address');
    this.departmentsTitle = this.byTextContains('departments_title');
  }

  async isDetailsVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isDetailsVisible', () => this.isElementDisplayed(this.financingRequestButton, timeout));
  }

  async isInstitutionNameVisible(name: string): Promise<boolean> {
    return this.then('isInstitutionNameVisible', () => this.isElementDisplayed(this.byDynamicText(name), this.timeouts.medium));
  }

  async isAddressVisible(): Promise<boolean> {
    return this.then('isAddressVisible', () => this.isElementDisplayed(this.addressLabel));
  }

  async isDepartmentsSectionVisible(): Promise<boolean> {
    return this.then('isDepartmentsSectionVisible', async () => {
      await this.scrollTo(this.departmentsTitle).catch(() => undefined);
      return this.isElementDisplayed(this.departmentsTitle);
    });
  }

  async isBranchVisible(branch: string): Promise<boolean> {
    return this.then('isBranchVisible', () => this.isElementDisplayed(this.byDynamicText(branch), this.timeouts.medium));
  }

  async clickOnBranch(branch: string): Promise<void> {
    return this.when('clickOnBranch', () => this.tap(this.byDynamicText(branch)));
  }

  async clickOnFinancingRequestButton(): Promise<void> {
    return this.when('clickOnFinancingRequestButton', () => this.tap(this.financingRequestButton));
  }
}
