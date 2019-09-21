import { OAUTH_LOGIN_URL, TOKEN_KEY, USER_INFO_KEY, IPS_TOKEN_KEY } from "../../../config/config";

/**退出登陆JSONP回调方法 */
(<any>window)._logoutCallback = (e) => {
  // session级别
  sessionStorage.removeItem(USER_INFO_KEY);
  sessionStorage.removeItem(IPS_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.clear();
  setTimeout(() => {
    // demo演示临时注释
    // window.location.href = OAUTH_LOGIN_URL;
  }, 100)
}

