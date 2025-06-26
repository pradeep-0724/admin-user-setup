import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListJournalEntryRoutingModule } from './list-journal-entry-routing.module';
import { ListJournalEntryComponent } from './list-journal-entry.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ListModuleV2 } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [ListJournalEntryComponent],
  imports: [
    CommonModule,
    ListJournalEntryRoutingModule,
    MatMomentDateModule,
    ListModuleV2,
    NgxPermissionsModule.forChild()

  ],
})
export class ListJournalEntryModule { }
