import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyVehicleProviderComponent } from './party-vehicle-provider/party-vehicle-provider.component';

const routes: Routes = [
  {
    path:':party_id',
    component:PartyVehicleProviderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyDetailsVehicleProviderRoutingModule { }
