import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class GlobalObservable {

    dataSoruce: BehaviorSubject<any> = new BehaviorSubject(null);
    orderPanelObs = new BehaviorSubject(null);

    // 收缩侧边栏
    toggleCollapsedSidebar = new Subject();

    // 控制页面外部关闭tab页
    reuseTabIndexStream = new Subject();
    reuseTabCloseStream = new Subject();

    paymentSuccess$: Subject<any> = new Subject<any>();

    constructor(private router: Router) {
    }

    globalTransDataOrJump(data, url?) {
        this.dataSoruce.next(data);
        if (!!url) {
            this.router.navigateByUrl(url)
        }
    }

    // 是否异步查询，控制表单loading图表
    orderPanelQuery(b: Boolean) {
        this.orderPanelObs.next(b);
    }


}
