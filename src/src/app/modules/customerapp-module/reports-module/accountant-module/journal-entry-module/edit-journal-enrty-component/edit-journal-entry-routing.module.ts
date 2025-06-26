import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditJournalEntryComponent } from './edit-journal-entry.component';

const routes: Routes = [
  {
    path:'',
    component:EditJournalEntryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditJournalEntryRoutingModule { }
