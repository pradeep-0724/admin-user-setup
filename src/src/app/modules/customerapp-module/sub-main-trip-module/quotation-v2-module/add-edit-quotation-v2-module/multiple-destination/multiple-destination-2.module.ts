import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { GoogleMapsModule } from '@angular/google-maps';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { LocationV2Module } from '../../../new-trip-v2/location-v2/location-v2.module';
import { CheckListModule } from '../../../new-trip-v2/check-list/check-list.module';
import { ToolTipModule } from '../../../new-trip-v2/tool-tip/tool-tip.module';
import { MultipleDestinationComponent2 } from './multiple-destination-2/multiple-destination-2.component';
import { MultipleDestinationSharedModule } from '../../../new-trip-v2/multiple-destination-shared-module/multiple-destination-shared-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    MultipleDestinationComponent2,
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
    MatCheckboxModule,
    MatMomentDateModule,
    MultipleDestinationSharedModule,
    ToolTipModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[MultipleDestinationComponent2]
})
export class MultipleDestinationModule2 { }
