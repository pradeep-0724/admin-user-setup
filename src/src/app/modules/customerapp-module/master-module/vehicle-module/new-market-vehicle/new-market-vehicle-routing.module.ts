import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./add-edit-new-market-vehicle/add-edit-new-market-vehicle.module').then(m => m.AddEditNewMarketVehicleModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.market_vehicle.toString().split(','),
      }
    }
  },
  {
    path: '',
    loadChildren: () => import('./new-market-vehicle-list/new-market-vehicle-list.module').then(m => m.NewMarketVehicleListModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.market_vehicle.toString().split(',')[3],
      }
    }
  },
  {
    path: '',
    loadChildren: () => import('./new-market-vehicle-details/new-market-vehicle-details.module').then(m => m.NewMarketVehicleDetailsModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.market_vehicle.toString().split(',')[3],
      }
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewMarketVehicleRoutingModule { }
