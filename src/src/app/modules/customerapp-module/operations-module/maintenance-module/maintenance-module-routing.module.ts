import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [{
  path:TSRouterLinks.list,
  canActivate: [NgxPermissionsGuard],
  loadChildren:()=> import('./maintenance-list-module/maintenance-list-module.module').then(m=>m.MaintenanceListModule),
  data: {
    permissions: {
      only: Permission.maintenance.toString().split(',')[3],
    }
  },
},
{
  path:TSRouterLinks.view,
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  loadChildren:()=> import('./maintenance-catagory/maintenance-catagory.module').then(m=>m.MaintenanceCatagoryModule),
  data: {
    permissions: {
      only: Permission.maintenance.toString().split(',')[3],
    }
  },
},

{
  path:TSRouterLinks.add +'/service',
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  loadChildren:()=> import('./add-edit-job-card-service/add-edit-job-card-service.module').then(m=>m.AddEditJobCardServiceModule),
  data: {
    permissions: {
      only: Permission.maintenance.toString().split(',')[0],
    }
  },
},

{
  path:TSRouterLinks.edit +'/service',
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  loadChildren:()=> import('./add-edit-job-card-service/add-edit-job-card-service.module').then(m=>m.AddEditJobCardServiceModule),
  data: {
    permissions: {
      only: Permission.maintenance.toString().split(',')[1],
    }
  },
},

{
  path:TSRouterLinks.add +'/tyre-change',
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  loadChildren:()=> import('./add-edit-job-card-tyre-change/add-edit-job-card-tyre-change.module').then(m=>m.AddEditJobCardTyreChangeModule),
  data: {
    permissions: {
      only: Permission.maintenance.toString().split(',')[0],
    }
  },
},

{
  path:TSRouterLinks.edit +'/tyre-change',
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  loadChildren:()=> import('./add-edit-job-card-tyre-change/add-edit-job-card-tyre-change.module').then(m=>m.AddEditJobCardTyreChangeModule),
  data: {
    permissions: {
      only: Permission.maintenance.toString().split(',')[0],
    }
  },
},

{
  path:TSRouterLinks.add,
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  loadChildren:()=> import('./add-edit-maintenance-job-card/add-edit-maintenance-job-card.module').then(m=>m.AddEditMaintenanceJobCardModule),
  data: {
    permissions: {
      only: Permission.maintenance.toString().split(',')[0],
    }
  },
},

{
  path:TSRouterLinks.edit,
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  loadChildren:()=> import('./add-edit-maintenance-job-card/add-edit-maintenance-job-card.module').then(m=>m.AddEditMaintenanceJobCardModule),
  data: {
    permissions: {
      only: Permission.maintenance.toString().split(',')[1],
    }
  },
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceModuleRoutingModule { }
