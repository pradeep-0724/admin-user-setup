import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleDetailsV2Component } from './vehicle-details-v2/vehicle-details-v2.component';

const routes: Routes = [{
  path:':vehicle_id',
  component:VehicleDetailsV2Component
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleDetailsV2RoutingModule { }
