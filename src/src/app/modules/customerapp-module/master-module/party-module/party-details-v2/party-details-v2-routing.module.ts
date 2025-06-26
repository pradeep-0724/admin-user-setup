import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [
  {
    path: TSRouterLinks.client,
    loadChildren: () => import('./party-details-client/party-details-client.module').then(m => m.PartyDetailsClientModule),
  },
  {
    path: TSRouterLinks.vendor,
    loadChildren: () => import('./party-details-maintenance/party-details-maintenance.module').then(m => m.PartyDetailsMaintenanceModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyDetailsV2RoutingModule { }
