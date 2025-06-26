import { AddTripV2Component } from './add-trip-v2/add-trip-v2.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
 path:'',
 component:AddTripV2Component
},
{
  path:':trip-id',
  component:AddTripV2Component
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTripV2RoutingModule { }
