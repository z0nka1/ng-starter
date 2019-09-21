// ---------------------------------------------------------
// | Imports
// ---------------------------------------------------------

// Common of angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AreaDownSelectModule } from '@zorro-ext/lib/area-down-select/area-down-select.component';
import { CarrierSelectModule } from '@zorro-ext/lib/carrier-select/carrier-select.component';
import { CustomerGoodtModule } from '@zorro-ext/lib/customer-good/customer-good.component';
import { CustomerAndCargoGoodtModule } from '@zorro-ext/lib/customerAndCargo-good/customerAndCargo-good.component';
import { YztLoadingModule } from '@zorro-ext/lib/loading/yzt-loading.component';
import { ApiService } from '@zorro-ext/lib/services/api.service';
import { StaffSelectModule } from '@zorro-ext/lib/staff-select/staff-select.component';
import { StandardGoodModule } from '@zorro-ext/lib/standard-good/standard-good.component';
import { AbnormalSelectModule } from './abnormal-select/abnormal-select.component';
import { AreaSelectModule } from './area-select/area-select.component';
import { CitySelectModule } from './city-select/city-select.component';
import { CneeSelectModule } from "./cnee-select/cnee-select.component";
import { DepartmentSelectModule } from './department-select/departement-select.component';
import { EchartsModule } from './echarts/echarts.component';
import { MasterSelectModule } from "./master-select/master-select.component";
import { RepairGoodSelectModule } from './repair-goods-select/repair-goods-select.component';
// Services
import { API } from './services/api';
// Directives
import { DirectivesModule } from './share/directives/yzt-directives.modules';
import { ShipperSelectModule } from "./shipper-select/shipper-select.component";
import { YztUploadModule } from './upload/yzt-upload.module';
import { CustomTemplateModule } from './yzt-grid/custom-template.component';
import { GridIconModule } from './yzt-grid/grid-icon.component';
import { UIGridModule } from './yzt-grid/yzt-grid.component';
import { YztTabsModule } from './yzt-tabs/yzt-tabs.module';
import { YZTViewerDirectiveModule } from './yzt-viewer/yzt-viewer.directive';



// ---------------------------------------------------------
// | Exports
// ---------------------------------------------------------
// interface
export { AreaDownSelectModule } from '@zorro-ext/lib/area-down-select/area-down-select.component';
export { CarrierSelectModule } from '@zorro-ext/lib/carrier-select/carrier-select.component';
export { CustomerGoodtModule } from '@zorro-ext/lib/customer-good/customer-good.component';
export { CustomerAndCargoGoodtModule } from '@zorro-ext/lib/customerAndCargo-good/customerAndCargo-good.component';
export { YztLoadingModule } from '@zorro-ext/lib/loading/yzt-loading.component';
export { StaffSelectModule } from '@zorro-ext/lib/staff-select/staff-select.component';
export { StandardGoodModule } from '@zorro-ext/lib/standard-good/standard-good.component';
// Modules
export { NgZorroAntdModule } from 'ng-zorro-antd';
export { AbnormalSelectModule } from './abnormal-select/abnormal-select.component';
export { AreaSelectModule } from './area-select/area-select.component';
export { CitySelectModule } from './city-select/city-select.component';
export { CneeSelectModule } from "./cnee-select/cnee-select.component";
export { DepartmentSelectModule } from './department-select/departement-select.component';
export { EchartsModule } from './echarts/echarts.component';
export { MasterSelectModule } from "./master-select/master-select.component";
export { RepairGoodSelectModule } from './repair-goods-select/repair-goods-select.component';
export { ShipperSelectModule } from "./shipper-select/shipper-select.component";
export * from './upload/interface';
export { YztUploadModule } from './upload/yzt-upload.module';
export { CustomTemplateModule } from './yzt-grid/custom-template.component';
export { GridIconModule } from './yzt-grid/grid-icon.component';
export { UIGridModule } from './yzt-grid/yzt-grid.component';
export { YztTabsModule } from './yzt-tabs/yzt-tabs.module';
export { YZTViewerDirectiveModule } from './yzt-viewer/yzt-viewer.directive';

// Components

// Services

// Tokens (eg. global services' config)

// ---------------------------------------------------------
// | Root module
// ---------------------------------------------------------

@NgModule({
  exports: [
    // NgZorroAntdModule,
    EchartsModule,
    UIGridModule,
    ShipperSelectModule,
    StaffSelectModule,
    CarrierSelectModule,
    RepairGoodSelectModule,
    GridIconModule,
    CustomTemplateModule,
    DirectivesModule,
    YztUploadModule,
    YZTViewerDirectiveModule,
    CneeSelectModule,
    MasterSelectModule,
    AbnormalSelectModule,
    AreaSelectModule,
    DepartmentSelectModule,
    CitySelectModule,
    YztTabsModule,
    CustomerGoodtModule,
    StandardGoodModule,
    AreaDownSelectModule,
    CustomerAndCargoGoodtModule,
    YztLoadingModule
  ]
})
export class ZorroExtModule {
  static forRoot(CustomAPI, API_BASE_URL): ModuleWithProviders {
    return {
      ngModule: ZorroExtModule,
      providers: [
        ApiService,
        { provide: API, useClass: CustomAPI },
        { provide: 'API_BASE_URL', useValue: API_BASE_URL }
      ]
    };
  }
}
