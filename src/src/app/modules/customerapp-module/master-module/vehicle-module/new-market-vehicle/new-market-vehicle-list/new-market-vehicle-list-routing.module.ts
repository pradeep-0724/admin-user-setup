import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewMarketVehicleListComponent } from './new-market-vehicle-list/new-market-vehicle-list.component';

const routes: Routes = [
  {
    path : 'list',
    component : NewMarketVehicleListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewMarketVehicleListRoutingModule { }
