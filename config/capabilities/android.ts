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
    'appium:newCommandTimeout': Number(process.env.E2E_NEW_COMMAND_TIMEOUT || 120),
    // Flutter screens with continuous animation never go idle: don't wait for idle, read every window
    // (system dialogs and the app), and disable system window animations on the device.
    'appium:disableWindowAnimation': true,
    'appium:settings': {
      waitForIdleTimeout: 0,
      waitForSelectorTimeout: 0,
      actionAcknowledgmentTimeout: 500,
      enableMultiWindows: true,
    },
  };
}
