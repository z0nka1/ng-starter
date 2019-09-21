import { Component } from '@angular/core';
import { NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ReuseTabService } from '@core/core.module';

@Component({
    selector: 'layout-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.less']
})
export class LayoutDefaultComponent {
    isFetching = false;

    constructor(
        private router: Router,
        private _message: NzMessageService,
        private _reuseTabSrv: ReuseTabService,
    ) {
        // scroll to top in change page
        router.events.subscribe(evt => {

            if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
                this.isFetching = true;
            }
            if (evt instanceof NavigationError) {
                this.isFetching = false;
                _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
                return;
            }
            if (!(evt instanceof NavigationEnd)) {
                return;
            }

            setTimeout(() => {
                // scroll.scrollToTop();
                this.isFetching = false;
            }, 100);
        });
    }
    // HACK
    onRouterActivate($event) {
        this._reuseTabSrv._newTabChange.next($event);
    }
}
