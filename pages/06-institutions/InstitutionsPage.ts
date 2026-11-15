import { BasePage } from '@madark/pages/00-common/BasePage';
import { I18n } from '@madark/i18n/i18n';
import { MobileGestures } from '@madark/utils/mobile-gestures';

/** EducationalInstitutionsScreen: institutions of one education type, with search, filter and featured cards. */
export class InstitutionsPage extends BasePage {
  private readonly searchField: string;
  private readonly clearSearchButton: string;
  private readonly filterButton: string;
  private readonly resetFilterButton: string;
  private readonly filterSheetTitle: string;
  private readonly filterSearchByName: string;
  private readonly filterAllCities: string;
  private readonly filterTypeAll: string;
  private readonly filterTypeBoys: string;
  private readonly filterTypeGirls: string;
  private readonly filterApplyButton: string;
  private readonly filterResetAllButton: string;
  private readonly cityDropdown: string;
  private readonly financingRequestButton: string;
  private readonly featuredBadge: string;
  private readonly emptySearchTitle: string;
  private readonly emptyListTitle: string;
  private readonly loadFailedTitle: string;
  private readonly tryAgainButton: string;
  private readonly departmentsTitle: string;

  constructor() {
    super();
    this.searchField = this.byHint('search_institution_hint');
    this.clearSearchButton = this.byTextContains('clear_search_institution_title');
    this.filterButton = this.byTextContains('educational_institution_filter_button_title');
    this.resetFilterButton = this.byTextContains('educational_institution_reset_filter_button_title');
    this.filterSheetTitle = this.byTextContains('educational_institution_filter_sheet_title');
    this.filterSearchByName = this.byHint('filter_search_by_name_hint');
    this.filterAllCities = this.byTextContains('educational_institution_filter_all_cities');
    this.filterTypeAll = this.byText('educational_institution_filter_type_all');
    this.filterTypeBoys = this.byTextContains('educational_institution_filter_type_boys');
    this.filterTypeGirls = this.byTextContains('educational_institution_filter_type_girls');
    this.filterApplyButton = this.byTextContains('educational_institution_filter_apply_button');
    this.filterResetAllButton = this.byTextContains('educational_institution_filter_reset_all');
    this.cityDropdown = this.byTextContains('choose_city_hint');
    this.financingRequestButton = this.byTextContains('educational_details_financing_request_button');
    this.featuredBadge = this.byTextContains('educational_institution_featured_title');
    this.emptySearchTitle = this.byTextContains('empty_search_institutions_title');
    this.emptyListTitle = this.byTextContains('empty_institutions_title_suffix');
    this.loadFailedTitle = this.byTextContains('institutions_load_failed_title');
    this.tryAgainButton = this.byTextContains('try_again');
    this.departmentsTitle = this.byTextContains('departments_title');
  }

  async isInstitutionsListVisible(timeout = this.timeouts.long): Promise<boolean> {
    return this.then('isInstitutionsListVisible', async () =>
      (await this.isElementDisplayed(this.financingRequestButton, timeout)) || (await this.isElementDisplayed(this.searchField, this.timeouts.short))
    );
  }

  async isInstitutionVisible(name: string): Promise<boolean> {
    return this.then('isInstitutionVisible', () => this.isElementDisplayed(this.byDynamicText(name), this.timeouts.medium));
  }

  async isEmptySearchVisible(): Promise<boolean> {
    return this.then('isEmptySearchVisible', () => this.isElementDisplayed(this.emptySearchTitle, this.timeouts.medium));
  }

  async isEmptyListVisible(): Promise<boolean> {
    return this.then('isEmptyListVisible', () => this.isElementDisplayed(this.emptyListTitle, this.timeouts.medium));
  }

  async isLoadFailedVisible(): Promise<boolean> {
    return this.then('isLoadFailedVisible', () => this.isElementDisplayed(this.loadFailedTitle, this.timeouts.medium));
  }

  async isFeaturedBadgeVisible(): Promise<boolean> {
    return this.then('isFeaturedBadgeVisible', () => this.isElementDisplayed(this.featuredBadge));
  }

  async isFilterSheetVisible(): Promise<boolean> {
    return this.then('isFilterSheetVisible', () => this.isElementDisplayed(this.filterSheetTitle, this.timeouts.medium));
  }

  async isFinancingRequestButtonVisible(): Promise<boolean> {
    return this.then('isFinancingRequestButtonVisible', () => this.isElementDisplayed(this.financingRequestButton));
  }

  async getFinancingRequestButtonCount(): Promise<number> {
    return this.then('getFinancingRequestButtonCount', () => this.countMatches(this.financingRequestButton));
  }

  async isResetFilterVisible(): Promise<boolean> {
    return this.then('isResetFilterVisible', () => this.isElementDisplayed(this.resetFilterButton));
  }

  async clickOnInstitution(name: string): Promise<void> {
    return this.when('clickOnInstitution', () => this.tap(this.byDynamicText(name)));
  }

  /** Category chip (All / Governmental / Private …): names come from EducationCategoryTypes. */
  async clickOnCategoryChip(name: string): Promise<void> {
    return this.when('clickOnCategoryChip', () => this.tap(this.nth(this.byDynamicText(name), 1)));
  }

  async getChipCount(name: string): Promise<number> {
    return this.then('getChipCount', async () => {
      const t = await this.readText(this.nth(this.byDynamicText(name), 1)).catch(() => '');
      return Number(/(\d+)/.exec(t.replace(name, ''))?.[1] ?? NaN);
    });
  }

  async pullToRefresh(): Promise<void> {
    return this.when('pullToRefresh', () => MobileGestures.swipeDown({ distance: 0.5 }));
  }

  async clickOnFirstFinancingRequestButton(): Promise<void> {
    return this.when('clickOnFirstFinancingRequestButton', () => this.tap(this.nth(this.financingRequestButton, 1)));
  }

  async clickOnClearSearchButton(): Promise<void> {
    return this.when('clickOnClearSearchButton', () => this.tap(this.clearSearchButton));
  }

  async clickOnFilterButton(): Promise<void> {
    return this.when('clickOnFilterButton', () => this.tap(this.filterButton));
  }

  async clickOnResetFilterButton(): Promise<void> {
    return this.when('clickOnResetFilterButton', () => this.tap(this.resetFilterButton));
  }

  async clickOnCityDropdown(): Promise<void> {
    return this.when('clickOnCityDropdown', () => this.tap(this.cityDropdown));
  }

  async selectCityOption(city: string): Promise<void> {
    return this.when('selectCityOption', () => this.tap(this.nth(this.byDynamicText(city), 1)));
  }

  async clickOnAllCitiesOption(): Promise<void> {
    return this.when('clickOnAllCitiesOption', () => this.tap(this.filterAllCities));
  }

  async clickOnTypeBoysOption(): Promise<void> {
    return this.when('clickOnTypeBoysOption', () => this.tap(this.filterTypeBoys));
  }

  async clickOnTypeGirlsOption(): Promise<void> {
    return this.when('clickOnTypeGirlsOption', () => this.tap(this.filterTypeGirls));
  }

  async clickOnTypeAllOption(): Promise<void> {
    return this.when('clickOnTypeAllOption', () => this.tap(this.filterTypeAll));
  }

  async clickOnApplyFiltersButton(): Promise<void> {
    return this.when('clickOnApplyFiltersButton', () => this.tap(this.filterApplyButton));
  }

  async clickOnResetAllFiltersButton(): Promise<void> {
    return this.when('clickOnResetAllFiltersButton', () => this.tap(this.filterResetAllButton));
  }

  async clickOnTryAgainButton(): Promise<void> {
    return this.when('clickOnTryAgainButton', () => this.tap(this.tryAgainButton));
  }

  async isDepartmentsSectionVisible(): Promise<boolean> {
    return this.then('isDepartmentsSectionVisible', () => this.isElementDisplayed(this.departmentsTitle));
  }

  async enterSearchText(text: string): Promise<void> {
    return this.when('enterSearchText', () => this.typeInto(this.searchField, text));
  }

  async enterFilterName(text: string): Promise<void> {
    return this.when('enterFilterName', () => this.typeInto(this.filterSearchByName, text));
  }

  static nameFor(seed: { name: string; nameAr?: string }): string {
    return I18n.isAr && seed.nameAr ? seed.nameAr : seed.name;
  }
}
