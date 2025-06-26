import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleInfoComponent } from './vehicle-info/vehicle-info.component';

const routes: Routes = [{
  path:'',
  component:VehicleInfoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleTypeReportRoutingModule { }
