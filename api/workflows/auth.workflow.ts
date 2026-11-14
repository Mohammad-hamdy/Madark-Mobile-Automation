import { ApiClient } from '@madark/api/client';
import { AuthService } from '@madark/api/services/auth.service';
import { ResponseAssert } from '@madark/api/builders/response.assert';
import {
  CheckMobileRegistrationRequestBuilder,
  PhoneDeviceRequestBuilder,
  toInternational,
} from '@madark/api/builders/auth.requests';
import type { Customer } from '@madark/environment/testdata/helpers/testdata.helper';
import { given } from '@madark/utils/report';

export class AuthWorkflow {
  static async loginAs(customer: Customer, client: ApiClient = ApiClient.instance): Promise<string> {
    return (await given('loginAs', () => this.performLogin(customer, client))) as string;
  }

  static async performLogin(customer: Customer, client: ApiClient = ApiClient.instance): Promise<string> {
    const auth = new AuthService(client);
    const phone = toInternational(customer.phone);

    const otpRes = await auth.generateLoginOrRegisterOtp(
      new PhoneDeviceRequestBuilder().phoneNumber(phone).deviceId(client.deviceId).build()
    );
    new ResponseAssert(otpRes).status(200).jsonPath('success', true);

    const loginRes = await auth.checkMobileRegistration(
      new CheckMobileRegistrationRequestBuilder().phoneNumber(phone).otp(customer.otp).deviceId(client.deviceId).build()
    );
    new ResponseAssert(loginRes).status(200).jsonPath('success', true).jsonPathExists('resource.token');
    client.token = String(loginRes.body.resource?.token);
    return client.token;
  }
}
