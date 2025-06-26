import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';

const routes: Routes = [
   {
    path:TSRouterLinks.tyremaster,
    loadChildren: () => import('../tyre-master-module/tyre-master-module.module').then(m => m.TyreMasterModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.tyre_master.toString().split(','),
      }
    }
  },
  {
    path:'own',
    loadChildren: () => import('./own-venicle-module/own-venicle-module.module').then(m => m.OwnVenicleModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.vehicle.toString().split(','),
      }
    }
  },
  {
    path:TSRouterLinks.market_vehicle,
    loadChildren: () => import('./new-market-vehicle/new-market-vehicle.module').then(m => m.NewMarketVehicleModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.market_vehicle.toString().split(','),
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
