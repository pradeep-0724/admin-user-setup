import { VehicleTripSettingPreferencesComponent } from './vehicle-trip-setting-preferences/vehicle-trip-setting-preferences.component';
import { VehicleTripSettingComponent } from './vehicle-trip-setting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleTripSettingCustomFiledsComponent } from './vehicle-trip-setting-custom-fileds/vehicle-trip-setting-custom-fileds.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TripApprovalComponent } from './trip-approval/trip-approval.component';
import { TripValidationComponent } from './trip-validation/trip-validation.component';

const routes: Routes = [{
  path:'',
  component:VehicleTripSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:VehicleTripSettingPreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'approval',
      component:TripApprovalComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'validation',
      component:TripValidationComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component: VehicleTripSettingCustomFiledsComponent,
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
export class VehicleTripModuleRoutingModule { }
