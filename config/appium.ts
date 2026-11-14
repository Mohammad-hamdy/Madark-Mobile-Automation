export type Target = 'local' | 'browserstack';

export function currentTarget(): Target {
  return (process.env.E2E_TARGET || 'local').toLowerCase() === 'browserstack' ? 'browserstack' : 'local';
}

export function connection(): Record<string, unknown> {
  if (currentTarget() === 'browserstack') {
    return {
      protocol: 'https',
      hostname: 'hub-cloud.browserstack.com',
      port: 443,
      path: '/wd/hub',
      user: process.env.BROWSERSTACK_USERNAME,
      key: process.env.BROWSERSTACK_ACCESS_KEY,
    };
  }
  return {
    hostname: process.env.APPIUM_HOST || '127.0.0.1',
    port: Number(process.env.APPIUM_PORT || 4725),
    path: '/',
  };
}
