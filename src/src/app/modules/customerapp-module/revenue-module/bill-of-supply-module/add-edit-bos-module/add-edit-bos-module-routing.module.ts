import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBillOfSupplyComponent } from './add-bill-of-supply/add-bill-of-supply.component';

const routes: Routes = [
  {
    path: '',
    component: AddBillOfSupplyComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditBosModuleRoutingModule { }
