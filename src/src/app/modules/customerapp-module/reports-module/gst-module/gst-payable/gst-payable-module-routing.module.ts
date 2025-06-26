import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GstPayableComponent } from './gst-payable.component';

const routes: Routes = [
  {
    path:'',
    component:GstPayableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstPayableModuleRoutingModule { }
