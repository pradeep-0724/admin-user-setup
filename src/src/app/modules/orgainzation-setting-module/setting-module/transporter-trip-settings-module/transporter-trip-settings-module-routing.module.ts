import { TransporterTripSettingComponent } from './transporter-trip-setting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransporterTripCustomPreferencesComponent } from './transporter-trip-custom-preferences/transporter-trip-custom-preferences.component';
import { TransporterTripCustomFieldComponent } from './transporter-trip-custom-field/transporter-trip-custom-field.component';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [{
  path:'',
  component:TransporterTripSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:TransporterTripCustomPreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:TransporterTripCustomFieldComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path: '',
      redirectTo:'custom-field',
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
export class TransporterTripSettingsModuleRoutingModule { }
