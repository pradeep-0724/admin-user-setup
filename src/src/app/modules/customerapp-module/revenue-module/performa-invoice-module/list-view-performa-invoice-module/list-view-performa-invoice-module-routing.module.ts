import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformaInvoiceListComponent } from './performa-invoice-list/performa-invoice-list.component';

const routes: Routes = [
  {
    path: '',
    component: PerformaInvoiceListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListViewPerformaInvoiceModuleRoutingModule { }
