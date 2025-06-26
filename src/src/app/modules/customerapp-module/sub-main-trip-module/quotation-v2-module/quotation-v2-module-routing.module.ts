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
    loadChildren: () => import('./add-edit-quotation-v2-module/add-edit-quotation-v2.module').then(m => m.AddEditQuotationV2Module),
    data: {
      permissions: {
        only:Permission.quotations.toString().split(',')[0],
      }
    },
  },
  {
    path:TSRouterLinks.edit+"/:quotation-id",
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    loadChildren: () => import('./add-edit-quotation-v2-module/add-edit-quotation-v2.module').then(m => m.AddEditQuotationV2Module),
    data: {
      permissions: {
        only:Permission.quotations.toString().split(',')[0],
      }
    },
  },
  {
    path:TSRouterLinks.list,
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./quotation-v2-list-module/quotation-v2-list-module.module').then(m => m.QuotationV2ListModuleModule),
    data: {
      permissions: {
        only:Permission.quotations.toString().split(',')[3],
      }
    },
  },
  {
    path:TSRouterLinks.details,
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./quotation-v2-details/quotation-v2-details.module').then(m => m.QuotationV2DetailsModule),
    data: {
      permissions: {
        only:Permission.quotations.toString().split(',')[3],
      }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationV2ModuleRoutingModule { }
