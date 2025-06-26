import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditVehicleInspectionComponent } from './add-edit-vehicle-inspection/add-edit-vehicle-inspection.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddEditVehicleInspectionComponent,
  },
  {
    path: 'edit/:InspectionId',
    component: AddEditVehicleInspectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditVehicleInpsectionModuleRoutingModule { }
