import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleInspectionSettingsComponent } from './vehicle-inspection-settings/vehicle-inspection-settings.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { VehicleInspectionPreferenceComponent } from './vehicle-inspection-preference/vehicle-inspection-preference.component';
import { VehicleInspectionCustomFieldsComponent } from './vehicle-inspection-custom-fields/vehicle-inspection-custom-fields.component';

const routes: Routes = [{
  path:'',
  component:VehicleInspectionSettingsComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:VehicleInspectionPreferenceComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/overview'
        }
      },
    },
    {
      path:'custom-field',
      component: VehicleInspectionCustomFieldsComponent,
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
export class VehicleInspectionModuleRoutingModule { }
