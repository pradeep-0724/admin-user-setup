import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerKycComponent } from './customer-kyc/customer-kyc.component';

const routes: Routes = [{
  path:'',
  component:CustomerKycComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerKycRoutingModule { }
