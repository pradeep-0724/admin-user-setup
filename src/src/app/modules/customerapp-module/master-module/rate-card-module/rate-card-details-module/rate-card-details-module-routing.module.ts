import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RateCardDetailsComponent } from './rate-card-details/rate-card-details.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';

const routes: Routes = [
  {
    path : 'details/:rateCardId',
    component : RateCardDetailsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.party.toString().split(',')[0],
      }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateCardDetailsModuleRoutingModule { }
