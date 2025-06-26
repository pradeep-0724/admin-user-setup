import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankActivityComponent } from './bank-activity.component';

const routes: Routes = [
  {
    path:'',
    component: BankActivityComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBankActivityModuleRoutingModule { }
