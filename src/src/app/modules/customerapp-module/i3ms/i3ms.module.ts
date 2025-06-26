
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {I3MSComponent} from './i3ms.component'
import {I3MSRoutingModule} from './i3m.routing'
import { SharedModule } from 'src/app/shared-module/shared.module';
import {MatInputModule} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';


import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomFilterPaginationModule } from '../custom-filter-pagination-module/custom-filter-pagination-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    I3MSComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    I3MSRoutingModule,
    SharedModule,
    MatInputModule,
    CustomFilterPaginationModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatNativeDateModule,
    BsDatepickerModule.forRoot(),
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports: [
    I3MSRoutingModule
  ],
  
})
export class I3MSModule { }