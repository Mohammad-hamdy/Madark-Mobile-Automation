import { logger } from '@madark/utils/logger';

let current: Mocha.Context | undefined;

export function setTestContext(ctx: Mocha.Context): void {
  current = ctx;
}

export function skipCurrentTest(reason: string): never {
  logger.warn(`skipped: ${reason}`);
  if (!current) throw new Error(`cannot skip outside a test: ${reason}`);
  current.skip();
  throw new Error(reason);
}
