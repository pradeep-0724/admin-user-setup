import { OverviewComponent } from './overview/overview.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerappComponent } from './customerapp.component';
import { TSRouterLinks } from '../../core/constants/router.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
	{
		path: '',
		component: CustomerappComponent,
		canActivateChild: [NgxPermissionsGuard],
		children: [
			{
				path: TSRouterLinks.master_overview,
				component: OverviewComponent,
				data: {
					permissions: {
						only: 'overview',
						redirectTo: '/gps'
					}
				},
			},
			{
				path: TSRouterLinks.dashboard,
				loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
				data: {
					permissions: {
						only: 'report_dashboard__view',
					}
				},
			},
			{
				path: TSRouterLinks.vehicle_inspection,
				loadChildren: () => import('./vehicle-inspection-module/vehicle-inspection-module.module').then(m => m.VehicleInspectionModuleModule),
				data: {
					permissions: {
						only : Permission.vehicleInspection.toString().split(','),
					}
				},
			},
			{
				path: 'onboarding',
				loadChildren: () => import('./master-module/master.module').then(m => m.MasterModule),
				data: {
					permissions: {
						only: Permission.onboading.toString().split(','),
					}
				},

			},
			{
				path: 'trip',
				loadChildren: () => import('./sub-main-trip-module/sub-main-trip-module.module').then(m => m.SubMainTripModule),
				data: {
					permissions: {
						only: Permission.trip.toString().split(','),
					}
				},

			},
			{
				path: 'income',
				loadChildren: () => import('./revenue-module/revenue.module').then(m => m.RevenueModule),
				data: {
					permissions: {
						only: Permission.income.toString().split(','),
					}
				},
			},
			{
				path: 'expense',
				loadChildren: () => import('./operations-module/operations.module').then(m => m.OperationsModule),
				data: {
					permissions: {
						only: Permission.expense.toString().split(','),
					}
				},
			},
			{
				path: 'payments',
				loadChildren: () => import('./sub-main-payment/sub-main-payment.module').then(m => m.SubMainPaymentModule),
				data: {
					permissions: {
						only: Permission.payments.toString().split(','),
					}
				},
			},
			{
				path: 'inventory',
				loadChildren: () => import('./inventory-module/inventory.module').then(m => m.InventoryModuleModule),
				data: {
					permissions: {
						only: Permission.inventory.toString().split(','),
					}
				},
			},
			{
				path: 'gps',
				loadChildren: () => import('./gps-module/gps-module.module').then(m => m.GpsModule),
				data: {
					permissions: {
						only: 'gps__view',
						redirectTo: '/login'
					}
				},

			},

			{
				path: TSRouterLinks.report,
				loadChildren: () => import('./reports-module/reports.module').then(m => m.ReportsModule),
				data: {
					permissions: {
						except: ['no permission'],
					}
				},
			},
			{
				path: TSRouterLinks.journalEntry,
				loadChildren: () => import('./reports-module/accountant-module/journal-entry-module/journal-entry.module').then(m => m.JournalEntryModule),
				data: {
					permissions: {
						only: Permission.journalentry.toString().split(','),
					}
				},
			},
			{
				path: TSRouterLinks.bankActivity,
				loadChildren: () => import('./reports-module/banking-module/banking.module').then(m => m.BankingModule),
				data: {
					permissions: {
						only: Permission.bankactivity.toString().split(','),
						redirectTo: '/login'
					}
				},
			},
			{
				path: TSRouterLinks.i3ms,
				loadChildren: () => import('./i3ms/i3ms.module').then(m => m.I3MSModule),
				data: {
					permissions: {
						only: 'i3ms',
						redirectTo: '/login'
					}
				},
			},
			{
				path: 'expense',
				loadChildren: () => import('./operations-module/operations.module').then(m => m.OperationsModule),
				data: {
					permissions: {
						only: Permission.expense.toString().split(','),
					}
				},
			},
			{
				path: TSRouterLinks.calendar,
				loadChildren: () => import('./calendar-module/calendar.module').then(m => m.CalendarModule),
				data: {
					permissions: {
						except: ['no permission'],
						redirectTo: '/login'
					}
				},
			},
			{
				path: TSRouterLinks.fuel_challan_list,
				loadChildren: () => import('./fuel-challan-module/fuel-challan-module.module').then(m => m.FuelChallanModule),
				data: {
					permissions: {
						only: Permission.fuel.toString().split(','),
						redirectTo: '/login'
					}
				},
			},
			{
				path: 'employee-attendance',
				loadChildren: () => import('./employee-attendance-module/employee-attendance-module.module').then(m => m.EmployeeAttendanceModuleModule),
				data: {
					permissions: {
						only: Permission.employee_attendance.toString().split(','),
					}
				},
			},
			{
				path: 'emp-timelog',
				loadChildren: () => import('./employee-timelog-module/employee-timelog-module.module').then(m => m.EmployeeTimelogModuleModule),
				data: {
					permissions: {
						except: ['no permission'],
					}
				},
			},
			{
				path: '',
				redirectTo: TSRouterLinks.master_overview,
				pathMatch: 'full'
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
export class CustomerappRoutingModule {
	constructor() {
	}
}
