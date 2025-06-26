import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditNewMarketVehicleComponent } from './add-edit-new-market-vehicle/add-edit-new-market-vehicle.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';

const routes: Routes = [
  {
    path :'add',
    component:  AddEditNewMarketVehicleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.market_vehicle.toString().split(',')[0],
      }
    }
  },
  {
    path :'edit/:vehicle_id',
    component:  AddEditNewMarketVehicleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.market_vehicle.toString().split(',')[1],
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditNewMarketVehicleRoutingModule { }
