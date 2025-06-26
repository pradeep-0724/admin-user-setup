import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BdpListComponent } from './bdp-list/bdp-list.component';

const routes: Routes = [
  {
    path:'',
    component:BdpListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BdpListModuleRoutingModule { }
