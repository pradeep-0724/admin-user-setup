import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankComponent } from './bank/bank.component';

const routes: Routes = [
  {
    path: '',
    component: BankComponent,
  },
  {
    path:':bank_id',
    component: BankComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankAddEditModuleRoutingModule { }
