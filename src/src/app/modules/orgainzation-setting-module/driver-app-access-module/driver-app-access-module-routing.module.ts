import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverAppAccessManagementComponent } from './driver-app-access-management/driver-app-access-management.component';

const routes: Routes = [{
  path:'',
  component:DriverAppAccessManagementComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverAppAccessModuleRoutingModule { }
