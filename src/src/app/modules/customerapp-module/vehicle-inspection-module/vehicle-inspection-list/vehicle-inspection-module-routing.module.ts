import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleInspectionListComponent } from './vehicle-inspection-list.component';

const routes: Routes = [
      {
		path: 'list',
		component : VehicleInspectionListComponent
	  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleInspectionListModuleRoutingModule { }
