import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('21 · App States', () => {
  describe('01 · App States', () => {
    test(
      '[12037] Customer App / Customer / App States_ No internet, maintenance and force update screens keep the current messages in the Figma revamp style',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.appStates,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12037' },
      async ({ app, data, mobile, bottomNav, appStatesPage, visual }) => {
        await app.ensureLoggedIn(data.customer());
        await mobile.setAirplaneMode(true);
        await bottomNav.goToPayments();
        expect(await appStatesPage.isConnectivityErrorVisible()).toBe(true);
        expect(await visual.matchesBaseline('21-no-internet')).toBe(true);
        await mobile.setAirplaneMode(false);
        manualCheck('maintenance and force update screens need remote-config changes by QA (see 21 · Maintenance / Force Update)');
      }
    );
  });

  describe('02 · No Internet', () => {
    test(
      '[12038] Customer App / Customer / No Internet_ No internet screen shows and retry restores the screen',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.appStates,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12038' },
      async ({ app, data, mobile, bottomNav, myPaymentsPage, appStatesPage }) => {
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToPayments();
        await mobile.setWifi(false).catch(() => undefined);
        await mobile.setMobileData(false).catch(() => undefined);
        await myPaymentsPage.pullToRefresh();
        expect(await appStatesPage.isNoInternetVisible()).toBe(true);
        await appStatesPage.clickOnRetryButton();
        expect(await appStatesPage.isNoInternetVisible()).toBe(true);
        await mobile.restoreDefaults();
        await appStatesPage.clickOnRetryButton();
        expect(await myPaymentsPage.isMyPaymentsVisible()).toBe(true);
      }
    );
  });

  describe('03 · Connection Error', () => {
    test(
      '[12039] Customer App / Customer / Connection Error_ API connection error shows A connection error occurred, please try again',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.appStates,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12039', blocked: 'needs QA to fail LoanApplication/CheckNationalIdExpiry through a proxy rule, then remove it' },
      async () => {}
    );
  });

  describe('04 · Maintenance', () => {
    test(
      '[12040] Customer App / Customer / Maintenance_ Maintenance mode shows the maintenance screen',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.appStates,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12040', blocked: 'needs QA to switch maintenance mode on/off in remote config (Firebase)' },
      async () => {}
    );
  });

  describe('05 · Force Update', () => {
    test(
      '[12041] Customer App / Customer / Force Update_ Older app version shows the force update prompt',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.appStates,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12041', blocked: 'needs QA to set the force-update minimum version in remote config above the installed build' },
      async () => {}
    );
  });

  describe('06 · App Lifecycle', () => {
    test(
      '[12042] Customer App / Customer / App Lifecycle_ Background and resume keep the current screen and data',
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.appStates,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12042' },
      async ({ app, data, mobile, bottomNav, myPaymentsPage, homePage, morePage, editProfilePage, splashPage }) => {
        await app.ensureLoggedIn(data.seedCustomer('customerWithLoan'));
        await bottomNav.goToPayments();
        const before = await myPaymentsPage.getLoanCardText();
        await mobile.backgroundFor(60);
        expect(await splashPage.isSplashVisible(2000)).toBe(false);
        expect(await myPaymentsPage.isMyPaymentsVisible()).toBe(true);
        expect(await myPaymentsPage.getLoanCardText()).toBe(before);
        await bottomNav.goToMore();
        await morePage.clickOnEditProfileLink();
        expect(await editProfilePage.isEditProfileVisible()).toBe(true);
        await mobile.backgroundFor(60);
        expect(await editProfilePage.isEditProfileVisible()).toBe(true);
        await app.goBack();
        await bottomNav.goToHome();
        expect(await homePage.isHomeVisible()).toBe(true);
      }
    );
  });
});
