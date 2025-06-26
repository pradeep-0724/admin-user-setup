import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
const routes: Routes = [
  {
    path: TSRouterLinks.add,
    loadChildren:()=> import('./bank-activity/add-bank-activity/add-bank-activity-module.module').then(m=>m.AddBankActivityModule),
    canActivate: [NgxPermissionsGuard],
    data: {
        permissions: {
            only: 'bank_activity__create',
        }
    },
  },
  {
    path: TSRouterLinks.edit,
    loadChildren:() =>import('./bank-activity/edit-bank-activity/edit-bank-activity-module.module').then(m=>m.EditBankActivityModule),
    canActivate: [NgxPermissionsGuard],
    data: {
        permissions: {
            only: 'bank_activity__edit',
        }
    },
  },
  {
    path:TSRouterLinks.list,
   loadChildren:() => import('./bank-activity/list-bank-activities/list-bank-activities-module.module').then(m=>m.ListBankActivitiesModule),
    canActivate: [NgxPermissionsGuard],
    data: {
        permissions: {
            only: 'bank_activity__view',
        }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankingRoutingModule { }
