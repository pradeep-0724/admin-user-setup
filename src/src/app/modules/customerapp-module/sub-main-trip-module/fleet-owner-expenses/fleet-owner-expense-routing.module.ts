import { FleetOwnerExpensesComponent } from './fleet-owner-expenses.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [
  {
    path:'add',
    component:FleetOwnerExpensesComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.vehicle_provider.toString().split(',')[0],
      }
    },
  },
  {
    path:'edit/:id',
    component:FleetOwnerExpensesComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.vehicle_provider.toString().split(',')[1],
      }
    },
  },
  {
    path:'list',
    canActivate: [NgxPermissionsGuard],
    loadChildren:()=>import('./list-fleet-owner-expenses/list-fleet-owner-expense.module').then(m=>m.ListFleetOwnerExpenseModule),
    data: {
      permissions: {
        only: Permission.vehicle_provider.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.view+'/:id',
    loadChildren:() => import('./veh-payment-details/veh-payment-details.module').then(m=>m.VehPaymentDetailsModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.vehicle_provider.toString().split(',')[3],
      }
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetOwnerExpenseRoutingModule { }
