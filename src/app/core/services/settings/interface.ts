export interface App {
    name?: string;
    description?: string;
    year?: number;
    [key: string]: any;
}

export interface User {
    userCode?: string; // 登陆用户code
    name?: string;
    avatar?: string;
    email?: string;
    consignorCode?: string; // 发货人客户code
    [key: string]: any;
}


export interface Layout {
    /** 是否固定顶部菜单 */
    fixed: boolean;
    /** 是否折叠右边菜单 */
    collapsed: boolean;
    /** 是否固定宽度 */
    boxed: boolean;
    /** 当前主题 */
    theme: string;
    /** 语言环境 */
    lang: string;
}
