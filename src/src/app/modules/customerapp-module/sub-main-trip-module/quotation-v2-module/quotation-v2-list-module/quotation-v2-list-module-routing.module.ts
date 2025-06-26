import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationV2ListComponent } from './quotation-v2-list/quotation-v2-list.component';

const routes: Routes = [{
  path:'',
  component:QuotationV2ListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationV2ListModuleRoutingModule { }
