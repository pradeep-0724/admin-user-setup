import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAddressComponent } from './employee-address/edit-address.component';

const routes: Routes = [{
  path:'',
  component:EmployeeAddressComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditAddressModuleRoutingModule { }
