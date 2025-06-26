import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleSettingsComponent } from './vehicle-settings.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PrefrenceComponent } from './prefrence/prefrence.component';
import { VehicleAddEditPermitComponent } from './vehicle-add-edit-permit/vehicle-add-edit-permit.component';
import { VehiclePermitListComponent } from './vehicle-permit-list/vehicle-permit-list.component';

const routes: Routes = [{
  path:'',
  component:VehicleSettingsComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:PrefrenceComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'permit/list',
      component:VehiclePermitListComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path: '',
      redirectTo:'prefrence',
      pathMatch: 'full',
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },]
},
{
  path:'permit/add',
  component:VehicleAddEditPermitComponent,
  data: {
    permissions: {
      only: 'super_user',
      redirectTo:'/master/overview'
    }
  },
},
{
  path:'permit/edit/:permitId',
  component:VehicleAddEditPermitComponent,
  data: {
    permissions: {
      only: 'super_user',
      redirectTo:'/master/overview'
    }
  },
},
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleSettingsModuleRoutingModule { }
