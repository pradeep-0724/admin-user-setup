import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformaInvoiceComponent } from './performa-invoice/performa-invoice.component';

const routes: Routes = [
  {
    path:'',
    component: PerformaInvoiceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditPerformaInvoiceModuleRoutingModule { }
