import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path:'payable',
  loadChildren:()=> import('./vat-payable/vat-payable.module').then(m =>m.VatPayableModule)
},
{
  path:'receivable',
  loadChildren:() => import('./vat-receivable/vat-receivable.module').then(m =>m.VatReceivableModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VatModuleRoutingModule { }
