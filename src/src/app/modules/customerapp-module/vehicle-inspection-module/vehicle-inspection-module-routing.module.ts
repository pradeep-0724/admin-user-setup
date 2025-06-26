import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
      {
		path: '',
		loadChildren: () => import('./add-edit-vehicle-inpsection-module/add-edit-vehicle-inpsection-module.module').then(m => m.AddEditVehicleInpsectionModuleModule),
		canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
		data: {
			permissions: {
				only: Permission.vehicleInspection.toString().split(','),
			}
		},
	  },
	  {
		path: '',
		loadChildren: () => import('./vehicle-inspection-list/vehicle-inspection-module.module').then(m => m.VehicleInspectionListModuleModule),
		canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
		data: {
			permissions: {
				only: Permission.vehicleInspection.toString().split(','),
			}
		},
	  },
	  {
		path: '',
		loadChildren: () => import('./vehicel-inspection-view/vehicel-inspection-view.module').then(m => m.VehicelInspectionViewModule),
		canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
		data: {
			permissions: {
				only: Permission.vehicleInspection.toString().split(','),
			}
		},
	  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleInspectionModuleRoutingModule { }
