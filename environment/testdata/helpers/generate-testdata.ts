import 'tsconfig-paths/register';
import { TestdataHelper } from '@madark/environment/testdata/helpers/testdata.helper';
import { envName } from '@madark/environment';

TestdataHelper.generate(envName());
