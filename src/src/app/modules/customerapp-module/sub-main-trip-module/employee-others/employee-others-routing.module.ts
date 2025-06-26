import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';
import { EmployeeOthersComponent } from './employee-others.component';

const routes: Routes = [
	{
		path:   'add',
		component: EmployeeOthersComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.employeeOthers.toString().split(',')[0],

      }
    },

	},
	{
		path:   'edit/:id',
		component: EmployeeOthersComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.employeeOthers.toString().split(',')[1],

      }
    },

	},
  {
    path:'list',
    canActivate:[NgxPermissionsGuard],
    loadChildren:()=>import('./list-employee-others/list-employee-others.module').then(m=>m.ListEmployeeOthersModule),
    data: {
      permissions: {
        only: Permission.employeeOthers.toString().split(',')[3],

      }
    },

  }
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class EmployeeOthersRoutingModule {}
