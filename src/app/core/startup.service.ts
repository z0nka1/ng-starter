import { Injectable } from '@angular/core';
import { MenuService, SettingsService, TitleService } from '@core/core.module';
import { MENUS } from 'app/config/menus';
import { APP_NAME } from '../config/config';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    constructor(
        private settingService: SettingsService,
        private titleService: TitleService,
        private menuService: MenuService
    ) { }

    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise((resolve, reject) => {
            // 初始化菜单
            this.menuService.add(MENUS);
            // 设置页面标题的后缀
            this.titleService.suffix = APP_NAME;
            this.settingService.setApp({
                name: APP_NAME
            });
            resolve(null);
        });
    }

}
