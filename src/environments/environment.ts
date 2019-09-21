// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
(function () {
  console.log("mode===>local");
})();
export const environment = {
  production: false,
  uat: false,
  dev: true,
  test: false,
  hmr: false,
  IPS_LOGIN_ACCOUNT: '17000000001', // IPS免登陆账号
  API_BASE_URL: 'https://yapi.1ziton.com/mock/112', // 开发环境
  IPS_BASE_URL: 'http://192.168.100.20:11101/',
  PASSPORT_URL: 'http://192.168.100.121:17800/'
};
