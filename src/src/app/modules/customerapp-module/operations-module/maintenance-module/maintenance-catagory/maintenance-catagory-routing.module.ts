import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceCatagoryListComponent } from './maintenance-catagory-list.component';

const routes: Routes = [{
  path:':id',
  component:MaintenanceCatagoryListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceCatagoryRoutingModule { }
