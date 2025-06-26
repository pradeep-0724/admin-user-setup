import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCreditNoteComponent } from './list-credit-note/list-credit-note.component';

const routes: Routes = [{
  path:'',
  component:ListCreditNoteComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditNoteDetailListModuleRoutingModule { }
