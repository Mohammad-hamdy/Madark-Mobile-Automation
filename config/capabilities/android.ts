import appMap from '@madark/generated/app-map.json';

export function androidCaps(): Record<string, unknown> {
  return {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:app': process.env.ANDROID_APP_PATH,
    'appium:appPackage': process.env.ANDROID_APP_PACKAGE || appMap.platform.android.appPackage,
    'appium:appActivity': process.env.ANDROID_APP_ACTIVITY || appMap.platform.android.appActivity,
    'appium:udid': process.env.ANDROID_UDID || 'emulator-5554',
    'appium:autoGrantPermissions': true,
    'appium:noReset': false,
    'appium:newCommandTimeout': 300,
    'appium:settings': { waitForIdleTimeout: 100, actionAcknowledgmentTimeout: 500 },
  };
}
