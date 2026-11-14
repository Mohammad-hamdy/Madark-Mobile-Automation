import { test } from '@madark/fixtures/test.fixture';
import { Tag } from '@madark/utils/tag';

describe('AppStates', () => {
  test(
    '[12037] Customer App / Customer / App States_ No internet, maintenance and force update screens keep the current messages in the Figma revamp style',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.appStates,
    Tag.type.ui,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12037', blocked: 'not implemented yet' },
    async () => {}
  );

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
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12038', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12039] Customer App / Customer / Connection Error_ API connection error shows A connection error occurred, please try again',
    Tag.Negative,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.appStates,
    Tag.type.functional,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12039', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12040] Customer App / Customer / Maintenance_ Maintenance mode shows the maintenance screen',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.appStates,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12040', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12041] Customer App / Customer / Force Update_ Older app version shows the force update prompt',
    Tag.Happy,
    Tag.regression,
    Tag.e2e,
    Tag.p1,
    Tag.module.appStates,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12041', blocked: 'not implemented yet' },
    async () => {}
  );

  test(
    '[12042] Customer App / Customer / App Lifecycle_ Background and resume keep the current screen and data',
    Tag.regression,
    Tag.e2e,
    Tag.p2,
    Tag.module.appStates,
    Tag.type.functional,
    Tag.type.regression,
    { adoUrl: 'https://dev.azure.com/Madark/Madarak-Backlog/_workitems/edit/12042', blocked: 'not implemented yet' },
    async () => {}
  );
});
