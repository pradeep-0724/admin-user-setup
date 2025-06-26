import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { PartyComponent } from './party/party.component';

const routes: Routes = [
  {
    path:'',
    component: PartyComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:Permission.party.toString().split(',')[0],
      }
    },
  },
  {
    path:':party_id',
    component: PartyComponent,
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
export class AddEditPartyModuleRoutingModule { }

