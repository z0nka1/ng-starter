
/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-8-23 14:39:07
 * @description: 
 */


import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AdNoticeIconModule } from '@core/components/notice-icon';
import { AdReuseTabModule } from '@core/components/reuse-tab';
import { AuthService, PassPortService } from '@core/services/auth/auth.service';
// region: service
import { MenuService } from '@core/services/menu';
import { ModalHelper } from '@core/services/modal';
import { SettingsService } from '@core/services/settings';
import { ReStorageService } from '@core/services/storage/storage.service';
import { TitleService } from '@core/services/title/title.service';
// endregion
// region: all modules
import { AdSidebarNavModule } from './components/sidebar-nav/sidebar-nav.module';

// endregion

// region: export
export { AdNoticeIconModule } from '@core/components/notice-icon';
export * from '@core/components/reuse-tab';
export { AuthService, PassPortService } from '@core/services/auth/auth.service';
export * from '@core/services/menu';
export * from '@core/services/modal';
export { ModalHelper } from '@core/services/modal';
export * from '@core/services/settings';
export { ReStorageService } from '@core/services/storage/storage.service';
export * from '@core/services/title/title.service';
// services
export { TreeNodeService } from '@core/services/utils/tree-node.service';
export { AdSidebarNavModule } from './components/sidebar-nav/sidebar-nav.module';


// endregion


const SERVICES = [MenuService, SettingsService, TitleService, ReStorageService, ModalHelper, PassPortService, AuthService];
const MODULES = [AdSidebarNavModule, AdReuseTabModule, AdNoticeIconModule];

// region: all components
const COMPONENTS = [];
// endregion

// pipes
const PIPES = [];

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ...COMPONENTS,
        ...PIPES
    ],
    exports: [
        ...COMPONENTS,
        ...PIPES,
        ...MODULES
    ],
    providers: [
        ...SERVICES,

    ]
})
export class CoreRootModule { }



@NgModule({ exports: MODULES })
export class CoreModule {
    public static forRoot(): ModuleWithProviders {
        return { ngModule: CoreRootModule };
    }
}
