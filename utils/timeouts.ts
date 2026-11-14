/**
 * Central wait budgets. CI / E2E_FAST=1 use tighter values so missing
 * elements fail quickly instead of stacking 15s–5min waits.
 */
function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

const fast = process.env.E2E_FAST === '1' || process.env.CI === 'true';

export const Timeouts = {
  /** Presence checks / negative asserts */
  short: num('E2E_WAIT_SHORT', fast ? 2500 : 5000),
  /** Default action wait (tap, type, visible) */
  medium: num('E2E_WAIT_MEDIUM', fast ? 8000 : 12000),
  /** Screen transitions / first paint */
  long: num('E2E_WAIT_LONG', fast ? 15000 : 25000),
  /** Per-swipe / scroll probe — must stay low or loops explode */
  probe: num('E2E_WAIT_PROBE', fast ? 600 : 1200),
  /** WDIO waitforTimeout */
  waitfor: num('E2E_WAITFOR', fast ? 10000 : 15000),
  /** Mocha per-test ceiling */
  mocha: num('E2E_MOCHA_TIMEOUT', fast ? 120_000 : 180_000),
  /** Appium session create / command retry */
  connectionRetry: num('E2E_CONNECTION_RETRY', fast ? 60_000 : 120_000),
  connectionRetryCount: num('E2E_CONNECTION_RETRY_COUNT', 1),
  /** UI settled (page-source polling is expensive) */
  settled: num('E2E_SETTLED', fast ? 2000 : 4000),
  settledHits: num('E2E_SETTLED_HITS', fast ? 1 : 2),
  maxSwipes: num('E2E_MAX_SWIPES', fast ? 4 : 6),
  fast,
} as const;
