import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path:'receivable',
  loadChildren:() => import('./gst-receivable/gst-receivable.module').then(m=>m.GstReceivableModule)
},{
  path:'payable',
  loadChildren:() => import('./gst-payable/gst-payable-module.module').then(m=>m.GstPayableModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstModuleRoutingModule { }
