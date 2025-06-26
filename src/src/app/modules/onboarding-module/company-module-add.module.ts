import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CompanyModuleAddRoutingModule } from './company-module-add-routing.module';
import { NewAddCompanyComponent } from './new-add-company.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared-module/shared.module';
import {MatSelectModule} from '@angular/material/select';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';


@NgModule({
  declarations: [NewAddCompanyComponent],
  imports: [
    CommonModule,
    CompanyModuleAddRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule,SharedModule,
    MatSelectModule,TaxModuleModule
  ]
})
export class CompanyModuleAddModule { }
