import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('06 · Institutions', () => {
  describe('01 · Institutions', () => {
    test(
      '[11901] Customer App / Customer / Institutions_ Empty list and empty search states match the design system',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.institutions,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11901' },
      async ({ app, data, homePage, institutionsPage, visual }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.customer());
        await homePage.clickOnEducationType(data.need(inst.emptyEducationType, 'institution.emptyEducationType'));
        expect(await institutionsPage.isEmptyListVisible()).toBe(true);
        expect(await visual.matchesBaseline('06-empty-list')).toBe(true);
        await app.goBack();
        await homePage.clickOnEducationType(data.pick(inst.educationType, inst.educationTypeAr));
        await institutionsPage.enterSearchText('zzzz');
        expect(await institutionsPage.isEmptySearchVisible()).toBe(true);
        expect(await visual.matchesBaseline('06-empty-search')).toBe(true);
        manualCheck('repeat both states with E2E_LANG=ar — Arabic texts asserted through i18n on the AR run');
      }
    );

    test(
      '[11902] Customer App / Customer / Institutions_ List loads by education type and All / Governmental / Private filters return the right institutions',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.institutions,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11902' },
      async ({ app, data, homePage, institutionsPage }) => {
        const inst = data.seed('institution');
        const chips = data.need(inst.categoryChips, 'institution.categoryChips');
        await app.ensureLoggedIn(data.customer());
        await homePage.clickOnEducationType(data.need(inst.universitiesType, 'institution.universitiesType'));
        const all = await institutionsPage.getFinancingRequestButtonCount();
        manualCheck('count badge equals the number of cards; counts equal admin');
        for (const chip of chips.slice(1)) {
          await institutionsPage.clickOnCategoryChip(chip);
          expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
        }
        await institutionsPage.clickOnCategoryChip(chips[0]);
        expect(await institutionsPage.getFinancingRequestButtonCount()).toBe(all);
      }
    );

    test(
      '[11903] Customer App / Customer / Institutions_ Search returns matching institutions and no match shows the empty search state',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.institutions,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11903' },
      async ({ app, data, homePage, institutionsPage, institutionDetailsPage }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.customer());
        await homePage.clickOnEducationType(data.pick(inst.educationType, inst.educationTypeAr));
        expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
        await institutionsPage.enterSearchText(inst.searchText);
        expect(await institutionsPage.isInstitutionVisible(data.pick(inst.name, inst.nameAr))).toBe(true);
        await institutionsPage.clickOnInstitution(data.pick(inst.name, inst.nameAr));
        expect(await institutionDetailsPage.isDetailsVisible()).toBe(true);
        await app.goBack();
        await institutionsPage.clickOnClearSearchButton();
        expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
        await institutionsPage.enterSearchText('zzzz');
        expect(await institutionsPage.isEmptySearchVisible()).toBe(true);
      }
    );

    test(
      '[11904] Customer App / Customer / Institutions_ City filter limits the list to the selected city',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.institutions,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11904' },
      async ({ app, data, homePage, institutionsPage }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.customer());
        await homePage.clickOnEducationType(data.pick(inst.educationType, inst.educationTypeAr));
        await institutionsPage.clickOnFilterButton();
        expect(await institutionsPage.isFilterSheetVisible()).toBe(true);
        await institutionsPage.clickOnCityDropdown();
        await institutionsPage.selectCityOption(data.need(inst.city, 'institution.city'));
        await institutionsPage.clickOnApplyFiltersButton();
        if (inst.otherCityInstitution) expect(await institutionsPage.isInstitutionVisible(inst.otherCityInstitution)).toBe(false);
        manualCheck('filtered count equals admin for the city; cities equal GET EducationalLookups/GetAllCities');
        await institutionsPage.clickOnResetFilterButton();
        expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
      }
    );

    test(
      '[11906] Customer App / Customer / Institutions_ Refresh works when no institutions are available',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.institutions,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11906' },
      async ({ app, data, homePage, institutionsPage }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.customer());
        await homePage.clickOnEducationType(data.need(inst.emptyEducationType, 'institution.emptyEducationType'));
        expect(await institutionsPage.isEmptyListVisible()).toBe(true);
        await institutionsPage.pullToRefresh();
        expect(await institutionsPage.isEmptyListVisible()).toBe(true);
        expect(await institutionsPage.isLoadFailedVisible()).toBe(false);
        manualCheck('QA activates one institution of that type in admin, then refresh shows it and the empty state disappears');
      }
    );
  });

  describe('02 · Universities', () => {
    test(
      '[11896] Customer App / Customer / Universities_ All Universities list matches Figma (filter chip All 104.89x36 radius 12, Governmental / Private Medium 13/19.5 #6B7280)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.institutions,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11896' },
      async ({ app, data, homePage, institutionsPage, visual }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.customer());
        await homePage.clickOnEducationType(data.need(inst.universitiesType, 'institution.universitiesType'));
        expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
        expect(await visual.matchesBaseline('06-universities-all')).toBe(true);
        manualCheck('Figma 1333:24327 — title Bold 16/24 #101828, chip All 104.89x36 radius 12, Governmental/Private Medium 13/19.5 #6B7280');
      }
    );

    test(
      '[11897] Customer App / Customer / Universities_ Filter state matches Figma (active chip, count badge, filter icon)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.institutions,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11897' },
      async ({ app, data, homePage, institutionsPage, visual }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.customer());
        await homePage.clickOnEducationType(data.need(inst.universitiesType, 'institution.universitiesType'));
        await institutionsPage.clickOnFilterButton();
        await institutionsPage.clickOnCityDropdown();
        await institutionsPage.selectCityOption(data.need(inst.city, 'institution.city'));
        await institutionsPage.clickOnApplyFiltersButton();
        expect(await institutionsPage.isResetFilterVisible()).toBe(true);
        expect(await visual.matchesBaseline('06-universities-filtered')).toBe(true);
        manualCheck('Figma 1333:24371 — active chip with filtered count badge, filter icon applied state');
      }
    );

    test(
      '[11898] Customer App / Customer / Universities_ University card matches Figma (173x178.1, radius 16, #FFFFFF, shadow #000000 7%)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.institutions,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11898' },
      async ({ app, data, homePage, institutionsPage, visual }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.customer());
        await homePage.clickOnEducationType(data.need(inst.universitiesType, 'institution.universitiesType'));
        expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
        expect(await visual.matchesBaseline('06-university-cards')).toBe(true);
        manualCheck('UniversityCard 173x178.1 radius 16, name Bold 12/15 #1E2939, two per row, long names wrap');
      }
    );
  });

  describe('03 · Schools', () => {
    test(
      '[11900] Customer App / Customer / Schools_ All Schools list matches Figma and the Financing Request button text is readable',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.institutions,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11900' },
      async ({ app, data, homePage, institutionsPage, visual }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.customer());
        await homePage.clickOnEducationType(data.need(inst.schoolsType, 'institution.schoolsType'));
        expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
        expect(await institutionsPage.isFinancingRequestButtonVisible()).toBe(true);
        expect(await visual.matchesBaseline('06-schools-list')).toBe(true);
        manualCheck('Figma 1333:25787 — "Financing request" label fully visible and readable on every card');
      }
    );
  });

  describe('04 · Institution Details', () => {
    test(
      '[11905] Customer App / Customer / Institution Details_ Details opens from the list and starts a financing request for that branch',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.institutions,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11905' },
      async ({ app, data, institutionDetailsPage, requestFinancingPage, eligibilityPage }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.seedCustomer('eligibleCustomer'));
        await app.openInstitutionDetails(inst);
        await institutionDetailsPage.clickOnFinancingRequestButton();
        if (await eligibilityPage.isAreYouRegisteredVisible(5000)) await eligibilityPage.clickOnYesButton();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
        expect(await requestFinancingPage.isBranchNameVisible(data.pick(inst.branch ?? inst.name, inst.nameAr))).toBe(true);
        await app.goBack();
        await app.logout();

        await app.loginAs(data.seedCustomer('newBranchCustomer'));
        await app.openInstitutionDetails(inst);
        await institutionDetailsPage.clickOnFinancingRequestButton();
        expect(await eligibilityPage.isAreYouRegisteredVisible()).toBe(true);
        await eligibilityPage.clickOnYesButton();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
        await app.goBack();
        await institutionDetailsPage.clickOnFinancingRequestButton();
        await eligibilityPage.clickOnNoButton();
        expect(await eligibilityPage.isRegistrationRequiredVisible()).toBe(true);
      }
    );
  });

  describe('05 · University Details', () => {
    test(
      '[11899] Customer App / Customer / University Details_ University details screen matches Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.institutions,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11899' },
      async ({ app, data, homePage, institutionsPage, institutionDetailsPage, visual }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.customer());
        await homePage.clickOnEducationType(data.need(inst.universitiesType, 'institution.universitiesType'));
        await institutionsPage.clickOnInstitution(data.need(inst.universityName, 'institution.universityName'));
        expect(await institutionDetailsPage.isDetailsVisible()).toBe(true);
        expect(await institutionDetailsPage.isDepartmentsSectionVisible()).toBe(true);
        expect(await visual.matchesBaseline('06-university-details')).toBe(true);
        manualCheck('Figma 1333:25289 — header, name Bold 14/19.25, gallery indicator, colleges, gradient Financing request');
      }
    );
  });
});
