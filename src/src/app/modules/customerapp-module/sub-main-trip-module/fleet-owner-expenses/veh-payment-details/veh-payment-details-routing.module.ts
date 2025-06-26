import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehPaymentDetailsComponent } from './veh-payment-details/veh-payment-details.component';

const routes: Routes = [{
  path:'',
  component:VehPaymentDetailsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class vehPaymentDetailsModuleRoutingModule { }
