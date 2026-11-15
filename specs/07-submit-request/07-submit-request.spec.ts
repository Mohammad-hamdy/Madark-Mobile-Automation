import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';
import { manualCheck } from '@madark/utils/report';

describe('07 · Submit Request', () => {
  describe('01 · Request Financing', () => {
    test(
      '[11907] Customer App / Customer / Request Financing_ Request Financing screen matches Figma (Choose Student 353x60 radius 18, school name SemiBold 13/19.5 #11BFD4, Installment Duration Medium 11/16.5 #6B7280)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.submitRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11907' },
      async ({ app, data, requestFinancingPage, visual }) => {
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), data.seed('institution'));
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
        expect(await requestFinancingPage.isContinueButtonEnabled()).toBe(false);
        expect(await visual.matchesBaseline('07-request-financing-empty')).toBe(true);
        manualCheck('Figma 998:14276 — Choose Student 353x60 radius 18, school name SemiBold 13/19.5 #11BFD4, duration label Medium 11/16.5');
      }
    );

    test(
      '[11908] Customer App / Customer / Request Financing_ Select a Student sheet matches Figma (title Bold 16/24 #0B1736, subtitle Medium 13/19.5 #6B7280)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.submitRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11908' },
      async ({ app, data, requestFinancingPage, visual }) => {
        const inst = data.seed('institution');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), inst);
        expect(await requestFinancingPage.isStudentVisible(data.need(inst.studentName, 'institution.studentName'))).toBe(true);
        expect(await visual.matchesBaseline('07-students-list')).toBe(true);
        manualCheck('build fbb2d4a0 lists the branch students inline (selectable cards) instead of the "Select a Student" sheet in Figma 998:14276');
      }
    );

    test(
      '[11912] Customer App / Customer / Request Financing_ Continue to Next Step button matches Figma (353x60, radius 18, Bold 15/22.5 #FFFFFF)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.submitRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11912' },
      async ({ app, data, requestFinancingPage, visual }) => {
        const inst = data.seed('institution');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), inst);
        expect(await requestFinancingPage.isContinueButtonEnabled()).toBe(false);
        expect(await visual.matchesBaseline('07-continue-disabled')).toBe(true);
        await requestFinancingPage.clickOnStudent(data.need(inst.studentName, 'institution.studentName')).catch(() => undefined);
        await requestFinancingPage.clickOnDurationDropdown();
        await requestFinancingPage.selectFirstDurationOption();
        expect(await requestFinancingPage.isContinueButtonEnabled()).toBe(true);
        expect(await visual.matchesBaseline('07-continue-enabled')).toBe(true);
        manualCheck('label "Continue to next step" vs Figma "Continue to Next Step" casing; 353x60 radius 18 gradient');
      }
    );

    test(
      '[11913] Customer App / Customer / Request Financing_ Arabic RTL request financing and add student screens',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.submitRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11913' },
      async ({ app, data, requestFinancingPage, addStudentPage, visual }) => {
        await app.ensureLoggedIn(data.seedCustomer('eligibleCustomer'));
        await app.switchLanguage('ar');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), data.seed('institution'));
        expect(await visual.matchesBaseline('07-request-financing-rtl')).toBe(true);
        await requestFinancingPage.clickOnAddAnotherStudentButton();
        expect(await addStudentPage.isAddStudentVisible()).toBe(true);
        expect(await visual.matchesBaseline('07-add-student-rtl')).toBe(true);
        manualCheck('Arabic frames 1452:20504 — mirrored layout, IDs and amounts LTR');
        await app.goBack();
        await app.switchLanguage(data.language);
      }
    );

    test(
      '[11916] Customer App / Customer / Request Financing_ Continue is blocked until a student and a duration are selected',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.submitRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11916' },
      async ({ app, data, requestFinancingPage }) => {
        const inst = data.seed('institution');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), inst);
        expect(await requestFinancingPage.isContinueButtonEnabled()).toBe(false);
        await requestFinancingPage.clickOnContinueButton().catch(() => undefined);
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
        await requestFinancingPage.clickOnStudent(data.need(inst.studentName, 'institution.studentName')).catch(() => undefined);
        expect(await requestFinancingPage.isContinueButtonEnabled()).toBe(false);
        await requestFinancingPage.clickOnDurationDropdown();
        await requestFinancingPage.selectFirstDurationOption();
        expect(await requestFinancingPage.isAcademicYearSelected()).toBe(true);
        expect(await requestFinancingPage.isContinueButtonEnabled()).toBe(true);
        manualCheck('requested amount is not customer-entered in build fbb2d4a0 (fees come from the institution)');
      }
    );

    test(
      '[11919] Customer App / Customer / Request Financing_ Back keeps the selected student and duration',
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.submitRequest,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11919' },
      async ({ app, data, requestFinancingPage, kycPage }) => {
        const inst = data.seed('institution');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), inst);
        await requestFinancingPage.clickOnStudent(data.need(inst.studentName, 'institution.studentName')).catch(() => undefined);
        await requestFinancingPage.clickOnDurationDropdown();
        await requestFinancingPage.selectFirstDurationOption();
        const estimate = await requestFinancingPage.getPlanEstimateText();
        await requestFinancingPage.clickOnContinueButton();
        expect(await kycPage.isKycVisible()).toBe(true);
        await app.goBack();
        expect(await requestFinancingPage.isRequestFinancingVisible()).toBe(true);
        expect(await requestFinancingPage.getPlanEstimateText()).toBe(estimate);
        expect(await requestFinancingPage.isContinueButtonEnabled()).toBe(true);
      }
    );
  });

  describe('02 · Add Students', () => {
    test(
      '[11909] Customer App / Customer / Add Students_ Add Students empty state matches Figma (Added Students (0), Add New Student SemiBold 13/19.5 #0DB4BE)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.submitRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11909' },
      async ({ app, data, requestFinancingPage, visual }) => {
        await app.openRequestFinancing(data.seedCustomer('newBranchCustomer'), data.seed('institution'));
        expect(await requestFinancingPage.getAddedStudentsCount()).toBe(0);
        expect(await visual.matchesBaseline('07-add-students-empty')).toBe(true);
        manualCheck('Figma 1296:407 — "Added Students (0)" SemiBold 13/19.5 #364153, Add New Student 358x60.22 #0DB4BE');
      }
    );

    test(
      '[11910] Customer App / Customer / Add Students_ Add Students filled state student card matches Figma (name SemiBold 14/21, ID Bold 12/18, amount Bold 13/19.5 #0DB4BE)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.submitRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11910' },
      async ({ app, data, requestFinancingPage, addStudentPage, visual }) => {
        await app.openRequestFinancing(data.seedCustomer('newBranchCustomer'), data.seed('institution'));
        for (const [i, rel] of (['father', 'mother'] as const).entries()) {
          await requestFinancingPage.clickOnAddAnotherStudentButton();
          await addStudentPage.enterStudentName(`E2E Student ${i + 1}`);
          await addStudentPage.enterStudentId(data.nationalId());
          await addStudentPage.clickOnRelationshipDropdown();
          await addStudentPage.selectRelationshipOption(rel);
          await addStudentPage.clickOnAddButton();
        }
        expect(await requestFinancingPage.getAddedStudentsCount()).toBe(2);
        expect(await visual.matchesBaseline('07-add-students-filled')).toBe(true);
        manualCheck('Figma 1296:263 — student card name SemiBold 14/21, ID Bold 12/18, amount Bold 13/19.5 #0DB4BE');
      }
    );

    test(
      '[11917] Customer App / Customer / Add Students_ Total Amount for Students equals the sum of the requested amount of every added student',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.submitRequest,
      Tag.type.functional,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11917', blocked: 'not in build fbb2d4a0 — the requested amount per student is not entered by the customer (fees come from the institution), so totals cannot be edited' },
      async () => {}
    );
  });

  describe('03 · Add Student', () => {
    test(
      '[11911] Customer App / Customer / Add Student_ Add Student form matches Figma (section label SemiBold 12/18 ls 0.8 #6B7B8D, academic year and relationship dropdowns)',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p2,
      Tag.module.submitRequest,
      Tag.type.ui,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11911' },
      async ({ app, data, requestFinancingPage, addStudentPage, visual }) => {
        await app.openRequestFinancing(data.seedCustomer('newBranchCustomer'), data.seed('institution'));
        await requestFinancingPage.clickOnAddAnotherStudentButton();
        expect(await addStudentPage.isAddStudentVisible()).toBe(true);
        expect(await addStudentPage.isFormSectionVisible()).toBe(true);
        expect(await visual.matchesBaseline('07-add-student-form')).toBe(true);
        manualCheck('academic year is read-only in build fbb2d4a0 (request-level, auto-selected) — no academic year dropdown to open');
        await addStudentPage.clickOnRelationshipDropdown();
        expect(await visual.matchesBaseline('07-add-student-relationship')).toBe(true);
        manualCheck('Figma 1046:466 / 1039:889 — section label SemiBold 12/18 ls 0.8 #6B7B8D, field 361x67');
      }
    );

    test(
      '[11918] Customer App / Customer / Add Student_ Add student validates ID, name, academic year and relationship',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.submitRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11918' },
      async ({ app, data, requestFinancingPage, addStudentPage }) => {
        await app.openRequestFinancing(data.seedCustomer('newBranchCustomer'), data.seed('institution'));
        await requestFinancingPage.clickOnAddAnotherStudentButton();
        await addStudentPage.enterStudentIdKeys('1');
        await addStudentPage.clearStudentId();
        expect(await addStudentPage.isIdRequiredErrorVisible()).toBe(true);
        await addStudentPage.enterStudentIdKeys('3');
        await addStudentPage.enterStudentIdKeys('ab');
        await addStudentPage.enterStudentId(`${data.nationalId()}9`);
        expect((await addStudentPage.getStudentId()).length).toBeLessThanOrEqual(10);
        const firstId = data.nationalId();
        await addStudentPage.enterStudentId(firstId);
        await addStudentPage.enterStudentName('E2E Student');
        await addStudentPage.clickOnRelationshipDropdown();
        await addStudentPage.selectRelationshipOption('father');
        await addStudentPage.clickOnAddButton();
        await requestFinancingPage.clickOnAddAnotherStudentButton();
        await addStudentPage.enterStudentId(firstId);
        expect(await addStudentPage.isSameIdErrorVisible()).toBe(true);
        manualCheck('academic year is request-level and auto-selected in build fbb2d4a0');
        expect(await addStudentPage.isFormSectionVisible()).toBe(true);
      }
    );
  });

  describe('04 · Installment Duration', () => {
    test(
      '[11915] Customer App / Customer / Installment Duration_ Tenor options start at 3 months and the maximum is the lower of branch and customer maximum',
      Tag.Corner,
      Tag.regression,
      Tag.e2e,
      Tag.smoke,
      Tag.p0,
      Tag.module.submitRequest,
      Tag.type.functional,
      Tag.type.boundary,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11915' },
      async ({ app, data, requestFinancingPage }) => {
        const inst = data.seed('institution');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), inst);
        await requestFinancingPage.clickOnDurationDropdown();
        const optionsA = await requestFinancingPage.getDurationOptions();
        expect(Math.min(...optionsA)).toBe(3);
        await app.goBack();
        const branchB = data.need(inst.secondBranch, 'institution.secondBranch');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), branchB);
        await requestFinancingPage.clickOnDurationDropdown();
        const optionsB = await requestFinancingPage.getDurationOptions();
        expect(Math.min(...optionsB)).toBe(3);
        manualCheck(`last options (A=${Math.max(...optionsA)}, B=${Math.max(...optionsB)}) equal GET LoanApplication/GetInstallmentPlans`);
      }
    );
  });

  describe('05 · Submit Request', () => {
    test(
      '[11914] Customer App / Customer / Submit Request_ Customer submits a new request end to end and it appears in My Requests as Under review',
      Tag.Happy,
      Tag.regression,
      Tag.e2e,
      Tag.p0,
      Tag.module.submitRequest,
      Tag.type.functional,
      Tag.type.integration,
      Tag.type.regression,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11914' },
      async ({ app, data, kycPage, myRequestsPage, requestFinancingPage }) => {
        const inst = data.seed('institution');
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), inst);
        await requestFinancingPage.clickOnStudent(data.need(inst.studentName, 'institution.studentName')).catch(() => undefined);
        await requestFinancingPage.clickOnDurationDropdown();
        await requestFinancingPage.selectFirstDurationOption();
        expect(await requestFinancingPage.isPlanEstimateVisible()).toBe(true);
        await requestFinancingPage.clickOnContinueButton();
        expect(await kycPage.isKycVisible()).toBe(true);
        await kycPage.completeAllCategories();
        await kycPage.checkSimah();
        await kycPage.clickOnConfirmButton();
        expect(await kycPage.isSuccessVisible()).toBe(true);
        await kycPage.clickOnBackToRequestsButton();
        expect(await myRequestsPage.isMyRequestsVisible()).toBe(true);
        await myRequestsPage.clickOnUnderReviewTab();
        expect(await myRequestsPage.hasRequestCards()).toBe(true);
      }
    );

    test(
      '[11920] Customer App / Customer / Submit Request_ Network loss on submit does not create a duplicate request',
      Tag.Negative,
      Tag.regression,
      Tag.e2e,
      Tag.p1,
      Tag.module.submitRequest,
      Tag.type.functional,
      { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11920' },
      async ({ app, data, mobile, kycPage, myRequestsPage }) => {
        await app.openRequestFinancing(data.seedCustomer('eligibleCustomer'), data.seed('institution'));
        await app.continueToKyc(data.seed('institution').studentName);
        await kycPage.completeAllCategories();
        await kycPage.checkSimah();
        await mobile.setAirplaneMode(true);
        await kycPage.clickOnConfirmButton();
        expect(await kycPage.isConnectionErrorVisible()).toBe(true);
        expect(await kycPage.isSuccessVisible(3000)).toBe(false);
        await mobile.setAirplaneMode(false);
        await kycPage.clickOnConfirmButton();
        expect(await kycPage.isSuccessVisible()).toBe(true);
        await kycPage.clickOnBackToRequestsButton();
        expect(await myRequestsPage.isMyRequestsVisible()).toBe(true);
        manualCheck('exactly one new request in My Requests / back office after the offline attempt');
      }
    );
  });
});
