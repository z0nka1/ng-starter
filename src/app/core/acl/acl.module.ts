import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// region: import
import { DelonACLConfig } from './acl.config';
import { ACLGuard } from './services/acl-guard';
import { ACLService } from './services/acl.service';
import { ACLDirective } from '@core/acl/directives/acl.directive';
const SERVICES = [ACLService, ACLGuard];

// components

const COMPONENTS = [ACLDirective];

@NgModule({
  imports: [CommonModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class YztACLModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: YztACLModule,
      providers: [DelonACLConfig, ...SERVICES],
    };
  }
}
