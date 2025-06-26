import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewMarketVehicleDetailsComponent } from './new-market-vehicle-details/new-market-vehicle-details.component';

const routes: Routes = [
  {
    path :'details/:vehicle_Id',
    component : NewMarketVehicleDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewMarketVehicleDetailsRoutingModule { }
