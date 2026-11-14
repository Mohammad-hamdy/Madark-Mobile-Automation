import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadEnv } from '@madark/environment';
import { currentPlatform, resolveCapabilities } from '@madark/config/capabilities';
import { I18n } from '@madark/i18n/i18n';
import { logger } from '@madark/utils/logger';

type Meta = Record<string, string>;

export function writeRunMetadata(resultsDir: string, extra: Meta = {}): void {
  fs.mkdirSync(resultsDir, { recursive: true });
  const caps = resolveCapabilities();
  const env = loadEnv();
  const platform = currentPlatform();
  const meta: Meta = {
    'App version': process.env.APP_VERSION || 'unknown',
    Environment: `${env.name} (${env.appEnvLabel}) ${env.apiBaseUrl}`,
    Encryption: String(env.encryption),
    Target: process.env.E2E_TARGET || "local",
    Package: String(caps['appium:appPackage'] || caps['appium:bundleId'] || ''),
    'Machine name': os.hostname(),
    'Platform type': platform,
    Language: process.env.E2E_LANG || I18n.lang || 'auto',
    'Screen size': 'pending-session',
    Device: String(caps['appium:deviceName'] || caps['appium:udid'] || os.hostname()),
    OS: `${String(caps.platformName || platform)} ${String(caps['appium:platformVersion'] || '')}`.trim(),
    ...extra,
  };
  writeProps(resultsDir, meta);
  logger.info('wrote Allure environment metadata');
}

export async function refreshSessionMetadata(resultsDir: string): Promise<void> {
  const extra: Meta = {};
  try {
    const { width, height } = await driver.getWindowSize();
    extra['Screen size'] = `${width}x${height}`;
  } catch {
    extra['Screen size'] = 'unknown';
  }
  try {
    const caps = driver.capabilities as Record<string, string>;
    extra['App version'] = process.env.APP_VERSION || caps.appVersion || caps['appium:appVersion'] || extra['App version'] || 'unknown';
    extra.Device = caps.deviceName || caps['appium:deviceName'] || extra.Device;
    extra.OS = `${caps.platformName || ''} ${caps.platformVersion || caps['appium:platformVersion'] || ''}`.trim();
  } catch {
    logger.warn('session metadata not ready');
  }
  writeRunMetadata(resultsDir, extra);
}

function writeProps(resultsDir: string, meta: Meta): void {
  const lines = Object.entries(meta).map(([k, v]) => `${k}=${String(v).replace(/\n/g, ' ')}`);
  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), `${lines.join('\n')}\n`);
}
