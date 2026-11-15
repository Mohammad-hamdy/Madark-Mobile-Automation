import { BasePage } from '@madark/pages/00-common/BasePage';

/** Appearance sheet (theme_mode_picker_sheet.dart): Light / Dark / System. */
export class ThemePickerPage extends BasePage {
  private readonly title: string;
  private readonly subtitle: string;
  private readonly lightOption: string;
  private readonly darkOption: string;
  private readonly systemOption: string;

  constructor() {
    super();
    this.title = this.byTextContains('theme_mode_sheet_title');
    this.subtitle = this.byTextContains('theme_mode_sheet_subtitle');
    this.lightOption = this.byText('theme_mode_light');
    this.darkOption = this.byText('theme_mode_dark');
    this.systemOption = this.byText('theme_mode_system');
  }

  async isThemePickerVisible(): Promise<boolean> {
    return this.then('isThemePickerVisible', async () =>
      (await this.isElementDisplayed(this.subtitle, this.timeouts.medium)) && (await this.isElementDisplayed(this.title))
    );
  }

  async areThemeOptionsVisible(): Promise<boolean> {
    return this.then('areThemeOptionsVisible', async () => {
      for (const o of [this.lightOption, this.darkOption, this.systemOption]) if (!(await this.isElementDisplayed(o))) return false;
      return true;
    });
  }

  async clickOnLightOption(): Promise<void> {
    return this.when('clickOnLightOption', () => this.tap(this.lightOption));
  }

  async clickOnDarkOption(): Promise<void> {
    return this.when('clickOnDarkOption', () => this.tap(this.darkOption));
  }

  async clickOnSystemOption(): Promise<void> {
    return this.when('clickOnSystemOption', () => this.tap(this.systemOption));
  }
}
