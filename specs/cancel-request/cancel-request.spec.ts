import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('CancelRequest', () => {
  test(
    '[11975] Customer App / Customer / Cancel Request_ Cancel confirmation uses the Figma Cancel Request style (title ExtraBold 20/30, body Regular 14/23.1 #7D8795, Dismiss SemiBold 16/24 #0F2340, Continue Bold 16/24 #FFFFFF) with the current confirmation text',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.cancelRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11975', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11976] Customer App / Customer / Cancel Success_ Cancel success uses the Figma style (title ExtraBold 24/30 #0F2340) with the current message Request canceled successfully',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.cancelRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11976', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11977] Customer App / Customer / Cancel Failed_ Cancel failure uses the Figma style (title ExtraBold 24/36 #0F2340) with the current message Failed to cancel the request. Please try again.',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.cancelRequest,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11977', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11978] Customer App / Customer / Cancel Request_ Customer cancels an eligible request and it moves to Cancelled',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.cancelRequest,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11978', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11979] Customer App / Customer / Cancel Request_ Cancel is offered only for cancellable statuses',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p0,
    Tag.module.cancelRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11979', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11980] Customer App / Customer / Cancel Request_ Dismiss closes the sheet and the request is unchanged',
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.cancelRequest,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11980', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[11981] Customer App / Customer / Cancel Request_ Cancellation API failure shows the failure message and Try Again works',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.cancelRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11981', blocked: 'needs seeded data/mocks: Backend-state' },
    async () => {}
  );

  test(
    '[11982] Customer App / Customer / Cancel Success_ Create New Request after cancellation opens a new request',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.cancelRequest,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/11982', blocked: 'not implemented yet' },
    async () => {}
  );
});
