import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TyreMasterModuleRoutingModule } from './tyre-master-module-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TyreMasterModuleRoutingModule,
    MatDatepickerModule,
		MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatMomentDateModule,
    BsDatepickerModule.forRoot(),
    NgxPermissionsModule.forChild(),
  ]
})
export class TyreMasterModule { }
