import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvanceListComponent } from './advance-component/advance.component';

const routes: Routes = [
  {
    path:'',
    component: AdvanceListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancePaymentListDetailsModuleRoutingModule { }
