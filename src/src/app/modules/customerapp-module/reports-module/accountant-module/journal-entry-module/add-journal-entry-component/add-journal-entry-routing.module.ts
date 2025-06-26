import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddJournalEntryComponent } from './add-journal-entry.component';

const routes: Routes = [
  {
    path: '',
    component: AddJournalEntryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddJournalEntryRoutingModule { }
