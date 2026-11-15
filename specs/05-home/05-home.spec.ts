import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('05 · Home', () => {
  describe('01 · Home', () => {
    test(
      '[11885] Customer App / Customer / Home_ Logged-in home layout matches Figma (header, cards, sections, bottom navigation)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.home,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11885' },
      async ({ app, data, homePage, bottomNav, visual }) => {
        await app.ensureLoggedIn(data.customer());
        expect(await homePage.isHomeVisible()).toBe(true);
        expect(await homePage.isGreetingVisible()).toBe(true);
        expect(await visual.matchesBaseline('05-home-top')).toBe(true);
        manualCheck('Figma 1449:812 — header, ad banner, cards, sections, bottom navigation in order');
        expect(await homePage.isWhatLookingForSectionVisible()).toBe(true);
        await homePage.scrollToEnd();
        expect(await bottomNav.isBottomNavigationVisible()).toBe(true);
        expect(await visual.matchesBaseline('05-home-bottom')).toBe(true);
      }
    );

    test(
      '[11888] Customer App / Customer / Home_ Loading shimmer and empty sections match the design system',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.home,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11888', blocked: 'needs the slow-network profile and an empty-list backend mock for education types (QA-controlled backend state)' },
      async () => {}
    );

    test(
      '[11889] Customer App / Customer / Home_ Arabic RTL home layout',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.home,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11889' },
      async ({ app, data, homePage, bottomNav, visual }) => {
        await app.ensureLoggedIn(data.customer());
        await app.switchLanguage('ar');
        await bottomNav.goToHome();
        expect(await homePage.isHomeVisible()).toBe(true);
        expect(await homePage.isGreetingRightOfBell()).toBe(true);
        expect(await bottomNav.isHomeTabRightMost()).toBe(true);
        expect(await visual.matchesBaseline('05-home-rtl')).toBe(true);
        await homePage.swipeAdBannerLeft();
        expect(await visual.matchesBaseline('05-home-rtl-banner')).toBe(true);
        manualCheck('Arabic Home frame 1452:20504 — mirrored header, RTL bottom navigation, Arabic banners');
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[11890] Customer App / Customer / Home_ Education type opens the institutions list for that type',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.home,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11890' },
      async ({ app, data, homePage, institutionsPage }) => {
        const inst = data.seed('institution');
        await app.ensureLoggedIn(data.customer());
        expect(await homePage.isEducationTypeVisible(data.pick(inst.educationType, inst.educationTypeAr))).toBe(true);
        manualCheck('education types equal GET EducationalLookups/EducationTypes (names and count as admin)');
        await homePage.clickOnEducationType(data.pick(inst.educationType, inst.educationTypeAr));
        expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
        expect(await institutionsPage.isTextOnScreen(data.pick(inst.educationType, inst.educationTypeAr))).toBe(true);
        await app.goBack();
        expect(await homePage.isHomeVisible()).toBe(true);
        const second = data.need(inst.secondEducationType, 'institution.secondEducationType');
        await homePage.clickOnEducationType(second);
        expect(await institutionsPage.isInstitutionsListVisible()).toBe(true);
        expect(await institutionsPage.isTextOnScreen(second)).toBe(true);
      }
    );

    test(
      '[11891] Customer App / Customer / Home_ Special institutions are listed and open their details',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.home,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11891' },
      async ({ app, data, homePage, institutionDetailsPage }) => {
        const inst = data.seed('institution');
        const special = data.need(inst.specialBranch, 'institution.specialBranch');
        await app.ensureLoggedIn(data.customer());
        expect(await homePage.isFeaturedInstitutionVisible()).toBe(true);
        manualCheck('special section equals GET EducationalInstitution/GetAllSpecialBranches (names and count as admin)');
        await homePage.clickOnInstitutionCard(special);
        expect(await institutionDetailsPage.isDetailsVisible()).toBe(true);
        await app.goBack();
        expect(await homePage.isHomeVisible()).toBe(true);
      }
    );

    test(
      '[11892] Customer App / Customer / Home_ Complete your data widget for an approved, incomplete request opens completion',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.home,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11892' },
      async ({ app, data, homePage, kycPage }) => {
        const a = data.seedCustomer('approvedIncompleteRequest');
        await app.ensureLoggedIn(a);
        expect(await homePage.isFollowUpCardVisible()).toBe(true);
        await homePage.clickOnFollowUpCard();
        expect(await homePage.isTextOnScreen(data.seed('approvedIncompleteRequest').requestNumber)).toBe(true);
        await app.goBack();
        await app.logout();

        const b = data.seedCustomer('kycIncompleteCustomer');
        await app.loginAs(b);
        expect(await homePage.isCompleteDataCardVisible()).toBe(true);
        await homePage.clickOnCompleteDataCard();
        expect(await kycPage.isKycVisible()).toBe(true);
        await kycPage.completeAllCategories();
        await app.goBack().catch(() => undefined);
        await app.logout();

        await app.loginAs(data.seedCustomer('eligibleCustomer'));
        expect(await homePage.isFollowUpCardVisible(3000)).toBe(false);
        expect(await homePage.isCompleteDataCardVisible(3000)).toBe(false);
      }
    );

    test(
      '[11893] Customer App / Customer / Home_ Uncompleted loans widget is shown and opens the loan',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.home,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11893' },
      async ({ app, data, homePage, myPaymentsPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        expect(await homePage.isLoanSummaryCardVisible()).toBe(true);
        await homePage.swipeAdBannerLeft();
        if (await homePage.isCompleteNextInstallmentVisible()) {
          await homePage.clickOnCompleteNextInstallmentButton();
          expect(await myPaymentsPage.isMyPaymentsVisible()).toBe(true);
        }
        manualCheck('one widget page per uncompleted loan from GET Loans/GetAllUnComplete');
        await app.logout();
        await app.loginAs(data.seedCustomer('eligibleCustomer'));
        expect(await homePage.isLoanSummaryCardVisible(3000)).toBe(false);
      }
    );

    test(
      '[11894] Customer App / Customer / Home_ Ads and banners are shown as in the current implementation',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.home,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11894' },
      async ({ app, data, homePage, visual }) => {
        await app.ensureLoggedIn(data.customer());
        expect(await visual.matchesBaseline('05-home-banner-1')).toBe(true);
        await homePage.swipeAdBannerLeft();
        expect(await visual.matchesBaseline('05-home-banner-2')).toBe(true);
        await homePage.swipeAdBannerLeft();
        expect(await visual.matchesBaseline('05-home-banner-3')).toBe(true);
        expect(await homePage.isHomeVisible()).toBe(true);
        manualCheck('three banners with the listed EN titles and the page indicator moving; Arabic run (E2E_LANG=ar) shows Arabic banners');
      }
    );

    test(
      '[11895] Customer App / Customer / Home_ Back on home does not leave to login and app resume refreshes the data',
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.home,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11895' },
      async ({ app, data, mobile, homePage, bottomNav }) => {
        await mobile.require('back');
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToPayments();
        await mobile.pressBack();
        expect(await homePage.isHomeVisible()).toBe(true);

        await mobile.pressBack();
        expect(await homePage.isExitDialogVisible()).toBe(true);
        await homePage.clickOnExitCancelButton();
        expect(await homePage.isHomeVisible()).toBe(true);

        await mobile.pressBack();
        await homePage.clickOnExitConfirmButton();
        await mobile.activateApp();
        expect(await homePage.isHomeVisible()).toBe(true);

        await mobile.backgroundFor(5);
        manualCheck('QA changes the request status in admin while the app is in background');
        await homePage.pullToRefresh();
        expect(await homePage.isHomeVisible()).toBe(true);
      }
    );
  });

  describe('02 · Home Summary Card', () => {
    test(
      '[11887] Customer App / Customer / Home Summary Card_ Summary card matches Figma (Total Amount Requested, Paid, Remaining, Overdue Payment, Go to Payments)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.home,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11887' },
      async ({ app, data, homePage, bottomNav, myPaymentsPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        expect(await homePage.isLoanSummaryCardVisible()).toBe(true);
        expect(await homePage.areLoanSummaryLabelsVisible()).toBe(true);
        expect(await visual.matchesBaseline('05-home-summary-card')).toBe(true);
        manualCheck('Figma 1449:812 — summary labels Medium 7/15 #FFFFFF, amounts Bold, date SemiBold 10/15');
        await homePage.clickOnGoToPaymentsButton();
        expect(await myPaymentsPage.isMyPaymentsVisible()).toBe(true);
        await bottomNav.goToHome();
      }
    );
  });

  describe('03 · Bottom Navigation', () => {
    test(
      '[11886] Customer App / Customer / Bottom Navigation_ Bottom navigation matches Figma (active Bold 10/15 #0CB5BE, inactive Medium 10/15 #7D8795: Home, Requests, My Payments, More)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.home,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11886' },
      async ({ app, data, bottomNav, visual }) => {
        await app.ensureLoggedIn(data.customer());
        expect(await bottomNav.isBottomNavigationVisible()).toBe(true);
        expect(await visual.matchesBaseline('05-bottom-nav-home', { maskTopPx: 1400 })).toBe(true);
        await bottomNav.goToRequests();
        expect(await visual.matchesBaseline('05-bottom-nav-requests', { maskTopPx: 1400 })).toBe(true);
        await bottomNav.goToPayments();
        expect(await visual.matchesBaseline('05-bottom-nav-payments', { maskTopPx: 1400 })).toBe(true);
        await bottomNav.goToMore();
        expect(await visual.matchesBaseline('05-bottom-nav-more', { maskTopPx: 1400 })).toBe(true);
        manualCheck('Figma 1333:26186 — active Bold 10/15 #0CB5BE, inactive Medium 10/15 #7D8795; label "Payments" vs Figma "My Payments" (deviation)');
      }
    );
  });
});
