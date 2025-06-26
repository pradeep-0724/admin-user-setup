import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListJournalEntryComponent } from './list-journal-entry.component';

const routes: Routes = [{
  path:"",
  component:ListJournalEntryComponent

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListJournalEntryRoutingModule { }
