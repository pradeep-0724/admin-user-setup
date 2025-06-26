import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddJournalEntryRoutingModule } from './add-journal-entry-routing.module';
import { AddNewCoaModule } from 'src/app/modules/customerapp-module/master-module/chart-of-account-module/add-new-coa-module/add-new-coa-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddJournalEntryComponent } from './add-journal-entry.component';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [  AddJournalEntryComponent ],
  imports: [
    CommonModule,
    AddJournalEntryRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    AddNewCoaModule,
    MatMomentDateModule,
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddJournalEntryModule { }
