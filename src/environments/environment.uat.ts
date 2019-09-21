// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

(function () { console.log('mode===>uat') })();
export const environment = {
  production: false,
  uat: true,
  dev: false,
  test: false,
  hmr: false,
  IPS_LOGIN_ACCOUNT: '17000000001',
  IPS_BASE_URL: 'https://uatcore.1ziton.com/api/core/',
  API_BASE_URL: 'https://uatgateway.1ziton.com/api/',
  PASSPORT_URL: 'https://uatpassport.1ziton.com/'
};
