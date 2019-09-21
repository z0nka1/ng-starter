/*
 * @Author: WuFengliang 
 * @Date: 2018-06-20 14:14:17 
 * @Description:   打印 
 * @Last Modified time: 2018-06-20 14:14:17 
 */
/* tslint:disable */
import { NzMessageService } from "ng-zorro-antd";

const waitFun = (msg, fn) => {
    let LODOP;
    try {

        LODOP = (<any>window).getCLodop();

        if (document.readyState !== "complete") {
            msg.error("C-Lodop没准备好，请稍后再试！");
            return;
        };

        if (LODOP.VERSION) {
            if (LODOP.CVERSION) {
                fn();

            } else {
                msg.error(`本机已成功安装了Lodop控件！\n 版本号:${LODOP.VERSION}，请启动服务！`);
            }
            return;
        };

        return LODOP;
    } catch (err) {
        msg.error(`若已安装插件，请启动服务！否则，请<a href="${window.location.protocol}//${window.location.host}/iframe/print/CLodop_Setup_for_Win32NT.exe">点击我</a>下载插件`)
    };
}

/**
 * getClodop 方法 是引入js中方法
 * @param msg:弹框对象
 * @param fn:打印相关参数
 */

//====获取LODOP对象的主过程：====
export function print(msg: NzMessageService, fn: Function) {

    //====页面动态加载C-Lodop云打印必须的文件CLodopfuncs.js====
    if (!(<any>window).getCLodop) {
        const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

        //让本机的浏览器打印(更优先一点)：
        const local_script = document.createElement("script");
        local_script.src = "http://localhost:8000/CLodopfuncs.js?priority=2";
        head.insertBefore(local_script, head.firstChild);

        //加载双端口(8000和18000）避免其中某个端口被占用：
        const backup_script = document.createElement("script");
        backup_script.src = "http://localhost:18000/CLodopfuncs.js?priority=1";
        head.insertBefore(backup_script, head.firstChild);

        let script = local_script || backup_script;
        if (script['readyState']) {   //IE
            script['onreadystatechange'] = () => {
                if (script['readyState'] === 'complete' || script['readyState'] === 'loaded') {
                    script['onreadystatechange'] = null;
                    setTimeout(() => {
                        waitFun(msg, fn);
                    }, 0)
                }
            }
        } else {    //非IE
            script.onload = () => {
                setTimeout(() => {
                    waitFun(msg, fn);
                }, 0)
            }
        }
        return;
    }

    waitFun(msg, fn);

    return;

}