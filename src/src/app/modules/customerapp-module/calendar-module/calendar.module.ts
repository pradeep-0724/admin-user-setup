import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { CalendarRoutingModule } from './calendar.routing';
import { CalendarModule as CM, DateAdapter } from 'angular-calendar';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AddNoteModalComponent } from './add-note-modal/add-note-modal.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { CalenderV2Component } from './calender-v2/calender-v2.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { CalendarTaskComponent } from './calendar-task/calendar-task.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { BookVehicleComponent } from './book-vehicle/book-vehicle.component';
import { DialogModule } from '@angular/cdk/dialog';
import { DateFormaterModule } from '../date-formater/date-formater.module';
import { DeleteAlertModule } from 'src/app/shared-module/delete-alert-module/delete-alert-module.module';
import { RouterModule } from '@angular/router';
import { CdkScrollableModule } from '@angular/cdk/scrolling';


export function momentAdapterFactory() {
  return adapterFactory(moment);
}
@NgModule({
  declarations: [
    CalendarComponent,AddNoteModalComponent, CalenderV2Component, CalendarTaskComponent, BookVehicleComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    CalendarRoutingModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule,
    AlertPopupModuleModule,
    MatInputModule,
    AppErrorModuleModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatRippleModule,
    OverlayModule,
    DialogModule,
    DateFormaterModule,
    DeleteAlertModule,
    RouterModule,
    NgxPermissionsModule.forChild(),
    CdkScrollableModule,
    CM.forRoot({
      provide: DateAdapter,
      useFactory: momentAdapterFactory
    })
  ],
})

export class CalendarModule { }
