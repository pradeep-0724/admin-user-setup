import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeTimelogModuleRoutingModule } from './employee-timelog-module-routing.module';
import { EmployeeTimelogComponent } from './employee-timelog/employee-timelog.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { EmployeetimelogpipePipe } from './employeetimelogpipe.pipe';
import { GoogleMapsModule } from '@angular/google-maps';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    EmployeeTimelogComponent,
    TimesheetComponent,
    EmployeetimelogpipePipe
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatMomentDateModule,
    GoogleMapsModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeTimelogModuleRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class EmployeeTimelogModuleModule { }
