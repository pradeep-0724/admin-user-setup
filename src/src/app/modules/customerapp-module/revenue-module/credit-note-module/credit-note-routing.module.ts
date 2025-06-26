import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
  {
    path: TSRouterLinks.add,
    loadChildren:() => import('./add-edit-credit-note-module/add-edit-credit-note-module.module').then(m => m.AddEditCreditNoteModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only:Permission.credit_note.toString().split(',')[0],
      }
    },
  },
  {
    path: TSRouterLinks.list,
    loadChildren:() => import('./credit-note-detail-list-module/credit-note-detail-list-module.module').then(m =>m.CreditNoteDetailListModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.credit_note.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.edit + '/:credit_id',
    loadChildren:() => import('./add-edit-credit-note-module/add-edit-credit-note-module.module').then(m => m.AddEditCreditNoteModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only:Permission.credit_note.toString().split(',')[1],
      }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditNoteRoutingModule { }
