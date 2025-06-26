import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllVendorBillListComponent } from './all-vendor-bill-list/all-vendor-bill-list.component';

const routes: Routes = [{
  path:'',
  component:AllVendorBillListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllVendorBillRoutingModule { }
