import { PaymentAgainstCustomFieldComponent } from './payment-against-custom-field/payment-against-custom-field.component';
import { PaymentAgainstPreferencesComponent } from './payment-against-preferences/payment-against-preferences.component';
import { PaymentAgainstSettingsComponent } from './payment-against-settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

const routes: Routes = [{
  path:'',
  component:PaymentAgainstSettingsComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:PaymentAgainstPreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:getPrefix()+'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:PaymentAgainstCustomFieldComponent,
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
export class PayementAgainstBillModuleRoutingModule { }
