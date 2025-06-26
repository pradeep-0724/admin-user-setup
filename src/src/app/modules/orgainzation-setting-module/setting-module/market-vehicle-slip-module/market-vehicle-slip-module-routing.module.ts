import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { MarketVehicleSlipCustomFieldComponent } from './market-vehicle-slip-custom-field/market-vehicle-slip-custom-field.component';
import { MarketVehicleSlipPreferencesComponent } from './market-vehicle-slip-preferences/market-vehicle-slip-preferences.component';
import { MarketVehicleSlipSettingsComponent } from './market-vehicle-slip-settings/market-vehicle-slip-settings.component';

const routes: Routes = [{
  path:'',
  component:MarketVehicleSlipSettingsComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:MarketVehicleSlipPreferencesComponent,
      data: {
        permissions: {
          only:'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:MarketVehicleSlipCustomFieldComponent,
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
export class MarketVehicleSlipModuleRoutingModule { }
