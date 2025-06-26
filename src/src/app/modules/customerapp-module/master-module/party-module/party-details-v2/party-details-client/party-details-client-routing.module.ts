import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyDetailsClientComponent } from './party-details-client/party-details-client.component';

const routes: Routes = [{
  path:':party_id',
  component:PartyDetailsClientComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyDetailsClientRoutingModule { }
