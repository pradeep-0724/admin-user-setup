import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditMultipleDestinationComponent } from './multiple-destination/multiple-destination.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { GoogleMapsModule } from '@angular/google-maps';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { CheckListModule } from '../../check-list/check-list.module';
import { LocationV2Module } from '../../location-v2/location-v2.module';
import { MultipleDestinationSharedModule } from '../../multiple-destination-shared-module/multiple-destination-shared-module.module';
import { ToolTipModule } from '../../tool-tip/tool-tip.module';
import { DateAndTimeModule } from 'src/app/modules/customerapp-module/date-and-time-module/date-and-time-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    EditMultipleDestinationComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    ReactiveFormsModule,
    MaterialDropDownModule,
    LocationV2Module,
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatMomentModule,
    MatFormFieldModule,
    NgxMatTimepickerModule,
    MatInputModule,
    CheckListModule,
    GoogleMapsModule,
    SharedModule,
    FormsModule,
    MatIconModule,
    MultipleDestinationSharedModule,
    ToolTipModule,
    MatMomentDateModule,
    DateAndTimeModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[EditMultipleDestinationComponent]
})
export class EditMultipleDestinationModule { }
