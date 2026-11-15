import { BasePage } from '@madark/pages/BasePage';
import { devLiteral } from '@madark/i18n/literals';

export class EnvSetupPage extends BasePage {
  private readonly devOption: string;
  private readonly preprodOption: string;
  private readonly encryptionOnOption: string;
  private readonly encryptionOffOption: string;

  constructor() {
    super();
    this.devOption = this.byLiteral(devLiteral('login.env.DEVELOPMENT'));
    this.preprodOption = this.byLiteral(devLiteral('login.env.PREPROD'));
    this.encryptionOnOption = this.byLiteral(devLiteral('login.encryptionON'));
    this.encryptionOffOption = this.byLiteral(devLiteral('login.encryptionOFF'));
  }

  async isEnvironmentPickerVisible(): Promise<boolean> {
    return this.then('isEnvironmentPickerVisible', async () => {
      await this.revealPickers();
      return (await this.isElementDisplayed(this.devOption)) || (await this.isElementDisplayed(this.preprodOption));
    });
  }

  async getSelectedEnvironment(): Promise<string> {
    return this.then('getSelectedEnvironment', async () => {
      await this.revealPickers();
      if (await this.isElementDisplayed(this.devOption)) return devLiteral('login.env.DEVELOPMENT');
      if (await this.isElementDisplayed(this.preprodOption)) return devLiteral('login.env.PREPROD');
      return '';
    });
  }

  async isEncryptionOn(): Promise<boolean> {
    return this.then('isEncryptionOn', async () => {
      await this.revealPickers();
      return this.isElementDisplayed(this.encryptionOnOption);
    });
  }

  async clickOnEnvironmentDropdown(): Promise<void> {
    return this.when('clickOnEnvironmentDropdown', async () => {
      const current = (await this.isElementDisplayed(this.devOption)) ? this.devOption : this.preprodOption;
      await this.tap(current);
    });
  }

  async clickOnEnvironmentOption(label: string): Promise<void> {
    return this.when('clickOnEnvironmentOption', () =>
      this.tap(`(${label === devLiteral('login.env.PREPROD') ? this.preprodOption : this.devOption})[last()]`)
    );
  }

  async clickOnEncryptionDropdown(): Promise<void> {
    return this.when('clickOnEncryptionDropdown', async () => {
      const current = (await this.isElementDisplayed(this.encryptionOnOption)) ? this.encryptionOnOption : this.encryptionOffOption;
      await this.tap(current);
    });
  }

  async clickOnEncryptionOption(on: boolean): Promise<void> {
    return this.when('clickOnEncryptionOption', () => this.tap(`(${on ? this.encryptionOnOption : this.encryptionOffOption})[last()]`));
  }

  private async revealPickers(): Promise<void> {
    await this.scrollTo(this.encryptionOnOption).catch(() => this.scrollTo(this.encryptionOffOption));
  }
}
