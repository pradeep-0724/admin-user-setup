import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleTyreMasterListComponent } from './vehicle-tyre-master-list/vehicle-tyre-master-list.component';

const routes: Routes = [
  {
    path:'',
    component: VehicleTyreMasterListComponent,

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TyreMasterListDetailsModuleRoutingModule { }
