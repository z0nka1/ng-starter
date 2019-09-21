import { ObserversModule } from '@angular/cdk/observers';
// import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { YztTabComponent } from "./yzt-tab.component";
import { YztTabSetComponent } from "./yzt-tabset.component";
import { YztTabsNavComponent } from "./yzt-tabs-nav.component";
import { YztTabLabelDirective } from "./yzt-tab-label.directive";
import { YztTabsInkBarDirective } from "./yzt-tabs-ink-bar.directive";
import { YztTabBodyComponent } from "./yzt-tab-body.component";


@NgModule({
  declarations: [ YztTabComponent, YztTabSetComponent, YztTabsNavComponent, YztTabLabelDirective, YztTabsInkBarDirective, YztTabBodyComponent ],
  exports     : [ YztTabComponent, YztTabSetComponent, YztTabsNavComponent, YztTabLabelDirective, YztTabsInkBarDirective, YztTabBodyComponent ],
  imports     : [ CommonModule, ObserversModule ]
})
export class YztTabsModule {
}
