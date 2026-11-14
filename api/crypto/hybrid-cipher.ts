import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const TAG_LENGTH = 16;
const KEY_FILE = path.resolve(__dirname, '..', '..', 'generated', 'server-public-key.pem');

export type EncryptedRequest = {
  encryptedAESKey: string;
  encryptedPayload: string;
  iv: string;
  tag: string;
};

export type EncryptedResponse = { data: string; tag: string; iv: string };

export class HybridCipher {
  private readonly key = crypto.randomBytes(32);
  private readonly iv = crypto.randomBytes(12);

  constructor(private readonly publicKeyPem: string = HybridCipher.serverPublicKey()) {}

  static serverPublicKey(): string {
    if (!fs.existsSync(KEY_FILE)) throw new Error('generated/server-public-key.pem missing — run npm run scan');
    return fs.readFileSync(KEY_FILE, 'utf8');
  }

  static isEncryptedResponse(body: unknown): body is EncryptedResponse {
    const b = body as Record<string, unknown> | null;
    return Boolean(b && typeof b.data === 'string' && typeof b.tag === 'string' && typeof b.iv === 'string');
  }

  encryptBody(body: Record<string, unknown>): EncryptedRequest {
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, this.iv, { authTagLength: TAG_LENGTH });
    const ciphertext = Buffer.concat([cipher.update(JSON.stringify(body), 'utf8'), cipher.final()]);
    const wrappedKey = crypto.publicEncrypt(
      { key: this.publicKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
      this.key
    );
    return {
      encryptedAESKey: wrappedKey.toString('base64'),
      encryptedPayload: ciphertext.toString('base64'),
      iv: this.iv.toString('base64'),
      tag: cipher.getAuthTag().toString('base64'),
    };
  }

  decryptResponse(body: EncryptedResponse): unknown {
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, Buffer.from(body.iv, 'base64'), {
      authTagLength: TAG_LENGTH,
    });
    decipher.setAuthTag(Buffer.from(body.tag, 'base64'));
    const plain = Buffer.concat([decipher.update(Buffer.from(body.data, 'base64')), decipher.final()]);
    return JSON.parse(plain.toString('utf8'));
  }

  decryptRequestForTest(req: EncryptedRequest, privateKeyPem: string): unknown {
    const key = crypto.privateDecrypt(
      { key: privateKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
      Buffer.from(req.encryptedAESKey, 'base64')
    );
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(req.iv, 'base64'), { authTagLength: TAG_LENGTH });
    decipher.setAuthTag(Buffer.from(req.tag, 'base64'));
    return JSON.parse(Buffer.concat([decipher.update(Buffer.from(req.encryptedPayload, 'base64')), decipher.final()]).toString('utf8'));
  }

  encryptResponseForTest(payload: unknown): EncryptedResponse {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv, { authTagLength: TAG_LENGTH });
    const data = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
    return { data: data.toString('base64'), tag: cipher.getAuthTag().toString('base64'), iv: iv.toString('base64') };
  }
}
