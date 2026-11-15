import { BasePage } from '@madark/pages/00-common/BasePage';

/** AddStudentScreen: manual student (name, national ID, academic year, relationship). */
export class AddStudentPage extends BasePage {
  private readonly title: string;
  private readonly subtitle: string;
  private readonly sectionLabel: string;
  private readonly nameField: string;
  private readonly idField: string;
  private readonly idRequiredError: string;
  private readonly sameIdError: string;
  private readonly academicYearLabel: string;
  private readonly relationshipDropdown: string;
  private readonly relationshipFather: string;
  private readonly relationshipMother: string;
  private readonly relationshipBrother: string;
  private readonly relationshipGuardian: string;
  private readonly addButton: string;

  constructor() {
    super();
    this.title = this.byTextContains('add_student_screen_title');
    this.subtitle = this.byTextContains('add_student_screen_subtitle');
    this.sectionLabel = this.byTextContains('student_information_section');
    this.nameField = this.byHint('enter_full_name_hint');
    this.idField = this.byHint('enter_student_id');
    this.idRequiredError = this.byTextContains('enter_student_id');
    this.sameIdError = this.byTextContains('same_id_error');
    this.academicYearLabel = this.byTextContains('academic_year');
    this.relationshipDropdown = this.byTextContains('select_hint');
    this.relationshipFather = this.byText('relationship_father');
    this.relationshipMother = this.byText('relationship_mother');
    this.relationshipBrother = this.byText('relationship_brother');
    this.relationshipGuardian = this.byText('relationship_guardian');
    this.addButton = this.nth(this.byText('add_student_screen_title'), 2);
  }

  async isAddStudentVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isAddStudentVisible', () => this.isElementDisplayed(this.subtitle, timeout));
  }

  async isFormSectionVisible(): Promise<boolean> {
    return this.then('isFormSectionVisible', async () =>
      (await this.isElementDisplayed(this.sectionLabel)) && (await this.isElementDisplayed(this.academicYearLabel))
    );
  }

  async isIdRequiredErrorVisible(): Promise<boolean> {
    return this.then('isIdRequiredErrorVisible', async () => (await this.countMatches(this.idRequiredError)) > 1);
  }

  async isSameIdErrorVisible(): Promise<boolean> {
    return this.then('isSameIdErrorVisible', () => this.isElementDisplayed(this.sameIdError));
  }

  async isAddButtonEnabled(): Promise<boolean> {
    return this.then('isAddButtonEnabled', () => this.isElementEnabled(this.addButton));
  }

  async getStudentId(): Promise<string> {
    return this.then('getStudentId', async () => (await this.getFieldValue(this.idField)).replace(/\D/g, ''));
  }

  async clickOnRelationshipDropdown(): Promise<void> {
    return this.when('clickOnRelationshipDropdown', () => this.tap(this.relationshipDropdown));
  }

  async selectRelationshipOption(relation: 'father' | 'mother' | 'brother' | 'guardian'): Promise<void> {
    const loc = { father: this.relationshipFather, mother: this.relationshipMother, brother: this.relationshipBrother, guardian: this.relationshipGuardian }[relation];
    return this.when('selectRelationshipOption', () => this.tap(loc));
  }

  async clickOnAddButton(): Promise<void> {
    return this.when('clickOnAddButton', () => this.tap(this.addButton));
  }

  async enterStudentName(name: string): Promise<void> {
    return this.when('enterStudentName', () => this.typeInto(this.nameField, name));
  }

  async enterStudentId(id: string): Promise<void> {
    return this.when('enterStudentId', () => this.typeInto(this.idField, id));
  }

  async enterStudentIdKeys(chars: string): Promise<void> {
    return this.when('enterStudentIdKeys', () => this.typeKeys(this.idField, chars));
  }

  async clearStudentId(): Promise<void> {
    return this.when('clearStudentId', async () => {
      const el = await this.waitForDisplayed(this.idField);
      await el.click();
      await el.clearValue();
    });
  }

  async isTitleVisible(): Promise<boolean> {
    return this.then('isTitleVisible', () => this.isElementDisplayed(this.title));
  }
}
