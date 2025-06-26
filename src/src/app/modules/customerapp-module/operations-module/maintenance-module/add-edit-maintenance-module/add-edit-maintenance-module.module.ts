import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenancePopupComponent } from './maintenance-popup/maintenance-popup.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [
    MaintenancePopupComponent
  ],
  imports: [
    CommonModule,
    GoThroughModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[MaintenancePopupComponent]
})
export class AddEditMaintenanceModule { }
