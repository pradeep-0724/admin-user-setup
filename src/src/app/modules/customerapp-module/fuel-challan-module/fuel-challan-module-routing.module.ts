import { FuelChallanListComponent } from './fuel-challan-list/fuel-challan-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path:'',
  component:FuelChallanListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuelChallanModuleRoutingModule { }
