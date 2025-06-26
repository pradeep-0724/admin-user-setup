import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VatReceivableComponent } from './vat-receivable.component';

const routes: Routes = [{
  path:'',
  component:VatReceivableComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VatReceivableRoutingModule { }
