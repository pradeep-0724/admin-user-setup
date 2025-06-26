import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyDetailsMaintenanceComponent } from './party-details-maintenance/party-details-maintenance.component';

const routes: Routes = [
  {
    path:':party_id',
    component:PartyDetailsMaintenanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyDetailsMaintenanceRoutingModule { }
