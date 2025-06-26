import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSalaryModuleRoutingModule } from './employee-salary-module-routing.module';
import { AddEditEmployeeSalaryComponent } from './add-edit-employee-salary/add-edit-employee-salary.component';
import { AddEditEmployeeSalaryListComponent } from './add-edit-employee-salary-list/add-edit-employee-salary-list.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SalarySearchPipePipe } from './salary-search-pipe.pipe';
import { EmployeeSalaryClassService } from './employee-salary-class/employee-salary.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
@NgModule({
  declarations: [AddEditEmployeeSalaryComponent, AddEditEmployeeSalaryListComponent,SalarySearchPipePipe],
  imports: [
    CommonModule,
    GoThroughModule,
    EmployeeSalaryModuleRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule ,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatRadioModule,
    NgMultiSelectDropDownModule,
    NgxPaginationModule,
    MatMomentDateModule,
    NgxPermissionsModule.forChild(),

  ],
  providers :[EmployeeSalaryClassService, { provide: DateAdapter, useClass: AppDateAdapter }]
})
export class EmployeeSalaryModuleModule { }
