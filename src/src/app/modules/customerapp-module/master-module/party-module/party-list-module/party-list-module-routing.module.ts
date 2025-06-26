import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { PartyListComponent } from './party-list/party-list.component';

const routes: Routes = [
  {
    path:'',
    component: PartyListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.party.toString().split(',')[3],
      }
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyListModuleRoutingModule { }
