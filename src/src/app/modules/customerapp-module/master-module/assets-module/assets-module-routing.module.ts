import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [
  {
    path: TSRouterLinks.add,
    loadChildren: () => import('./add-assets-module/add-assets-module.module').then(m => m.AddAssetsModuleModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.assets.toString().split(',')[0],
      }
    }
  },
  {
    path: TSRouterLinks.edit,
    loadChildren: () => import('./add-assets-module/add-assets-module.module').then(m => m.AddAssetsModuleModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.assets.toString().split(',')[1],
      }
    }
  },
  {
    path: TSRouterLinks.view,
    loadChildren: () => import('./view-assets-module/view-assets-module.module').then(m => m.ViewAssetsModuleModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.assets.toString().split(',')[3],
      }
    }
  },
  {
    path: TSRouterLinks.list,
    loadChildren: () => import('./list-assets-module/list-assets-module.module').then(m => m.ListAssetsModuleModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.assets.toString().split(',')[3],
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsModuleRoutingModule { }
