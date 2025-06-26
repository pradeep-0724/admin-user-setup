import { PaymentVendorCustomFieldComponent } from './payment-vendor-custom-field/payment-vendor-custom-field.component';
import { PaymentVendorPreferencesComponent } from './payment-vendor-preferences/payment-vendor-preferences.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { PaymentVendorSettingComponent } from './payment-vendor-setting.component';

const routes: Routes = [{
  path:'',
  component:PaymentVendorSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:PaymentVendorPreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:getPrefix()+'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:PaymentVendorCustomFieldComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:getPrefix()+'/master/overview'
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
          redirectTo:getPrefix()+'/master/overview'
        }
      }
    },]

}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentVendorAdvanceSettingModuleRoutingModule { }
