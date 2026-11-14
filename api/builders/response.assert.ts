import type { ApiResponse } from '@madark/api/client';

export class ResponseAssert {
  constructor(private readonly res: ApiResponse<unknown>) {}

  status(expected: number): this {
    if (this.res.status !== expected) {
      throw new Error(`expected HTTP ${expected}, got ${this.res.status}: ${JSON.stringify(this.res.body).slice(0, 300)}`);
    }
    return this;
  }

  jsonPath(pathExpr: string, expected: unknown): this {
    const actual = read(this.res.body, pathExpr);
    if (actual !== expected) throw new Error(`${pathExpr}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    return this;
  }

  jsonPathExists(pathExpr: string): this {
    if (read(this.res.body, pathExpr) == null) throw new Error(`${pathExpr} missing in response`);
    return this;
  }

  encrypted(expected: boolean): this {
    if (this.res.encrypted !== expected) throw new Error(`expected encrypted=${expected}, got ${this.res.encrypted}`);
    return this;
  }
}

export function read(obj: unknown, pathExpr: string): unknown {
  return pathExpr.split('.').reduce<unknown>((acc, k) => (acc == null ? undefined : (acc as Record<string, unknown>)[k]), obj);
}
