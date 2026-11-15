import { BasePage } from '@madark/pages/00-common/BasePage';

/** Contact Us (channels, social) and Submit Complaint. */
export class ContactUsPage extends BasePage {
  private readonly title: string;
  private readonly contactVia: string;
  private readonly followUs: string;
  private readonly submitComplaintLink: string;
  private readonly complaintTitle: string;
  private readonly complaintInfo: string;
  private readonly categoryDropdown: string;
  private readonly subcategoryDropdown: string;
  private readonly descriptionField: string;
  private readonly submitButton: string;
  private readonly categoryRequired: string;
  private readonly descriptionTooShort: string;
  private readonly categoriesFailed: string;
  private readonly submitted: string;
  private readonly addImageButton: string;
  private readonly firstOption: string;

  constructor() {
    super();
    this.title = this.byText('more_section_contact_us');
    this.contactVia = this.byTextContains('or_contact_us_via');
    this.followUs = this.byTextContains('follow_us_on');
    this.submitComplaintLink = this.byText('submit_complaint_button');
    this.complaintTitle = this.byText('submit_complaint_title');
    this.complaintInfo = this.byTextContains('complaint_info_message');
    this.categoryDropdown = this.byTextContains('select_category');
    this.subcategoryDropdown = this.byTextContains('select_subcategory');
    this.descriptionField = this.byHint('complaint_description_hint');
    this.submitButton = `(${this.byText('submit_complaint')})[last()]`;
    this.categoryRequired = this.byTextContains('select_category_error');
    this.descriptionTooShort = this.byTextContains('description_too_short');
    this.categoriesFailed = this.byTextContains('failed_to_load_categories');
    this.submitted = this.byTextContains('complaint_submitted_successfully');
    this.addImageButton = this.byTextContains('add_image');
    this.firstOption = this.structural('complaintCategoryOption', 'view', 'categories come from Complaint/categories/lookup; the first option of the open dropdown is used', 2);
  }

  async isContactUsVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isContactUsVisible', async () =>
      (await this.isElementDisplayed(this.contactVia, timeout)) || (await this.isElementDisplayed(this.followUs, this.timeouts.short))
    );
  }

  async isChannelVisible(value: string): Promise<boolean> {
    return this.then('isChannelVisible', () => this.isTextOnScreen(value, this.timeouts.medium));
  }

  async isComplaintFormVisible(): Promise<boolean> {
    return this.then('isComplaintFormVisible', async () =>
      (await this.isElementDisplayed(this.complaintInfo, this.timeouts.long)) && (await this.isElementDisplayed(this.categoryDropdown, this.timeouts.short))
    );
  }

  async isCategoryRequiredVisible(): Promise<boolean> {
    return this.then('isCategoryRequiredVisible', () => this.isElementDisplayed(this.categoryRequired, this.timeouts.medium));
  }

  async isDescriptionTooShortVisible(): Promise<boolean> {
    return this.then('isDescriptionTooShortVisible', () => this.isElementDisplayed(this.descriptionTooShort));
  }

  async isCategoriesFailedVisible(): Promise<boolean> {
    return this.then('isCategoriesFailedVisible', () => this.isElementDisplayed(this.categoriesFailed, this.timeouts.medium));
  }

  async isSubmittedVisible(): Promise<boolean> {
    return this.then('isSubmittedVisible', () => this.isElementDisplayed(this.submitted, this.timeouts.long));
  }

  async clickOnChannel(value: string): Promise<void> {
    return this.when('clickOnChannel', () => this.tap(this.byDynamicText(value)));
  }

  async clickOnSubmitComplaintLink(): Promise<void> {
    return this.when('clickOnSubmitComplaintLink', () => this.tap(this.submitComplaintLink));
  }

  async clickOnCategoryDropdown(): Promise<void> {
    return this.when('clickOnCategoryDropdown', () => this.tap(this.categoryDropdown));
  }

  async clickOnSubcategoryDropdown(): Promise<void> {
    return this.when('clickOnSubcategoryDropdown', () => this.tap(this.subcategoryDropdown));
  }

  async selectFirstOption(): Promise<void> {
    return this.when('selectFirstOption', () => this.tap(this.firstOption));
  }

  async clickOnAddImageButton(): Promise<void> {
    return this.when('clickOnAddImageButton', () => this.tap(this.addImageButton));
  }

  async clickOnSubmitButton(): Promise<void> {
    return this.when('clickOnSubmitButton', () => this.tap(this.submitButton));
  }

  async enterDescription(text: string): Promise<void> {
    return this.when('enterDescription', () => this.typeInto(this.descriptionField, text));
  }

  async isTitleVisible(): Promise<boolean> {
    return this.then('isTitleVisible', async () => (await this.isElementDisplayed(this.title)) || (await this.isElementDisplayed(this.complaintTitle)));
  }
}
