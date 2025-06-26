import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripExpenseListComponent } from './trip-expense-list.component';

const routes: Routes = [{
  path:'',
  component:TripExpenseListComponent

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripExpenseListRoutingModule { }
