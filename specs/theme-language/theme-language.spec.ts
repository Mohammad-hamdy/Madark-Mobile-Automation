import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('ThemeLanguage', () => {
  test(
    '[12043] Customer App / Customer / Typography_ Revamped screens use Plus Jakarta Sans with the Figma type scale',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.themeLanguage,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12043', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12044] Customer App / Customer / Arabic_ Every revamped screen in Arabic matches the Figma Arabic Conversion frames',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.themeLanguage,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12044', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12045] Customer App / Customer / Dark Mode_ Dark mode login matches Figma (secondary text #A1ACC3, disabled button #A1ACC3 80%, Back to Login #0B8BA3)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.themeLanguage,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12045', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12046] Customer App / Customer / Dark Mode_ Dark mode home matches Figma',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.themeLanguage,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12046', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12047] Customer App / Customer / Accessibility_ Largest system font size does not cut or overlap text',
    Tag.Corner,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.themeLanguage,
    Tag.type.ui,
    Tag.type.boundary,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12047', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12048] Customer App / Customer / Touch Targets_ Tap areas match the Figma sizes (back button 38x38, primary button 299.79x53.99 / 353x60, OTP box 46x61)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.themeLanguage,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12048', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12049] Customer App / Customer / Colour Palette_ Text, button and status colours match the Figma palette exactly',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.themeLanguage,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12049', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[12050] Customer App / Customer / Screen Sizes_ Revamped screens fit small, large and tablet screens',
    Tag.Corner,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.themeLanguage,
    Tag.type.ui,
    Tag.type.boundary,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12050', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12051] Customer App / Customer / Platforms_ iOS and Android show the same revamped design',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.themeLanguage,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12051', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12052] Customer App / Customer / Language_ Language switch from More applies at once and persists after restart',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.smoke,
    Tag.p0,
    Tag.module.themeLanguage,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12052', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12053] Customer App / Customer / Language_ Numbers, dates and SAR amounts follow the app language',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.themeLanguage,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12053', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12054] Customer App / Customer / Language_ First launch defaults to Arabic',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.themeLanguage,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12054', blocked: 'not implemented yet' },
    async () => {}
  );
});
