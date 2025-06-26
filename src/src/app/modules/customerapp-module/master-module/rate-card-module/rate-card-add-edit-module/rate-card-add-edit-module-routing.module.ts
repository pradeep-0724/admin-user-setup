import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RateCardAddEditComponent } from './rate-card-add-edit/rate-card-add-edit.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';

const routes: Routes = [
  {
    path:'add',
    component: RateCardAddEditComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.party.toString().split(',')[0],
      }
    },
  },
  {
    path:'edit/:rateCardId',
    component: RateCardAddEditComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.party.toString().split(',')[1],
      }
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateCardAddEditModuleRoutingModule { }
