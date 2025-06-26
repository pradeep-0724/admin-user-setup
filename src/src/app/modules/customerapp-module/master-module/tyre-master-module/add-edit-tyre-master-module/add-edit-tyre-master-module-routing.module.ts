import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { VehicleTyreMasterComponent } from './vehicle-tyre-master/vehicle-tyre-master.component';

const routes: Routes = [
  {
    path:'',
    component: VehicleTyreMasterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.tyre_master.toString().split(',')[0],
      }
    }
  },

  {
    path:':tyremaster_id',
    component: VehicleTyreMasterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.tyre_master.toString().split(',')[1],
      }
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditTyreMasterModuleRoutingModule { }
