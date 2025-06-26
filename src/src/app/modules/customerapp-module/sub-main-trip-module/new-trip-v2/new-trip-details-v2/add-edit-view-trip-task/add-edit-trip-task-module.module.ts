import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditViewTripTaskComponent } from './add-edit-view-trip-task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FileUploaderV2Module } from '../../file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from '../file-delete-view-module/file-delete-view-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [AddEditViewTripTaskComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    FileUploaderV2Module,
    MatMomentDateModule,
    FileDeleteViewModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[AddEditViewTripTaskComponent]
})
export class AddEditTripTaskModule{ }
