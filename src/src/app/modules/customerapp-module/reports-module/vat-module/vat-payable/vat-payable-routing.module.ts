import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VatPayabaleComponent } from './vat-payabale.component';

const routes: Routes = [{
  path:'',
  component:VatPayabaleComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VatPayableRoutingModule { }
