import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalPurchaseOrderSettingComponent } from './local-purchase-order-setting.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { LocalPurchaseOrderPrefrencesComponent } from './local-purchase-order-prefrences/local-purchase-order-prefrences.component';

const routes: Routes = [{
  path:'',
  component:LocalPurchaseOrderSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:LocalPurchaseOrderPrefrencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path: '',
      redirectTo:'prefrence',
      pathMatch: 'full',
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },]

}
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalPurchaseOrderSettingModuleRoutingModule { }
