// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

(function () { console.log('mode===>test') })();
export const environment = {
  production: false,
  uat: false,
  dev: false,
  test: true,
  hmr: false,
  IPS_LOGIN_ACCOUNT: '17000000001',
  IPS_BASE_URL: 'http://192.168.100.20:11101/',
  API_BASE_URL: 'http://192.168.100.121:17600/api/',
  PASSPORT_URL: 'http://192.168.100.121:17800/'
};
