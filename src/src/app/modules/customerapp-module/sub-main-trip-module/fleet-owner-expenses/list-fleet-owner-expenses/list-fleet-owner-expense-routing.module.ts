import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFleetOwnerExpensesComponent } from './list-fleet-owner-expenses.component';

const routes: Routes = [{
  path:'',
  component:ListFleetOwnerExpensesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListFleetOwnerExpenseRoutingModule { }
