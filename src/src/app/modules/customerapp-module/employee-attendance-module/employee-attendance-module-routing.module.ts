import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path:'',
  component:EmployeeAttendanceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeAttendanceModuleRoutingModule { }
