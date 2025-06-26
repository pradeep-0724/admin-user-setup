import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRenewDocumentComponent } from './employee-renew-document/employee-renew-document.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule} from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [EmployeeRenewDocumentComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDialogModule,
    MatMomentDateModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[EmployeeRenewDocumentComponent]
})
export class EmployeeSharedModuleModule { }
