import { randomUUID } from 'node:crypto';
import { HybridCipher } from '@madark/api/crypto/hybrid-cipher';
import { loadEnv } from '@madark/environment';
import type { EnvConfig } from '@madark/environment/types';
import { logger } from '@madark/utils/logger';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ApiResponse<T = Record<string, unknown>> = {
  status: number;
  body: T;
  encrypted: boolean;
};

export type RequestOptions = {
  body?: Record<string, unknown>;
  query?: Record<string, string | number | boolean | undefined>;
  auth?: boolean;
};

const ACCEPT_LANGUAGE = { en: 'en-US', ar: 'ar-SA' } as const;

export class ApiClient {
  private static shared?: ApiClient;
  token = '';
  readonly deviceId = `e2e-${randomUUID()}`;

  constructor(private readonly env: EnvConfig = loadEnv()) {}

  static get instance(): ApiClient {
    if (!this.shared) this.shared = new ApiClient();
    return this.shared;
  }

  get encryption(): boolean {
    return this.env.encryption;
  }

  async request<T = Record<string, unknown>>(method: HttpMethod, apiPath: string, opts: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = new URL(apiPath, this.env.apiBaseUrl);
    for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': ACCEPT_LANGUAGE[process.env.E2E_LANG === 'ar' ? 'ar' : 'en'],
    };
    if (opts.auth !== false && this.token) headers.Authorization = `Bearer ${this.token}`;

    let cipher: HybridCipher | undefined;
    let payload: string | undefined;
    if (opts.body) {
      if (this.env.encryption) {
        cipher = new HybridCipher();
        payload = JSON.stringify(cipher.encryptBody(opts.body));
        headers['X-Encrypted'] = '1';
      } else {
        payload = JSON.stringify(opts.body);
      }
    }

    const res = await fetch(url, { method, headers, body: payload });
    const text = await res.text();
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      logger.debug(`non-JSON response from ${apiPath}`);
    }
    let encrypted = false;
    if (cipher && HybridCipher.isEncryptedResponse(body)) {
      body = cipher.decryptResponse(body);
      encrypted = true;
    }
    logger.debug(`${method} ${apiPath} -> ${res.status}${encrypted ? ' (decrypted)' : ''}`);
    return { status: res.status, body: body as T, encrypted };
  }

  post<T = Record<string, unknown>>(apiPath: string, body: Record<string, unknown>, opts: Omit<RequestOptions, 'body'> = {}) {
    return this.request<T>('POST', apiPath, { ...opts, body });
  }

  get<T = Record<string, unknown>>(apiPath: string, query?: RequestOptions['query'], opts: Omit<RequestOptions, 'query'> = {}) {
    return this.request<T>('GET', apiPath, { ...opts, query });
  }
}
