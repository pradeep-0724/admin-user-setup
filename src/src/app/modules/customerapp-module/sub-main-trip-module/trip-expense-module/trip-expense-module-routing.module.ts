import { TripExpenseComponent } from './trip-expense/trip-expense.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [{
  path:'add',
  component:TripExpenseComponent,
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.tripexpense.toString().split(',')[0],
    }
  },
},
{
  path:'edit/:id',
  component:TripExpenseComponent,
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.tripexpense.toString().split(',')[1],
    }
  },


},
{
  path:'list',
  loadChildren:()=>import('./trip-expense-list/trip-expense-list.module').then(m=>m.TripExpenseListModule),
  canActivate: [NgxPermissionsGuard],
  data: {
    permissions: {
      only: Permission.tripexpense.toString().split(',')[3],
    }
  },

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripExpenseModuleRoutingModule { }
