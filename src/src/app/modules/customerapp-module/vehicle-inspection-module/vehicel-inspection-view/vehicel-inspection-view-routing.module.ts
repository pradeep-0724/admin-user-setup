import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleInspectionViewComponent } from './vehicle-inspection-view/vehicle-inspection-view.component';

const routes: Routes = [
  {
    path : 'view/:inspectionId',
    component : VehicleInspectionViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicelInspectionViewRoutingModule { }
