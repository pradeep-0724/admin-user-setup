import { QuotationComponent } from './quotation/quotation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path:'',
  component:QuotationComponent
},
{
  path:':quotationId',
  component:QuotationComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditQuotationModuleRoutingModule { }
