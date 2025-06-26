import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';
import { FuelExpenseComponent } from './fuel-expense.component';

const routes: Routes = [
  {
    path:'add',
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    component:FuelExpenseComponent,
    data: {
      permissions: {
        only: Permission.fuel.toString().split(',')[0],
      }
    },
  },
  {
    path:'edit/:id',
    component:FuelExpenseComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.fuel.toString().split(',')[1],
      }
    },

  },
  {
    path:'list',
    loadChildren:()=>import('./list-fuel/list-fuel.module').then(m=>m.ListFuelModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.fuel.toString().split(',')[3],
      }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuelExpenseRoutingModule { }
