import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTripV2Component } from './list-trip-v2/list-trip-v2.component';

const routes: Routes = [{
  path:'',
  component:ListTripV2Component,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListTripV2RoutingModule { }
