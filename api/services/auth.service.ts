import type { ApiClient, ApiResponse } from '@madark/api/client';
import { endpoint } from '@madark/api/endpoints';

export type MadarkEnvelope<T = Record<string, unknown>> = {
  success?: boolean;
  message?: string;
  resource?: T;
};

export class AuthService {
  constructor(private readonly client: ApiClient) {}

  generateLoginOrRegisterOtp(body: Record<string, unknown>): Promise<ApiResponse<MadarkEnvelope>> {
    return this.client.post(endpoint('generateLoginOrRegisterOtp'), body, { auth: false });
  }

  checkMobileRegistration(body: Record<string, unknown>): Promise<ApiResponse<MadarkEnvelope<{ token?: string }>>> {
    return this.client.post(endpoint('checkMobileRegistration'), body, { auth: false });
  }
}
