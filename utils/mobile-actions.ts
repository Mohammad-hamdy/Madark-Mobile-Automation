import fs from 'node:fs';
import { isIos } from '@madark/config/capabilities';
import { logger } from '@madark/utils/logger';
import { when } from '@madark/utils/report';
import { Wait } from '@madark/utils/wait';
import { skipCurrentTest } from '@madark/utils/test-context';

export type DeviceKind = 'emulator' | 'simulator' | 'real';
export type DeviceTarget = { platform: 'android' | 'ios'; kind: DeviceKind; udid: string };
export type ActionName =
  | 'airplaneMode'
  | 'wifi'
  | 'mobileData'
  | 'bluetooth'
  | 'portrait'
  | 'landscape'
  | 'location'
  | 'locationServices'
  | 'lock'
  | 'home'
  | 'back'
  | 'recent'
  | 'volume'
  | 'keyboard'
  | 'clipboard'
  | 'notifications'
  | 'permissions'
  | 'biometric'
  | 'deepLink'
  | 'files'
  | 'appLifecycle'
  | 'appData'
  | 'sms'
  | 'gsm'
  | 'battery'
  | 'shake';

type Support = { android?: Array<'emulator' | 'real' | '*'>; ios?: Array<'simulator' | 'real' | '*'> };

export type Connectivity = { wifi: boolean; data: boolean; airplaneMode: boolean };

const SUPPORT: Record<ActionName, Support> = {
  airplaneMode: { android: ['*'] },
  wifi: { android: ['*'] },
  mobileData: { android: ['*'] },
  bluetooth: { android: ['*'] },
  portrait: { android: ['*'], ios: ['*'] },
  landscape: { android: ['*'], ios: ['*'] },
  location: { android: ['*'], ios: ['simulator'] },
  locationServices: { android: ['*'] },
  lock: { android: ['*'], ios: ['*'] },
  home: { android: ['*'], ios: ['*'] },
  back: { android: ['*'] },
  recent: { android: ['*'] },
  volume: { android: ['*'], ios: ['*'] },
  keyboard: { android: ['*'], ios: ['*'] },
  clipboard: { android: ['*'], ios: ['*'] },
  notifications: { android: ['*'] },
  permissions: { android: ['*'], ios: ['simulator'] },
  biometric: { android: ['emulator'], ios: ['simulator'] },
  deepLink: { android: ['*'], ios: ['*'] },
  files: { android: ['*'], ios: ['*'] },
  appLifecycle: { android: ['*'], ios: ['*'] },
  appData: { android: ['*'], ios: ['simulator'] },
  sms: { android: ['emulator'] },
  gsm: { android: ['emulator'] },
  battery: { android: ['emulator'] },
  shake: { ios: ['*'] },
};

export class MobileActionUnsupported extends Error {
  constructor(action: string, target: DeviceTarget, reason: string) {
    super(`${action} is not available on ${target.platform} ${target.kind}: ${reason}`);
    this.name = 'MobileActionUnsupported';
  }
}

export class MobileActions {
  static async target(): Promise<DeviceTarget> {
    const caps = (driver.capabilities || {}) as Record<string, unknown>;
    const udid = String(caps.udid || caps['appium:udid'] || '');
    if (isIos()) {
      const hinted = caps['appium:isSimulator'];
      const simUuid = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/.test(udid);
      const kind: DeviceKind =
        hinted === false || hinted === 'false' ? 'real' : hinted === true || hinted === 'true' || simUuid || !udid
          ? 'simulator'
          : 'real';
      return { platform: 'ios', kind, udid };
    }
    const emulator = Boolean(caps['appium:avd']) || udid.startsWith('emulator-') || udid.startsWith('emulator');
    return { platform: 'android', kind: emulator ? 'emulator' : 'real', udid };
  }

  static async supports(action: ActionName): Promise<boolean> {
    const t = await this.target();
    const allowed = t.platform === 'ios' ? SUPPORT[action].ios : SUPPORT[action].android;
    if (!allowed) return false;
    return allowed.includes('*') || allowed.includes(t.kind as never);
  }

  static async require(action: ActionName): Promise<DeviceTarget> {
    const t = await this.target();
    if (await this.supports(action)) return t;
    const err = new MobileActionUnsupported(action, t, 'see mobile-actions.md support matrix');
    if (process.env.E2E_SKIP_UNSUPPORTED_DEVICE_ACTIONS === '1') skipCurrentTest(err.message);
    throw err;
  }

  static async getConnectivity(): Promise<Connectivity> {
    await this.require('wifi');
    return driver.execute('mobile: getConnectivity') as Promise<Connectivity>;
  }

  static setAirplaneMode(on: boolean): Promise<void> {
    return when('setAirplaneMode', () => this.setRadio('airplaneMode', on));
  }

  static setWifi(on: boolean): Promise<void> {
    return when('setWifi', () => this.setRadio('wifi', on));
  }

  static setMobileData(on: boolean): Promise<void> {
    return when('setMobileData', () => this.setRadio('data', on));
  }

  static async isAirplaneMode(): Promise<boolean> {
    return (await this.getConnectivity()).airplaneMode;
  }

  static async isWifiOn(): Promise<boolean> {
    return (await this.getConnectivity()).wifi;
  }

  static async isMobileDataOn(): Promise<boolean> {
    return (await this.getConnectivity()).data;
  }

  static setBluetooth(on: boolean): Promise<void> {
    return when('setBluetooth', async () => {
      await this.require('bluetooth');
      await driver.execute('mobile: shell', {
        command: 'svc',
        args: ['bluetooth', on ? 'enable' : 'disable'],
        includeStderr: true,
        timeout: 8000,
      });
      await Wait.until(async () => (await this.isBluetoothOn()) === on, { message: `bluetooth ${on}` });
      await Wait.settled();
    });
  }

  static async isBluetoothOn(): Promise<boolean> {
    await this.require('bluetooth');
    const out = await driver.execute('mobile: shell', {
      command: 'settings',
      args: ['get', 'global', 'bluetooth_on'],
      includeStderr: true,
      timeout: 8000,
    });
    return String(out).trim() === '1';
  }

  static setPortrait(): Promise<void> {
    return when('setPortrait', () => this.setOrientation('PORTRAIT'));
  }

  static setLandscape(): Promise<void> {
    return when('setLandscape', () => this.setOrientation('LANDSCAPE'));
  }

  static async getOrientation(): Promise<'PORTRAIT' | 'LANDSCAPE'> {
    const value = await driver.getOrientation();
    return String(value).toUpperCase() === 'LANDSCAPE' ? 'LANDSCAPE' : 'PORTRAIT';
  }

  static setLocation(point: { latitude: number; longitude: number; altitude?: number }): Promise<void> {
    return when('setLocation', async () => {
      const t = await this.require('location');
      if (t.platform === 'ios') {
        await driver.execute('mobile: setSimulatedLocation', {
          latitude: point.latitude,
          longitude: point.longitude,
        });
      } else {
        await driver.setGeoLocation({
          latitude: point.latitude,
          longitude: point.longitude,
          altitude: point.altitude ?? 0,
        });
      }
      await Wait.settled();
    });
  }

  static async getLocation(): Promise<{ latitude: number; longitude: number; altitude?: number }> {
    await this.require('location');
    if (isIos()) return driver.execute('mobile: getSimulatedLocation') as Promise<{ latitude: number; longitude: number }>;
    return driver.getGeoLocation() as unknown as Promise<{ latitude: number; longitude: number; altitude?: number }>;
  }

  static resetLocation(): Promise<void> {
    return when('resetLocation', async () => {
      const t = await this.require('location');
      if (t.platform === 'ios') await driver.execute('mobile: resetSimulatedLocation');
    });
  }

  static setLocationServices(on: boolean): Promise<void> {
    return when('setLocationServices', async () => {
      await this.require('locationServices');
      await driver.execute('mobile: shell', {
        command: 'settings',
        args: ['put', 'secure', 'location_mode', on ? '3' : '0'],
        includeStderr: true,
        timeout: 8000,
      });
      await Wait.settled();
    });
  }

  static lock(): Promise<void> {
    return when('lock', async () => {
      await this.require('lock');
      await driver.lock();
      await Wait.until(async () => this.isLocked(), { message: 'device locked' });
    });
  }

  static unlock(): Promise<void> {
    return when('unlock', async () => {
      await this.require('lock');
      await driver.unlock();
      await Wait.until(async () => !(await this.isLocked()), { message: 'device unlocked' });
      await Wait.settled();
    });
  }

  static async isLocked(): Promise<boolean> {
    return driver.isLocked();
  }

  static pressHome(): Promise<void> {
    return when('pressHome', async () => {
      await this.require('home');
      if (isIos()) await driver.execute('mobile: pressButton', { name: 'home' });
      else await driver.pressKeyCode(3);
      await Wait.settled();
    });
  }

  /** Go back one screen: system back on Android, left-edge swipe on iOS (Flutter Cupertino back gesture). */
  static navigateBack(): Promise<void> {
    return when('navigateBack', async () => {
      if (isIos()) {
        const { width, height } = await driver.getWindowSize();
        await driver.performActions([
          {
            type: 'pointer',
            id: 'edge',
            parameters: { pointerType: 'touch' },
            actions: [
              { type: 'pointerMove', duration: 0, x: 2, y: Math.round(height / 2) },
              { type: 'pointerDown', button: 0 },
              { type: 'pointerMove', duration: 300, x: Math.round(width * 0.7), y: Math.round(height / 2) },
              { type: 'pointerUp', button: 0 },
            ],
          },
        ]);
        await driver.releaseActions().catch(() => undefined);
      } else {
        await driver.pressKeyCode(4);
      }
      await Wait.settled();
    });
  }

  static pressBack(): Promise<void> {
    return when('pressBack', async () => {
      await this.require('back');
      await driver.pressKeyCode(4);
      await Wait.settled();
    });
  }

  static pressRecent(): Promise<void> {
    return when('pressRecent', async () => {
      await this.require('recent');
      await driver.pressKeyCode(187);
      await Wait.settled();
    });
  }

  static pressVolumeUp(): Promise<void> {
    return when('pressVolumeUp', () => this.pressVolume('up'));
  }

  static pressVolumeDown(): Promise<void> {
    return when('pressVolumeDown', () => this.pressVolume('down'));
  }

  static pressPower(): Promise<void> {
    return when('pressPower', async () => {
      await this.require('lock');
      if (isIos()) await driver.execute('mobile: pressButton', { name: 'power' });
      else await driver.pressKeyCode(26);
    });
  }

  static hideKeyboard(): Promise<void> {
    return when('hideKeyboard', async () => {
      await this.require('keyboard');
      if (await driver.isKeyboardShown()) await driver.hideKeyboard();
      await Wait.until(async () => !(await driver.isKeyboardShown()), { timeout: Wait.timeouts.short, message: 'keyboard hidden' }).catch(
        () => undefined
      );
    });
  }

  static isKeyboardShown(): Promise<boolean> {
    return driver.isKeyboardShown();
  }

  static setClipboard(text: string): Promise<void> {
    return when('setClipboard', async () => {
      await this.require('clipboard');
      await driver.setClipboard(Buffer.from(text, 'utf8').toString('base64'), 'plaintext');
    });
  }

  static async getClipboard(): Promise<string> {
    await this.require('clipboard');
    const raw = await driver.getClipboard();
    try {
      return Buffer.from(raw, 'base64').toString('utf8');
    } catch {
      return String(raw);
    }
  }

  static openNotifications(): Promise<void> {
    return when('openNotifications', async () => {
      await this.require('notifications');
      await driver.openNotifications();
      await Wait.settled();
    });
  }

  static grantPermission(permission: string): Promise<void> {
    return when('grantPermission', () => this.changePermission(permission, 'grant'));
  }

  static revokePermission(permission: string): Promise<void> {
    return when('revokePermission', () => this.changePermission(permission, 'revoke'));
  }

  static enrollBiometric(): Promise<void> {
    return when('enrollBiometric', async () => {
      const t = await this.require('biometric');
      if (t.platform === 'ios') await driver.execute('mobile: enrollBiometric', { isEnabled: true });
      else logger.info('android emulator fingerprint ready');
    });
  }

  static matchBiometric(): Promise<void> {
    return when('matchBiometric', async () => {
      const t = await this.require('biometric');
      if (t.platform === 'ios') await driver.execute('mobile: sendBiometricMatch', { type: 'touchId', match: true });
      else await driver.fingerPrint(1);
      await Wait.settled();
    });
  }

  static failBiometric(): Promise<void> {
    return when('failBiometric', async () => {
      const t = await this.require('biometric');
      if (t.platform === 'ios') await driver.execute('mobile: sendBiometricMatch', { type: 'touchId', match: false });
      else await driver.fingerPrint(0);
      await Wait.settled();
    });
  }

  static openDeepLink(url: string): Promise<void> {
    return when('openDeepLink', async () => {
      await this.require('deepLink');
      const caps = (driver.capabilities || {}) as Record<string, unknown>;
      const pkg = String(caps['appium:appPackage'] || caps['appium:bundleId'] || '');
      await driver.execute('mobile: deepLink', isIos() ? { url } : { url, package: pkg });
      await Wait.settled();
    });
  }

  static pushFile(remotePath: string, localPath: string): Promise<void> {
    return when('pushFile', async () => {
      await this.require('files');
      const payload = fs.readFileSync(localPath).toString('base64');
      await driver.pushFile(remotePath, payload);
    });
  }

  static async pullFile(remotePath: string): Promise<string> {
    await this.require('files');
    return driver.pullFile(remotePath);
  }

  static backgroundApp(): Promise<void> {
    return when('backgroundApp', async () => {
      await this.require('appLifecycle');
      await driver.execute('mobile: backgroundApp', { seconds: -1 });
    });
  }

  static activateApp(): Promise<void> {
    return when('activateApp', async () => {
      await this.require('appLifecycle');
      await this.activate();
      await Wait.settled();
    });
  }

  static terminateApp(): Promise<void> {
    return when('terminateApp', async () => {
      await this.require('appLifecycle');
      await this.terminate();
    });
  }

  /** Device action: app goes to background for N seconds and Appium brings it back (case step "background for 60 seconds"). */
  static backgroundFor(seconds: number): Promise<void> {
    return when('backgroundFor', async () => {
      await this.require('appLifecycle');
      await driver.execute('mobile: backgroundApp', { seconds });
      await Wait.settled();
    });
  }

  static clearAppData(): Promise<void> {
    return when('clearAppData', async () => {
      const t = await this.require('appData');
      if (t.platform === 'ios') {
        await driver.removeApp(this.appId());
        await driver.installApp(String((driver.capabilities as Record<string, unknown>)['appium:app'] || ''));
      } else {
        await driver.execute('mobile: clearApp', { appId: this.appId() });
      }
      await this.activate();
      await Wait.settled();
    });
  }

  static restartApp(): Promise<void> {
    return when('restartApp', async () => {
      await this.require('appLifecycle');
      await this.terminate();
      await this.activate();
      await Wait.settled();
    });
  }

  static queryAppState(): Promise<number> {
    return driver.queryAppState(this.appId());
  }

  static sendSms(phone: string, body: string): Promise<void> {
    return when('sendSms', async () => {
      await this.require('sms');
      await driver.execute('mobile: sendSms', { phoneNumber: phone, message: body });
    });
  }

  static gsmCall(phone: string, action: 'call' | 'accept' | 'cancel' | 'hold'): Promise<void> {
    return when('gsmCall', async () => {
      await this.require('gsm');
      await driver.execute('mobile: gsmCall', { phoneNumber: phone, action });
    });
  }

  static setBatteryLevel(percent: number): Promise<void> {
    return when('setBatteryLevel', async () => {
      await this.require('battery');
      await driver.execute('mobile: powerCapacity', { percent });
    });
  }

  static setPowerAC(on: boolean): Promise<void> {
    return when('setPowerAC', async () => {
      await this.require('battery');
      await driver.execute('mobile: powerAC', { state: on ? 'on' : 'off' });
    });
  }

  static shake(): Promise<void> {
    return when('shake', async () => {
      await this.require('shake');
      await driver.shake();
      await Wait.settled();
    });
  }

  static restoreDefaults(): Promise<void> {
    return when('restoreDefaults', async () => {
      if (await this.supports('airplaneMode')) await this.setRadio('airplaneMode', false);
      if (await this.supports('wifi')) await this.setRadio('wifi', true);
      if (await this.supports('mobileData')) await this.setRadio('data', true);
      if (await this.supports('bluetooth')) await this.setBluetooth(true).catch((err) => logger.warn(String(err)));
      if (await this.supports('portrait')) await this.setOrientation('PORTRAIT');
    });
  }

  private static async setRadio(key: 'wifi' | 'data' | 'airplaneMode', on: boolean): Promise<void> {
    const action = key === 'data' ? 'mobileData' : key;
    await this.require(action as ActionName);
    await driver.execute('mobile: setConnectivity', { [key]: on });
    await Wait.until(async () => (await this.getConnectivity())[key] === on, { message: `${key} ${on}` });
    await Wait.settled();
  }

  private static async setOrientation(value: 'PORTRAIT' | 'LANDSCAPE'): Promise<void> {
    await this.require(value === 'PORTRAIT' ? 'portrait' : 'landscape');
    await driver.setOrientation(value);
    await Wait.until(async () => (await this.getOrientation()) === value, { message: `orientation ${value}` });
    await Wait.settled();
  }

  private static async pressVolume(dir: 'up' | 'down'): Promise<void> {
    await this.require('volume');
    if (isIos()) await driver.execute('mobile: pressButton', { name: dir === 'up' ? 'volumeUp' : 'volumeDown' });
    else await driver.pressKeyCode(dir === 'up' ? 24 : 25);
  }

  private static async changePermission(permission: string, action: 'grant' | 'revoke'): Promise<void> {
    const t = await this.require('permissions');
    const caps = (driver.capabilities || {}) as Record<string, unknown>;
    if (t.platform === 'ios') {
      await driver.execute('mobile: setPermission', {
        bundleId: String(caps['appium:bundleId'] || ''),
        access: { [permission]: action === 'grant' ? 'yes' : 'never' },
      });
      return;
    }
    await driver.execute('mobile: changePermissions', {
      appPackage: String(caps['appium:appPackage'] || ''),
      permissions: permission,
      action,
    });
  }

  private static async activate(): Promise<void> {
    await driver.execute("mobile: activateApp", isIos() ? { bundleId: this.appId() } : { appId: this.appId() });
  }

  private static async terminate(): Promise<void> {
    await driver.execute("mobile: terminateApp", isIos() ? { bundleId: this.appId() } : { appId: this.appId() });
  }

  private static appId(): string {
    const caps = (driver.capabilities || {}) as Record<string, unknown>;
    return String(caps['appium:appPackage'] || caps['appium:bundleId'] || '');
  }
}
