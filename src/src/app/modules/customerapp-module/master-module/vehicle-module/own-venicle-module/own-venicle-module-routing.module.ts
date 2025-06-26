import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [
  {
    path: TSRouterLinks.master_vehicle_add,
    loadChildren: () => import('./add-edit-vehicle-v2/add-edit-vehicle-v2.module').then(m => m.AddEditVehicleV2Module),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.vehicle.toString().split(',')[0],
      }
    }
  },
  {
    path: TSRouterLinks.master_vehicle_edit + '/:vehicle_id',
    loadChildren: () => import('./add-edit-vehicle-v2/add-edit-vehicle-v2.module').then(m => m.AddEditVehicleV2Module),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.vehicle.toString().split(',')[1],      }
    }
  },
  {
    path: TSRouterLinks.master_vehicle_view,
    loadChildren:() => import('./vehicle-list-module/vehicle-list-module.module').then(m=>m.VehicleListModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.vehicle.toString().split(',')[3],      }
    }
  },
  {
    path: TSRouterLinks.master_vehicle_detail,
    loadChildren:() => import('./vehicle-details-v2/vehicle-details-v2.module').then(m=>m.VehicleDetailsV2Module),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.vehicle.toString().split(',')[3],
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnVenicleModuleRoutingModule { }
