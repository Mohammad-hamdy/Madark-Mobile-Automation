import appMap from '@madark/generated/app-map.json';

export function iosCaps(): Record<string, unknown> {
  return {
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:app': process.env.IOS_APP_PATH,
    'appium:bundleId': process.env.IOS_BUNDLE_ID || appMap.platform.ios.bundleId,
    'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 15',
    'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '17.0',
    'appium:udid': process.env.IOS_UDID,
    'appium:isSimulator': !process.env.IOS_UDID,
    'appium:autoAcceptAlerts': true,
    'appium:newCommandTimeout': 300,
  };
}
