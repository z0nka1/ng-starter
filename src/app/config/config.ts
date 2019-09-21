import { environment } from "@env/environment";

/**应用名称 */
export const APP_NAME = 'DASHIXIONG';
export const API_VERSION = 'v1';

/**大师兄 API服务地址 */
export const API_BASE_URL = environment.API_BASE_URL;

/**IPS API服务地址 */
export const IPS_BASE_URL = environment.IPS_BASE_URL;
// IPS免密登录密匙
/**IPS免密登录账号(异常反馈用的帐号) */
export const IPS_LOGIN_ACCOUNT = environment.IPS_LOGIN_ACCOUNT;
export const IPS_CERTIFICATE_KEY = 'V6TI6ikg2NZOqcwE';
/**passport服务地址 */
export const PASSPORT_URL = environment.PASSPORT_URL;

/**登陆服务地址 */
export const OAUTH_LOGIN_URL = '/#/security/login';
/**退出登陆服务 */
export const LOGOUT_URL = '/logout';
/**访问领域（获取当前登录用户url），token */
export const CUR_USERINFO_URL = '/user/me';

/**缓存KEY值变量 */
export const TOKEN_KEY = '_access_tk_'; // jwt token
export const USER_INFO_KEY = '_usr_k_'; // 用户信息
export const USER_PEMISSION_KEY = '_usr_pms_'; // 菜单
export const USER_PEMISSION_ROUTE_KEY = '_usr_pms_route_'; // 路由
export const USER_PEMISSION_BTN_KEY = '_usr_pms_btn_'; // 按钮或者单页面（非菜单权限控制）
export const IPS_TOKEN_KEY = '_ips_access_tk_'; // ips token
export const USER_NAME = '_usr_name_'; // 用户名称

/**需要忽略拦截的接口 */
export const IGNORE_API_INTERCEPT = [
    'baseConfig/upload',
    'oauth/token',
];

// 发抖统一控制时间
export const DEBOUNCE_TIME = 200;

/**
 * 微服务，按功能模块分
 * @type {string}
 */
// 用户管理
export const userURL = `${API_BASE_URL}/user/${API_VERSION}/api`;
// 采购管理
export const supplierManageURL = `${API_BASE_URL}/supplierManage/${API_VERSION}/api`;
// 登录相关
export const securityURL = `${API_BASE_URL}/auth/${API_VERSION}/api`;
// 基础数据
export const baseDataURL = `${API_BASE_URL}/baseData/${API_VERSION}/api`;
