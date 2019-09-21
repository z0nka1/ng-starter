/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-08-23 14:38:26
 * @description:
 */

import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { YztACLModule } from '@core/acl';
import { AuthService, CoreModule, PassPortService, ReuseTabService, ReuseTabStrategy } from '@core/core.module';
// services
import { StartupService } from '@core/startup.service';
import { InterceptorService } from '@core/services/api/interceptor';
import { IpsApiService } from '@shared/services/ips-api.service';
import { ZorroExtModule } from '@zorro-ext/lib/yzt-custom.module';
import { API_BASE_URL } from 'app/config/config';
// lib modules
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { RebirthHttpModule } from 'rebirth-http';
import { RebirthStorageModule } from 'rebirth-storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { PagesModule } from './pages/pages.module';
// app modules
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

registerLocaleData(zh);

export function StartupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

@NgModule({
  declarations: [AppComponent],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    NgZorroAntdModule,
    CoreModule.forRoot(),
    ZorroExtModule.forRoot(IpsApiService, API_BASE_URL),
    YztACLModule.forRoot(),
    AppRoutingModule,
    RebirthStorageModule,
    LayoutModule,
    PagesModule,
    RebirthHttpModule,
    SharedModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    StartupService,
    InterceptorService,
    PassPortService,
    AuthService,
    IpsApiService,
    {
      provide: RouteReuseStrategy,
      useClass: ReuseTabStrategy,
      deps: [ReuseTabService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true
    },
    { provide: NZ_I18N, useValue: zh_CN }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
