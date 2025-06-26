import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBillOfSupplyComponent } from './list-bill-of-supply/list-bill-of-supply.component';

const routes: Routes = [
  {
    path: '',
    component: ListBillOfSupplyComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BosListViewModuleRoutingModule { }
