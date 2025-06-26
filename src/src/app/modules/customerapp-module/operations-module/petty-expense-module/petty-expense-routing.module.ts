import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { ViewPettyExpenseComponent } from './view-petty-expense/view-petty-expense.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PettyExpenseComponent } from './petty-expense/petty-expense.component';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';



const routes: Routes = [
  {
    path: TSRouterLinks.petty_expense_add,
    component: PettyExpenseComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
				data: {
					permissions: {
            only: Permission.petty_expense.toString().split(',')[0],

					}
				}
  },
  {
    path: TSRouterLinks.petty_expense_list,
    component: ViewPettyExpenseComponent,
    canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
            only: Permission.petty_expense.toString().split(',')[3],

					}
				}
  },
  {
    path:TSRouterLinks.petty_expense_edit+'/:expense_id',
    component:PettyExpenseComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
				data: {
					permissions: {
            only: Permission.petty_expense.toString().split(',')[1],

					}
				}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PettyExpenseRoutingModule { }
