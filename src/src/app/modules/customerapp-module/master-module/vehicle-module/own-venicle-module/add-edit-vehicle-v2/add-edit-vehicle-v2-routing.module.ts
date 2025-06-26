import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleTypeSectionV2Component } from './vehicle-type-section-v2/vehicle-type-section-v2.component';

const routes: Routes = [{
  path:'',
  component:VehicleTypeSectionV2Component
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditVehicleV2RoutingModule { }
