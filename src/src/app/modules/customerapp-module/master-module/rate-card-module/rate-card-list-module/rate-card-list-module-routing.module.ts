import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { RateCardListComponent } from './rate-card-list/rate-card-list.component';

const routes: Routes = [
  {
    path:'list',
    component: RateCardListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.party.toString().split(',')[0],
      }
    },
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateCardListModuleRoutingModule { }
