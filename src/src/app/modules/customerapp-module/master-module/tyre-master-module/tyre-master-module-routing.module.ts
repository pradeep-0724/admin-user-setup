import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [
  {
    path:TSRouterLinks.add,
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./add-edit-tyre-master-module/add-edit-tyre-master-module.module').then(m => m.AddEditTyreMasterModule),
    data: {
      permissions: {
        only:Permission.tyre_master.toString().split(',')[0],
      }
    }
  },
  {
    path:TSRouterLinks.edit,
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./add-edit-tyre-master-module/add-edit-tyre-master-module.module').then(m => m.AddEditTyreMasterModule),
    data: {
      permissions: {
        only:Permission.tyre_master.toString().split(',')[1],
      }
    }
  },

  {
    path:TSRouterLinks.view,
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./tyre-master-list-details-module/tyre-master-list-details-module.module').then(m => m.TyreMasterListDetailsModule),
    data: {
      permissions: {
        only:Permission.tyre_master.toString().split(',')[3],
      }
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TyreMasterModuleRoutingModule { }
