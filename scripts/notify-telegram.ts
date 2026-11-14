import fs from 'node:fs';
import path from 'node:path';
import { loadTelegram, type TelegramConfig } from '@madark/environment/telegram';

type Attachment = { name: string; type: string; source: string };
type Step = { attachments?: Attachment[]; steps?: Step[] };
type Result = Step & {
  name: string;
  status: 'passed' | 'failed' | 'broken' | 'skipped' | 'unknown';
  statusDetails?: { message?: string };
  links?: Array<{ name?: string; url: string; type?: string }>;
};

const RESULTS = path.resolve(__dirname, '..', 'allure-results');

function readResults(): Result[] {
  if (!fs.existsSync(RESULTS)) return [];
  return fs
    .readdirSync(RESULTS)
    .filter((f) => f.endsWith('-result.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(RESULTS, f), 'utf8')) as Result);
}

function readEnvironment(): Record<string, string> {
  const file = path.join(RESULTS, 'environment.properties');
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .map((line) => line.split('='))
      .filter((parts) => parts.length >= 2)
      .map(([k, ...v]) => [k.trim(), v.join('=').trim()])
  );
}

/** Top-level screenshot is the failure capture; fall back to the last step image. */
function screenshotOf(result: Result): string | undefined {
  const images = (list?: Attachment[]) => (list ?? []).filter((a) => a.type === 'image/png');
  const top = images(result.attachments).at(-1);
  if (top) return path.join(RESULTS, top.source);
  let last: Attachment | undefined;
  const walk = (steps?: Step[]) => {
    for (const s of steps ?? []) {
      last = images(s.attachments).at(-1) ?? last;
      walk(s.steps);
    }
  };
  walk(result.steps);
  return last ? path.join(RESULTS, last.source) : undefined;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function call(cfg: TelegramConfig, method: string, body: FormData | Record<string, unknown>): Promise<void> {
  const isForm = body instanceof FormData;
  const res = await fetch(`https://api.telegram.org/bot${cfg.botToken}/${method}`, {
    method: 'POST',
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
    body: isForm ? body : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Telegram ${method} ${res.status}: ${await res.text()}`);
}

async function main(): Promise<void> {
  const cfg = loadTelegram();
  if (!cfg.enabled) {
    console.log('[telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — skipping');
    return;
  }

  const results = readResults();
  const failed = results.filter((r) => r.status === 'failed' || r.status === 'broken');
  const passed = results.filter((r) => r.status === 'passed').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;

  if (!results.length) {
    await call(cfg, 'sendMessage', {
      chat_id: cfg.chatId,
      parse_mode: 'HTML',
      text: `⚠️ <b>Madark automation</b>: no test results were produced.${cfg.runUrl ? `\n<a href="${cfg.runUrl}">Open pipeline run</a>` : ''}`,
      disable_web_page_preview: true,
    });
    return;
  }
  if (!failed.length && !cfg.notifyOnSuccess) {
    console.log('[telegram] all passed and TELEGRAM_NOTIFY_ON_SUCCESS=false — skipping');
    return;
  }

  const env = readEnvironment();
  const lines = [
    `${failed.length ? '❌' : '✅'} <b>Madark automation</b> — ${failed.length ? 'FAILED' : 'PASSED'}`,
    '',
    `Passed: ${passed} · Failed: ${failed.length} · Skipped: ${skipped}`,
    `Env: ${escapeHtml(env.Environment || process.env.E2E_ENV || '')} · Lang: ${escapeHtml(env.Language || process.env.E2E_LANG || '')} · Tags: ${escapeHtml(process.env.E2E_TAGS || 'all')}`,
  ];
  if (failed.length) {
    lines.push('', '<b>Failed test cases:</b>');
    for (const r of failed) lines.push(`• ${escapeHtml(r.name)}`);
  }
  if (cfg.runUrl) lines.push('', `<a href="${cfg.runUrl}">Open pipeline run &amp; Allure report</a>`);

  await call(cfg, 'sendMessage', {
    chat_id: cfg.chatId,
    parse_mode: 'HTML',
    text: lines.join('\n').slice(0, 4096),
    disable_web_page_preview: true,
  });

  for (const r of failed.slice(0, cfg.maxScreenshots)) {
    const shot = screenshotOf(r);
    const reason = (r.statusDetails?.message || '').split('\n')[0].slice(0, 300);
    const ado = r.links?.find((l) => l.type === 'tms')?.url;
    const caption = [`❌ <b>${escapeHtml(r.name)}</b>`, reason && `<code>${escapeHtml(reason)}</code>`, ado && `<a href="${ado}">ADO</a>`]
      .filter(Boolean)
      .join('\n')
      .slice(0, 1024);
    if (!shot || !fs.existsSync(shot)) {
      await call(cfg, 'sendMessage', { chat_id: cfg.chatId, parse_mode: 'HTML', text: caption });
      continue;
    }
    const form = new FormData();
    form.append('chat_id', cfg.chatId);
    form.append('parse_mode', 'HTML');
    form.append('caption', caption);
    form.append('photo', new Blob([fs.readFileSync(shot)], { type: 'image/png' }), path.basename(shot));
    await call(cfg, 'sendPhoto', form);
  }
  console.log(`[telegram] sent summary and ${Math.min(failed.length, cfg.maxScreenshots)} failure screenshot(s)`);
}

main().catch((err) => {
  // Notification problems must never fail the pipeline.
  console.error(`[telegram] ${err instanceof Error ? err.message : String(err)}`);
});
