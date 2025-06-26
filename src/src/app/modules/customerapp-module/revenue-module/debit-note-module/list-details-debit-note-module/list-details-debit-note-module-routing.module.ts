import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDebitNoteComponent } from './list-debit-note/list-debit-note.component';

const routes: Routes = [
  {
    path:'',
    component: ListDebitNoteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListDetailsDebitNoteModuleRoutingModule { }
