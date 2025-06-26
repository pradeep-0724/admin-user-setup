import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
  {
    path: TSRouterLinks.add,
    loadChildren:()=>import('./add-edit-bos-module/add-edit-bos-module.module').then(m=>m.AddEditBosModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only:Permission.bos.toString().split(',')[0],
      }
    },
  },
  {
    path: TSRouterLinks.list,
    loadChildren:() =>import('./bos-list-view-module/bos-list-view-module.module').then(m=>m.BosListViewModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.bos.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.edit + '/:billofsupply_id',
    loadChildren:()=>import('./add-edit-bos-module/add-edit-bos-module.module').then(m=>m.AddEditBosModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only:Permission.bos.toString().split(',')[1],
      }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillOfSupplyRoutingModule { }
