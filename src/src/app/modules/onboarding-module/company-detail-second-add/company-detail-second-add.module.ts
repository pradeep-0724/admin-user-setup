import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDetailSecondAddRoutingModule } from './company-detail-second-add-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { CompanyDetailSecondAddComponent } from './company-detail-second-add.component';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [CompanyDetailSecondAddComponent],
  imports: [
    CommonModule,
    CompanyDetailSecondAddRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatMomentDateModule,
    MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule,SharedModule,
    MatSelectModule,TaxModuleModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[CompanyDetailSecondAddComponent]
})
export class CompanyDetailSecondAddModule { }
