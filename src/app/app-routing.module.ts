import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { LayoutDefaultComponent } from './layout/default/default.component';

const routes: Routes = [
  // { path: '', component: HomeComponent ,canActivate: [ACLGuard]},
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      // NO Guard Router
      { path: '', pathMatch: 'full', redirectTo: 'demo' },
      { path: 'demo', loadChildren: 'app/pages/demo/demo.module#DemoModule' }
    ]
  },
  {
    path: 'security',
    loadChildren: 'app/security/security.module#SecurityModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      environment.production
        ? {
            useHash: true,
            preloadingStrategy: PreloadAllModules
          }
        : { useHash: true }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
