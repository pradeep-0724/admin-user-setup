import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [
  {
    path: TSRouterLinks.add,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.item.toString().split(',')[0],
      }
    },
    loadChildren: () => import('./add-edit-item-master-module/add-edit-item-master-module.module').then(m => m.AddEditItemMasterModuleModule)
  },
  {
    path: TSRouterLinks.edit + '/:edit-id',
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.item.toString().split(',')[1],
      }
    },
    loadChildren: () => import('./add-edit-item-master-module/add-edit-item-master-module.module').then(m => m.AddEditItemMasterModuleModule)
  },
  {
    path: TSRouterLinks.list,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.item.toString().split(',')[3],
      }
    },
    loadChildren: () => import('./item-list-master-module/item-list-master-module.module').then(m => m.ItemListMasterModuleModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemMasterRoutingModule { }
