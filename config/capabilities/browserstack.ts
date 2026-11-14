import type { PlatformName } from '@madark/config/capabilities';

export function browserstackOptions(platform: PlatformName): Record<string, unknown> {
  const ios = platform === 'ios';
  return {
    'appium:app': ios ? process.env.BROWSERSTACK_APP_URL_IOS : process.env.BROWSERSTACK_APP_URL,
    'appium:deviceName': ios ? process.env.IOS_DEVICE_NAME || 'iPhone 16' : process.env.DEVICE_NAME || 'Samsung Galaxy S23',
    'appium:platformVersion': ios ? process.env.IOS_OS_VERSION || '18' : process.env.OS_VERSION || '13.0',
    'bstack:options': {
      projectName: 'Madark Mobile E2E',
      buildName: process.env.BUILD_NAME || 'madark-e2e',
      sessionName: `${process.env.E2E_ENV || 'dev'}-${process.env.E2E_LANG || 'en'}-${platform}`,
      appiumVersion: '2.11.0',
      gpsLocation: '24.7136,46.6753',
      networkLogs: true,
      deviceLogs: true,
      video: true,
    },
  };
}
