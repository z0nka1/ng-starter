// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

(function () { console.log('mode===>dev') })();
export const environment = {
  production: true,
  uat: false,
  dev: true,
  test: false,
  hmr: false,
  IPS_LOGIN_ACCOUNT: '17000000001',
  IPS_BASE_URL: 'http://192.168.100.90:11101/',
  API_BASE_URL: 'http://192.168.100.48:17600/api/',
  PASSPORT_URL: 'http://192.168.100.48:17800/'
};