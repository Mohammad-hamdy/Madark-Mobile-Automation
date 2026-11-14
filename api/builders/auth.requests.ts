export class PhoneDeviceRequestBuilder {
  private phone?: string;
  private device?: string;

  phoneNumber(v: string): this {
    this.phone = v;
    return this;
  }

  deviceId(v: string): this {
    this.device = v;
    return this;
  }

  build(): Record<string, unknown> {
    if (!this.phone || !this.device) throw new Error('phoneNumber and deviceId required');
    return { phoneNumber: this.phone, deviceId: this.device };
  }
}

export class CheckMobileRegistrationRequestBuilder {
  private fields: Record<string, unknown> = {
    fcmToken: '',
    deviceType: 'android',
    deviceModel: 'e2e',
    osVersion: 'e2e',
    ipAddress: '127.0.0.1',
    loginCoordinates: '24.7136 , 46.6753',
  };

  phoneNumber(v: string): this {
    this.fields.phoneNumber = v;
    return this;
  }

  otp(v: string): this {
    this.fields.otp = v;
    return this;
  }

  deviceId(v: string): this {
    this.fields.deviceId = v;
    this.fields.macAddress = v;
    return this;
  }

  build(): Record<string, unknown> {
    for (const k of ['phoneNumber', 'otp', 'deviceId']) if (!this.fields[k]) throw new Error(`${k} required`);
    return { ...this.fields };
  }
}

export function toInternational(localPhone: string): string {
  const digits = localPhone.replace(/\D/g, '');
  if (digits.startsWith('966')) return `+${digits}`;
  return `+966${digits.replace(/^0/, '')}`;
}

export function toLocal(phone: string): string {
  return phone.replace(/\D/g, '').replace(/^966/, '').replace(/^0/, '');
}
