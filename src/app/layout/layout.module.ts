import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { AdSidebarNavModule, AdReuseTabModule, AdNoticeIconModule } from '@core/core.module';
import { LayoutDefaultComponent } from './default/default.component';
import { DefaultHeaderComponent } from './default/header/header.component';
import { SidebarDefaultComponent } from './default/sidebar/sidebar.component';
import { HeaderUserComponent } from './default/header/components/user.component';
import { HeaderNotifyComponent } from './default/header/components/notify.component';


const COMPONENTS = [
    LayoutDefaultComponent,
    SidebarDefaultComponent,
    DefaultHeaderComponent,
    HeaderNotifyComponent,
    HeaderUserComponent
];

const HEADERCOMPONENTS = [

];


@NgModule({
    imports: [
        SharedModule,
        AdSidebarNavModule,
        AdReuseTabModule.forRoot(),
        AdNoticeIconModule.forRoot()
    ],
    providers: [],
    declarations: [
        ...COMPONENTS,
        ...HEADERCOMPONENTS,
    ],
    exports: [
        ...COMPONENTS
    ]
})
export class LayoutModule { }
