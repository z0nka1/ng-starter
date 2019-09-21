import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestTab2Component } from '@pages/demo/test-tab2/test-tab2.component';
import { RouterModule } from '@angular/router';
import { TestTabComponent } from '@pages/demo/test-tab/test-tab.component';
import { SharedModule } from '@shared/shared.module';
import { DemoService } from './demo.service';

const routes = [
  { path: '', pathMatch: 'full', redirectTo: 'test-tab' },
  {
    path: 'test-tab2',
    component: TestTab2Component,
    data: { resue: true, title: 'tab2测试' }
  },
  {
    path: 'test-tab',
    component: TestTabComponent,
    data: { resue: true, title: '测试Tab' }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule, RouterModule.forChild(routes), SharedModule],
  declarations: [TestTab2Component, TestTabComponent],
  providers: [DemoService]
})
export class DemoModule {}
