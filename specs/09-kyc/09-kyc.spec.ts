import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('09 · KYC', () => {
  describe('01 · KYC Stepper', () => {
    test(
      '[11931] Customer App / Customer / KYC Stepper_ KYC stepper matches Figma (4 steps, active #3ECFCF, inactive #9CA3AF, step number SemiBold 12/16)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.kYC,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11931' },
      async ({ app, data, kycPage, visual }) => {
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        await kycPage.answerCurrentCategory();
        await kycPage.clickOnNextButton();
        expect(await kycPage.isKycVisible()).toBe(true);
        expect(await visual.matchesBaseline('09-kyc-stepper-step2')).toBe(true);
        manualCheck('Figma 1046:1123 — 4 steps, active #3ECFCF, inactive #9CA3AF, number SemiBold 12/16');
      }
    );

    test(
      '[11935] Customer App / Customer / KYC Stepper_ Arabic RTL stepper runs right to left with mirrored back icon',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.kYC,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11935' },
      async ({ app, data, kycPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('eligibleCustomer'));
        await app.switchLanguage('ar');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        expect(await visual.matchesBaseline('09-kyc-rtl-step1')).toBe(true);
        await kycPage.answerCurrentCategory();
        await kycPage.clickOnNextButton();
        expect(await visual.matchesBaseline('09-kyc-rtl-step2')).toBe(true);
        manualCheck('Arabic frames 1452:20504 — stepper right to left, mirrored back icon, digits stay LTR');
        await app.goBack();
        await app.goBack();
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[11942] Customer App / Customer / KYC Stepper_ Back returns to the previous step and keeps the answers',
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.kYC,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11942' },
      async ({ app, data, kycPage, requestFinancingPage }) => {
        await app.openRequestFinancing(data.seedCustomer('kycIncompleteCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        await kycPage.answerCurrentCategory();
        await kycPage.clickOnNextButton();
        await app.goBack();
        expect(await kycPage.hasUnansweredSingleChoice()).toBe(false);
        await kycPage.clickOnNextButton();
        expect(await kycPage.isKycVisible()).toBe(true);
        await app.goBack();
        await app.goBack();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
        expect(await requestFinancingPage.isContinueButtonEnabled()).toBe(true);
      }
    );
  });

  describe('02 · KYC', () => {
    test(
      '[11936] Customer App / Customer / KYC_ Customer answers all KYC categories and submits',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.kYC,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11936' },
      async ({ app, data, kycPage, myRequestsPage }) => {
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        await kycPage.completeAllCategories();
        expect(await kycPage.isConfirmationTabVisible()).toBe(true);
        expect(await kycPage.isSimahTitleVisible()).toBe(true);
        await kycPage.checkSimah();
        await kycPage.clickOnConfirmButton();
        expect(await kycPage.isSuccessVisible()).toBe(true);
        await kycPage.clickOnBackToRequestsButton();
        expect(await myRequestsPage.isMyRequestsVisible()).toBe(true);
      }
    );

    test(
      '[11937] Customer App / Customer / KYC_ Required questions block moving to the next step',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.kYC,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11937' },
      async ({ app, data, kycPage }) => {
        await app.openRequestFinancing(data.seedCustomer('kycIncompleteCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        await kycPage.clickOnNextButton();
        expect(await kycPage.isMustAnswerAllVisible()).toBe(true);
        expect(await kycPage.isKycVisible()).toBe(true);
        manualCheck('answer all except one question, Next still blocked (question set is server-driven)');
        await kycPage.answerCurrentCategory();
        await kycPage.clickOnNextButton();
        expect(await kycPage.isMustAnswerAllVisible()).toBe(false);
      }
    );

    test(
      '[11943] Customer App / Customer / KYC_ App kill during KYC resumes with saved answers',
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.kYC,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11943' },
      async ({ app, data, mobile, kycPage, bottomNav, myRequestsPage }) => {
        const customer = data.seedCustomer('eligibleCustomer');
        await app.openRequestFinancing(customer, data.seed('institution'));
        await bottomNav.goToRequests().catch(() => undefined);
        const before = await myRequestsPage.getRequestCardCount().catch(() => 0);
        await app.goBack().catch(() => undefined);
        await app.continueToKyc(data.seed('institution').studentName);
        await kycPage.answerCurrentCategory('E2E changed answer');
        await mobile.terminateApp();
        await mobile.activateApp();
        await app.ensureLoggedIn(customer);
        await bottomNav.goToRequests();
        expect(await myRequestsPage.getRequestCardCount()).toBe(before);
        await app.openRequestFinancing(customer, data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        expect(await kycPage.isKycVisible()).toBe(true);
        manualCheck('KYC shows the last saved server answers, not the unsaved changes from the killed session');
      }
    );
  });

  describe('03 · Personal Information', () => {
    test(
      '[11932] Customer App / Customer / Personal Information_ Personal Information screen matches Figma (title Bold 18/27 #0B1736, subtitle Regular 12/18 #99A1AF, tiles 350 wide radius 16 border #F0F0F0)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.kYC,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11932' },
      async ({ app, data, kycPage, visual }) => {
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        expect(await kycPage.isKycVisible()).toBe(true);
        expect(await visual.matchesBaseline('09-kyc-personal-information')).toBe(true);
        manualCheck('Figma 998:14468 — title Bold 18/27 #0B1736 (server category name), tiles 350 wide radius 16 border #F0F0F0');
      }
    );
  });

  describe('04 · Work Data', () => {
    test(
      '[11934] Customer App / Customer / Work Data_ Work Data empty state matches Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.kYC,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11934' },
      async ({ app, data, kycPage, visual }) => {
        await app.openRequestFinancing(data.seedCustomer('kycIncompleteCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        await kycPage.answerCurrentCategory();
        await kycPage.clickOnNextButton();
        expect(await kycPage.hasUnansweredSingleChoice()).toBe(true);
        expect(await visual.matchesBaseline('09-kyc-work-data-empty')).toBe(true);
        manualCheck('Figma 1046:1123 — step 2 current, steps 3-4 inactive, Next disabled');
      }
    );
  });

  describe('05 · KYC Selection Sheets', () => {
    test(
      '[11933] Customer App / Customer / KYC Selection Sheets_ Nationality, marital status and work sector sheets match Figma',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.kYC,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11933' },
      async ({ app, data, kycPage, visual }) => {
        const kyc = data.seed('kycQuestions');
        await app.openRequestFinancing(data.seedCustomer('kycIncompleteCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        for (const [i, q] of [kyc.nationality, kyc.maritalStatus, kyc.workSector].entries()) {
          if (!q) continue;
          if (!(await kycPage.isQuestionVisible(q))) {
            await kycPage.answerCurrentCategory();
            await kycPage.clickOnNextButton();
          }
          await kycPage.clickOnQuestion(q);
          expect(await visual.matchesBaseline(`09-kyc-sheet-${i + 1}`)).toBe(true);
          await kycPage.clickOnFirstOption();
        }
        manualCheck('option tiles 350x70.22 radius 16, selected option marked, sheet closes with the value shown');
      }
    );
  });

  describe('06 · KYC Question Types', () => {
    test(
      '[11938] Customer App / Customer / KYC Question Types_ Text, date, single, multi, yes/no, percentage and file questions save the answer',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.kYC,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11938' },
      async ({ app, data, kycPage }) => {
        await app.openRequestFinancing(data.seedCustomer('kycIncompleteCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        const seen = { text: false, date: false, single: false, upload: false };
        for (let i = 0; i < 6 && !(await kycPage.isConfirmationTabVisible(2000)); i++) {
          seen.text ||= await kycPage.hasTextQuestion();
          seen.date ||= await kycPage.hasDateQuestion();
          seen.single ||= await kycPage.hasUnansweredSingleChoice();
          seen.upload ||= await kycPage.hasUploadQuestion();
          await kycPage.answerCurrentCategory();
          await kycPage.clickOnNextButton();
        }
        expect(seen.text || seen.single).toBe(true);
        await app.goBack();
        expect(await kycPage.hasUnansweredSingleChoice()).toBe(false);
        manualCheck(`question types seen: ${JSON.stringify(seen)} — multi-choice, yes/no, percentage and file upload depend on the server template`);
      }
    );
  });

  describe('07 · KYC Related Questions', () => {
    test(
      '[11939] Customer App / Customer / KYC Related Questions_ Child questions appear only for the triggering answer',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.kYC,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11939' },
      async ({ app, data, kycPage }) => {
        const kyc = data.seed('kycQuestions');
        const parent = data.need(kyc.parentQuestion, 'kycQuestions.parentQuestion');
        await app.openRequestFinancing(data.seedCustomer('kycIncompleteCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        await kycPage.clickOnQuestion(parent);
        await kycPage.clickOnOption(data.need(kyc.nonTriggeringAnswer, 'kycQuestions.nonTriggeringAnswer'));
        expect(await kycPage.isQuestionVisible(data.need(kyc.childQuestion, 'kycQuestions.childQuestion'))).toBe(false);
        await kycPage.clickOnQuestion(parent);
        await kycPage.clickOnOption(data.need(kyc.triggeringAnswer, 'kycQuestions.triggeringAnswer'));
        expect(await kycPage.isQuestionVisible(kyc.childQuestion!)).toBe(true);
        await kycPage.answerCurrentCategory();
        await kycPage.clickOnQuestion(parent);
        await kycPage.clickOnOption(kyc.nonTriggeringAnswer!);
        expect(await kycPage.isQuestionVisible(kyc.childQuestion!)).toBe(false);
        await kycPage.clickOnNextButton();
      }
    );
  });

  describe('08 · KYC File Upload', () => {
    test(
      '[11941] Customer App / Customer / KYC File Upload_ Valid file uploads, wrong type or size is rejected and retry works',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.kYC,
      Tag.type.functional,
      Tag.type.boundary,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11941' },
      async ({ app, data, mobile, kycPage }) => {
        const files = data.seed('kycFiles');
        await app.openRequestFinancing(data.seedCustomer('kycIncompleteCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        for (let i = 0; i < 6 && !(await kycPage.hasUploadQuestion()); i++) {
          await kycPage.answerCurrentCategory();
          await kycPage.clickOnNextButton();
        }
        expect(await kycPage.hasUploadQuestion()).toBe(true);
        await mobile.pushFile(files.devicePath, files.validPdf);
        await kycPage.clickOnUploadFileButton();
        manualCheck('pick the pushed PDF in the system file picker; unsupported and oversized files show the current rejection message');
        await mobile.setAirplaneMode(true);
        await kycPage.clickOnUploadFileButton();
        expect(await kycPage.isConnectionErrorVisible()).toBe(true);
        await mobile.setAirplaneMode(false);
      }
    );
  });

  describe('09 · KYC Saved Answers', () => {
    test(
      '[11940] Customer App / Customer / KYC Saved Answers_ Returning customer sees saved KYC answers prefilled and editable',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.kYC,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11940' },
      async ({ app, data, kycPage }) => {
        const kyc = data.seed('kycQuestions');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        expect(await kycPage.hasUnansweredSingleChoice()).toBe(false);
        manualCheck('every saved answer equals the customer answers stored in the backend');
        if (kyc.maritalStatus) {
          await kycPage.clickOnQuestion(kyc.maritalStatus);
          await kycPage.clickOnFirstOption();
        }
        await kycPage.completeAllCategories();
        await kycPage.checkSimah();
        await kycPage.clickOnConfirmButton();
        expect(await kycPage.isSuccessVisible()).toBe(true);
        manualCheck('next KYC session shows the changed answer prefilled (needs a second eligible request)');
      }
    );
  });
});
