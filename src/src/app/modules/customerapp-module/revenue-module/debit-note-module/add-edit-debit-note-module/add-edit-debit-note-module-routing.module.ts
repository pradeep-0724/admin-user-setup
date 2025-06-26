import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebitNoteComponent } from './debit-note/debit-note.component';

const routes: Routes = [
  {
    path:'',
    component: DebitNoteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditDebitNoteModuleRoutingModule { }
