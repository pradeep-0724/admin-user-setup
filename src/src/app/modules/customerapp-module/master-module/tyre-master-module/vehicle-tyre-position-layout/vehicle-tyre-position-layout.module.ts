import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TyrePositionLayoutComponent } from './tyre-position-layout/tyre-position-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateFormaterModule } from '../../../date-formater/date-formater.module';



@NgModule({
  declarations: [
    TyrePositionLayoutComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    DateFormaterModule
    
  ],
  exports:[TyrePositionLayoutComponent]
})
export class VehicleTyrePositionLayoutModule { }
