import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TdsReceivableComponent } from './tds-receivable.component';

const routes: Routes = [
  {
    path:'',
    component:TdsReceivableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TdsReceivableRoutingModule { }
