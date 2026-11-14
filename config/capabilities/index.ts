import { androidCaps } from '@madark/config/capabilities/android';
import { iosCaps } from '@madark/config/capabilities/ios';
import { browserstackOptions } from '@madark/config/capabilities/browserstack';
import { currentTarget } from '@madark/config/appium';

export type PlatformName = 'android' | 'ios';

export function currentPlatform(): PlatformName {
  return process.env.PLATFORM?.toLowerCase() === 'ios' ? 'ios' : 'android';
}

export function isIos(): boolean {
  return currentPlatform() === 'ios';
}

export function resolveCapabilities(): Record<string, unknown> {
  const caps = isIos() ? iosCaps() : androidCaps();
  if (currentTarget() !== 'browserstack') return caps;
  const remote: Record<string, unknown> = { ...caps, ...browserstackOptions(currentPlatform()) };
  delete remote['appium:udid'];
  delete remote['appium:isSimulator'];
  delete remote['appium:settings'];
  return remote;
}
