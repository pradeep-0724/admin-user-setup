import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTimelogComponent } from './employee-timelog/employee-timelog.component';
import { TimesheetComponent } from './timesheet/timesheet.component';

const routes: Routes = [
  {
    path:'',
    component:EmployeeTimelogComponent
  },
  {
    path:':id/timesheet',
    component:TimesheetComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTimelogModuleRoutingModule { }
