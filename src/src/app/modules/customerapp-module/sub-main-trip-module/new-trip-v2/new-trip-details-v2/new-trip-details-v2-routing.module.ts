import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewTripDetailsV2Component } from './new-trip-details-v2/new-trip-details-v2.component';

const routes: Routes = [{
  path:'',
  component:NewTripDetailsV2Component
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewTripDetailsV2RoutingModule { }
