import 'tsconfig-paths/register';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { HybridCipher } from '@madark/api/crypto/hybrid-cipher';

const serverKey = crypto.createPublicKey(HybridCipher.serverPublicKey());
const details = serverKey.asymmetricKeyDetails;
assert.equal(serverKey.asymmetricKeyType, 'rsa');
process.stdout.write(`server key: RSA ${details?.modulusLength} bits (from app rsa_helper.dart)\n`);

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const pubPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
const privPem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

const body = { phoneNumber: '+966500000000', deviceId: 'e2e-check', note: 'مرحبا ✓' };
const cipher = new HybridCipher(pubPem);
const req = cipher.encryptBody(body);

assert.deepEqual(Object.keys(req).sort(), ['encryptedAESKey', 'encryptedPayload', 'iv', 'tag']);
assert.equal(Buffer.from(req.iv, 'base64').length, 12, 'IV must be 12 bytes (GCM nonce, as aes_helper.dart)');
assert.equal(Buffer.from(req.tag, 'base64').length, 16, 'tag must be 16 bytes, split from ciphertext');
assert.equal(Buffer.from(req.encryptedAESKey, 'base64').length, 256, 'RSA-2048 wrapped key');
assert.deepEqual(cipher.decryptRequestForTest(req, privPem), body, 'server-side decrypt of request');

const response = { success: true, message: 'ok', resource: { token: 'abc' } };
assert.deepEqual(cipher.decryptResponse(cipher.encryptResponseForTest(response)), response, 'response decrypt with request AES key');

const tampered = { ...cipher.encryptResponseForTest(response), tag: Buffer.alloc(16).toString('base64') };
assert.throws(() => cipher.decryptResponse(tampered), 'tampered tag must fail GCM auth');

const real = new HybridCipher().encryptBody(body);
assert.equal(Buffer.from(real.encryptedAESKey, 'base64').length, (details?.modulusLength ?? 0) / 8, 'wrapped with server key');

process.stdout.write('hybrid cipher: request/response round-trip, sizes, GCM auth and server key wrap all OK\n');
