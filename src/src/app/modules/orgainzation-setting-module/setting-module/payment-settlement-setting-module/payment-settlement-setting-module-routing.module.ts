import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrefrencesComponent } from './prefrences/prefrences.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { PaymentSettlementSettingComponent } from './payment-settlement-setting.component';
import { NgxPermissionsGuard } from 'ngx-permissions';



const routes: Routes = [{
  path:'',
  component:PaymentSettlementSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:PrefrencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },

    },
    {
      path:'custom-field',
      component:CustomFieldComponent,
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
export class PaymentSettlementSettingRoutingModule { }
