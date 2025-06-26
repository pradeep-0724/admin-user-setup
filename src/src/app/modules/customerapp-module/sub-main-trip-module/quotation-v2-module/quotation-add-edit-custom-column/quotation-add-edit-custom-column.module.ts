import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationAddEditCustomColumnComponent } from './quotation-add-edit-custom-column/quotation-add-edit-custom-column.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxPermissionsModule } from 'ngx-permissions';



@NgModule({
  declarations: [
    QuotationAddEditCustomColumnComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatMomentModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    NgxPermissionsModule.forChild(),
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[QuotationAddEditCustomColumnComponent]
})
export class QuotationAddEditCustomColumnModule { }
