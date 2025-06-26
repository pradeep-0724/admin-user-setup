import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BdpDetailsComponent } from './bdp-details/bdp-details.component';

const routes: Routes = [{
  path:':id',
  component:BdpDetailsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BdpDetailsModuleRoutingModule { }
