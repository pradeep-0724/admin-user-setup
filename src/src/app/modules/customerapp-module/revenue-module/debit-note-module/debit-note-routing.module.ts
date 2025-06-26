import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
  {
    path: TSRouterLinks.add,
    loadChildren:() => import('./add-edit-debit-note-module/add-edit-debit-note-module.module').then(m=>m.AddEditDebitNoteModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.debit_note.toString().split(',')[0]
      }
    }
  },
  {
    path: TSRouterLinks.list,
    loadChildren:() => import('./list-details-debit-note-module/list-details-debit-note-module.module').then(m=>m.ListDetailsDebitNoteModule),
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.debit_note.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.edit + '/:debit_id',
    loadChildren:() => import('./add-edit-debit-note-module/add-edit-debit-note-module.module').then(m=>m.AddEditDebitNoteModule),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.debit_note.toString().split(',')[1],
      }
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebitNoteRoutingModule { }
