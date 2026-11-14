const levels = { error: 0, warn: 1, info: 2, debug: 3 } as const;
type Level = keyof typeof levels;
const current = levels[(process.env.E2E_LOG_LEVEL as Level) || 'info'] ?? 2;

function log(level: Level, msg: string, extra?: unknown): void {
  if (levels[level] > current) return;
  const line = extra ? `${msg} ${JSON.stringify(extra)}` : msg;
  process.stdout.write(`[${level}] ${line}\n`);
}

export const logger = {
  error: (msg: string, extra?: unknown) => log('error', msg, extra),
  warn: (msg: string, extra?: unknown) => log('warn', msg, extra),
  info: (msg: string, extra?: unknown) => log('info', msg, extra),
  debug: (msg: string, extra?: unknown) => log('debug', msg, extra),
};
