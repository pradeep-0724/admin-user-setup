import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalEntryRoutingModule } from './journal-entry.routing';
import { NgxPermissionsModule } from 'ngx-permissions';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JournalEntryRoutingModule,
    NgxPermissionsModule.forChild()
  ],
})
export class JournalEntryModule { }
