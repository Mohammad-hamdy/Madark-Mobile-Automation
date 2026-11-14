import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

export type TelegramConfig = {
  enabled: boolean;
  botToken: string;
  chatId: string;
  /** Send the run summary even when every test passed. */
  notifyOnSuccess: boolean;
  /** Cap on failure screenshots per run, to avoid flooding the channel. */
  maxScreenshots: number;
  runUrl: string;
};

/** Empty token or chat id disables sending; the pipeline still runs. */
export function loadTelegram(): TelegramConfig {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const chatId = process.env.TELEGRAM_CHAT_ID || '';
  const server = process.env.GITHUB_SERVER_URL;
  const repo = process.env.GITHUB_REPOSITORY;
  const runId = process.env.GITHUB_RUN_ID;
  return {
    enabled: Boolean(botToken && chatId),
    botToken,
    chatId,
    notifyOnSuccess: (process.env.TELEGRAM_NOTIFY_ON_SUCCESS || 'true') === 'true',
    maxScreenshots: Number(process.env.TELEGRAM_MAX_SCREENSHOTS || 10),
    runUrl: server && repo && runId ? `${server}/${repo}/actions/runs/${runId}` : '',
  };
}
