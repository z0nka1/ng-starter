import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { YztACLModule } from '@core/acl';
import { CopyDomDirective } from '@shared/directives/copy-dom.directive';
import { StopPropagationDirective } from '@shared/directives/stopPropagation.directive';
import { GlobalObservable } from '@shared/services/global-observable';
import { ValidatorModule } from '@shared/validator/validator.module';
import { ZorroExtModule } from '@zorro-ext/lib/yzt-custom.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AreaMultipleSelectComponent } from './component/area-multiple/area-multiple.component';
import { SetPageHeightDirective } from './directives/set-page-height.directive';
import { CallbackPipe } from './pipes/callback.pipe';
import { QueryTabsComponent, QueryTabsMapPipe } from './component/query-tabs/query-tabs.component';
import { TranslatePipe } from './pipes/translate.pipe';

const COMPONENTS = [AreaMultipleSelectComponent, QueryTabsComponent];

const DIRECTIVES = [SetPageHeightDirective, StopPropagationDirective, CopyDomDirective];

const PIPES = [CallbackPipe, QueryTabsMapPipe, TranslatePipe];

const MODULES = [YztACLModule];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ValidatorModule,
    ZorroExtModule,
    ...MODULES
  ],
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PIPES],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroAntdModule,
    ZorroExtModule,
    ValidatorModule,
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ],
  providers: [GlobalObservable]
})
export class SharedModule {}
