import { SharedModule } from './../../../shared-module/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeAttendanceModuleRoutingModule } from './employee-attendance-module-routing.module';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ListAttendanceComponent } from './list-attendance/list-attendance.component';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AttendenceSearchPipePipe } from './attendence-search-pipe.pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [EmployeeAttendanceComponent, ListAttendanceComponent, AttendenceSearchPipePipe],
  imports: [
    CommonModule,
    EmployeeAttendanceModuleRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule.forRoot(),

    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,

      useFactory: adapterFactory,
    }),
  ]
})
export class EmployeeAttendanceModuleModule { }
