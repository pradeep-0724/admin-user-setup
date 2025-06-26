import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceCustomFieldComponent } from './invoice-custom-field/invoice-custom-field.component';
import { InvoicePreferencesComponent } from './invoice-preferences/invoice-preferences.component';
import { InvoiceSettingComponent } from './invoice-setting.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [{
  path:'',
  component:InvoiceSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:InvoicePreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:InvoiceCustomFieldComponent,
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
export class InvoiceSettingModuleRoutingModule { }
