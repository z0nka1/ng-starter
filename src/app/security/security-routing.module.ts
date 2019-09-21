import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { Exception404Component } from './exception/404.component';
import { Exception403Component } from './exception/403.component';
import { Exception500Component } from './exception/500.component';
import {LoginComp} from "./login/login.component";


let routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComp, data: { title: '登录' }
      },
      {
        path: '403',
        component: Exception403Component, data: { title: '权限不足' }
      },
      {
        path: '404',
        component: Exception404Component, data: { title: '页面找不到' }
      },
      {
        path: '500',
        component: Exception500Component, data: { title: '服务器内部错误' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [],
  providers: [],
})
export class SecurityRoutingModule {

}
