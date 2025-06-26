import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerListComponent } from './container-list/container-list.component';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { ContainerAddEditPopupComponent } from './container-add-edit-popup/container-add-edit-popup.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';

const routes: Routes = [{
  path:TSRouterLinks.list,
  component:ContainerListComponent,
  canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.container.toString().split(',')[3],
      }
    }
},
{
  path:TSRouterLinks.add,
  component:ContainerAddEditPopupComponent,
  canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.container.toString().split(',')[0],
      }
    }
},
{
  path:TSRouterLinks.edit+"/:container_id",
  component:ContainerAddEditPopupComponent,
  canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.container.toString().split(',')[1],
      }
    }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerModuleRoutingModule { }
