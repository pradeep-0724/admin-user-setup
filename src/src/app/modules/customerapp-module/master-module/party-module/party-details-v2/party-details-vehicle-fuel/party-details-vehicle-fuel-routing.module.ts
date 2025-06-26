import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyDetailsFuelProviderComponent } from './party-details-fuel-provider/party-details-fuel-provider.component';

const routes: Routes = [ {
    path:':party_id',
    component:PartyDetailsFuelProviderComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyDetailsVehicleFuelRoutingModule { }
