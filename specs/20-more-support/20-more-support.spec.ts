import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('20 · More & Support', () => {
  describe('01 · More', () => {
    test(
      '[12031] Customer App / Customer / More_ More menu matches Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.moreSupport,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12031' },
      async ({ app, data, bottomNav, morePage, visual }) => {
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToMore();
        expect(await morePage.isAccountSectionVisible()).toBe(true);
        expect(await visual.matchesBaseline('20-more-top')).toBe(true);
        expect(await morePage.areMenuItemsVisible()).toBe(true);
        expect(await morePage.isVersionVisible()).toBe(true);
        expect(await visual.matchesBaseline('20-more-bottom')).toBe(true);
        manualCheck('Figma 998:12162 — Plus Jakarta Sans everywhere, item title colours');
      }
    );

    test(
      '[12032] Customer App / Customer / More_ More items open About, Sharia, FAQ, Privacy, Terms and Contact Us',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.moreSupport,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12032' },
      async ({ app, data, bottomNav, morePage, legalContentPage, contactUsPage }) => {
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToMore();
        await morePage.clickOnAboutAppItem();
        expect(await legalContentPage.hasContent()).toBe(true);
        await app.goBack();
        await morePage.clickOnShariahItem();
        expect(await legalContentPage.isShariahVisible()).toBe(true);
        await app.goBack();
        await morePage.clickOnHelpFaqItem();
        expect(await legalContentPage.hasContent()).toBe(true);
        await app.goBack();
        await morePage.clickOnPrivacyItem();
        expect(await legalContentPage.isPrivacyVisible()).toBe(true);
        await app.goBack();
        await morePage.clickOnTermsOfUseItem();
        expect(await legalContentPage.isTermsOfUseVisible()).toBe(true);
        await app.goBack();
        await morePage.clickOnTermsItem();
        expect(await legalContentPage.isTermsVisible()).toBe(true);
        await app.goBack();
        await morePage.clickOnContactUsItem();
        expect(await contactUsPage.isContactUsVisible()).toBe(true);
        await app.goBack();
      }
    );
  });

  describe('02 · Contact Us', () => {
    test(
      '[12033] Customer App / Customer / Contact Us_ Contact channels open phone, email and social links',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.moreSupport,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12033' },
      async ({ app, data, mobile, bottomNav, morePage, contactUsPage }) => {
        const ch = data.seed('contactChannels');
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToMore();
        await morePage.clickOnContactUsItem();
        expect(await contactUsPage.isContactUsVisible()).toBe(true);
        for (const value of [ch.phone, ch.email]) {
          expect(await contactUsPage.isChannelVisible(value)).toBe(true);
          await contactUsPage.clickOnChannel(value);
          manualCheck(`${value} opens the dialer / mail app with the value filled in (system app)`);
          await mobile.activateApp();
        }
        manualCheck('Instagram, X and LinkedIn icons open the Madark pages (icons have no text)');
      }
    );
  });

  describe('03 · Complaint', () => {
    test(
      '[12034] Customer App / Customer / Complaint_ Complaint needs a category and returns a complaint code',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.moreSupport,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12034' },
      async ({ app, data, bottomNav, morePage, contactUsPage }) => {
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToMore();
        await morePage.clickOnContactUsItem();
        await contactUsPage.clickOnSubmitComplaintLink();
        expect(await contactUsPage.isComplaintFormVisible()).toBe(true);
        await contactUsPage.clickOnSubmitButton();
        expect(await contactUsPage.isCategoryRequiredVisible()).toBe(true);
        await contactUsPage.clickOnCategoryDropdown();
        await contactUsPage.selectFirstOption();
        await contactUsPage.clickOnSubcategoryDropdown();
        await contactUsPage.selectFirstOption();
        await contactUsPage.enterDescription('short');
        expect(await contactUsPage.isDescriptionTooShortVisible()).toBe(true);
        await contactUsPage.enterDescription('E2E complaint description text');
        manualCheck('attach the JPG through the system picker');
        await contactUsPage.clickOnSubmitButton();
        expect(await contactUsPage.isSubmittedVisible()).toBe(true);
      }
    );

    test(
      '[12035] Customer App / Customer / Complaint_ Complaint categories failure shows Failed to load complaint categories',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.moreSupport,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12035', blocked: 'needs QA to block GET Complaint/categories/lookup (proxy) and then remove the block' },
      async () => {}
    );
  });

  describe('04 · Share App', () => {
    test(
      '[12036] Customer App / Customer / Share App_ Share app opens the share sheet',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p3,
      Tag.module.moreSupport,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12036' },
      async ({ app, data, mobile, bottomNav, morePage }) => {
        await app.ensureLoggedIn(data.customer());
        await bottomNav.goToMore();
        await morePage.clickOnShareAppItem();
        manualCheck('native share sheet text starts with "حمّل تطبيق مدارك الآن:" with Android and iOS links (system UI)');
        await mobile.activateApp();
        await bottomNav.goToMore();
        expect(await morePage.isLogoutButtonVisible()).toBe(true);
      }
    );
  });
});
