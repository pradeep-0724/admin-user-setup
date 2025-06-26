import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationV2DetailsComponent } from './quotation-v2-details/quotation-v2-details.component';

const routes: Routes = [{
  path:':quotation-id',
  component:QuotationV2DetailsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationV2DetailsRoutingModule { }
