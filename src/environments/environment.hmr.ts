// 支持Hot Module Replacement（HMR）

(function () {
  console.log("mode===>Hot Module Replacement（HMR）");
})();
export const environment = {
  production: false,
  uat: false,
  dev: true,
  test: false,
  hmr: true,
  IPS_LOGIN_ACCOUNT: '17000000001',
  IPS_BASE_URL: 'http://192.168.100.90:11101/',
  PASSPORT_URL: "http://192.168.3.98:7800/",
  // API_BASE_URL: 'http://192.168.100.38:7777/api/', // 测试backend （后期7777端口对外不可访问）
  // API_BASE_URL: "https://yapi.1ziton.com/mock/29/api/" // yapi mock
  // API_BASE_URL:'http://192.168.3.101:7777/api/', // 张思源backend
  // API_BASE_URL:'http://192.168.3.169:7777/api/', // 罗有利backend
  // API_BASE_URL:'http://192.168.3.116:7600/api/', // 建荣 backend
  // API_BASE_URL:'http://192.168.7.176:7777/api/', // 俊荣 mac backend
  API_BASE_URL: 'http://192.168.3.98:7600/api/', // 俊荣 backend
  // API_BASE_URL:'http://192.168.3.208:7777/api/', // 张蒙 backend
  // API_BASE_URL:'http://192.168.3.129:7600/api/', // 善玩 backend
  // API_BASE_URL: 'http://192.168.3.234:7777/api/', // 陈波 backend
};
