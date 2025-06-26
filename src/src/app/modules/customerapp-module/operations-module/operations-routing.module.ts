import { Permission } from './../../../core/constants/permissionConstants';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsComponent } from './operations.component';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
const routes: Routes = [
	{
		path: '',
		component: OperationsComponent,
		canActivateChild: [NgxPermissionsGuard],
		children: [
      {
        path: TSRouterLinks.operations_activity_vehicle_maintainence,
        loadChildren: () => import('./maintenance-module/maintenance-module.module').then(m => m.MaintenanceModule),
        data: {
          permissions: {
            only: Permission.maintenance.toString().split(','),
          }
        },
      },
      {
				path: 'fuel_expense',
				loadChildren: () => import('./fuel-expense/fuel-expense.module').then(m => m.FuelExpenseModule),
				data: {
					permissions: {
						only: Permission.fuel.toString().split(','),
					}
				},
			},
      {
				path: 'salary_expense',
				loadChildren: () => import('./employee-salary-module/employee-salary-module.module').then(m => m.EmployeeSalaryModuleModule),
				data: {
					permissions: {
						only: Permission.employee_salary.toString().split(','),
					}
				},
			},
      {
				path: 'others_expense',
				loadChildren: () => import('./other-activity-module/other-activity.module').then(m => m.EditOtherActivityModule),
				data: {
					permissions: {
						only: Permission.others.toString().split(','),
					}
				},
			},
			{
				path: TSRouterLinks.operations_petty_expense,
				loadChildren: () => import('./petty-expense-module/petty-expense-module.module').then(m => m.PettyExpenseModuleModule),
				data: {
					permissions: {
						only: Permission.petty_expense.toString().split(','),
					}
				},
			}
		]
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
export class OperationsRoutingModule { }
