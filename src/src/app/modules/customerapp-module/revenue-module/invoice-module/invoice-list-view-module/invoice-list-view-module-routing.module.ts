import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInvoiceComponent } from './list-invoice/list-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: ListInvoiceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceListViewModuleRoutingModule { }
