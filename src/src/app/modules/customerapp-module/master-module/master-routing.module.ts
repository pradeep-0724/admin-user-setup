import { MasterComponent } from './master.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    canActivateChild: [NgxPermissionsGuard],
    children: [
      {
        path: TSRouterLinks.master_employee,
        loadChildren: () => import('./employee-module/employee.module').then(m => m.EmployeeModule),
        data: {
					permissions: {
						only:Permission.employee.toString().split(','),
					}
        }
      },
      {
        path: TSRouterLinks.master_vehicle,
        loadChildren: () => import('./vehicle-module/vehicle.module').then(m => m.VehicleModule),
        data: {
					permissions: {
						expect:'all-vehicle'
					}
        }
      },
      {
        path: TSRouterLinks.master_party,
        loadChildren: () => import('./party-module/party.module').then(m => m.PartyModule),
        data: {
					permissions: {
						only:Permission.party.toString().split(',')
					}
        }
      },
      {
        path: TSRouterLinks.master_bank,
        loadChildren: () => import('./bank-module/bank.module').then(m => m.BankModule),
        data: {
					permissions: {
						only:Permission.bank.toString().split(',')
					}
        }
      },
      {
        path: TSRouterLinks.master_chart_of_account,
        loadChildren: () => import('./../master-module/chart-of-account-module/chart-of-account.module').then(m => m.ChartOfAccountModule),
        data: {
					permissions: {
						only:Permission.opening_balance.toString().split(','),
					}
        }
      },
      {
        path: 'zone',
        loadChildren: () => import('./new-zone/new-zone.module').then(m => m.NewZoneModule),
        data: {
					permissions: {
						only:Permission.zone.toString().split(','),
					}
        }
      },
      {
        path: 'rate-card',
        loadChildren: () => import('./rate-card-module/rate-card-module.module').then(m => m.RateCardModuleModule),
        data: {
					permissions: {
						only:Permission.rate_card.toString().split(','),
					}
        }
      },
      {
        path: 'assets',
        loadChildren: () => import('./assets-module/assets-module.module').then(m => m.AssetsModuleModule),
        data: {
					permissions: {
						only:Permission.zone.toString().split(','),
					}
        }
      },
      {
        path: 'item',
        loadChildren: () => import('./item-master/item-master.module').then(m => m.ItemMasterModule),
        data: {
					permissions: {
						only:Permission.item.toString().split(','),
					}
        }
      },
      {
        path: 'container',
        loadChildren: () => import('./container-module/container-module.module').then(m => m.ContainerModuleModule),
        data: {
					permissions: {
						only:Permission.container.toString().split(','),
					}
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
