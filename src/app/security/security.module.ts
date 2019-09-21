import {NgModule} from '@angular/core';


import {SharedModule} from '@shared/shared.module';
import {SecurityRoutingModule} from './security-routing.module';
import {SecurityComponent} from './security.component';
import {Exception404Component} from './exception/404.component';
import {Exception403Component} from './exception/403.component';
import {Exception500Component} from './exception/500.component';
import {ExceptionComponent} from './exception/exception.component';
import {LoginComp} from "./login/login.component";
import {VerifyService} from "./security.service";


@NgModule({
    imports: [
        SharedModule,
        SecurityRoutingModule
    ],
    declarations: [
        ExceptionComponent,
        SecurityComponent,
        Exception403Component,
        Exception404Component,
        Exception500Component,
        LoginComp
    ],
    providers: [
        VerifyService
    ]
})
export class SecurityModule {
}
