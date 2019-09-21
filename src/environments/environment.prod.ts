
(function () { console.log('mode===>prod') })();
export const environment = {
  production: true,
  uat: false,
  dev: false,
  test: false,
  hmr: false,
  IPS_LOGIN_ACCOUNT: '17000000001', // IPS免登陆账号
  IPS_BASE_URL: 'https://core.1ziton.com/api/core/', // IPS后端服务
  API_BASE_URL: 'https://gateway.1ziton.com/api/', // SCM后端服务
  PASSPORT_URL: 'https://passport.1ziton.com/' // 登录服务
};