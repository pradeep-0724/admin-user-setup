import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GstReceivableComponent } from './gst-receivable.component';

const routes: Routes = [
  {
    path:'',
    component:GstReceivableComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstReceivableRoutingModule { }
