import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TdsPayableComponent } from './tds-payable.component';

const routes: Routes = [
  {
    path:'',
    component:TdsPayableComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TdsPayableRoutingModule { }
