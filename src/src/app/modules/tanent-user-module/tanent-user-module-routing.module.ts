import { MainAppAuthGaurd } from './../../core/services/mainappauth.guard';
import { TanentUserComponent } from './tanent-user.component';
import { TanentUserComponentComponent } from './tanent-user-component/tanent-user-component.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGaurd } from 'src/app/core/services/auth.gaurd';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [{
  path:'',
  component:TanentUserComponent,
  children:[
    {
      component:TanentUserComponentComponent,
      path:'tenant-list',
    },
     {
      pathMatch:'full',
      path:'',
      redirectTo:'/client/tenant-list'
    },
    {
      path:':id',
      loadChildren: () => import('../../modules/customerapp-module/customerapp.module').then(m => m.CustomerappModule),
      canActivate: [MainAppAuthGaurd]
    },
    {
      path: ':id/onboading',
      loadChildren: () => import('../../modules/onboarding-module/company-module-add.module').then(m => m.CompanyModuleAddModule),
      canActivate: [AuthGaurd]
    },
    {
      path:':id/'+TSRouterLinks.organization_setting,
      loadChildren: () => import('../orgainzation-setting-module/orgainzation-setting-module.module').then(m => m.OrgainzationSettingModuleModule),
      canActivate: [MainAppAuthGaurd]
    },
  ]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TanentUserModuleRoutingModule { }
