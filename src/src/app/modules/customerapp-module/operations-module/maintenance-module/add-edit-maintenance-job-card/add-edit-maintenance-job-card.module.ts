import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceJobCardComponent } from './maintenance-job-card/maintenance-job-card.component';
import { MaintenanceJobCardRoutingModule } from './maintenance-job-card-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { DateAdapter, MatRippleModule } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import {MatSelectModule} from '@angular/material/select';



@NgModule({
  declarations: [
    MaintenanceJobCardComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceJobCardRoutingModule,
    GoThroughModule,
    SharedModule,
    FormsModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatMomentDateModule  ],
    providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],

})
export class AddEditMaintenanceJobCardModule { }
