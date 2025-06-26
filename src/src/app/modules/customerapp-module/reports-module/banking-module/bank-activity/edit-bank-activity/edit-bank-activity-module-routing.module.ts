import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditBankActivityComponent } from './edit-bank-activity.component';

const routes: Routes = [
  {
    path:':bank_activity_id',
    component: EditBankActivityComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditBankActivityModuleRoutingModule { }
