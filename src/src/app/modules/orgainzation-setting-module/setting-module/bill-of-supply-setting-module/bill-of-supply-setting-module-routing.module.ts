import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { BillofsupplysettingsComponent } from './billofsupplysettings.component';
import { BillOfSupplyCustomFieldComponent } from './bill-of-supply-custom-field/bill-of-supply-custom-field.component';
import { BillOfSupplyPreferencesComponent } from './bill-of-supply-preferences/bill-of-supply-preferences.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [{
  path:'',
  component:BillofsupplysettingsComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:BillOfSupplyPreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:getPrefix()+'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:BillOfSupplyCustomFieldComponent,
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
export class BillOfSupplySettingModuleRoutingModule { }
