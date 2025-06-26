import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';


const routes: Routes = [
  {
    path:TSRouterLinks.add,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    loadChildren: () => import('./add-edit-quotation-module/add-edit-quotation-module.module').then(m => m.AddEditQuotationModule),
    data: {
      permissions: {
        only:Permission.quotations.toString().split(','),
      }
    },
  },

  {
    path:TSRouterLinks.edit,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    loadChildren: () => import('./add-edit-quotation-module/add-edit-quotation-module.module').then(m => m.AddEditQuotationModule),
    data: {
      permissions: {
        only:Permission.quotations.toString().split(','),
      }
    },
    },
  {
    path:TSRouterLinks.list,
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./list-view-quotation-module/list-view-quotation-module.module').then(m => m.ListViewQuotationModule),
    data: {
      permissions: {
        only:Permission.quotations.toString().split(','),
      }
    },
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationModuleRoutingModule { }
