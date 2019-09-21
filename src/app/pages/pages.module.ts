import { NgModule } from '@angular/core';
import { LAZYPAGE_COMPONENTS } from 'app/pages/lazy-pages';
import { SharedModule } from '../shared/shared.module';
import { AdSidebarNavModule, AdReuseTabModule, AdNoticeIconModule } from '@core/core.module';

const COMPONENTS = [];

const COMPONENT_MODULES = [];

@NgModule({
  declarations: [...COMPONENTS, ...LAZYPAGE_COMPONENTS],
  entryComponents: [...LAZYPAGE_COMPONENTS],
  imports: [
    SharedModule,
    AdSidebarNavModule,
    AdReuseTabModule.forRoot(),
    AdNoticeIconModule.forRoot(),
    ...COMPONENT_MODULES
  ],
  exports: [],
  providers: []
})
export class PagesModule {}
