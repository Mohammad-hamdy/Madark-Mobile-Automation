import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('SubmitRequest', () => {
  test(
    '[11907] Customer App / Customer / Request Financing_ Request Financing screen matches Figma (Choose Student 353x60 radius 18, school name SemiBold 13/19.5 #11BFD4, Installment Duration Medium 11/16.5 #6B7280)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.submitRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11907', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11908] Customer App / Customer / Request Financing_ Select a Student sheet matches Figma (title Bold 16/24 #0B1736, subtitle Medium 13/19.5 #6B7280)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.submitRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11908', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11909] Customer App / Customer / Add Students_ Add Students empty state matches Figma (Added Students (0), Add New Student SemiBold 13/19.5 #0DB4BE)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.submitRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11909', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11910] Customer App / Customer / Add Students_ Add Students filled state student card matches Figma (name SemiBold 14/21, ID Bold 12/18, amount Bold 13/19.5 #0DB4BE)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.submitRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11910', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11911] Customer App / Customer / Add Student_ Add Student form matches Figma (section label SemiBold 12/18 ls 0.8 #6B7B8D, academic year and relationship dropdowns)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.submitRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11911', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11912] Customer App / Customer / Request Financing_ Continue to Next Step button matches Figma (353x60, radius 18, Bold 15/22.5 #FFFFFF)',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.submitRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11912', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11913] Customer App / Customer / Request Financing_ Arabic RTL request financing and add student screens',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.submitRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11913', blocked: 'not implemented yet' },
    async () => {}
  );

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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11914', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );

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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11915', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11916] Customer App / Customer / Request Financing_ Continue is blocked until a student and a duration are selected',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.submitRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11916', blocked: 'not implemented yet' },
    async () => {}
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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11917', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11918] Customer App / Customer / Add Student_ Add student validates ID, name, academic year and relationship',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.submitRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11918', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11919] Customer App / Customer / Request Financing_ Back keeps the selected student and duration',
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.submitRequest,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11919', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11920] Customer App / Customer / Submit Request_ Network loss on submit does not create a duplicate request',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.submitRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11920', blocked: 'needs seeded data/mocks: External-service' },
    async () => {}
  );
});
