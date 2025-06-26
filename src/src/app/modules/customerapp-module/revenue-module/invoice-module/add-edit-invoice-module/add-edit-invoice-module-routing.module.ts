import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceV2Component } from './invoice-v2/invoice-v2.component';

const routes: Routes = [
  {
    path:'',
    component: InvoiceV2Component,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditInvoiceModuleRoutingModule { }
