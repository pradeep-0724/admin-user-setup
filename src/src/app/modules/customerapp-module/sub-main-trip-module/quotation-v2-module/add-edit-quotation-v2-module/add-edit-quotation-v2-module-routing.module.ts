import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditQuotationV2Component } from './add-edit-quotation-v2/add-edit-quotation-v2.component';


const routes: Routes = [
  {
    path:'',
    component:AddEditQuotationV2Component
   
    
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditQuotationV2RoutingModule { }
