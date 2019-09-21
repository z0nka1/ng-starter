import { Component } from '@angular/core';
import { SettingsService, AuthService } from '@core/core.module';
import { Router } from '@angular/router';
import { GlobalObservable } from '@shared/services/global-observable';

@Component({
    selector: 'app-default-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']

})
export class DefaultHeaderComponent {

    get isShipper() {
        return _.get(this.settings.user, 'isShipperOrNotUser', false);
    }

    get userCode() {
        return _.get(this.settings.user, 'organize.code', '');
    }
    constructor(
        private router: Router,
        public settings: SettingsService, // 必须public,html有用到
        private authSrv: AuthService,
        private _globalSrv: GlobalObservable
    ) { }

    toggleCollapsedSidebar() {
        this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
        this._globalSrv.toggleCollapsedSidebar.next();
    }


    loginOut() {
        this.authSrv.logout();
    }

    goToProfile() {
        this.router.navigateByUrl(`/user/${this.userCode}`)
    }
}
