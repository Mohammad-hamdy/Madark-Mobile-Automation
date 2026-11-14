export function encryptionFlag(): boolean {
  return (process.env.E2E_ENCRYPTION ?? 'true').toLowerCase() !== 'false';
}
